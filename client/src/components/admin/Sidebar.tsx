import React, { type Dispatch, type SetStateAction } from 'react';
import { useNavigate } from 'react-router-dom';

interface SidebarProps {
  activeItem: string;
  setActiveItem: Dispatch<SetStateAction<string>>;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

const Sidebar: React.FC<SidebarProps> = ({
  activeItem,
  setActiveItem,
  isOpen,
  setIsOpen,
}) => {
  const navigate = useNavigate();
  // const location = useLocation();

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: 'dashboard',
      path: '/admin/dashboard',
    },
    { id: 'users', label: 'Users', icon: 'group', path: '/admin/users' },
    { id: 'spaces', label: 'Spaces', icon: 'apartment', path: '/admin/spaces' },
    {
      id: 'finance',
      label: 'Finance',
      icon: 'payments',
      path: '/admin/finance',
    },
  ];

  const systemItems = [
    {
      id: 'settings',
      label: 'Settings',
      icon: 'settings',
      path: '/admin/settings',
    },
    {
      id: 'security',
      label: 'Security Logs',
      icon: 'shield',
      path: '/admin/security',
    },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:relative inset-y-0 left-0 z-50 flex flex-col w-72 h-full bg-white border-r border-gray-100 shrink-0 transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand */}
        <div className="p-8 flex items-center gap-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-200">
            <span className="material-symbols-outlined text-2xl">
              rocket_launch
            </span>
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-gray-900 leading-none">
              SPACEPOCKER
            </h1>
            <p className="text-xs text-indigo-600 font-medium mt-1">
              Admin Console
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 mt-6 overflow-y-auto">
          <div className="mb-8">
            <p className="px-4 mb-4 text-[11px] font-bold text-gray-400 uppercase tracking-[2px]">
              Main Menu
            </p>
            <div className="space-y-1">
              {menuItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveItem(item.id);
                    setIsOpen(false);
                    navigate(item.path);
                  }}
                  className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-200 ${
                    activeItem === item.id
                      ? 'bg-indigo-50 text-indigo-600 font-semibold'
                      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <span
                    className={`material-symbols-outlined text-[22px] ${activeItem === item.id ? 'fill-1' : ''}`}
                  >
                    {item.icon}
                  </span>
                  <span className="text-sm">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="px-4 mb-4 text-[11px] font-bold text-gray-400 uppercase tracking-[2px]">
              System
            </p>
            <div className="space-y-1">
              {systemItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveItem(item.id);
                    setIsOpen(false);
                    navigate(item.path);
                  }}
                  className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-200 ${
                    activeItem === item.id
                      ? 'bg-indigo-50 text-indigo-600 font-semibold'
                      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <span
                    className={`material-symbols-outlined text-[22px] ${activeItem === item.id ? 'fill-1' : ''}`}
                  >
                    {item.icon}
                  </span>
                  <span className="text-sm">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </nav>

        {/* User Footer */}
        <div className="p-4 mt-auto">
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100">
            <img
              src="https://picsum.photos/seed/marcus/100/100"
              alt="Admin"
              className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-900 truncate">
                Marcus Chen
              </p>
              <p className="text-[11px] text-gray-500 font-medium">
                Super Admin
              </p>
            </div>
            <button className="text-gray-400 hover:text-red-500 transition-colors">
              <span className="material-symbols-outlined text-lg">logout</span>
            </button>
          </div>
        </div>

        {/* Material Icons CSS Link */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        />
      </aside>
    </>
  );
};

export default Sidebar;
