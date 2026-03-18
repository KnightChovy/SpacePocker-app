import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useAuthStore } from '@/store/authStore';
import { SplashScreen, Stack } from 'expo-router';
import { useEffect } from 'react';
import '../global.css';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { colorScheme, loaded: themeLoaded } = useColorScheme();
  const loadFromStorage = useAuthStore(s => s.loadFromStorage);
  const authLoading = useAuthStore(s => s.isLoading);

  useEffect(() => {
    loadFromStorage();
  }, []);

  useEffect(() => {
    if (themeLoaded && !authLoading) {
      SplashScreen.hideAsync();
    }
  }, [themeLoaded, authLoading]);

  if (!themeLoaded || authLoading) return null;

  return (
    <GluestackUIProvider mode={colorScheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(modals)" />
      </Stack>
    </GluestackUIProvider>
  );
}
