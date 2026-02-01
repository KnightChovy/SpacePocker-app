import React from 'react';
import { Wifi, Tv, Projector, AirVent, PenLine } from 'lucide-react';
import type { AmenityDetail } from '@/types/types';

interface SpaceDetailAmenitiesProps {
  amenities?: AmenityDetail[]; 
}

const iconMap: Record<string, React.FC<{ className?: string }>> = {
  wifi: Wifi,
  tv: Tv,
  videoCam: Projector,
  ac_unit: AirVent,
  whiteboard: PenLine,
};

const SpaceDetailAmenities: React.FC<SpaceDetailAmenitiesProps> = ({
  amenities = [],
}) => {
  if (!amenities || amenities.length === 0) {
    return null;
  }

  return (
    <section>
      <h3 className="text-xl font-bold text-gray-900 mb-6">
        What this place offers
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-12">
        {amenities.map((amenity, idx) => {
          const IconComponent = iconMap[amenity.icon];

          return (
            <div key={idx} className="flex items-center gap-4 group">
              <div className="w-10 h-10 rounded-lg bg-cyan-50 flex items-center justify-center text-cyan-400 transition-colors group-hover:bg-cyan-400 group-hover:text-white">
                {IconComponent ? (
                  <IconComponent className="w-5 h-5" />
                ) : (
                  <span className="text-xs font-bold">?</span>
                )}
              </div>
              <span className="text-gray-700 font-medium tracking-tight transition-colors group-hover:text-gray-900">
                {amenity.label}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default SpaceDetailAmenities;
