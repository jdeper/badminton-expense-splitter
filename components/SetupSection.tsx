'use client';

import { DollarSign, MapPin } from 'lucide-react';
import { AppData } from '@/lib/storage';

interface SetupSectionProps {
  shuttlecockPrice: number;
  courtFee: number;
  onShuttlecockPriceChange: (price: number) => void;
  onCourtFeeChange: (fee: number) => void;
}

export default function SetupSection({
  shuttlecockPrice,
  courtFee,
  onShuttlecockPriceChange,
  onCourtFeeChange,
}: SetupSectionProps) {
  return (
    <div className="bg-badminton-light rounded-lg p-6 shadow-lg border border-badminton-green/20">
      <h2 className="text-2xl font-bold text-badminton-green mb-6 flex items-center gap-2">
        <DollarSign className="w-6 h-6" />
        Setup
      </h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Shuttlecock Price per Unit
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
            <input
              type="number"
              step="0.01"
              min="0"
              value={shuttlecockPrice || ''}
              onChange={(e) => onShuttlecockPriceChange(parseFloat(e.target.value) || 0)}
              className="w-full pl-8 pr-4 py-2 bg-badminton-dark border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-badminton-green focus:border-transparent"
              placeholder="0.00"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Total Court Fee
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
            <input
              type="number"
              step="0.01"
              min="0"
              value={courtFee || ''}
              onChange={(e) => onCourtFeeChange(parseFloat(e.target.value) || 0)}
              className="w-full pl-8 pr-4 py-2 bg-badminton-dark border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-badminton-green focus:border-transparent"
              placeholder="0.00"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
