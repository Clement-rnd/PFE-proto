import { Tabs } from 'expo-router';
import { View, Text, Pressable, StyleSheet, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { useRef, useEffect, useState } from 'react';
import {
  Home01Icon,
  FavouriteIcon,
  MessageMultiple01Icon,
  UserIcon,
} from '@hugeicons/core-free-icons';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';

const ACTIVE = '#ff5a7d';
const INACTIVE = '#717171';
const INDICATOR_W = 24;

const TABS = [
  { name: 'home',         label: 'Accueil',   icon: Home01Icon },
  { name: 'health',       label: 'Santé',      icon: FavouriteIcon },
  { name: 'messages',     label: 'Messages',   icon: MessageMultiple01Icon },
  { name: 'appointments', label: 'Mon compte', icon: UserIcon },
];

function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const [tabWidth, setTabWidth] = useState(0);
  const indicatorX = useRef(new Animated.Value(0)).current;
  const iconScales = useRef(TABS.map(() => new Animated.Value(1))).current;
  const isFirstLayout = useRef(true);

  useEffect(() => {
    if (tabWidth === 0) return;
    const targetX = state.index * tabWidth + (tabWidth - INDICATOR_W) / 2;
    if (isFirstLayout.current) {
      indicatorX.setValue(targetX);
      isFirstLayout.current = false;
    } else {
      Animated.spring(indicatorX, {
        toValue: targetX,
        useNativeDriver: true,
        damping: 20,
        stiffness: 200,
        mass: 0.8,
      }).start();
    }
  }, [state.index, tabWidth]);

  function animateIcon(index: number) {
    Animated.sequence([
      Animated.timing(iconScales[index], {
        toValue: 1.25,
        duration: 90,
        useNativeDriver: true,
      }),
      Animated.spring(iconScales[index], {
        toValue: 1,
        useNativeDriver: true,
        damping: 8,
        stiffness: 220,
      }),
    ]).start();
  }

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <View
        style={styles.row}
        onLayout={(e) => setTabWidth(e.nativeEvent.layout.width / TABS.length)}
      >
        {tabWidth > 0 && (
          <Animated.View style={[styles.indicator, { transform: [{ translateX: indicatorX }] }]} />
        )}

        {state.routes.map((route, index) => {
          const focused = state.index === index;
          const tab = TABS.find(t => t.name === route.name);
          if (!tab) return null;
          const color = focused ? ACTIVE : INACTIVE;

          return (
            <Pressable
              key={route.key}
              style={styles.tab}
              onPress={() => {
                animateIcon(index);
                const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
                if (!focused && !event.defaultPrevented) navigation.navigate(route.name);
              }}
            >
              <Animated.View style={{ transform: [{ scale: iconScales[index] }] }}>
                <HugeiconsIcon icon={tab.icon} size={24} color={color} strokeWidth={1.5} />
              </Animated.View>
              <Text style={[styles.label, { color }]} numberOfLines={1}>{tab.label}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
      sceneContainerStyle={{ backgroundColor: 'transparent' }}
    >
      <Tabs.Screen name="home" />
      <Tabs.Screen name="health" />
      <Tabs.Screen name="messages" />
      <Tabs.Screen name="appointments" />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  container: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E8E8E8',
    backgroundColor: '#FDF7F9',
  },
  row: {
    flexDirection: 'row',
    height: 56,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  indicator: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: INDICATOR_W,
    height: 2,
    borderRadius: 99,
    backgroundColor: ACTIVE,
  },
  label: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 14,
  },
});
