import { useAuthStore } from '@/store/authStore';
export function useAuth() {
  const isLoggedIn = useAuthStore(state => state.isLoggedIn);
  const isLoading = useAuthStore(state => state.isLoading);
  const login = useAuthStore(state => state.login);
  const logout = useAuthStore(state => state.logout);

  return { isLoggedIn, isLoading, login, logout };
}
