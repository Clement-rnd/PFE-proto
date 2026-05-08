import { View, Text, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { HugeiconsIcon } from '@hugeicons/react-native';
import {
  CalendarFavorite01Icon,
  Folder01Icon,
  MedicalFileIcon,
  Medicine02Icon,
  ArrowRight01Icon,
} from '@hugeicons/core-free-icons';
import { AnimatedEntry } from '../../src/components/ui/AnimatedEntry';
import { colors } from '../../src/theme/colors';
import { ScreenBackground } from '../../src/components/ui/ScreenBackground';

const MENU_ITEMS = [
  {
    key: 'consultations',
    label: 'Consultations',
    icon: CalendarFavorite01Icon,
    subtitle: null,
    route: '/(health)/consultations',
  },
  {
    key: 'my-animals',
    label: 'Mes animaux',
    icon: Folder01Icon,
    subtitle: null,
    route: '/(health)/my-animals',
  },
  {
    key: 'prescriptions',
    label: 'Ordonnances',
    icon: MedicalFileIcon,
    subtitle: 'Aucune ordonnance en cours',
    route: '/(health)/prescriptions',
  },
  {
    key: 'treatments',
    label: 'Traitements',
    icon: Medicine02Icon,
    subtitle: 'Aucun traitement en cours',
    route: '/(health)/traitements',
  },
];

export default function HealthScreen() {
  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
      <ScreenBackground />
      <View style={styles.body}>

        <AnimatedEntry delay={0}>
          <View style={styles.header}>
            <View style={styles.titleRow}>
              <Text style={styles.title}>Santé</Text>
            </View>
            <Text style={styles.subtitle}>
              Retrouvez toutes les informations médicales de vos animaux.
            </Text>
          </View>
        </AnimatedEntry>

        <AnimatedEntry delay={100}>
          <View style={styles.list}>
            {MENU_ITEMS.map((item) => (
              <Pressable
                key={item.key}
                style={styles.row}
                onPress={() => { if (item.route) router.push(item.route as any); }}
              >
                <View style={styles.rowIconSlot}>
                  <HugeiconsIcon icon={item.icon} size={24} color={colors.neutral[900]} strokeWidth={1.5} />
                </View>
                <View style={styles.rowContent}>
                  <Text style={styles.rowLabel}>{item.label}</Text>
                  {item.subtitle && (
                    <Text style={styles.rowSubtitle}>{item.subtitle}</Text>
                  )}
                </View>
                <HugeiconsIcon icon={ArrowRight01Icon} size={24} color={colors.neutral[400]} strokeWidth={1.5} />
              </Pressable>
            ))}
          </View>
        </AnimatedEntry>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: 'transparent' },
  body: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 24,
  },
  header: { gap: 4 },
  titleRow: { height: 44, justifyContent: 'center' },
  title: {
    fontSize: 24,
    fontWeight: '500',
    color: colors.neutral[900],
    lineHeight: 24 * 1.2,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '300',
    color: '#4F4F4F',
    lineHeight: 16 * 1.4,
  },
  list: { gap: 4 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    gap: 8,
  },
  rowIconSlot: { width: 24, alignItems: 'center' },
  rowContent: { flex: 1 },
  rowLabel: {
    fontSize: 16,
    fontWeight: '300',
    color: colors.neutral[900],
    lineHeight: 16 * 1.4,
  },
  rowSubtitle: {
    fontSize: 12,
    fontWeight: '300',
    color: '#B2B2B2',
    lineHeight: 12 * 1.4,
  },
});
