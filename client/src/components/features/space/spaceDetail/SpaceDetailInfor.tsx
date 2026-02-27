import React from 'react';
import type { Host } from '@/types/types';

interface SpaceDetailInfoProps {
  description: string;
  host?: Host;
}

const SpaceDetailInfo: React.FC<SpaceDetailInfoProps> = ({
  description,
  host,
}) => {
  return (
    <div className="space-y-12">
      {host && (
        <div className="flex items-center justify-between pb-8 border-b border-gray-100">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Hosted by {host.name}
            </h2>
            <p className="text-gray-500">Joined in {host.joinedDate}</p>
          </div>
          <img
            src={host.avatar}
            alt={host.name}
            className="w-14 h-14 rounded-full border-2 border-white shadow-md"
          />
        </div>
      )}

      {/* Description */}
      <section>
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          About this space
        </h3>
        <p className="text-gray-600 leading-relaxed whitespace-pre-line">
          {description}
        </p>
      </section>
    </div>
  );
};

export default SpaceDetailInfo;
