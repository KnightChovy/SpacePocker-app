import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import { useColorScheme } from '@/hooks/useColorScheme';
import { SplashScreen, Stack } from 'expo-router';
import { useEffect } from 'react';
import '../global.css';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { colorScheme, loaded } = useColorScheme();

  useEffect(() => {
    if (loaded) SplashScreen.hideAsync();
  }, [loaded]);

  if (!loaded) return null;

  return (
    <GluestackUIProvider mode={colorScheme}>
      <Stack screenOptions={{ headerShown: false }} />
    </GluestackUIProvider>
  );
}
