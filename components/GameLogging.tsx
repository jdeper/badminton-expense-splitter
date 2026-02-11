'use client';

import { Gamepad2, X } from 'lucide-react';
import { useState } from 'react';
import { GameData } from '@/lib/storage';
import { getPlayerColor, getPlayerBgColor } from '@/lib/playerColors';

interface GameLoggingProps {
  players: string[];
  onAddGame: (game: GameData) => void;
}

export default function GameLogging({ players, onAddGame }: GameLoggingProps) {
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);

  const handlePlayerClick = (playerName: string) => {
    if (selectedPlayers.includes(playerName)) {
      setSelectedPlayers(selectedPlayers.filter((p) => p !== playerName));
    } else if (selectedPlayers.length < 4) {
      setSelectedPlayers([...selectedPlayers, playerName]);
    }
  };

  const handleRemovePlayer = (playerName: string) => {
    setSelectedPlayers(selectedPlayers.filter((p) => p !== playerName));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedPlayers.length !== 4) {
      alert('Please select exactly 4 players');
      return;
    }
    const game: GameData = {
      player1: selectedPlayers[0],
      player2: selectedPlayers[1],
      player3: selectedPlayers[2],
      player4: selectedPlayers[3],
      shuttlecocks: 1,
      date: new Date().toISOString(),
    };
    onAddGame(game);
    setSelectedPlayers([]);
  };

  return (
    <div className="bg-badminton-light rounded-xl p-6 shadow-lg border border-badminton-green/20">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-badminton-green flex items-center gap-2">
          <Gamepad2 className="w-6 h-6" />
          รอบที่เล่น
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
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
                    px-5 py-2.5 rounded-full text-sm font-medium transition-all border-2
                    ${isSelected
                      ? 'text-white shadow-md'
                      : isDisabled
                      ? 'bg-gray-700 text-gray-500 cursor-not-allowed opacity-50'
                      : 'bg-badminton-dark text-gray-300 hover:text-white'
                  }`}
                  style={{
                    borderColor: getPlayerColor(player),
                    ...(isSelected ? { backgroundColor: getPlayerColor(player) } : {}),
                  }}
                >
                  {player}
                </button>
              );
            })}
          </div>
          {selectedPlayers.length > 0 && (
            <p className="text-sm text-gray-400 mt-2">
              Selected: {selectedPlayers.length}/4
              {selectedPlayers.length < 4 &&
                ` — ${4 - selectedPlayers.length} more to go`}
            </p>
          )}
        </div>

        {/* Selected 4 (read-only summary, removable) */}
        {selectedPlayers.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              This game
            </label>
            <div className="flex flex-wrap gap-2">
              {selectedPlayers.map((player) => (
                <div
                  key={player}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-white rounded-full text-sm font-medium"
                  style={{ backgroundColor: getPlayerColor(player) }}
                >
                  {player}
                  <button
                    type="button"
                    onClick={() => handleRemovePlayer(player)}
                    className="hover:bg-white/20 rounded-full p-0.5"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={selectedPlayers.length !== 4}
          className={`
            w-full py-3 rounded-lg font-semibold transition-colors
            ${
              selectedPlayers.length === 4
                ? 'bg-badminton-green text-white hover:bg-green-600'
                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
            }
          `}
        >
          Record game
        </button>
      </form>
    </div>
  );
}
