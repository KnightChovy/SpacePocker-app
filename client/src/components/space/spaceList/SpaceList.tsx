import type { Space } from '@/types/types';
import SpaceCard from '../spaceList/SpaceCard';

interface SpaceListProps {
  spaces: Space[];
}

const SpaceList = ({ spaces }: SpaceListProps) => {
  return (
    <div className="grid grid-cols-3 gap-6">
      {spaces.map((space) => (
        <SpaceCard key={space.id} space={space} />
      ))}
    </div>
  );
};

export default SpaceList;
