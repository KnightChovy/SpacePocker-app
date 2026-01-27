import React from 'react';

interface RatingFilterProps {
  minRating: number | null;
  onChange: (rating: number | null) => void;
}

const RatingFilter: React.FC<RatingFilterProps> = ({ minRating, onChange }) => {
  return (
    <div className="space-y-3 pt-4 border-t border-slate-100">
      <h4 className="font-semibold text-sm text-slate-900">Minimum Rating</h4>
      <div className="flex gap-2">
        {[4.5, 4.0].map((val) => (
          <button
            key={val}
            onClick={() => onChange(minRating === val ? null : val)}
            className={`flex items-center justify-center gap-1 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
              minRating === val
                ? 'bg-primary text-white ring-2 ring-primary ring-offset-1 ring-offset-white'
                : 'bg-white border border-slate-200 text-slate-600 hover:border-primary/50'
            }`}
          >
            <span
              className={`material-symbols-outlined text-[16px] ${minRating === val ? 'fill-current' : ''}`}
            >
              ★
            </span>{' '}
            {val}+
          </button>
        ))}
        <button
          onClick={() => onChange(null)}
          className={`flex items-center justify-center gap-1 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
            minRating === null
              ? 'bg-primary text-white ring-2 ring-primary ring-offset-1 ring-offset-white'
              : 'bg-white border border-slate-200 text-slate-600 hover:border-primary/50'
          }`}
        >
          Any
        </button>
      </div>
    </div>
  );
};

export default RatingFilter;
