import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        scrolled ? 'nav-blur border-b py-3' : 'bg-transparent py-5'
      }`}
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8 flex items-center justify-between">
        <div className="flex items-center gap-2.5 cursor-pointer">
          <div
            className={`h-8 w-8 rounded-lg flex items-center justify-center shadow-lg transition-colors ${
              scrolled
                ? 'bg-primary shadow-primary/20'
                : 'bg-white/20 backdrop-blur-sm shadow-white/20'
            }`}
          >
            <img src="/logomautrang.png" alt="Logo" className="h-6 w-8" />
          </div>
          <span
            className={`text-xl font-extrabold tracking-tight transition-colors ${
              scrolled ? 'text-secondary' : 'text-white'
            }`}
          >
            SPACEPOCKER
          </span>
        </div>

        {/* <div className="hidden md:flex items-center gap-8">
          {['Find a Space', 'Pricing', 'List your Space'].map((item) => (
            <a
              key={item}
              className={`text-sm font-semibold transition-colors ${
                scrolled
                  ? 'text-slate-600 hover:text-primary'
                  : 'text-white/90 hover:text-white'
              }`}
              href="#"
            >
              {item}
            </a>
          ))}
        </div> */}

        <div className="hidden md:flex items-center gap-8">
          {[
            { label: 'Find a Space', href: '/spaces' },
            { label: 'Pricing', href: '#' },
            { label: 'List your Space', href: '#' },
          ].map((item) => (
            <a
              key={item.label}
              href={item.href}
              className={`text-sm font-semibold transition-colors ${
                scrolled
                  ? 'text-slate-600 hover:text-primary'
                  : 'text-white/90 hover:text-white'
              }`}
            >
              {item.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <button
            className={`text-sm font-semibold transition-colors ${
              scrolled
                ? 'text-slate-600 hover:text-primary'
                : 'text-white/90 hover:text-white'
            }`}
            onClick={() => navigate('/auth-login')}
          >
            Log In
          </button>
          <Button
            className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all active:scale-95 shadow-lg ${
              scrolled
                ? 'bg-primary text-white shadow-primary/20 hover:bg-indigo-700'
                : 'bg-white text-primary shadow-white/20 hover:bg-white/90'
            }`}
            onClick={() => navigate('/auth-register')}
          >
            Get Started
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
