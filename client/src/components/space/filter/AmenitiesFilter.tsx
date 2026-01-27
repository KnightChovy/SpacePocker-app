import React from 'react';
import type { Amenity } from '@/types/types';

interface AmenitiesFilterProps {
  selectedAmenities: Amenity[];
  availableAmenities: Amenity[];
  onChange: (amenities: Amenity[]) => void;
}

const AmenitiesFilter: React.FC<AmenitiesFilterProps> = ({
  selectedAmenities,
  availableAmenities,
  onChange,
}) => {
  const toggleAmenity = (amenity: Amenity) => {
    const next = selectedAmenities.includes(amenity)
      ? selectedAmenities.filter((a) => a !== amenity)
      : [...selectedAmenities, amenity];
    onChange(next);
  };

  return (
    <div className="space-y-3 pt-4 border-t border-slate-100">
      <h4 className="font-semibold text-sm text-slate-900">Amenities</h4>
      {availableAmenities.map((amenity) => (
        <label
          key={amenity}
          className="flex items-center gap-3 group cursor-pointer"
        >
          <input
            checked={selectedAmenities.includes(amenity)}
            onChange={() => toggleAmenity(amenity)}
            className="size-4 rounded border-slate-300 accent-primary focus:ring-primary/20"
            type="checkbox"
          />
          <span className="text-sm text-slate-600 group-hover:text-primary transition-colors">
            {amenity}
          </span>
        </label>
      ))}
    </div>
  );
};

export default AmenitiesFilter;
