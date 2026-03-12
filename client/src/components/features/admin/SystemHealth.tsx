import React from 'react';
import type { LogEntry } from '@/types/admin-types';

interface Props {
  logs: LogEntry[];
}

const SystemHealth: React.FC<Props> = ({ logs }) => {
  return (
    <div className="bg-[#0f172a] rounded-3xl p-6 shadow-xl border border-gray-800 flex-1 flex flex-col min-h-62.5">
      <div className="flex items-center justify-between mb-6 border-b border-gray-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.4)]"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
          </div>
          <div className="flex items-center gap-2 ml-2">
            <span className="material-symbols-outlined text-[14px] text-emerald-400">
              terminal
            </span>
            <span className="text-[11px] font-mono font-bold text-gray-400 uppercase tracking-widest">
              System Health
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto font-mono text-[11px] space-y-3 custom-scrollbar">
        {logs.map((log, idx) => (
          <div
            key={idx}
            className="flex gap-3 items-start animate-in fade-in slide-in-from-left duration-500"
          >
            <span className="text-gray-500 whitespace-nowrap">
              [{log.timestamp}]
            </span>
            <div className="flex items-center gap-2 leading-relaxed">
              <span
                className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                  log.type === 'success'
                    ? 'bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.4)]'
                    : log.type === 'error'
                      ? 'bg-rose-500 shadow-[0_0_6px_rgba(244,63,94,0.4)]'
                      : 'bg-sky-400 shadow-[0_0_6px_rgba(56,189,248,0.4)]'
                }`}
              ></span>
              <span
                className={
                  log.type === 'error'
                    ? 'text-rose-300 font-semibold'
                    : log.type === 'success'
                      ? 'text-emerald-200'
                      : 'text-gray-300'
                }
              >
                {log.message}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SystemHealth;
