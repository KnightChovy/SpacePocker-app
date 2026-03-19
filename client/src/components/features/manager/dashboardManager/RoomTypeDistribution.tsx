import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useMemo } from 'react';
import { Card } from '@/components/common/Card';
import type { BookingDistribution } from '@/types/user/types';
import { useGetRooms } from '@/hooks/manager/rooms/use-get-rooms';
import type { ApiRoomType } from '@/types/user/room-api';

interface RoomTypeDistributionProps {
  // Kept for backward compatibility with existing page usage.
  data: BookingDistribution[];
}

const ROOM_TYPE_LABEL: Record<ApiRoomType, string> = {
  MEETING: 'Meeting',
  CLASSROOM: 'Classroom',
  EVENT: 'Event',
  OTHER: 'Other',
};

export const RoomTypeDistribution: React.FC<RoomTypeDistributionProps> = ({
  data: _data,
}) => {
  const roomsQuery = useGetRooms({ limit: 1000, offset: 0 });

  const data: BookingDistribution[] = useMemo(() => {
    const rooms = roomsQuery.data?.rooms;
    if (!rooms || rooms.length === 0) return [];

    const byType = new Map<string, { total: number; available: number }>();

    for (const room of rooms) {
      const label = ROOM_TYPE_LABEL[room.roomType] ?? room.roomType;
      const current = byType.get(label) ?? { total: 0, available: 0 };
      current.total += 1;
      if (room.status === 'AVAILABLE') current.available += 1;
      byType.set(label, current);
    }

    return Array.from(byType.entries()).map(([roomType, counts]) => ({
      roomType,
      available: counts.available,
      booked: Math.max(0, counts.total - counts.available),
    }));
  }, [roomsQuery.data?.rooms]);

  return (
    <Card
      title="Bookings by Room Type"
      subtitle="Distribution of usage across categories"
      headerAction={
        <div className="flex gap-4">
          <div className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-primary"></span>
            <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
              Booked
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-gray-200"></span>
            <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
              Available
            </span>
          </div>
        </div>
      }
    >
      <div className="h-48 w-full mt-4">
        {roomsQuery.isLoading ? (
          <div className="h-full flex items-center justify-center text-sm text-slate-500">
            Loading distribution...
          </div>
        ) : data.length === 0 ? (
          <div className="h-full flex items-center justify-center text-sm text-slate-500">
            No room data available.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} barGap={8}>
              <XAxis
                dataKey="roomType"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: '#9CA3AF' }}
                dy={5}
              />
              <YAxis hide />
              <Tooltip
                cursor={{ fill: 'transparent' }}
                contentStyle={{
                  borderRadius: '8px',
                  border: 'none',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                }}
              />
              <Bar
                dataKey="booked"
                fill="#6764f2"
                radius={[4, 4, 0, 0]}
                barSize={32}
              />
              <Bar
                dataKey="available"
                fill="#e5e7eb"
                radius={[4, 4, 0, 0]}
                barSize={32}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </Card>
  );
};
