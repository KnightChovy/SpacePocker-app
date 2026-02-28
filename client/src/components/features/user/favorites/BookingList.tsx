import { SPACESUSER } from '@/data/constant';
import { Heart, MapPin, Star } from 'lucide-react';

const BookingList = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {SPACESUSER.map((space, idx) => (
        <div
          key={idx}
          className="group bg-surface-light dark:bg-surface-dark rounded-2xl border border-border-light dark:border-border-dark overflow-hidden hover:shadow-xl transition-all duration-300 relative"
        >
          <div className="relative h-56 w-full overflow-hidden">
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
              style={{ backgroundImage: `url('${space.image}')` }}
            ></div>
            <div className="absolute top-3 right-3 z-10">
              <button className="w-9 h-9 rounded-full bg-white/95 dark:bg-surface-dark/95 backdrop-blur-sm flex items-center justify-center shadow-md text-red-500 hover:scale-110 transition-transform active:scale-95">
                <Heart className="h-5 w-5" />
              </button>
            </div>
            <div className="absolute top-3 left-3 z-10">
              <label className="flex items-center gap-2 bg-white/95 dark:bg-surface-dark/95 backdrop-blur-sm px-3 py-1.5 rounded-lg cursor-pointer hover:bg-white dark:hover:bg-surface-dark shadow-sm transition-colors border border-transparent hover:border-primary/20">
                <input
                  className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary dark:border-gray-600 dark:bg-gray-800"
                  type="checkbox"
                />
                <span className="text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
                  Compare
                </span>
              </label>
            </div>
          </div>

          <div className="p-5 flex flex-col gap-3">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-bold group-hover:text-primary transition-colors">
                  {space.name}
                </h3>
                <p className="text-sm text-text-sub-light dark:text-text-sub-dark flex items-center gap-1 mt-1">
                  <MapPin className="h-4 w-4" /> {space.location.split(',')[0]}
                </p>
              </div>
              <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-900/10 px-2 py-1 rounded-md text-amber-600 dark:text-amber-400 font-bold text-xs border border-amber-100 dark:border-amber-800">
                <Star className="h-4 w-4 fill-yellow-500" />
                {space.rating.toFixed(1)}
              </div>
            </div>

            <div className="flex gap-2 flex-wrap">
              {space.amenities.map((amenity, i) => (
                <span
                  key={i}
                  className="px-2 py-1 rounded-md bg-background-light dark:bg-background-dark text-[10px] font-medium text-text-sub-light dark:text-text-sub-dark uppercase tracking-wide"
                >
                  {amenity}
                </span>
              ))}
              <span className="px-2 py-1 rounded-md bg-background-light dark:bg-background-dark text-[10px] font-medium text-text-sub-light dark:text-text-sub-dark uppercase tracking-wide">
                {space.capacity}
              </span>
            </div>

            <div className="h-px bg-border-light dark:bg-border-dark w-full my-1"></div>
            <div className="flex justify-between items-end">
              <div className="flex flex-col">
                <span className="text-xs text-text-sub-light dark:text-text-sub-dark font-medium">
                  Starting from
                </span>
                <span className="text-xl font-black">
                  ${space.pricePerHour}
                  <span className="text-sm font-medium text-text-sub-light dark:text-text-sub-dark">
                    /hr
                  </span>
                </span>
              </div>
              <button className="px-5 py-2.5 bg-text-main-light dark:bg-white text-white dark:text-text-main-light rounded-xl text-sm font-bold hover:opacity-90 transition-opacity">
                Book Now
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BookingList;
