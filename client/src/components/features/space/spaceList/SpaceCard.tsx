import React from 'react';
import { Link } from 'react-router-dom';
import type { Space } from '@/types/types';
import { Button } from '@/components/ui/button';
import { formatVND } from '@/lib/utils';

const SpaceCard: React.FC<{ space: Space }> = ({ space }) => {
  return (
    <Link to={`/spaces/detail/${space.id}`} className="block">
      <div className="card-hover group flex flex-col overflow-hidden bg-white rounded-2xl border border-slate-100">
        <div className="relative aspect-16/10 w-full overflow-hidden">
          {space.imageUrl ? (
            <img
              src={space.imageUrl}
              alt={space.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full bg-slate-100 flex items-center justify-center">
              <span className="text-xs font-semibold text-slate-400">
                No image
              </span>
            </div>
          )}
          {space.rating > 0 && (
            <div className="absolute bottom-4 left-4 flex items-center gap-1  rounded-lg">
              <span className="text-yellow-500">★</span>
              <span className="text-sm text-white drop-shadow-lg">
                {space.rating}
              </span>
            </div>
          )}
        </div>

        <div className="p-5">
          <h3 className="font-bold text-secondary text-lg truncate mb-2">
            {space.name}
          </h3>
          <p className="text-sm text-slate-500 mb-1 line-clamp-1">
            {space.description}
          </p>

          {space.amenities && space.amenities.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-4">
              {space.amenities.slice(0, 3).map((amenity, index) => (
                <span
                  key={typeof amenity === 'string' ? amenity : index}
                  className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full"
                >
                  {typeof amenity === 'string' ? amenity : amenity.label}
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
                {formatVND(space.price)}
              </span>
              <span className="text-xs text-slate-400 font-medium">
                {' '}
                / hour
              </span>
            </div>
            <Button className="text-xs font-bold text-primary bg-primary/5 px-3 py-1.5 rounded-full hover:bg-primary/10 transition-colors cursor-pointer">
              Details
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default SpaceCard;
