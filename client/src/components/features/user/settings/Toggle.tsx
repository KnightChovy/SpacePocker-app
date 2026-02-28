import React from 'react';

const Toggle: React.FC = () => (
  <label className="relative inline-flex items-center cursor-pointer">
    <input className="sr-only peer" type="checkbox" />
    <div className="w-11 h-6 bg-border-light peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
  </label>
);

export default Toggle;
