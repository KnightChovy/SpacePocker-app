import * as SecureStore from 'expo-secure-store';
import { useEffect, useState } from 'react';
const TOKEN_KEY = 'access_token';
export function useAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    checkAuthState();
  }, []);
  async function checkAuthState() {
    try {
      const token = await SecureStore.getItemAsync(TOKEN_KEY);
      setIsLoggedIn(!!token);
    } catch {
      setIsLoggedIn(false);
    } finally {
      setIsLoading(false);
    }
  }
  async function login(token: string) {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
    setIsLoggedIn(true);
  }
  async function logout() {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    setIsLoggedIn(false);
  }
  return { isLoggedIn, isLoading, login, logout };
}
