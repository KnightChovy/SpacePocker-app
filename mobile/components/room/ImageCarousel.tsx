import { useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Text,
  View,
} from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type Props = {
  images: string[];
  height?: number;
};

export default function ImageCarousel({ images, height = 300 }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
    setActiveIndex(index);
  };

  if (!images || images.length === 0) {
    return (
      <View
        className="w-full bg-gray-100 items-center justify-center"
        style={{ height }}
      >
        <Text className="text-gray-400 text-sm">No images available</Text>
      </View>
    );
  }

  return (
    <View style={{ height }}>
      <FlatList
        ref={flatListRef}
        data={images}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        keyExtractor={(_, i) => String(i)}
        renderItem={({ item }) => (
          <Image
            source={{ uri: item }}
            style={{ width: SCREEN_WIDTH, height }}
            resizeMode="cover"
          />
        )}
      />

      {images.length > 1 && (
        <View className="absolute bottom-4 left-0 right-0 flex-row justify-center items-center gap-1.5">
          {images.map((_, i) => (
            <View
              key={i}
              className="rounded-full"
              style={{
                width: i === activeIndex ? 20 : 6,
                height: 6,
                backgroundColor:
                  i === activeIndex ? '#fff' : 'rgba(255,255,255,0.5)',
              }}
            />
          ))}
        </View>
      )}

      {/* Counter badge */}
      <View className="absolute top-4 right-4 bg-black/40 rounded-full px-3 py-1">
        <Text className="text-white text-xs font-semibold">
          {activeIndex + 1} / {images.length}
        </Text>
      </View>
    </View>
  );
}
