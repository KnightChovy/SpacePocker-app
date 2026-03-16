// hooks/useColorScheme.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme as useNWColorScheme } from 'nativewind';
import { useEffect, useState } from 'react';
import { useColorScheme as useRNColorScheme } from 'react-native';

const KEY = 'theme_preference';

export function useColorScheme() {
  const { colorScheme, setColorScheme } = useNWColorScheme();
  const systemScheme = useRNColorScheme() ?? 'light';
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(KEY).then(v => {
      if (v === 'light' || v === 'dark') {
        // User đã chọn thủ công
        setColorScheme(v);
      } else {
        setColorScheme(systemScheme);
      }
      setLoaded(true);
    });
  }, []);

  const updateColorScheme = async (val: 'light' | 'dark' | 'system') => {
    if (val === 'system') {
      // 'system' → truyền vào scheme thực của thiết bị
      setColorScheme(systemScheme);
      await AsyncStorage.setItem(KEY, 'system');
    } else {
      setColorScheme(val);
      await AsyncStorage.setItem(KEY, val);
    }
  };

  return { colorScheme, setColorScheme: updateColorScheme, loaded };
}
