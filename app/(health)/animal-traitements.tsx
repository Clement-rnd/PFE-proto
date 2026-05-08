import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { ArrowLeft01Icon, ArrowRight01Icon, HelpCircleIcon } from '@hugeicons/core-free-icons';
import { AppIcon } from '../../src/components/ui/AppIcon';
import { SegmentedControl } from '../../src/components/ui/SegmentedControl';
import { usePets } from '../../src/data/petStore';
import { TRAITEMENTS, type TreatmentStatus } from '../../src/data/traitementsData';
import { colors } from '../../src/theme/colors';
import { AnimatedEntry } from '../../src/components/ui/AnimatedEntry';
import { ScreenBackground } from '../../src/components/ui/ScreenBackground';

const STATUS_STYLES: Record<TreatmentStatus, { bg: string; text: string; label: string }> = {
  active:   { bg: '#E5FAF5', text: '#1D745F', label: 'En cours' },
  upcoming: { bg: '#E5E8FA', text: '#39438D', label: 'À venir' },
  finished: { bg: '#F5F5F5', text: '#4F4F4F', label: 'Terminé' },
  paused:   { bg: '#FCEEE3', text: '#EA863E', label: 'Suspendu' },
};

const ACTIVE_ORDER: TreatmentStatus[] = ['active', 'upcoming', 'paused'];
const ACTIVE_SECTION_LABELS: Partial<Record<TreatmentStatus, string>> = {
  active:   'En cours',
  upcoming: 'À venir',
  paused:   'Suspendus',
};

export default function AnimalTraitementsScreen() {
  const { index } = useLocalSearchParams<{ index?: string }>();
  const petIndex = parseInt(index ?? '0', 10);
  const pets = usePets();
  const pet = pets[petIndex];
  const [tab, setTab] = useState(0);

  if (!pet) return null;

  const petTraitements = TRAITEMENTS.filter(t => t.petIndex === petIndex);
  const activeItems = petTraitements.filter(t => t.status === 'active' || t.status === 'upcoming' || t.status === 'paused');
  const expiredItems = petTraitements.filter(t => t.status === 'finished');

  const activeGroups = ACTIVE_ORDER.map(status => ({
    status,
    items: activeItems.filter(t => t.status === status),
  })).filter(g => g.items.length > 0);

  const yearGroups: { year: number; items: typeof expiredItems }[] = [];
  for (const t of expiredItems) {
    const y = t.year ?? 0;
    const existing = yearGroups.find(g => g.year === y);
    if (existing) existing.items.push(t);
    else yearGroups.push({ year: y, items: [t] });
  }
  yearGroups.sort((a, b) => b.year - a.year);

  const segments = [
    { label: 'En cours', count: activeItems.length },
    { label: 'Expiré', count: expiredItems.length },
  ];

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
      <ScreenBackground />

      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <HugeiconsIcon icon={ArrowLeft01Icon} size={28} color={colors.neutral[900]} strokeWidth={1.5} />
        </Pressable>
        <Text style={styles.title}>Traitements de {pet.name}</Text>
        <View style={{ width: 28 }} />
      </View>

      <View style={styles.segmentWrapper}>
        <SegmentedControl options={segments} selected={tab} onChange={setTab} />
      </View>

      <AnimatedEntry delay={80} style={{ flex: 1 }}>
        {tab === 0 ? (
          activeItems.length > 0 ? (
            <ScrollView
              key="active"
              style={styles.scroll}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              {activeGroups.map(group => {
                const tag = STATUS_STYLES[group.status];
                return (
                  <View key={group.status} style={styles.group}>
                    <Text style={styles.groupLabel}>{ACTIVE_SECTION_LABELS[group.status]}</Text>
                    <View style={styles.itemList}>
                      {group.items.map(t => (
                        <Pressable
                          key={t.id}
                          style={styles.row}
                          onPress={() => router.push({
                            pathname: '/(health)/traitement-detail',
                            params: { id: t.id, petIndex: String(petIndex), fromAnimal: 'true' },
                          })}
                        >
                          <View style={styles.iconBox}>
                            <AppIcon icon={t.icon} size={20} color={colors.neutral[900]} strokeWidth={1.5} />
                          </View>
                          <View style={styles.content}>
                            <Text style={styles.name} numberOfLines={1}>{t.name} · {t.posologie}</Text>
                            <View style={styles.meta}>
                              <View style={[styles.statusTag, { backgroundColor: tag.bg }]}>
                                <Text style={[styles.statusTagText, { color: tag.text }]}>{tag.label}</Text>
                              </View>
                              {t.daysInfo && <Text style={styles.subtitle}>· {t.daysInfo}</Text>}
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
          ) : (
            <ScrollView
              key="active-empty"
              style={styles.scroll}
              contentContainerStyle={[styles.scrollContent, { flexGrow: 1 }]}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.alertBanner}>
                <HugeiconsIcon icon={HelpCircleIcon} size={16} color="#39438D" strokeWidth={1.5} />
                <View style={{ flex: 1, gap: 8 }}>
                  <Text style={styles.alertText}>
                    Seul votre vétérinaire peut renseigner les traitements de votre animal.
                  </Text>
                  <Text style={styles.alertText}>
                    Pensez à prendre RDV pour un suivi régulier.
                  </Text>
                </View>
              </View>
              <View style={styles.emptyCard}>
                <Text style={styles.emptyTitle}>Aucun traitement en cours</Text>
                <Text style={styles.emptyBody}>{pet.name} ne suit aucun traitement actuellement.</Text>
              </View>
            </ScrollView>
          )
        ) : (
          expiredItems.length > 0 ? (
            <ScrollView
              key="expired"
              style={styles.scroll}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              {yearGroups.map(group => (
                <View key={group.year} style={styles.group}>
                  <Text style={styles.groupLabel}>{group.year}</Text>
                  <View style={styles.itemList}>
                    {group.items.map(t => (
                      <Pressable
                        key={t.id}
                        style={styles.row}
                        onPress={() => router.push({
                          pathname: '/(health)/traitement-detail',
                          params: { id: t.id, petIndex: String(petIndex), fromAnimal: 'true' },
                        })}
                      >
                        <View style={styles.iconBox}>
                          <AppIcon icon={t.icon} size={20} color={colors.neutral[900]} strokeWidth={1.5} />
                        </View>
                        <View style={styles.content}>
                          <Text style={styles.name} numberOfLines={1}>{t.name} · {t.posologie}</Text>
                          {t.dateRange && <Text style={styles.subtitle}>· {t.dateRange}</Text>}
                        </View>
                        <HugeiconsIcon icon={ArrowRight01Icon} size={20} color={colors.neutral[400]} strokeWidth={1.5} />
                      </Pressable>
                    ))}
                  </View>
                </View>
              ))}
            </ScrollView>
          ) : (
            <View style={styles.expiredEmpty}>
              <Text style={styles.emptyTitle}>Aucun traitement expiré</Text>
              <Text style={styles.emptyBody}>L'historique des traitements de {pet.name} apparaîtra ici.</Text>
            </View>
          )
        )}
      </AnimatedEntry>
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
  segmentWrapper: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 },
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
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 8,
    elevation: 3,
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
  expiredEmpty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 32,
  },
  emptyTitle: { fontSize: 16, fontWeight: '500', color: '#181818', lineHeight: 16 * 1.4 },
  emptyBody: { fontSize: 16, fontWeight: '300', color: '#717171', lineHeight: 16 * 1.4, textAlign: 'center' },
});
