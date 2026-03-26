import { RoomDetail } from '@/types/room.type';
import {
  Car,
  Coffee,
  Monitor,
  Package,
  Sparkles,
  Speaker,
  Utensils,
  Wifi,
  Wind,
} from 'lucide-react-native';
import { Text, View } from 'react-native';

type Props = { room: RoomDetail };

function getAmenityIcon(name: string) {
  const lower = name.toLowerCase();
  if (lower.includes('wifi') || lower.includes('internet')) return Wifi;
  if (
    lower.includes('projector') ||
    lower.includes('screen') ||
    lower.includes('monitor')
  )
    return Monitor;
  if (lower.includes('coffee') || lower.includes('tea')) return Coffee;
  if (lower.includes('air') || lower.includes('ac')) return Wind;
  if (lower.includes('parking')) return Car;
  if (lower.includes('speaker') || lower.includes('audio')) return Speaker;
  return Package;
}

function getCategoryIcon(name: string) {
  const lower = name.toLowerCase();
  if (lower.includes('food') || lower.includes('beverage')) return Utensils;
  if (lower.includes('clean')) return Sparkles;
  return Package;
}

export default function RoomFeatures({ room }: Props) {
  const amenities = room.amenities ?? [];
  const categories = room.serviceCategories ?? [];

  return (
    <View className="px-5 mb-5">
      {/* Amenities */}
      {amenities.length > 0 && (
        <View className="mb-5">
          <Text className="text-base font-bold text-gray-900 mb-3">
            Amenities
          </Text>
          <View className="flex-row flex-wrap gap-2">
            {amenities.map(({ amenity }) => {
              const Icon = getAmenityIcon(amenity.name);
              return (
                <View
                  key={amenity.id}
                  className="flex-row items-center gap-2 bg-white border border-gray-100 rounded-xl px-3 py-2.5"
                  style={{
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.04,
                    shadowRadius: 3,
                    elevation: 1,
                  }}
                >
                  <View className="w-6 h-6 rounded-lg bg-[#EEF0FF] items-center justify-center">
                    <Icon size={13} color="#5B4FE9" strokeWidth={1.8} />
                  </View>
                  <Text className="text-sm text-gray-700 font-medium">
                    {amenity.name}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>
      )}

      {/* Service Categories */}
      {categories.length > 0 && (
        <View>
          <Text className="text-base font-bold text-gray-900 mb-3">
            Available Services
          </Text>
          {categories.map(({ category }) => {
            const Icon = getCategoryIcon(category.name);
            return (
              <View key={category.id} className="mb-4">
                {/* Category header */}
                <View className="flex-row items-center gap-2 mb-2">
                  <View className="w-7 h-7 rounded-lg bg-amber-50 items-center justify-center">
                    <Icon size={14} color="#D97706" strokeWidth={1.8} />
                  </View>
                  <Text className="text-sm font-bold text-gray-700">
                    {category.name}
                  </Text>
                </View>
                {/* Services list */}
                <View className="flex-row flex-wrap gap-2">
                  {category.services.map(service => (
                    <View
                      key={service.id}
                      className="bg-white border border-gray-100 rounded-xl px-3 py-2"
                      style={{
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 1 },
                        shadowOpacity: 0.04,
                        shadowRadius: 3,
                        elevation: 1,
                      }}
                    >
                      <Text className="text-xs font-semibold text-gray-700">
                        {service.name}
                      </Text>
                      <Text className="text-[10px] text-[#5B4FE9] font-medium mt-0.5">
                        {service.price.toLocaleString('vi-VN')}đ
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
}
