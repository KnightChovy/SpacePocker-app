import type { Space } from '@/types/types';
import React from 'react';

interface SpaceDetailHeaderProps {
  space: Space;
}

const SpaceDetailHeader: React.FC<SpaceDetailHeaderProps> = ({ space }) => {
  return (
    <div className="space-detail-header">
      <h1 className="text-2xl font-bold">{space.title}</h1>
      <p className="text-sm text-gray-600">{space.location}</p>
      <div className="flex items-center">
        <span className="text-yellow-500">{'★'.repeat(space.rating)}</span>
        <span className="text-gray-500 ml-2">({space.reviewCount} reviews)</span>
      </div>
    </div>
  );
};

export default SpaceDetailHeader;