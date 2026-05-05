import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: 'fade_from_bottom' }}>
      <Stack.Screen name="login" options={{ animation: 'fade' }} />
      <Stack.Screen name="verify" />
      <Stack.Screen name="create-profile" />
      <Stack.Screen name="terms" />
      <Stack.Screen name="add-pet" />
      <Stack.Screen name="my-pets" />
      <Stack.Screen name="edit-pet" />
    </Stack>
  );
}
