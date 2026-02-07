import React from 'react';
import { Briefcase, Mail, Phone, UserRound } from 'lucide-react';

const InputField: React.FC<{
  label: string;
  icon: string;
  defaultValue: string;
  type?: string;
}> = ({ label, icon, defaultValue, type = 'text' }) => (
  <div className="flex flex-col gap-2">
    <label className="text-sm font-semibold">{label}</label>
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-sub-light">
        {icon === 'person' && <UserRound className="w-4 h-4" />}
        {icon === 'work' && <Briefcase className="w-5 h-5" />}
        {icon === 'mail' && <Mail className="w-5 h-5" />}
        {icon === 'call' && <Phone className="w-4 h-4" />}
      </span>
      <input
        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark focus:ring-2 focus:ring-primary/50 focus:border-primary text-sm transition-all text-text-main-light dark:text-text-main-dark outline-none"
        type={type}
        defaultValue={defaultValue}
      />
    </div>
  </div>
);

export default InputField;
