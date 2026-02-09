'use client';

import { Gamepad2, Circle, X } from 'lucide-react';
import { useState } from 'react';
import { GameData } from '@/lib/storage';

interface GameLoggingProps {
  players: string[];
  onAddGame: (game: GameData) => void;
}

export default function GameLogging({ players, onAddGame }: GameLoggingProps) {
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);
  const [shuttlecocks, setShuttlecocks] = useState<number>(0);

  const handlePlayerClick = (playerName: string) => {
    if (selectedPlayers.includes(playerName)) {
      // Deselect player
      setSelectedPlayers(selectedPlayers.filter(p => p !== playerName));
    } else {
      // Select player (max 4)
      if (selectedPlayers.length < 4) {
        setSelectedPlayers([...selectedPlayers, playerName]);
      }
    }
  };

  const handleRemovePlayer = (playerName: string) => {
    setSelectedPlayers(selectedPlayers.filter(p => p !== playerName));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedPlayers.length !== 4) {
      alert('Please select exactly 4 players');
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
    // Reset after submit
    setSelectedPlayers([]);
    setShuttlecocks(0);
  };

  return (
    <div className="bg-badminton-light rounded-lg p-6 shadow-lg border border-badminton-green/20">
      <h2 className="text-2xl font-bold text-badminton-green mb-6 flex items-center gap-2">
        <Gamepad2 className="w-6 h-6" />
        Log Game
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Selected Players Display */}
        {selectedPlayers.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Selected Players ({selectedPlayers.length}/4)
            </label>
            <div className="flex flex-wrap gap-2 mb-4">
              {selectedPlayers.map((player, index) => (
                <div
                  key={player}
                  className="flex items-center gap-2 px-4 py-2 bg-badminton-green text-white rounded-full font-medium"
                >
                  <span>{player}</span>
                  <button
                    type="button"
                    onClick={() => handleRemovePlayer(player)}
                    className="hover:bg-green-600 rounded-full p-0.5 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Player Capsules */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-3">
            Select 4 Players
          </label>
          <div className="flex flex-wrap gap-3">
            {players.map((player) => {
              const isSelected = selectedPlayers.includes(player);
              const isDisabled = !isSelected && selectedPlayers.length >= 4;
              
              return (
                <button
                  key={player}
                  type="button"
                  onClick={() => handlePlayerClick(player)}
                  disabled={isDisabled}
                  className={`
                    px-6 py-3 rounded-full font-medium transition-all
                    ${isSelected
                      ? 'bg-badminton-green text-white shadow-lg scale-105'
                      : isDisabled
                      ? 'bg-gray-700 text-gray-500 cursor-not-allowed opacity-50'
                      : 'bg-badminton-dark text-gray-300 border-2 border-gray-600 hover:border-badminton-green hover:text-white hover:bg-badminton-dark/80'
                    }
                  `}
                >
                  {player}
                </button>
              );
            })}
          </div>
          {selectedPlayers.length < 4 && (
            <p className="text-sm text-gray-400 mt-3">
              Select {4 - selectedPlayers.length} more player{4 - selectedPlayers.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>

        {/* Shuttlecocks Input */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
            <Circle className="w-4 h-4" />
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

        {/* Submit Button */}
        <button
          type="submit"
          disabled={selectedPlayers.length !== 4 || shuttlecocks <= 0}
          className={`
            w-full py-3 rounded-lg font-semibold transition-colors
            ${selectedPlayers.length === 4 && shuttlecocks > 0
              ? 'bg-badminton-green text-white hover:bg-green-600'
              : 'bg-gray-600 text-gray-400 cursor-not-allowed'
            }
          `}
        >
          Add Game
        </button>
      </form>
    </div>
  );
}
