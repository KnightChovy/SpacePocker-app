import React from 'react';

interface PriceRangeFilterProps {
  priceRange: [number, number];
  onChange: (range: [number, number]) => void;
}

const PriceRangeFilter: React.FC<PriceRangeFilterProps> = ({
  priceRange,
  onChange,
}) => {
  return (
    <div className="space-y-4">
      <h4 className="font-semibold text-sm text-slate-900">
        Price Range (per hour)
      </h4>
      <div className="relative pt-6 pb-2">
        <input
          className="absolute z-20 w-full h-1 bg-transparent appearance-none pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-primary [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:shadow-md"
          max="500"
          min="0"
          type="range"
          value={priceRange[1]}
          onChange={(e) => onChange([20, parseInt(e.target.value)])}
        />
        <div className="h-1 w-full bg-slate-200 rounded-full absolute top-6">
          <div
            className="h-1 bg-primary rounded-full absolute left-0"
            style={{ width: `${(priceRange[1] / 500) * 100}%` }}
          ></div>
        </div>
      </div>
      <div className="flex justify-between items-center text-sm font-medium text-slate-600">
        <div className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 shadow-sm">
          ${priceRange[0]}
        </div>
        <span className="text-slate-300">-</span>
        <div className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 shadow-sm">
          ${priceRange[1]}
          {priceRange[1] >= 500 ? '+' : ''}
        </div>
      </div>
    </div>
  );
};

export default PriceRangeFilter;
