import { Stack } from "expo-router";
import './global.css';

import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import '@/app/global.css';

export default function RootLayout() {
  return <Stack />;
}
