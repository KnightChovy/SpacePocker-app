import React from 'react';
import { roomPerformances } from '@/data/constantManager';

export const TopRoomsTable: React.FC = () => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col h-full">
      <div className="p-6 flex items-center justify-between border-b border-gray-50">
        <h3 className="text-lg font-bold text-text-dark">
          Top Performing Rooms
        </h3>
        <a
          className="text-xs font-semibold text-primary hover:text-primary-hover transition-colors"
          href="#"
        >
          View All
        </a>
      </div>

      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider w-[40%]">
                Room
              </th>
              <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Revenue
              </th>
              <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Occupancy
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {roomPerformances.map(room => (
              <tr key={room.id} className="hover:bg-gray-50 transition-colors">
                <td className="py-3 px-6">
                  <div className="flex items-center gap-3">
                    <img
                      src={room.imageUrl}
                      className="w-8 h-8 rounded bg-gray-200 object-cover"
                      alt={room.name}
                    />
                    <div className="overflow-hidden">
                      <div className="text-sm font-bold text-text-dark truncate">
                        {room.name}
                      </div>
                      <div className="text-[10px] text-gray-500">
                        {room.location}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-6 text-sm font-mono font-bold text-text-dark">
                  ${room.revenue.toLocaleString()}
                </td>
                <td className="py-3 px-6">
                  <div className="flex items-center gap-2 min-w-25">
                    <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${room.occupancy}%`,
                          backgroundColor:
                            room.occupancy > 80
                              ? '#14B8A6'
                              : room.occupancy > 60
                                ? '#6764f2'
                                : '#F59E0B',
                        }}
                      ></div>
                    </div>
                    <span className="text-xs font-medium text-gray-600">
                      {room.occupancy}%
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
