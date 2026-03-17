import CuratedSpaces from '@/components/home/CuratedSpaces';
import HeroSection from '@/components/home/HeroSection';
import HostBanner from '@/components/home/HostBanner';
import SearchCard from '@/components/home/SearchCard';
import TrustedBrands from '@/components/home/TrustedBrands';
import WhySection from '@/components/home/WhySection';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top', 'bottom']}>
      <ScrollView
        className="flex-1 bg-gray-50"
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pb-4"
      >
        <HeroSection />

        <View className="bg-gray-50">
          <SearchCard />
        </View>

        <View className="bg-white mt-4">
          <TrustedBrands />
        </View>

        <View className="bg-white mt-3">
          <WhySection />
        </View>

        <View className="bg-white mt-3">
          <CuratedSpaces />
        </View>

        <View className="bg-white mt-3">
          <HostBanner />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
