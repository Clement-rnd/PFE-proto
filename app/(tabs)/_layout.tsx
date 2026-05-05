import { Tabs } from 'expo-router';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HugeiconsIcon } from '@hugeicons/react-native';
import {
  Home01Icon,
  FavouriteIcon,
  MessageMultiple01Icon,
  UserIcon,
} from '@hugeicons/core-free-icons';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';

const ACTIVE = '#ff5a7d';
const INACTIVE = '#717171';

const TABS = [
  { name: 'home',         label: 'Accueil',   icon: Home01Icon },
  { name: 'health',       label: 'Santé',      icon: FavouriteIcon },
  { name: 'messages',     label: 'Messages',   icon: MessageMultiple01Icon },
  { name: 'appointments', label: 'Mon compte', icon: UserIcon },
];

function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <View style={styles.row}>
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
                const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
                if (!focused && !event.defaultPrevented) navigation.navigate(route.name);
              }}
            >
              {focused && <View style={styles.indicator} />}
              <HugeiconsIcon icon={tab.icon} size={24} color={color} strokeWidth={1.5} />
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
    width: 24,
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
