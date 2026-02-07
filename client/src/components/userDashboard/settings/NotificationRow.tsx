import React from 'react';

const NotificationRow: React.FC<{
  title: string;
  desc: string;
  options: string[];
  checked?: string[];
  disabled?: boolean;
}> = ({ title, desc, options, checked = [], disabled }) => (
  <div className="flex items-start justify-between pb-6 border-b border-border-light dark:border-border-dark last:border-0 last:pb-0">
    <div>
      <h3 className="text-sm font-bold">{title}</h3>
      <p className="text-xs text-text-sub-light dark:text-text-sub-dark mt-1">
        {desc}
      </p>
    </div>
    <div className="flex items-center gap-4">
      {options.map(opt => (
        <div key={opt} className="flex items-center gap-2">
          <input
            type="checkbox"
            defaultChecked={checked.includes(opt) || disabled}
            disabled={disabled}
            className={`rounded border-gray-300 text-primary focus:ring-primary ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          />
          <span className={`text-xs ${disabled ? 'opacity-70' : ''}`}>
            {opt}
          </span>
        </div>
      ))}
    </div>
  </div>
);

export default NotificationRow;
