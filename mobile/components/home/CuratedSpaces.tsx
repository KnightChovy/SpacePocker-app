import { MapPin, Star } from 'lucide-react-native';
import { Image, Text, TouchableOpacity, View } from 'react-native';

type Space = {
  id: string;
  name: string;
  location: string;
  price: number;
  rating: number;
  image: string;
  tags: string[];
};

const SPACES: Space[] = [
  {
    id: '1',
    name: 'The Skyline Loft',
    location: 'Downtown Brooklyn, NY',
    price: 85,
    rating: 4.9,
    image:
      'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80',
    tags: ['FAST WIFI', 'PARKING', 'PROJECTOR'],
  },
  {
    id: '2',
    name: 'Neon Canvas Studio',
    location: 'Arts District, LA',
    price: 60,
    rating: 4.8,
    image:
      'https://images.unsplash.com/photo-1525130413817-d45c1d127c42?w=600&q=80',
    tags: ['NATURAL LIGHT', 'SPEAKERS'],
  },
];

function SpaceCard({ space }: { space: Space }) {
  return (
    <TouchableOpacity
      className="bg-white rounded-2xl overflow-hidden mb-4 shadow-sm shadow-black/5 border border-gray-100"
      activeOpacity={0.92}
    >
      {/* Image */}
      <View className="relative">
        <Image
          source={{ uri: space.image }}
          className="w-full h-48"
          resizeMode="cover"
        />
        {/* Rating badge */}
        <View className="absolute top-3 right-3 bg-white/95 rounded-xl px-2.5 py-1.5 flex-row items-center gap-1">
          <Star size={12} color="#F59E0B" fill="#F59E0B" />
          <Text className="text-xs font-bold text-gray-800">
            {space.rating}
          </Text>
        </View>
      </View>

      {/* Info */}
      <View className="p-4">
        <View className="flex-row items-start justify-between mb-1">
          <Text className="text-gray-900 font-bold text-base flex-1">
            {space.name}
          </Text>
          <View className="flex-row items-baseline gap-0.5 ml-2">
            <Text className="text-[#5B4FE9] font-extrabold text-lg">
              ${space.price}
            </Text>
            <Text className="text-gray-400 text-xs">/hr</Text>
          </View>
        </View>

        <View className="flex-row items-center gap-1 mb-3">
          <MapPin size={12} color="#9CA3AF" strokeWidth={1.8} />
          <Text className="text-gray-400 text-xs">{space.location}</Text>
        </View>

        {/* Tags */}
        <View className="flex-row flex-wrap gap-2">
          {space.tags.map(tag => (
            <View key={tag} className="bg-gray-100 rounded-lg px-2.5 py-1">
              <Text className="text-gray-500 text-[10px] font-semibold tracking-wider">
                {tag}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function CuratedSpaces() {
  return (
    <View className="px-5 py-4">
      <View className="flex-row items-center justify-between mb-4">
        <Text className="text-xl font-bold text-gray-900">Curated Spaces</Text>
        <TouchableOpacity>
          <Text className="text-[#5B4FE9] text-sm font-medium">View All</Text>
        </TouchableOpacity>
      </View>

      {SPACES.map(space => (
        <SpaceCard key={space.id} space={space} />
      ))}
    </View>
  );
}
