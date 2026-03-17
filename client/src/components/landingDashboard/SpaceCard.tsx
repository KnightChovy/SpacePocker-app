import React from 'react';
import type { Space } from '@/types/types';
import { Button } from '../ui/button';
import { formatVND } from '@/lib/utils';

const SpaceCard: React.FC<{ space: Space }> = ({ space }) => {
  return (
    <div className="card-hover group flex flex-col overflow-hidden bg-white rounded-2xl border border-slate-100">
      <div className="relative aspect-16/10 w-full overflow-hidden">
        <img
          src={space.imageUrl}
          alt={space.name}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="p-5">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-bold text-secondary text-lg truncate pr-4">
            {space.name}
          </h3>
          <div className="flex items-center gap-1">
            ⭐<span className="text-sm font-bold">{space.rating}</span>
          </div>
        </div>
        <p className="text-sm text-slate-500 mb-6 line-clamp-1">
          {space.description}
        </p>

        <div className="flex items-center justify-between pt-4 border-t border-slate-50">
          <div>
            <span className="text-lg font-extrabold text-secondary">
              {formatVND(space.price)}
            </span>
            <span className="text-xs text-slate-400 font-medium"> / hour</span>
          </div>
          <Button className="text-xs font-bold text-primary bg-primary/5 px-3 py-1.5 rounded-full hover:bg-primary/10 transition-colors cursor-pointer">
            Details
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SpaceCard;
