import React from 'react';

const SecurityInputField: React.FC<{ label: string }> = ({ label }) => (
  <div className="md:col-span-1">
    <label className="text-sm font-semibold">{label}</label>
    <input 
      className="mt-2 w-full px-4 py-2.5 rounded-xl border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark focus:ring-2 focus:ring-primary/50 focus:border-primary text-sm outline-none" 
      placeholder="••••••••" 
      type="password"
    />
  </div>
);

export default SecurityInputField