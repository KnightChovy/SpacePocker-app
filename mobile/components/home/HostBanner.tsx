import { LinearGradient } from 'expo-linear-gradient';
import { Text, TouchableOpacity, View } from 'react-native';

export default function HostBanner() {
  return (
    <View className="px-5 pb-8">
      <LinearGradient
        colors={['#3B2F8F', '#5B4FE9', '#7C6FF7']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="rounded-3xl p-6 overflow-hidden"
      >
        <View className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/10" />
        <View className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full bg-white/5" />

        <Text className="text-white text-2xl font-extrabold text-center mb-2">
          Host Your Own Space
        </Text>
        <Text className="text-white/70 text-sm text-center leading-relaxed mb-6">
          Earn up to $2,500/month by renting out your office, studio, or rooftop
          during off-hours.
        </Text>

        <TouchableOpacity
          className="bg-white rounded-2xl py-3.5 items-center mb-3"
          activeOpacity={0.88}
        >
          <Text className="text-[#5B4FE9] font-bold text-base">
            Start Listing
          </Text>
        </TouchableOpacity>

        <TouchableOpacity className="py-2 items-center" activeOpacity={0.7}>
          <Text className="text-white/80 text-sm font-medium">
            How it works
          </Text>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
}
