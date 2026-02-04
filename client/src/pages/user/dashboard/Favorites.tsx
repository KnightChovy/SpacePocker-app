import BookingList from '@/components/userDashboard/favorites/BookingList';
import { ArrowLeftRight, Shuffle } from 'lucide-react';

const Favorites = () => {
  return (
    <div className="p-4 md:p-8 scroll-smooth">
      <div className="max-w-7xl mx-auto flex flex-col gap-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 animate-fade-in-up border-b border-border-light dark:border-border-dark pb-6">
          <div>
            <h1 className="text-3xl font-black tracking-tight mb-2">Favorites Collection</h1>
            <p className="text-text-sub-light dark:text-text-sub-dark text-base">You have saved 6 spaces. Select to compare.</p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark text-text-sub-light dark:text-text-sub-dark hover:bg-background-light dark:hover:bg-background-dark hover:text-primary transition-all">
              <Shuffle className='h-5 w-5' />
              <span className="text-sm font-bold hidden sm:inline">Filter</span>
            </button>
            <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white shadow-lg shadow-primary/25 hover:bg-primary/60 transition-all active:scale-95 group">
              <ArrowLeftRight className='h-5 w-5 transition-transform' />
              <span className="text-sm font-bold">Compare Selected (0/3)</span>
            </button>
          </div>
        </div>

        <BookingList />
      </div>
    </div>
  );
};

export default Favorites;