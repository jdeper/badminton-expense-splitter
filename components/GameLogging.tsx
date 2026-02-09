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
  const [shuttlecocks, setShuttlecocks] = useState<number>(1);
  const [reusedShuttlecocks, setReusedShuttlecocks] = useState<boolean>(false);

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
      reusedShuttlecocks,
      date: new Date().toISOString(),
    };
    onAddGame(game);
    setSelectedPlayers([]);
    setShuttlecocks(1);
    setReusedShuttlecocks(false);
  };

  return (
    <div className="bg-badminton-light rounded-xl p-6 shadow-lg border border-badminton-green/20">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-badminton-green flex items-center gap-2">
          <Gamepad2 className="w-6 h-6" />
          Game Logging Form
        </h2>
        <p className="text-sm text-gray-400 mt-1">
          Select 4 players from the list, enter shuttlecocks used, then record. Form resets for the next game.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Players as capsule list (input) */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-3">
            Players — tap to select 4
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
                    px-5 py-2.5 rounded-full text-sm font-medium transition-all
                    ${isSelected
                      ? 'bg-badminton-green text-white shadow-md'
                      : isDisabled
                      ? 'bg-gray-700 text-gray-500 cursor-not-allowed opacity-50'
                      : 'bg-badminton-dark text-gray-300 border-2 border-gray-600 hover:border-badminton-green hover:text-white'
                  }`}
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
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-badminton-green/90 text-white rounded-full text-sm font-medium"
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

        {/* Shuttlecocks + Re-used (one row) */}
        <div className="flex flex-wrap items-end gap-4">
          <div className="shrink-0">
            <label className="block text-sm font-medium text-gray-300 mb-1.5 flex items-center gap-2">
              <Circle className="w-4 h-4" />
              Shuttlecocks used
            </label>
            <input
              type="number"
              min={1}
              value={shuttlecocks}
              onChange={(e) => setShuttlecocks(Math.max(1, parseInt(e.target.value, 10) || 1))}
              className="w-14 px-2 py-2 text-center bg-badminton-dark border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-badminton-green [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              placeholder="1"
            />
          </div>
          <label className="flex items-center gap-2 cursor-pointer pb-2 shrink-0">
            <input
              type="checkbox"
              checked={reusedShuttlecocks}
              onChange={(e) => setReusedShuttlecocks(e.target.checked)}
              className="w-4 h-4 rounded border-gray-600 bg-badminton-dark text-badminton-green focus:ring-badminton-green"
            />
            <span className="text-sm text-gray-300">Re-used Shuttlecocks</span>
            <span className="text-xs text-gray-500">(½ cost)</span>
          </label>
        </div>

        <button
          type="submit"
          disabled={selectedPlayers.length !== 4 || shuttlecocks <= 0}
          className={`
            w-full py-3 rounded-lg font-semibold transition-colors
            ${
              selectedPlayers.length === 4 && shuttlecocks > 0
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
