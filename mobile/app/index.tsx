import { useAuth } from '@/hooks/useAuth';
import { Redirect } from 'expo-router';

export default function Index() {
  const { isLoading, isLoggedIn } = useAuth();
  if (isLoading) return null;
  return <Redirect href={isLoggedIn ? '/(tabs)/home' : '/(auth)/login'} />;
}
