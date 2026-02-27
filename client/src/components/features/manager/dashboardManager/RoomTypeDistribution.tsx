import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Card } from '@/components/common/Card';
import type { BookingDistribution } from '@/types/types';

interface RoomTypeDistributionProps {
  data: BookingDistribution[];
}

export const RoomTypeDistribution: React.FC<RoomTypeDistributionProps> = ({
  data,
}) => {
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
      </div>
    </Card>
  );
};
