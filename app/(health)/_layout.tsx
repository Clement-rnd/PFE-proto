import { Stack } from 'expo-router';

export default function HealthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right', animationDuration: 380, contentStyle: { backgroundColor: 'transparent' } }} />
  );
}
