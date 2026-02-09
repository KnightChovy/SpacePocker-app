import { Menu, Search, Bell, MessageSquare, ChevronDown } from 'lucide-react';

interface ManagerHeaderProps {
  title: string;
  onMenuClick: () => void;
}

export default function ManagerHeader({
  title,
  onMenuClick,
}: ManagerHeaderProps) {
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-border-light bg-background-light/80 backdrop-blur-md sticky top-0 z-20">
      <div className="flex items-center gap-4">
        <button className="lg:hidden text-slate-500" onClick={onMenuClick}>
          <Menu className="h-6 w-6" />
        </button>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
          {title}
        </h2>
      </div>

      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="hidden md:flex items-center h-10 bg-white border border-border-light rounded-xl px-3 w-64 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all shadow-sm">
          <Search className="h-5 w-5 text-slate-400" />
          <input
            className="bg-transparent border-none text-sm text-slate-900 placeholder-slate-400 focus:ring-0 w-full ml-2 outline-none"
            placeholder="Search bookings..."
            type="text"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button className="h-10 w-10 flex items-center justify-center rounded-xl bg-white border border-border-light text-slate-600 hover:text-primary hover:border-primary/30 transition-all shadow-sm relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-2.5 right-2.5 h-2 w-2 bg-red-500 rounded-full border-2 border-white" />
          </button>
          <button className="h-10 w-10 flex items-center justify-center rounded-xl bg-white border border-border-light text-slate-600 hover:text-primary hover:border-primary/30 transition-all shadow-sm">
            <MessageSquare className="h-5 w-5" />
          </button>
        </div>

        <div className="h-8 w-px bg-slate-200 mx-2" />

        {/* Profile */}
        <button className="flex items-center gap-3 pl-1 pr-2 py-1 rounded-full hover:bg-white transition-colors">
          <div
            className="h-9 w-9 rounded-full bg-cover bg-center border border-slate-200"
            style={{
              backgroundImage: "url('https://picsum.photos/id/64/100/100')",
            }}
          />
          <div className="hidden lg:flex flex-col items-start">
            <span className="text-sm font-semibold text-slate-900 leading-none">
              Alex Morgan
            </span>
            <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider mt-1">
              Admin
            </span>
          </div>
          <ChevronDown className="hidden lg:block h-4 w-4 text-slate-400" />
        </button>
      </div>
    </header>
  );
}
