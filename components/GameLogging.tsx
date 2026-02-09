'use client';

import { Gamepad2, Shuttlecock } from 'lucide-react';
import { useState } from 'react';
import { GameData } from '@/lib/storage';

interface GameLoggingProps {
  players: string[];
  onAddGame: (game: GameData) => void;
}

export default function GameLogging({ players, onAddGame }: GameLoggingProps) {
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>(['', '', '', '']);
  const [shuttlecocks, setShuttlecocks] = useState<number>(0);

  const handlePlayerSelect = (index: number, playerName: string) => {
    const newSelected = [...selectedPlayers];
    newSelected[index] = playerName;
    setSelectedPlayers(newSelected);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedPlayers.some(p => !p) || selectedPlayers.length !== 4) {
      alert('Please select 4 players');
      return;
    }

    if (new Set(selectedPlayers).size !== 4) {
      alert('Please select 4 different players');
      return;
    }

    if (shuttlecocks <= 0) {
      alert('Please enter a valid number of shuttlecocks');
      return;
    }

    const game: GameData = {
      player1: selectedPlayers[0],
      player2: selectedPlayers[1],
      player3: selectedPlayers[2],
      player4: selectedPlayers[3],
      shuttlecocks,
      date: new Date().toISOString(),
    };

    onAddGame(game);
    setSelectedPlayers(['', '', '', '']);
    setShuttlecocks(0);
  };

  return (
    <div className="bg-badminton-light rounded-lg p-6 shadow-lg border border-badminton-green/20">
      <h2 className="text-2xl font-bold text-badminton-green mb-6 flex items-center gap-2">
        <Gamepad2 className="w-6 h-6" />
        Log Game
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Team 1 - Player 1
            </label>
            <select
              value={selectedPlayers[0]}
              onChange={(e) => handlePlayerSelect(0, e.target.value)}
              className="w-full px-4 py-2 bg-badminton-dark border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-badminton-green focus:border-transparent"
            >
              <option value="">Select player</option>
              {players.map((player) => (
                <option key={player} value={player}>
                  {player}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Team 1 - Player 2
            </label>
            <select
              value={selectedPlayers[1]}
              onChange={(e) => handlePlayerSelect(1, e.target.value)}
              className="w-full px-4 py-2 bg-badminton-dark border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-badminton-green focus:border-transparent"
            >
              <option value="">Select player</option>
              {players.map((player) => (
                <option key={player} value={player}>
                  {player}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Team 2 - Player 1
            </label>
            <select
              value={selectedPlayers[2]}
              onChange={(e) => handlePlayerSelect(2, e.target.value)}
              className="w-full px-4 py-2 bg-badminton-dark border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-badminton-green focus:border-transparent"
            >
              <option value="">Select player</option>
              {players.map((player) => (
                <option key={player} value={player}>
                  {player}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Team 2 - Player 2
            </label>
            <select
              value={selectedPlayers[3]}
              onChange={(e) => handlePlayerSelect(3, e.target.value)}
              className="w-full px-4 py-2 bg-badminton-dark border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-badminton-green focus:border-transparent"
            >
              <option value="">Select player</option>
              {players.map((player) => (
                <option key={player} value={player}>
                  {player}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
            <Shuttlecock className="w-4 h-4" />
            Shuttlecocks Used
          </label>
          <input
            type="number"
            min="1"
            value={shuttlecocks || ''}
            onChange={(e) => setShuttlecocks(parseInt(e.target.value) || 0)}
            className="w-full px-4 py-2 bg-badminton-dark border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-badminton-green focus:border-transparent"
            placeholder="Enter number of shuttlecocks"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-badminton-green text-white rounded-lg hover:bg-green-600 transition-colors font-semibold"
        >
          Add Game
        </button>
      </form>
    </div>
  );
}
