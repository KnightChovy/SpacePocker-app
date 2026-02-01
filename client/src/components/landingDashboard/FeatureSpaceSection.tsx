import { SPACES } from '@/data/constant';
import SpaceCard from './SpaceCard';
import { ChevronDown, Shuffle } from 'lucide-react';
import { Button } from '../ui/button';

const FeatureSpaceSection = () => {
  return (
    <section className="py-12 pb-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-xl">
            <h2 className="text-3xl font-extrabold text-secondary tracking-tight">
              Popular near you
            </h2>
            <p className="text-slate-500 mt-2 leading-relaxed">
              Discover the most booked spaces this week. From boutique studios
              to high-tech conference rooms.
            </p>
          </div>
          <div className="flex gap-3">
            <Button className="px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors flex items-center gap-2">
              <Shuffle className="h-4 w-4" />
              Filters
            </Button>
            <Button className="px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors flex items-center gap-2">
              Sort by
              <ChevronDown className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {SPACES.map(space => (
            <SpaceCard key={space.id} space={space} />
          ))}
        </div>

        <div className="mt-8 flex justify-center sm:hidden">
          <Button className="flex w-full items-center justify-center rounded-xl border border-gray-200 bg-white py-3 text-sm font-bold text-[#0e0d1b] shadow-sm">
            View all spaces
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeatureSpaceSection;
