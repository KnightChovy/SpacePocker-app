import { useAuthStore } from '@/store/authStore';

export function useAuth() {
  return useAuthStore(state => ({
    user: state.user,
    isLoggedIn: state.isLoggedIn,
    isLoading: state.isLoading,
    error: state.error,
    login: state.login,
    logout: state.logout,
    clearError: state.clearError,
  }));
}
