import type { ReactNode } from 'react';

interface CardProps {
  title: string;
  subtitle?: string;
  headerAction?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function Card({
  title,
  subtitle,
  headerAction,
  children,
  className = '',
}: CardProps) {
  return (
    <div
      className={`bg-white rounded-xl border border-gray-200 shadow-soft p-6 ${className}`}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900">{title}</h3>
          {subtitle && (
            <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>
          )}
        </div>
        {headerAction && <div>{headerAction}</div>}
      </div>
      {children}
    </div>
  );
}
