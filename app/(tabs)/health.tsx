import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text } from 'react-native';

export default function HealthScreen() {
  return (
    <SafeAreaView className="flex-1 bg-neutral-50">
      <View className="flex-1 items-center justify-center">
        <Text className="text-primary text-2xl font-semibold">Carnet de santé</Text>
        <Text className="text-neutral-400 mt-2 text-sm">À coder depuis Figma</Text>
      </View>
    </SafeAreaView>
  );
}
