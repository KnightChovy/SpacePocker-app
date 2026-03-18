import { Stack } from 'expo-router';

export default function ModalsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        presentation: 'modal',
        animation: 'slide_from_bottom',
      }}
    >
      <Stack.Screen name="room-detail" />
      <Stack.Screen name="booking" />
      <Stack.Screen name="booking-success" />
      <Stack.Screen name="booking-failed" />
    </Stack>
  );
}
