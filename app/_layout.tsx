import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider, DefaultTheme } from '@react-navigation/native';
import { View, StyleSheet } from 'react-native';
import * as SystemUI from 'expo-system-ui';
import { useEffect } from 'react';
import { ScreenBackground } from '../src/components/ui/ScreenBackground';
import { initPetStore } from '../src/data/petStore';
import { initUserStore } from '../src/data/userStore';
import '../global.css';

const navigationTheme = {
  ...DefaultTheme,
  colors: { ...DefaultTheme.colors, background: '#FDF7F9' },
};

export default function RootLayout() {
  useEffect(() => {
    initPetStore();
    initUserStore();
    SystemUI.setBackgroundColorAsync('#FDF7F9');
  }, []);

  return (
    <SafeAreaProvider>
      <ThemeProvider value={navigationTheme}>
        <View style={styles.root}>
          <ScreenBackground />
          <StatusBar style="dark" backgroundColor="transparent" translucent />
          <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: 'transparent' } }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(tabs)" />
          </Stack>
        </View>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#FDF7F9',
  },
});
