import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { ArrowLeft01Icon, ArrowRight01Icon, HelpCircleIcon, InjectionIcon } from '@hugeicons/core-free-icons';
import { usePets } from '../../src/data/petStore';
import { VACCINS, type VaccineStatus } from '../../src/data/vaccinsData';
import { colors } from '../../src/theme/colors';
import { AnimatedEntry } from '../../src/components/ui/AnimatedEntry';
import { ScreenBackground } from '../../src/components/ui/ScreenBackground';

const STATUS_STYLES: Record<VaccineStatus, { bg: string; text: string; label: string }> = {
  upToDate: { bg: colors.success[50],  text: colors.success.DEFAULT,  label: 'À jour' },
  toDo:     { bg: colors.warning[50],  text: colors.warning.DEFAULT,  label: 'À faire' },
  late:     { bg: colors.danger[50],   text: colors.danger.DEFAULT,   label: 'En retard' },
};

const STATUS_ORDER: VaccineStatus[] = ['late', 'toDo', 'upToDate'];

const SECTION_LABELS: Record<VaccineStatus, string> = {
  late:     'En retard',
  toDo:     'À faire',
  upToDate: 'À jour',
};

export default function AnimalVaccinsScreen() {
  const { index } = useLocalSearchParams<{ index?: string }>();
  const petIndex = parseInt(index ?? '0', 10);
  const pets = usePets();
  const pet = pets[petIndex];

  if (!pet) return null;

  const petVaccins = VACCINS.filter(v => v.petIndex === petIndex);
  const hasData = petVaccins.length > 0;

  const groups = STATUS_ORDER.map(status => ({
    status,
    items: petVaccins.filter(v => v.status === status),
  })).filter(g => g.items.length > 0);

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
      <ScreenBackground />

      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <HugeiconsIcon icon={ArrowLeft01Icon} size={28} color={colors.neutral[900]} strokeWidth={1.5} />
        </Pressable>
        <Text style={styles.title}>Vaccins de {pet.name}</Text>
        <View style={{ width: 28 }} />
      </View>

      {hasData ? (
        <AnimatedEntry delay={80} style={{ flex: 1 }}>
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {groups.map(group => {
              const tag = STATUS_STYLES[group.status];
              return (
                <View key={group.status} style={styles.group}>
                  <Text style={styles.groupLabel}>{SECTION_LABELS[group.status]}</Text>
                  <View style={styles.itemList}>
                    {group.items.map(v => (
                      <Pressable
                        key={v.id}
                        style={styles.row}
                        onPress={() => router.push({
                          pathname: '/(health)/vaccin-detail',
                          params: { id: v.id, petIndex: String(petIndex), fromAnimal: 'true' },
                        })}
                      >
                        <View style={styles.iconBox}>
                          <HugeiconsIcon icon={InjectionIcon} size={20} color={colors.neutral[900]} strokeWidth={1.5} />
                        </View>
                        <View style={styles.content}>
                          <Text style={styles.name} numberOfLines={1}>{v.name}</Text>
                          <View style={styles.meta}>
                            <View style={[styles.statusTag, { backgroundColor: tag.bg }]}>
                              <Text style={[styles.statusTagText, { color: tag.text }]}>{tag.label}</Text>
                            </View>
                            <Text style={styles.subtitle}>· Prochain rappel : {v.nextInjection}</Text>
                          </View>
                        </View>
                        <HugeiconsIcon icon={ArrowRight01Icon} size={20} color={colors.neutral[400]} strokeWidth={1.5} />
                      </Pressable>
                    ))}
                  </View>
                </View>
              );
            })}
          </ScrollView>
        </AnimatedEntry>
      ) : (
        <AnimatedEntry delay={80} style={{ flex: 1 }}>
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={[styles.scrollContent, { flexGrow: 1 }]}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.alertBanner}>
              <HugeiconsIcon icon={HelpCircleIcon} size={16} color="#39438D" strokeWidth={1.5} />
              <View style={{ flex: 1, gap: 8 }}>
                <Text style={styles.alertText}>
                  Seul votre vétérinaire peut renseigner les vaccins de votre animal.
                </Text>
                <Text style={styles.alertText}>
                  Pensez à prendre RDV pour un suivi régulier.
                </Text>
              </View>
            </View>
            <View style={styles.emptyCard}>
              <Text style={styles.emptyTitle}>Aucun vaccin</Text>
              <Text style={styles.emptyBody}>
                Votre vétérinaire n'a pas encore complété le carnet vaccinal de {pet.name}.
              </Text>
            </View>
          </ScrollView>
        </AnimatedEntry>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: 'transparent' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
    height: 44,
    gap: 8,
  },
  title: { flex: 1, fontSize: 20, fontWeight: '500', color: '#181818' },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 32, gap: 24 },

  group: { gap: 12 },
  groupLabel: { fontSize: 16, fontWeight: '500', color: '#717171', lineHeight: 16 * 1.4 },
  itemList: { gap: 8 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 64,
    paddingLeft: 16,
    paddingRight: 8,
    gap: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: { flex: 1, gap: 8, justifyContent: 'center' },
  name: { fontSize: 16, fontWeight: '300', color: '#181818', lineHeight: 16 * 1.4 },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  statusTag: {
    height: 20,
    paddingHorizontal: 6,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusTagText: { fontSize: 12, fontWeight: '300', lineHeight: 12 * 1.4 },
  subtitle: { fontSize: 12, fontWeight: '300', color: '#B2B2B2', lineHeight: 12 * 1.4 },

  alertBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: '#E5E8FA',
    borderWidth: 1,
    borderColor: '#8E9AF6',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 13,
  },
  alertText: { flex: 1, fontSize: 16, fontWeight: '300', color: '#39438D', lineHeight: 16 * 1.2 },

  emptyCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    paddingHorizontal: 16,
    paddingVertical: 24,
    gap: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: { fontSize: 16, fontWeight: '500', color: '#181818', lineHeight: 16 * 1.4 },
  emptyBody: { fontSize: 16, fontWeight: '300', color: '#717171', lineHeight: 16 * 1.4, textAlign: 'center' },
});
