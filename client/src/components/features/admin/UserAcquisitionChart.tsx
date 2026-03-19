import React from 'react';

interface UserAcquisitionData {
  renters: number;
  hosts: number;
  admins: number;
}

interface Props {
  roles?: UserAcquisitionData;
}

const UserAcquisitionChart: React.FC<Props> = ({ roles }) => {
  const roleItems = [
    {
      label: 'Renters',
      count: roles?.renters ?? 0,
      color: 'bg-indigo-600',
    },
    {
      label: 'Hosts',
      count: roles?.hosts ?? 0,
      color: 'bg-purple-500',
    },
    {
      label: 'Admins',
      count: roles?.admins ?? 0,
      color: 'bg-gray-400',
    },
  ];

  const maxCount = Math.max(...roleItems.map(role => role.count), 1);

  const displayRoles = roleItems.map(role => ({
    ...role,
    value: Math.max((role.count / maxCount) * 100, role.count > 0 ? 12 : 0),
    countText: role.count.toLocaleString('vi-VN'),
  }));

  return (
    <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex-1">
      <h3 className="text-lg font-bold text-gray-900">User Acquisition</h3>
      <p className="text-sm text-gray-500 mt-1 mb-10">
        By role over last 30 days.
      </p>

      <div className="flex items-end justify-between h-48 gap-8 px-2">
        {displayRoles.map(role => (
          <div
            key={role.label}
            className="flex-1 flex flex-col items-center group"
          >
            <div className="mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span className="text-[11px] font-bold text-gray-900 bg-gray-100 px-2 py-1 rounded-md">
                {role.countText}
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
