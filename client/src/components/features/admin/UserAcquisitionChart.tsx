import React from 'react';

const UserAcquisitionChart: React.FC = () => {
  const roles = [
    { label: 'Renters', value: 75, color: 'bg-indigo-600', count: '1,450' },
    { label: 'Hosts', value: 35, color: 'bg-purple-500', count: '420' },
    { label: 'Admins', value: 10, color: 'bg-gray-400', count: '12' },
  ];

  return (
    <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex-1">
      <h3 className="text-lg font-bold text-gray-900">User Acquisition</h3>
      <p className="text-sm text-gray-500 mt-1 mb-10">
        By role over last 30 days.
      </p>

      <div className="flex items-end justify-between h-48 gap-8 px-2">
        {roles.map(role => (
          <div
            key={role.label}
            className="flex-1 flex flex-col items-center group"
          >
            <div className="mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span className="text-[11px] font-bold text-gray-900 bg-gray-100 px-2 py-1 rounded-md">
                {role.count}
              </span>
            </div>
            <div className="w-full bg-gray-50 rounded-t-2xl relative flex items-end overflow-hidden h-full">
              <div
                className={`w-full rounded-t-2xl transition-all duration-1000 ease-out delay-100 ${role.color}`}
                style={{ height: `${role.value}%` }}
              ></div>
            </div>
            <span className="text-xs font-bold text-gray-500 mt-4 uppercase tracking-wider">
              {role.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserAcquisitionChart;
