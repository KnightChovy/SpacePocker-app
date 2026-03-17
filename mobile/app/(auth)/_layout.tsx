import { useAuthStore } from '@/store/authStore';
import { Redirect, Stack } from 'expo-router';

export default function AuthLayout() {
  const isLoggedIn = useAuthStore(s => s.isLoggedIn);

  if (isLoggedIn) return <Redirect href="/(tabs)/home/>" />;
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
    </Stack>
  );
}
