import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="guide/[id]" options={{ title: '攻略详情' }} />
      <Stack.Screen name="trip/[id]" options={{ title: '行程详情' }} />
    </Stack>
  );
}
