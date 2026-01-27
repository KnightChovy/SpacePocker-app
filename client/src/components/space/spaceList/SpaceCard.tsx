import React from 'react';
import type { Space } from '@/types/types';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

const SpaceCard: React.FC<{ space: Space }> = ({ space }) => {
  return (
    <div className="card-hover group flex flex-col overflow-hidden bg-white rounded-2xl border border-slate-100">
      <div className="relative aspect-16/10 w-full overflow-hidden">
        <img
          src={space.imageUrl}
          alt={space.name}
          className="h-full w-full object-cover"
        />
        {/* Heart icon */}
        <div className="absolute top-4 right-4 h-8 w-8 rounded-full bg-white/90 flex items-center justify-center text-slate-400 hover:text-red-500 cursor-pointer shadow-sm">
          <Heart className="h-5 w-5" />
        </div>
        {/* Rating overlay */}
        <div className="absolute bottom-4 left-4 flex items-center gap-1  rounded-lg">
          <span className="text-yellow-500">★</span>
          <span className="text-sm text-white drop-shadow-lg">
            {space.rating}
          </span>
        </div>
      </div>

      <div className="p-5">
        <h3 className="font-bold text-secondary text-lg truncate mb-2">
          {space.name}
        </h3>
        <p className="text-sm text-slate-500 mb-1 line-clamp-1">
          {space.description}
        </p>

        {/* Hiển thị amenities nếu có */}
        {space.amenities && space.amenities.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {space.amenities.slice(0, 3).map((amenity) => (
              <span
                key={amenity}
                className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full"
              >
                {amenity}
              </span>
            ))}
            {space.amenities.length > 3 && (
              <span className="text-xs text-slate-400 px-2 py-1">
                +{space.amenities.length - 3} more
              </span>
            )}
          </div>
        )}

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
