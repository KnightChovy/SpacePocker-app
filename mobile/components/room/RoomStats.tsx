import { RoomDetail } from '@/types/room.type';
import { DollarSign, Maximize2, ShieldCheck, Users } from 'lucide-react-native';
import { Text, View } from 'react-native';

type Props = { room: RoomDetail };

type StatItem = {
  icon: React.ElementType;
  label: string;
  value: string;
  iconColor: string;
  iconBg: string;
};

export default function RoomStats({ room }: Props) {
  const stats: StatItem[] = [
    {
      icon: Users,
      label: 'Capacity',
      value: `${room.capacity} pax`,
      iconColor: '#5B4FE9',
      iconBg: '#EEF0FF',
    },
    {
      icon: Maximize2,
      label: 'Area',
      value: `${room.area} m²`,
      iconColor: '#0891B2',
      iconBg: '#ECFEFF',
    },
    {
      icon: DollarSign,
      label: 'Giá/giờ',
      value: `${room.pricePerHour.toLocaleString('vi-VN')}đ`,
      iconColor: '#059669',
      iconBg: '#D1FAE5',
    },
    {
      icon: ShieldCheck,
      label: 'Đặt cọc',
      value: `${room.securityDeposit.toLocaleString('vi-VN')}đ`,
      iconColor: '#D97706',
      iconBg: '#FEF3C7',
    },
  ];

  return (
    <View className="mx-5 mb-5">
      <View className="flex-row gap-3">
        {stats.map(s => {
          const Icon = s.icon;
          return (
            <View
              key={s.label}
              className="flex-1 bg-white rounded-2xl p-3.5 items-center border border-gray-100"
              style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.05,
                shadowRadius: 4,
                elevation: 2,
              }}
            >
              <View
                className="w-9 h-9 rounded-xl items-center justify-center mb-2"
                style={{ backgroundColor: s.iconBg }}
              >
                <Icon size={16} color={s.iconColor} strokeWidth={1.8} />
              </View>
              <Text className="text-sm font-extrabold text-gray-900">
                {s.value}
              </Text>
              <Text className="text-[10px] text-gray-400 mt-0.5 font-medium">
                {s.label}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}
