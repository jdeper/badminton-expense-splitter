'use client';

import { Users, Plus, X, Calendar } from 'lucide-react';
import { useState } from 'react';

interface PlayerManagementProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
  players: string[];
  onAddPlayer: (name: string) => void;
  onRemovePlayer: (index: number) => void;
  loading?: boolean;
}

export default function PlayerManagement({
  selectedDate,
  onDateChange,
  players,
  onAddPlayer,
  onRemovePlayer,
  loading = false,
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
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold text-badminton-green flex items-center gap-2 flex-wrap">
          <Users className="w-6 h-6" />
          ผู้เล่นที่มาวันนี้
          <span className="text-gray-400 font-normal text-lg">
            (จำนวน {players.length} คน)
          </span>
        </h2>
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-gray-400" />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => onDateChange(e.target.value)}
            className="px-3 py-2 bg-badminton-dark border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-badminton-green focus:border-transparent"
          />
        </div>
      </div>

      {loading ? (
        <p className="text-gray-400 text-center py-4">กำลังโหลด...</p>
      ) : (
        <>
          <div className="mb-4 flex gap-2">
            <input
          type="text"
          value={newPlayerName}
              onChange={(e) => setNewPlayerName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddPlayer()}
              placeholder="ชื่อ (สูงสุด 10 ตัว)"
              maxLength={10}
              className="w-32 max-w-[10ch] px-4 py-2 bg-badminton-dark border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-badminton-green focus:border-transparent"
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
        </>
      )}
    </div>
  );
}
