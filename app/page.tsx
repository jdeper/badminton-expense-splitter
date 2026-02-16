'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import SetupSection from '@/components/SetupSection';
import PlayerManagement from '@/components/PlayerManagement';
import GameLogging from '@/components/GameLogging';
import SummaryTable from '@/components/SummaryTable';
import { AppData, GameData, getStoredData, saveData, getCourtFeeFromSetup, DEFAULT_PLAYERS, subscribeToDate } from '@/lib/storage';

const defaultCourtSetup = { ratePerHour: 170, entries: [] };

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

export default function Home() {
  const [selectedDate, setSelectedDate] = useState(today);
  const [data, setData] = useState<AppData>({
    shuttlecockPrice: 0,
    courtSetup: defaultCourtSetup,
    players: [],
    games: [],
    paidPlayers: [],
  });
  const [loading, setLoading] = useState(true);
  const skipNextRealtime = useRef(false);

  const courtFee = getCourtFeeFromSetup(data.courtSetup);

  useEffect(() => {
    setLoading(true);
    getStoredData(selectedDate).then((loaded) => {
      setData(loaded);
      setLoading(false);
    });

    const unsub = subscribeToDate(selectedDate, (incoming) => {
      if (skipNextRealtime.current) {
        skipNextRealtime.current = false;
        return;
      }
      setData(incoming);
    });

    return unsub;
  }, [selectedDate]);

  const updateData = useCallback(
    (updater: Partial<AppData> | ((prev: AppData) => Partial<AppData>)) => {
      setData((prev) => {
        const updates = typeof updater === 'function' ? updater(prev) : updater;
        const newData = { ...prev, ...updates };
        skipNextRealtime.current = true;
        saveData(newData, selectedDate).catch((err) => console.warn('saveData failed:', err));
        return newData;
      });
    },
    [selectedDate]
  );

  const handleShuttlecockPriceChange = (price: number) => {
    updateData({ shuttlecockPrice: price });
  };

  const handleCourtSetupChange = (courtSetup: AppData['courtSetup']) => {
    updateData({ courtSetup });
  };

  const handleAddPlayer = (name: string) => {
    updateData((prev) => ({ players: [...prev.players, name] }));
  };

  const handleRemovePlayer = (index: number) => {
    updateData((prev) => {
      const newPlayers = prev.players.filter((_, i) => i !== index);
      const newGames = prev.games.filter(
        (game) =>
          newPlayers.includes(game.player1) &&
          newPlayers.includes(game.player2) &&
          newPlayers.includes(game.player3) &&
          newPlayers.includes(game.player4)
      );
      return { players: newPlayers, games: newGames };
    });
  };

  const handleAddGame = (game: GameData) => {
    updateData((prev) => ({ games: [...prev.games, game] }));
  };

  const handleRemoveGame = (index: number) => {
    updateData((prev) => ({ games: prev.games.filter((_, i) => i !== index) }));
  };

  const handlePaidChange = (player: string, paid: boolean) => {
    updateData((prev) => ({
      paidPlayers: paid
        ? [...prev.paidPlayers, player]
        : prev.paidPlayers.filter((p) => p !== player),
    }));
  };

  const handleReset = () => {
    updateData({
      games: [],
      players: [...DEFAULT_PLAYERS],
      paidPlayers: [],
      shuttlecockPrice: 0,
      courtSetup: defaultCourtSetup,
    });
  };

  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-badminton-green mb-2">
            🏸 โปรแกรมคำนวณค่าใช้จ่าย
          </h1>
          <p className="text-gray-400">ชมรมแบดฯ วันเสาร์ T-Smash</p>
        </div>

        <div className="mb-6">
          <PlayerManagement
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
            players={data.players}
            onAddPlayer={handleAddPlayer}
            onRemovePlayer={handleRemovePlayer}
            loading={loading}
          />
        </div>

        {data.players.length >= 4 && (
          <div className="mb-6">
            <GameLogging players={data.players} onAddGame={handleAddGame} />
          </div>
        )}

        <SummaryTable
          shuttlecockPrice={data.shuttlecockPrice}
          courtFee={courtFee}
          players={data.players}
          games={data.games}
          paidPlayers={data.paidPlayers}
          onRemoveGame={handleRemoveGame}
          onPaidChange={handlePaidChange}
        />

        <div className="mb-6">
          <SetupSection
            shuttlecockPrice={data.shuttlecockPrice}
            courtSetup={data.courtSetup}
            onShuttlecockPriceChange={handleShuttlecockPriceChange}
            onCourtSetupChange={handleCourtSetupChange}
            onReset={handleReset}
          />
        </div>
      </div>
    </main>
  );
}
