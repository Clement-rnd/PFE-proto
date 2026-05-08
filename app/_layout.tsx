import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, StyleSheet } from 'react-native';
import { ScreenBackground } from '../src/components/ui/ScreenBackground';
import '../global.css';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <View style={styles.root}>
        <ScreenBackground />
        <StatusBar style="dark" backgroundColor="transparent" translucent />
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: 'transparent' } }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" />
        </Stack>
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#FDF7F9',
  },
});
