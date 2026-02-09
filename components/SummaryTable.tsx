'use client';

import { Calculator, Trash2 } from 'lucide-react';
import { GameData } from '@/lib/storage';

interface SummaryTableProps {
  shuttlecockPrice: number;
  courtFee: number;
  players: string[];
  games: GameData[];
  onRemoveGame: (index: number) => void;
}

export default function SummaryTable({
  shuttlecockPrice,
  courtFee,
  players,
  games,
  onRemoveGame,
}: SummaryTableProps) {
  const calculatePlayerCosts = () => {
    if (players.length === 0 || games.length === 0) {
      return {};
    }

    const playerShuttlecocks: Record<string, number> = {};
    players.forEach((player) => {
      playerShuttlecocks[player] = 0;
    });

    games.forEach((game) => {
      const playersInGame = [game.player1, game.player2, game.player3, game.player4];
      const shuttlecocksPerPlayer = game.shuttlecocks / 4;
      playersInGame.forEach((player) => {
        if (playerShuttlecocks[player] !== undefined) {
          playerShuttlecocks[player] += shuttlecocksPerPlayer;
        }
      });
    });

    const totalShuttlecocks = Object.values(playerShuttlecocks).reduce(
      (sum, count) => sum + count,
      0
    );
    const totalCost = totalShuttlecocks * shuttlecockPrice + courtFee;
    const costPerPlayer = totalCost / players.length;

    const playerCosts: Record<string, number> = {};
    players.forEach((player) => {
      const shuttlecockCost = playerShuttlecocks[player] * shuttlecockPrice;
      const courtFeeShare = courtFee / players.length;
      playerCosts[player] = shuttlecockCost + courtFeeShare;
    });

    return {
      playerCosts,
      totalShuttlecocks,
      totalCost,
      costPerPlayer,
    };
  };

  const calculations = calculatePlayerCosts();

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
    <div className="bg-badminton-light rounded-lg p-6 shadow-lg border border-badminton-green/20">
      <h2 className="text-2xl font-bold text-badminton-green mb-6 flex items-center gap-2">
        <Calculator className="w-6 h-6" />
        Summary
      </h2>

      {games.length > 0 && (
        <div className="mb-6 space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-300">Total Shuttlecocks:</span>
            <span className="text-white font-semibold">
              {calculations.totalShuttlecocks?.toFixed(1) || 0}
            </span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-300">Shuttlecock Cost:</span>
            <span className="text-white font-semibold">
              ${((calculations.totalShuttlecocks || 0) * shuttlecockPrice).toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-300">Court Fee:</span>
            <span className="text-white font-semibold">${courtFee.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-gray-600">
            <span className="text-gray-300 font-medium">Total Cost:</span>
            <span className="text-badminton-green font-bold text-lg">
              ${calculations.totalCost?.toFixed(2) || '0.00'}
            </span>
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-gray-600">
            <span className="text-gray-300 font-medium">Cost per Player:</span>
            <span className="text-badminton-green font-bold text-lg">
              ${calculations.costPerPlayer?.toFixed(2) || '0.00'}
            </span>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-600">
              <th className="text-left py-3 px-4 text-gray-300 font-medium">Player</th>
              <th className="text-right py-3 px-4 text-gray-300 font-medium">Shuttlecocks</th>
              <th className="text-right py-3 px-4 text-gray-300 font-medium">Cost</th>
            </tr>
          </thead>
          <tbody>
            {players.map((player) => {
              const playerGames = games.filter(
                (g) =>
                  g.player1 === player ||
                  g.player2 === player ||
                  g.player3 === player ||
                  g.player4 === player
              );
              const shuttlecocksUsed = playerGames.reduce((sum, game) => {
                return sum + game.shuttlecocks / 4;
              }, 0);
              const cost = calculations.playerCosts?.[player] || 0;

              return (
                <tr key={player} className="border-b border-gray-700 hover:bg-badminton-dark/50">
                  <td className="py-3 px-4 text-white">{player}</td>
                  <td className="py-3 px-4 text-right text-gray-300">
                    {shuttlecocksUsed.toFixed(1)}
                  </td>
                  <td className="py-3 px-4 text-right text-badminton-green font-semibold">
                    ${cost.toFixed(2)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {games.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-300 mb-3">Game History</h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {games.map((game, index) => (
              <div
                key={index}
                className="bg-badminton-dark p-3 rounded-lg flex justify-between items-center"
              >
                <div className="text-sm text-gray-300">
                  <span className="font-medium text-white">
                    {game.player1}, {game.player2}
                  </span>{' '}
                  vs{' '}
                  <span className="font-medium text-white">
                    {game.player3}, {game.player4}
                  </span>
                  {' - '}
                  <span className="text-badminton-green">{game.shuttlecocks}</span> shuttlecocks
                </div>
                <button
                  onClick={() => onRemoveGame(index)}
                  className="text-red-400 hover:text-red-300 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
