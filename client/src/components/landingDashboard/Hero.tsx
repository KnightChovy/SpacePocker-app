import { Calendar, Search } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

const BACKGROUND_IMAGES = [
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCwlPPMsf9lghdgPlt1bq56qVptcqi1bkMFjNHUyE4TPrQiOjR7JLsXdDAMhJn13nJq6P6OZqz7C0-9x5cEBJhqU-V_pmyD6SxjSOTTFZ5Ue2LFMBsqb4HbegPzXxkAn5or-4GwajEddanVttCumKFnSd9c1Sjb4Dl1hXPNX-HUf1Rp1kgj2UV3r897jjX4KH8ditSiJzuWO5OLmOY-fF5XhySVffajiAfUHOn4mDoSPHcTian4qESRqNpPKyK4XPlsPNr9mD1MKD08',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDL3xl0GFXISNp8qVpObELYgdUbG_D3YKSJS53o0bQaQbNnsiQ0_Ri-1L-2zxPihml5kAmfdEPr3zvGyMDWR6eGoFfYw97t8BSvFCgwsL3X66HVFvTpCln8HflxfKyEBNlYZucV5hg6sKEy2wWatxxcuHlHIFsIvAiKtrGzivtWbtlQwYzt5VJFtS16jmG_67fTePYzfCorYdfanV8f2LAMBJOYBXTJmk5oMuaXk1FU0YPoY7pralodPsuULJfDUyhhv7uJiCqe1vUT',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAhMv8qNFwG35b9XGVy9xWT2EGsCulDlda03EZowocuP9z_37zxsILgVRLMNKw1B8nEwgRggbCEZDwAaeGVJ_jscWx7tsHKkdTSjqZoHLnCG3U1ABeZeH1KBrxAWSPyNseqL2MpEYtxEj0RnN6vEub0MVXCSmNVk4ityVECZ1x7a5cRlUP6LNx6Ie7bur6Fc5jkL9yE5loJqEU5KcdQTLvQbiloVyWxRPu7jWfGOjUnbtDZiLjNgSVtiw5T7j0bvdo7kx1p1ksVvU1S',
];

const Hero = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex(
        (prevIndex) => (prevIndex + 1) % BACKGROUND_IMAGES.length,
      );
    }, 7000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
      <div className="absolute inset-0 z-0">
        {BACKGROUND_IMAGES.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentImageIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={image}
              alt={`Background ${index + 1}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-b from-black/60 via-black/50 to-black/70"></div>
          </div>
        ))}
      </div>

      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none overflow-hidden z-10">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/20 rounded-full blur-[120px]"></div>
        <div className="absolute top-1/2 -left-24 w-72 h-72 bg-purple-400/20 rounded-full blur-[100px]"></div>
      </div>

      <div className="relative z-20 mx-auto max-w-7xl px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-bold mb-8 animate-bounce">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
          </span>
          New: AI-powered space matching
        </div>

        <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-7xl mb-8 leading-[1.1] drop-shadow-2xl">
          Find the perfect space for <br className="hidden sm:block" />
          <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-400 to-purple-400">
            your next breakthrough.
          </span>
        </h1>

        <p className="mx-auto max-w-2xl text-lg text-white/90 mb-12 leading-relaxed drop-shadow-lg">
          Book modern classrooms, creative studios, and meeting hubs instantly.
          No contracts, just pure creativity.
        </p>

        <div className="mx-auto max-w-3xl items-center bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-2 flex flex-col md:flex-row gap-2 border border-white/20">
          <div className="flex-1 flex items-center px-4 py-3 border-b md:border-b-0 md:border-r border-slate-200">
            <Search className="text-slate-400 mr-3 h-5 w-5" />
            <Input
              className="w-full bg-transparent border-0 focus:ring-0 text-sm font-medium placeholder:text-slate-400 focus-visible:ring-0 focus-visible:ring-offset-0"
              placeholder="San Francisco, CA"
            />
          </div>
          <div className="hidden md:flex items-center px-4 py-3 border-r border-slate-200 min-w-45">
            <Calendar className="text-slate-400 mr-3 h-5 w-5" />
            <span className="text-sm font-medium text-slate-600">
              Add dates
            </span>
          </div>
          <Button className="bg-primary text-white px-10 py-6 rounded-xl font-bold text-base shadow-lg shadow-primary/30 hover:bg-indigo-700 transition-all active:scale-95 w-full md:w-auto">
            Search
          </Button>
        </div>

        <div className="mt-16 flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
          <span className="text-xs font-bold uppercase tracking-widest text-white/60">
            Trusted by creators at
          </span>
          <div className="flex gap-8 items-center text-lg font-black text-white/80">
            <span>ACME Corp</span>
            <span>Globex</span>
            <span>Soylant</span>
            <span>Initech</span>
            <span>Umbrella</span>
          </div>
        </div>

        <div className="mt-12 flex justify-center gap-2">
          {BACKGROUND_IMAGES.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentImageIndex
                  ? 'w-8 bg-white'
                  : 'w-2 bg-white/40 hover:bg-white/60'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Hero;
