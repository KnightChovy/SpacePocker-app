import React from 'react';
import type { SpaceType } from '@/types/types';

interface SpaceTypeOption {
  label: SpaceType;
}

interface SpaceTypeFilterProps {
  spaceTypes: SpaceType[];
  availableTypes: SpaceTypeOption[];
  onChange: (types: SpaceType[]) => void;
}

const SpaceTypeFilter: React.FC<SpaceTypeFilterProps> = ({
  spaceTypes,
  availableTypes,
  onChange,
}) => {
  const toggleSpaceType = (type: SpaceType) => {
    const next = spaceTypes.includes(type)
      ? spaceTypes.filter((t) => t !== type)
      : [...spaceTypes, type];
    onChange(next);
  };

  return (
    <div className="space-y-3">
      <h4 className="font-semibold text-sm text-slate-900">Space Type</h4>
      {availableTypes.map((type) => (
        <label
          key={type.label}
          className="flex items-center gap-3 group cursor-pointer"
        >
          <input
            checked={spaceTypes.includes(type.label)}
            onChange={() => toggleSpaceType(type.label)}
            className="size-4 rounded border-slate-300 accent-primary focus:ring-primary/20"
            type="checkbox"
          />
          <span className="text-sm text-slate-600 group-hover:text-primary transition-colors">
            {type.label}
          </span>
        </label>
      ))}
    </div>
  );
};

export default SpaceTypeFilter;
