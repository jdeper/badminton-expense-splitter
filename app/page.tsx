'use client';

import { useEffect, useState } from 'react';
import SetupSection from '@/components/SetupSection';
import PlayerManagement from '@/components/PlayerManagement';
import GameLogging from '@/components/GameLogging';
import SummaryTable from '@/components/SummaryTable';
import { AppData, GameData, getStoredData, saveData } from '@/lib/storage';

export default function Home() {
  const [data, setData] = useState<AppData>({
    shuttlecockPrice: 0,
    courtFee: 0,
    players: [],
    games: [],
  });

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

  const handleCourtFeeChange = (fee: number) => {
    updateData({ courtFee: fee });
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

  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-badminton-green mb-2">
            🏸 Badminton Expense Splitter
          </h1>
          <p className="text-gray-400">Split your badminton expenses fairly</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <SetupSection
            shuttlecockPrice={data.shuttlecockPrice}
            courtFee={data.courtFee}
            onShuttlecockPriceChange={handleShuttlecockPriceChange}
            onCourtFeeChange={handleCourtFeeChange}
          />
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
          courtFee={data.courtFee}
          players={data.players}
          games={data.games}
          onRemoveGame={handleRemoveGame}
        />
      </div>
    </main>
  );
}
