'use client';

import { Settings, RotateCcw, Plus, Trash2 } from 'lucide-react';
import type { CourtSetup, CourtSetupEntry } from '@/lib/storage';
import { getCourtFeeFromSetup } from '@/lib/storage';

interface SetupSectionProps {
  shuttlecockPrice: number;
  courtSetup: CourtSetup;
  onShuttlecockPriceChange: (price: number) => void;
  onCourtSetupChange: (setup: CourtSetup) => void;
  onReset: () => void;
}

export default function SetupSection({
  shuttlecockPrice,
  courtSetup,
  onShuttlecockPriceChange,
  onCourtSetupChange,
  onReset,
}: SetupSectionProps) {
  const courtFee = getCourtFeeFromSetup(courtSetup);

  const handleReset = () => {
    if (typeof window !== 'undefined' && window.confirm('Clear all game history and reset totals to zero?')) {
      onReset();
    }
  };

  const defaultEntry: CourtSetupEntry = {
    courtNumber: '1',
    startHour: 9,
    startMinute: 0,
    endHour: 10,
    endMinute: 0,
  };

  const courtOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const minuteOptions = [0, 15, 30, 45];
  const hourMin = 9;
  const hourMax = 18;

  const addEntry = () => {
    onCourtSetupChange({
      ...courtSetup,
      entries: [...courtSetup.entries, { ...defaultEntry }],
    });
  };

  const updateEntry = (index: number, updates: Partial<CourtSetupEntry>) => {
    const next = [...courtSetup.entries];
    next[index] = { ...next[index], ...updates };
    onCourtSetupChange({ ...courtSetup, entries: next });
  };

  const removeEntry = (index: number) => {
    onCourtSetupChange({
      ...courtSetup,
      entries: courtSetup.entries.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="bg-badminton-light rounded-lg p-6 shadow-lg border border-badminton-green/20">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold text-badminton-green flex items-center gap-2">
          <Settings className="w-6 h-6" />
          ค่าใช้จ่าย
        </h2>
        <button
          type="button"
          onClick={handleReset}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-red-500/50 text-red-400 hover:bg-red-500/10 transition-colors font-medium"
        >
          <RotateCcw className="w-4 h-4" />
          Reset
        </button>
      </div>

      {/* Court setup */}
      <div className="border-t border-gray-600 pt-6">
        <h3 className="text-lg font-semibold text-badminton-green mb-3">Court setup</h3>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300 mb-2">ค่าต่อชั่วโมง (฿)</label>
          <div className="relative max-w-[140px]">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">฿</span>
            <input
              type="number"
              step="1"
              min="0"
              value={courtSetup.ratePerHour || ''}
              onChange={(e) => onCourtSetupChange({ ...courtSetup, ratePerHour: parseInt(e.target.value, 10) || 0 })}
              className="w-full pl-8 pr-4 py-2 bg-badminton-dark border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-badminton-green"
              placeholder="0"
            />
          </div>
        </div>

        <div className="space-y-3 mb-3">
          {courtSetup.entries.map((entry, index) => (
            <div
              key={index}
              className="flex flex-col gap-3 md:flex-row md:flex-wrap md:items-center md:gap-2 p-3 rounded-lg bg-badminton-dark/50"
            >
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => removeEntry(index)}
                  className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <label className="text-gray-400 text-xs w-10 shrink-0">สนาม</label>
                <select
                  value={courtOptions.includes(Number(entry.courtNumber)) ? entry.courtNumber : '1'}
                  onChange={(e) => updateEntry(index, { courtNumber: e.target.value })}
                  className="w-14 px-2 py-1.5 bg-badminton-dark border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-badminton-green"
                >
                  {courtOptions.map((n) => (
                    <option key={n} value={String(n)}>{n}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-500 text-xs w-10 shrink-0">เริ่ม</span>
                <select
                  value={Math.min(hourMax, Math.max(hourMin, entry.startHour ?? 9))}
                  onChange={(e) => updateEntry(index, { startHour: parseInt(e.target.value, 10) })}
                  className="w-14 px-2 py-1.5 bg-badminton-dark border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-badminton-green"
                >
                  {Array.from({ length: hourMax - hourMin + 1 }, (_, i) => hourMin + i).map((h) => (
                    <option key={h} value={h}>{h}</option>
                  ))}
                </select>
                <span className="text-gray-500 text-sm">:</span>
                <select
                  value={minuteOptions.includes(entry.startMinute ?? 0) ? (entry.startMinute ?? 0) : 0}
                  onChange={(e) => updateEntry(index, { startMinute: parseInt(e.target.value, 10) })}
                  className="w-14 px-2 py-1.5 bg-badminton-dark border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-badminton-green"
                >
                  {minuteOptions.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
                <span className="text-gray-500 text-sm">น.</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-500 text-xs w-10 shrink-0">สิ้นสุด</span>
                <select
                  value={Math.min(hourMax, Math.max(hourMin, entry.endHour ?? 10))}
                  onChange={(e) => updateEntry(index, { endHour: parseInt(e.target.value, 10) })}
                  className="w-14 px-2 py-1.5 bg-badminton-dark border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-badminton-green"
                >
                  {Array.from({ length: hourMax - hourMin + 1 }, (_, i) => hourMin + i).map((h) => (
                    <option key={h} value={h}>{h}</option>
                  ))}
                </select>
                <span className="text-gray-500 text-sm">:</span>
                <select
                  value={minuteOptions.includes(entry.endMinute ?? 0) ? (entry.endMinute ?? 0) : 0}
                  onChange={(e) => updateEntry(index, { endMinute: parseInt(e.target.value, 10) })}
                  className="w-14 px-2 py-1.5 bg-badminton-dark border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-badminton-green"
                >
                  {minuteOptions.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
                <span className="text-gray-500 text-sm">น.</span>
              </div>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addEntry}
          className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-600 text-gray-300 hover:border-badminton-green hover:text-badminton-green transition-colors text-sm"
        >
          <Plus className="w-4 h-4" />
          เพิ่มสนาม
        </button>

        <div className="mt-4 pt-4 border-t border-gray-600">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-300">ค่าคอร์ท (จากการคำนวณ)</span>
            <span className="text-lg font-semibold text-badminton-green">฿{courtFee.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-600 pt-6 mt-6">
        <label className="block text-sm font-medium text-gray-300 mb-2">ค่าลูกทั้งหมด</label>
        <div className="relative max-w-[140px]">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">฿</span>
          <input
            type="number"
            step="1"
            min="0"
            value={shuttlecockPrice || ''}
            onChange={(e) => onShuttlecockPriceChange(parseInt(e.target.value, 10) || 0)}
            className="w-full pl-8 pr-4 py-2 bg-badminton-dark border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-badminton-green focus:border-transparent"
            placeholder="0"
          />
        </div>
      </div>
    </div>
  );
}
