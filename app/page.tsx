'use client';

import { useEffect, useState } from 'react';
import SetupSection from '@/components/SetupSection';
import PlayerManagement from '@/components/PlayerManagement';
import GameLogging from '@/components/GameLogging';
import SummaryTable from '@/components/SummaryTable';
import { AppData, GameData, getStoredData, saveData, getCourtFeeFromSetup } from '@/lib/storage';

const defaultCourtSetup = { ratePerHour: 0, entries: [] };

export default function Home() {
  const [data, setData] = useState<AppData>({
    shuttlecockPrice: 0,
    courtSetup: defaultCourtSetup,
    players: [],
    games: [],
  });

  const courtFee = getCourtFeeFromSetup(data.courtSetup);

  useEffect(() => {
    const stored = getStoredData();
    setData(stored);
  }, []);

  const updateData = (updates: Partial<AppData>) => {
    const newData = { ...data, ...updates };
    setData(newData);
    saveData(newData);
  };

  const handleShuttlecockPriceChange = (price: number) => {
    updateData({ shuttlecockPrice: price });
  };

  const handleCourtSetupChange = (courtSetup: AppData['courtSetup']) => {
    updateData({ courtSetup });
  };

  const handleAddPlayer = (name: string) => {
    updateData({ players: [...data.players, name] });
  };

  const handleRemovePlayer = (index: number) => {
    const newPlayers = data.players.filter((_, i) => i !== index);
    const newGames = data.games.filter(
      (game) =>
        newPlayers.includes(game.player1) &&
        newPlayers.includes(game.player2) &&
        newPlayers.includes(game.player3) &&
        newPlayers.includes(game.player4)
    );
    updateData({ players: newPlayers, games: newGames });
  };

  const handleAddGame = (game: GameData) => {
    updateData({ games: [...data.games, game] });
  };

  const handleRemoveGame = (index: number) => {
    const newGames = data.games.filter((_, i) => i !== index);
    updateData({ games: newGames });
  };

  const handleReset = () => {
    updateData({
      games: [],
      players: [],
      shuttlecockPrice: 0,
      courtSetup: defaultCourtSetup,
    });
  };

  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-badminton-green mb-2">
            🏸 Badminton Expense Splitter
          </h1>
          <p className="text-gray-400">Split your badminton expenses fairly</p>
        </div>

        <div className="mb-6">
          <PlayerManagement
            players={data.players}
            onAddPlayer={handleAddPlayer}
            onRemovePlayer={handleRemovePlayer}
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
          onRemoveGame={handleRemoveGame}
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
