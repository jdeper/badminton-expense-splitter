'use client';

import { Users, Plus, X } from 'lucide-react';
import { useState } from 'react';

interface PlayerManagementProps {
  players: string[];
  onAddPlayer: (name: string) => void;
  onRemovePlayer: (index: number) => void;
}

export default function PlayerManagement({
  players,
  onAddPlayer,
  onRemovePlayer,
}: PlayerManagementProps) {
  const [newPlayerName, setNewPlayerName] = useState('');

  const handleAddPlayer = () => {
    if (newPlayerName.trim() && !players.includes(newPlayerName.trim())) {
      onAddPlayer(newPlayerName.trim());
      setNewPlayerName('');
    }
  };

  return (
    <div className="bg-badminton-light rounded-lg p-6 shadow-lg border border-badminton-green/20">
      <h2 className="text-2xl font-bold text-badminton-green mb-6 flex items-center gap-2">
        <Users className="w-6 h-6" />
        ผู้เล่นที่มาวันนี้
      </h2>

      <div className="mb-4 flex gap-2">
        <input
          type="text"
          value={newPlayerName}
          onChange={(e) => setNewPlayerName(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAddPlayer()}
          placeholder="Enter player name"
          className="flex-1 px-4 py-2 bg-badminton-dark border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-badminton-green focus:border-transparent"
        />
        <button
          onClick={handleAddPlayer}
          className="px-4 py-2 bg-badminton-green text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add
        </button>
      </div>

      {players.length === 0 ? (
        <p className="text-gray-400 text-center py-4">No players added yet</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {players.map((player, index) => (
            <div
              key={index}
              className="flex items-center justify-between bg-badminton-dark px-4 py-2 rounded-lg border border-gray-700"
            >
              <span className="text-white">{player}</span>
              <button
                onClick={() => onRemovePlayer(index)}
                className="text-red-400 hover:text-red-300 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
