'use client';

import { useRef, useState } from 'react';
import { Calculator, Trash2, Camera, ChevronDown, ChevronUp } from 'lucide-react';
import { GameData } from '@/lib/storage';

interface SummaryTableProps {
  shuttlecockPrice: number;
  courtFee: number;
  players: string[];
  games: GameData[];
  paidPlayers: string[];
  onRemoveGame: (index: number) => void;
  onPaidChange: (player: string, paid: boolean) => void;
}

export default function SummaryTable({
  shuttlecockPrice,
  courtFee,
  players,
  games,
  paidPlayers,
  onRemoveGame,
  onPaidChange,
}: SummaryTableProps) {
  const calculatePlayerCosts = () => {
    if (players.length === 0 || games.length === 0) {
      return {};
    }

    const numGames = games.length;
    const totalSlots = 4 * numGames;

    // รวมค่าใช้จ่าย = ค่าลูก + ค่าคอร์ท (from Setup)
    const totalCost = shuttlecockPrice + courtFee;
    const costPerSlot = totalSlots > 0 ? totalCost / totalSlots : 0;

    // Cost by total games played (each game slot pays the same)
    const playerGameCount: Record<string, number> = {};
    players.forEach((player) => {
      playerGameCount[player] = 0;
    });
    games.forEach((game) => {
      [game.player1, game.player2, game.player3, game.player4].forEach((player) => {
        if (playerGameCount[player] !== undefined) playerGameCount[player]++;
      });
    });

    const playerCosts: Record<string, number> = {};
    players.forEach((player) => {
      playerCosts[player] = playerGameCount[player] * costPerSlot;
    });

    return {
      playerCosts,
      totalCost,
    };
  };

  const calculations = calculatePlayerCosts();
  const summaryRef = useRef<HTMLDivElement>(null);
  const captureBtnRef = useRef<HTMLDivElement>(null);
  const [capturing, setCapturing] = useState(false);
  const [gameHistoryExpanded, setGameHistoryExpanded] = useState(true);

  const handleCapture = async () => {
    if (!summaryRef.current) return;
    setCapturing(true);
    const btnEl = captureBtnRef.current;
    if (btnEl) btnEl.style.visibility = 'hidden';
    try {
      await new Promise((r) => requestAnimationFrame(r));
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(summaryRef.current, {
        backgroundColor: null,
        scale: 2,
      });
      const link = document.createElement('a');
      link.download = `badminton-summary-${new Date().toISOString().slice(0, 10)}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } finally {
      if (btnEl) btnEl.style.visibility = '';
      setCapturing(false);
    }
  };

  if (players.length === 0) {
    return (
      <div className="bg-badminton-light rounded-lg p-6 shadow-lg border border-badminton-green/20">
        <h2 className="text-2xl font-bold text-badminton-green mb-6 flex items-center gap-2">
          <Calculator className="w-6 h-6" />
          Summary
        </h2>
        <p className="text-gray-400 text-center py-4">Add players to see the summary</p>
      </div>
    );
  }

  return (
    <div
      ref={summaryRef}
      className="bg-badminton-light rounded-lg p-6 shadow-lg border border-badminton-green/20"
    >
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold text-badminton-green flex items-center gap-2">
          <Calculator className="w-6 h-6" />
          Summary
        </h2>
        <div ref={captureBtnRef}>
          <button
            type="button"
            onClick={handleCapture}
            disabled={capturing}
            className="flex items-center gap-2 px-4 py-2 bg-badminton-green text-white rounded-lg hover:bg-green-600 transition-colors font-medium disabled:opacity-50"
          >
            <Camera className="w-4 h-4" />
            {capturing ? 'Saving…' : 'Capture'}
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-600">
              <th className="text-left py-3 px-4 text-gray-300 font-medium">Player</th>
              <th className="text-right py-3 px-4 text-gray-300 font-medium">Cost</th>
              <th className="text-right py-3 px-4 text-gray-300 font-medium">Games</th>
              <th className="text-center py-3 px-4 text-gray-300 font-medium w-20">Paid</th>
            </tr>
          </thead>
          <tbody>
            {[...players]
              .sort((a, b) => {
                const gamesA = games.filter(
                  (g) =>
                    g.player1 === a || g.player2 === a || g.player3 === a || g.player4 === a
                ).length;
                const gamesB = games.filter(
                  (g) =>
                    g.player1 === b || g.player2 === b || g.player3 === b || g.player4 === b
                ).length;
                return gamesB - gamesA;
              })
              .map((player) => {
                const playerGames = games.filter(
                  (g) =>
                    g.player1 === player ||
                    g.player2 === player ||
                    g.player3 === player ||
                    g.player4 === player
                );
                const cost = calculations.playerCosts?.[player] || 0;

                return (
                  <tr
                    key={player}
                    className="border-b border-gray-700 even:bg-badminton-dark/40 odd:bg-badminton-dark/20 hover:bg-badminton-dark/60"
                  >
                    <td className="py-3 px-4 text-white">{player}</td>
                    <td className="py-3 px-4 text-right text-badminton-green font-semibold">
                      ฿{Math.ceil(cost)}
                    </td>
                    <td className="py-3 px-4 text-right text-gray-300">
                      {playerGames.length}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <input
                        type="checkbox"
                        checked={paidPlayers.includes(player)}
                        onChange={(e) => onPaidChange(player, e.target.checked)}
                        className="w-5 h-5 rounded border-gray-500 bg-badminton-dark text-badminton-green focus:ring-badminton-green focus:ring-offset-0"
                      />
                    </td>
                  </tr>
                );
              })}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-gray-600 bg-badminton-dark/60">
              <td className="py-3 px-4 text-gray-300 font-medium">สรุป ยอดรวม</td>
              <td className="py-3 px-4 text-right text-badminton-green font-bold">
                ฿
                {[...players].reduce((sum, player) => {
                  const cost = calculations.playerCosts?.[player] ?? 0;
                  return sum + Math.ceil(cost);
                }, 0)}
              </td>
              <td className="py-3 px-4 text-right text-gray-400">-</td>
              <td className="py-3 px-4 text-center text-gray-300 font-medium">
                {paidPlayers.length}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {games.length > 0 && (
        <div className="mt-6 space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-300">ค่าลูก</span>
            <span className="text-white font-semibold">
              ฿{shuttlecockPrice.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-300">ค่าคอร์ท</span>
            <span className="text-white font-semibold">฿{courtFee.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-gray-600">
            <span className="text-gray-300 font-medium">รวมค่าใช้จ่าย</span>
            <span className="text-badminton-green font-bold text-lg">
              ฿{calculations.totalCost?.toFixed(2) || '0.00'}
            </span>
          </div>
        </div>
      )}

      {games.length > 0 && (
        <div className="mt-6">
          <button
            type="button"
            onClick={() => setGameHistoryExpanded((e) => !e)}
            className="flex items-center gap-2 w-full text-left mb-3"
          >
            <h3 className="text-lg font-semibold text-gray-300">Game History</h3>
            <span className="text-gray-500 text-sm">({games.length})</span>
            {gameHistoryExpanded ? (
              <ChevronUp className="w-5 h-5 text-gray-400 ml-auto" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400 ml-auto" />
            )}
          </button>
          {gameHistoryExpanded && (
          <div className="space-y-2">
            {games.map((game, index) => (
              <div
                key={index}
                className="bg-badminton-dark p-3 rounded-lg flex justify-between items-center"
              >
                <span className="text-sm font-medium text-white">
                  {[game.player1, game.player2, game.player3, game.player4].join(', ')}
                </span>
                <button
                  onClick={() => onRemoveGame(index)}
                  className="text-red-400 hover:text-red-300 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
          )}
        </div>
      )}
    </div>
  );
}
