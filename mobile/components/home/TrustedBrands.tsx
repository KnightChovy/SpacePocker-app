import { ScrollView, Text, View } from 'react-native';

const BRANDS = [
  {
    name: 'Notion',
    symbol: '◻',
    color: '#000000',
    bg: '#F7F7F5',
  },
  {
    name: 'Stripe',
    symbol: '⌇',
    color: '#635BFF',
    bg: '#F0EFFF',
  },
  {
    name: 'Figma',
    symbol: '◈',
    color: '#F24E1E',
    bg: '#FEF0EC',
  },
  {
    name: 'Linear',
    symbol: '◎',
    color: '#5E6AD2',
    bg: '#EEEFFE',
  },
  {
    name: 'Vercel',
    symbol: '▲',
    color: '#000000',
    bg: '#F4F4F4',
  },
  {
    name: 'Loom',
    symbol: '⬡',
    color: '#625DF5',
    bg: '#EEECFF',
  },
];

export default function TrustedBrands() {
  return (
    <View className="py-6">
      {/* Label */}
      <Text className="text-[10px] text-gray-400 tracking-[0.2em] text-center uppercase font-semibold mb-5 px-5">
        Trusted by Innovators at
      </Text>

      {/* Scrollable brand chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, gap: 10 }}
      >
        {BRANDS.map(brand => (
          <View
            key={brand.name}
            className="flex-row items-center gap-2 px-4 py-2.5 rounded-2xl border border-gray-100 bg-white"
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.04,
              shadowRadius: 4,
              elevation: 1,
            }}
          >
            {/* Icon badge */}
            <View
              className="w-7 h-7 rounded-lg items-center justify-center"
              style={{ backgroundColor: brand.bg }}
            >
              <Text
                style={{ color: brand.color, fontSize: 13, fontWeight: '700' }}
              >
                {brand.symbol}
              </Text>
            </View>

            {/* Brand name */}
            <Text className="text-gray-700 text-sm font-semibold tracking-tight">
              {brand.name}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
