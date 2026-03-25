import { Clock, ShieldCheck, Star, Zap } from 'lucide-react-native';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

const FEATURES = [
  {
    icon: Zap,
    iconColor: '#F59E0B',
    iconBg: '#FEF3C7',
    title: 'Instant Booking',
    desc: 'Book in seconds with real-time availability and zero hidden fees.',
  },
  {
    icon: ShieldCheck,
    iconColor: '#10B981',
    iconBg: '#D1FAE5',
    title: 'Verified Spaces',
    desc: 'Every space is inspected and verified for quality standards.',
  },
  {
    icon: Clock,
    iconColor: '#6B52D9',
    iconBg: '#EDE9FE',
    title: 'Flexible Hours',
    desc: 'Book by the hour, day, or month. Cancel anytime.',
  },
  {
    icon: Star,
    iconColor: '#EF4444',
    iconBg: '#FEE2E2',
    title: 'Top Rated',
    desc: 'Only the highest rated spaces make it to our platform.',
  },
];

export default function WhySection() {
  return (
    <View className="px-5 py-4">
      <View className="flex-row items-center justify-between mb-5">
        <Text className="text-xl font-bold text-gray-900">
          Why SPACEPOCKER?
        </Text>
        <TouchableOpacity>
          <Text className="text-[#5B4FE9] text-sm font-medium">Learn more</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="gap-3 pr-5"
      >
        {FEATURES.map(item => {
          const Icon = item.icon;
          return (
            <View
              key={item.title}
              className="bg-white border border-gray-100 rounded-2xl p-4 w-44 shadow-sm shadow-black/5"
            >
              <View
                className="w-10 h-10 rounded-xl items-center justify-center mb-3"
                style={{ backgroundColor: item.iconBg }}
              >
                <Icon size={20} color={item.iconColor} strokeWidth={2} />
              </View>
              <Text className="font-bold text-gray-900 text-sm mb-1">
                {item.title}
              </Text>
              <Text className="text-gray-400 text-xs leading-relaxed">
                {item.desc}
              </Text>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}
