import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text } from 'react-native';
import { ScreenBackground } from '../../src/components/ui/ScreenBackground';

export default function HomeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-transparent">
      <ScreenBackground />
      <View className="flex-1 items-center justify-center">
        <Text className="text-primary text-2xl font-semibold">Accueil</Text>
        <Text className="text-neutral-400 mt-2 text-sm">À coder depuis Figma</Text>
      </View>
    </SafeAreaView>
  );
}
