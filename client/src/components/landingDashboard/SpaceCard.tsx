import React from 'react';
import type { Space } from '@/types/types';
import { Heart } from 'lucide-react';
import { Button } from '../ui/button';

const SpaceCard: React.FC<{ space: Space }> = ({ space }) => {
  return (
    <div className="card-hover group flex flex-col overflow-hidden bg-white rounded-2xl border border-slate-100">
      <div className="relative aspect-16/10 w-full overflow-hidden">
        <img
          src={space.imageUrl}
          alt={space.name}
          className="h-full w-full object-cover"
        />
        <div className="absolute top-4 right-4 h-8 w-8 rounded-full bg-white/90 flex items-center justify-center text-slate-400 hover:text-red-500 cursor-pointer shadow-sm">
          <Heart className="h-5 w-5" />
        </div>
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
              ${space.price}
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
