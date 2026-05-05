import { useCallback } from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withTiming,
  Easing,
  cancelAnimation,
} from 'react-native-reanimated';
import { useFocusEffect } from 'expo-router';
import type { StyleProp, ViewStyle } from 'react-native';

interface Props {
  children: React.ReactNode;
  delay?: number;
  style?: StyleProp<ViewStyle>;
}

export function AnimatedEntry({ children, delay = 0, style }: Props) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);

  useFocusEffect(useCallback(() => {
    opacity.value = 0;
    translateY.value = 20;
    const easing = Easing.out(Easing.cubic);
    const startDelay = 60 + delay;
    opacity.value = withDelay(startDelay, withTiming(1, { duration: 350, easing }));
    translateY.value = withDelay(startDelay, withTiming(0, { duration: 350, easing }));

    return () => {
      cancelAnimation(opacity);
      cancelAnimation(translateY);
    };
  }, [delay]));

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return <Animated.View style={[style, animStyle]}>{children}</Animated.View>;
}
