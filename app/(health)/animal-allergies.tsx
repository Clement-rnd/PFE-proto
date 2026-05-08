import {
  View, Text, Pressable, ScrollView, StyleSheet, Modal,
  Animated, Easing,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { useRef, useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react-native';
import {
  ArrowLeft01Icon, ArrowRight01Icon, FilterHorizontalIcon, HelpCircleIcon,
} from '@hugeicons/core-free-icons';
import { usePets } from '../../src/data/petStore';
import {
  ALLERGIES, CATEGORY_ORDER, SEVERITY_ORDER, RISK_STYLE,
} from '../../src/data/allergiesData';
import { colors } from '../../src/theme/colors';
import { AnimatedEntry } from '../../src/components/ui/AnimatedEntry';

// ── Types ─────────────────────────────────────────────────────────────────────

type SortMode = 'categories' | 'severity';

function getGroups(sort: SortMode, filter: string | null) {
  const base = filter
    ? ALLERGIES.filter(a => (sort === 'categories' ? a.category === filter : a.severity === filter))
    : ALLERGIES;

  if (sort === 'categories') {
    return CATEGORY_ORDER
      .map(cat => ({
        key: cat,
        title: `${cat} (${base.filter(a => a.category === cat).length})`,
        items: base.filter(a => a.category === cat),
      }))
      .filter(g => g.items.length > 0);
  }
  return SEVERITY_ORDER
    .map(sev => ({
      key: sev,
      title: `${sev} (${base.filter(a => a.severity === sev).length})`,
      items: base.filter(a => a.severity === sev),
    }))
    .filter(g => g.items.length > 0);
}

// ── Sub-components ────────────────────────────────────────────────────────────

type AllergyRowProps = {
  allergy: (typeof ALLERGIES)[0];
  sortMode: SortMode;
  onPress: () => void;
};

function AllergyRow({ allergy, sortMode, onPress }: AllergyRowProps) {
  const showRisk = sortMode === 'categories';
  const risk = RISK_STYLE[allergy.severity];

  return (
    <Pressable style={styles.allergyRow} onPress={onPress}>
      <View style={styles.allergyIconBox}>
        <HugeiconsIcon icon={allergy.icon} size={20} color={colors.neutral[900]} strokeWidth={1.5} />
      </View>
      <View style={styles.allergyContent}>
        <Text style={styles.allergyName} numberOfLines={1}>{allergy.name}</Text>
        {showRisk ? (
          <View style={[styles.tag, { backgroundColor: risk.bg }]}>
            <Text style={[styles.tagText, { color: risk.text }]}>{allergy.severity}</Text>
          </View>
        ) : (
          <View style={[styles.tag, { backgroundColor: '#F5F5F5' }]}>
            <Text style={[styles.tagText, { color: '#4F4F4F' }]}>{allergy.category}</Text>
          </View>
        )}
      </View>
      <HugeiconsIcon icon={ArrowRight01Icon} size={20} color={colors.neutral[400]} strokeWidth={1.5} />
    </Pressable>
  );
}

// ── Screen ────────────────────────────────────────────────────────────────────

export default function AnimalAllergiesScreen() {
  const { index } = useLocalSearchParams<{ index?: string }>();
  const petIndex = parseInt(index ?? '0', 10);
  const pets = usePets();
  const pet = pets[petIndex];

  const [sortMode, setSortMode] = useState<SortMode>('categories');
  const [pendingSort, setPendingSort] = useState<SortMode>('categories');
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const sheetY = useRef(new Animated.Value(300)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const listOpacity = useRef(new Animated.Value(1)).current;

  if (!pet) return null;

  const hasData = petIndex === 0;
  const groups = getGroups(sortMode, activeFilter);

  // Filter chips change based on sort mode
  const filterChips: { label: string; value: string | null }[] =
    sortMode === 'categories'
      ? [
          { label: `Tout (${ALLERGIES.length})`, value: null },
          ...CATEGORY_ORDER.map(cat => ({
            label: `${cat} (${ALLERGIES.filter(a => a.category === cat).length})`,
            value: cat,
          })),
        ]
      : [
          { label: `Tout (${ALLERGIES.length})`, value: null },
          { label: `Élevé (${ALLERGIES.filter(a => a.severity === 'Risque élevé').length})`,   value: 'Risque élevé' },
          { label: `Modéré (${ALLERGIES.filter(a => a.severity === 'Risque modéré').length})`, value: 'Risque modéré' },
          { label: `Faible (${ALLERGIES.filter(a => a.severity === 'Risque faible').length})`, value: 'Risque faible' },
        ];

  // ── Bottom sheet ────────────────────────────────────────────────────────────

  function openSheet() {
    setPendingSort(sortMode);
    sheetY.setValue(300);
    backdropOpacity.setValue(0);
    setSheetOpen(true);
    Animated.parallel([
      Animated.spring(sheetY, { toValue: 0, useNativeDriver: true, damping: 22, stiffness: 260 }),
      Animated.timing(backdropOpacity, { toValue: 1, duration: 220, useNativeDriver: true }),
    ]).start();
  }

  function closeSheet(callback?: () => void) {
    Animated.parallel([
      Animated.timing(sheetY, { toValue: 300, duration: 260, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      Animated.timing(backdropOpacity, { toValue: 0, duration: 200, useNativeDriver: true }),
    ]).start(() => {
      setSheetOpen(false);
      callback?.();
    });
  }

  function animateList(fn: () => void) {
    Animated.timing(listOpacity, { toValue: 0, duration: 120, useNativeDriver: true }).start(() => {
      fn();
      Animated.timing(listOpacity, { toValue: 1, duration: 200, useNativeDriver: true }).start();
    });
  }

  function applySort(mode: SortMode) {
    closeSheet(() => {
      if (mode !== sortMode) {
        animateList(() => { setSortMode(mode); setActiveFilter(null); });
      }
    });
  }

  function selectFilter(value: string | null) {
    if (value === activeFilter) return;
    animateList(() => setActiveFilter(value));
  }

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>

      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <HugeiconsIcon icon={ArrowLeft01Icon} size={28} color={colors.neutral[900]} strokeWidth={1.5} />
        </Pressable>
        <Text style={styles.title}>Allergies de {pet.name}</Text>
        <View style={{ width: 28 }} />
      </View>

      {hasData ? (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Filter chips */}
          <AnimatedEntry delay={80}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{ marginHorizontal: -16 }}
              contentContainerStyle={[styles.chipsRow, { paddingHorizontal: 16 }]}
            >
              <Pressable style={styles.chipTri} onPress={openSheet}>
                <HugeiconsIcon icon={FilterHorizontalIcon} size={16} color="#fcfcfc" strokeWidth={1.5} />
                <Text style={styles.chipTriLabel}>Tri</Text>
              </Pressable>
              {filterChips.map(({ label, value }) => {
                const selected = activeFilter === value;
                return (
                  <Pressable
                    key={label}
                    style={[styles.chip, selected && styles.chipSelected]}
                    onPress={() => selectFilter(value)}
                  >
                    <Text style={[styles.chipLabel, selected && styles.chipLabelSelected]}>{label}</Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </AnimatedEntry>

          {/* Grouped list */}
          <AnimatedEntry delay={140}>
            <Animated.View style={{ opacity: listOpacity, gap: 24 }}>
              {groups.map(group => (
                <View key={group.key} style={styles.section}>
                  <Text style={styles.sectionTitle}>{group.title}</Text>
                  <View style={styles.allergyList}>
                    {group.items.map(a => (
                      <AllergyRow
                        key={a.name}
                        allergy={a}
                        sortMode={sortMode}
                        onPress={() => router.push({
                          pathname: '/(health)/animal-allergy-detail',
                          params: { name: a.name, petIndex: String(petIndex) },
                        })}
                      />
                    ))}
                  </View>
                </View>
              ))}
            </Animated.View>
          </AnimatedEntry>
        </ScrollView>
      ) : (
        /* Empty state */
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
                  Seul votre vétérinaire peut renseigner les allergies de votre animal.
                </Text>
                <Text style={styles.alertText}>
                  Pensez à prendre RDV pour un suivi régulier.
                </Text>
              </View>
            </View>
            <View style={styles.emptyCard}>
              <Text style={styles.emptyTitle}>Aucune allergie connue</Text>
              <Text style={styles.emptyBody}>
                {pet.name} n'a pas d'allergie diagnostiquée. Cette section sera mise à jour par votre vétérinaire.
              </Text>
            </View>
          </ScrollView>
        </AnimatedEntry>
      )}

      {/* Sort bottom sheet */}
      <Modal visible={sheetOpen} transparent animationType="none" onRequestClose={() => closeSheet()}>
        <Animated.View style={[styles.sortBackdrop, { opacity: backdropOpacity }]}>
          <Pressable style={StyleSheet.absoluteFill} onPress={() => closeSheet()} />
          <Animated.View style={[styles.sortSheet, { transform: [{ translateY: sheetY }] }]}>
            <View style={styles.grabHandleWrap}>
              <View style={styles.grabHandle} />
            </View>
            <View style={styles.sheetContent}>
              <Text style={styles.sheetTitle}>Trier par</Text>
              <View style={styles.sortOptions}>
                {([
                  { mode: 'categories' as SortMode, label: 'Catégorie' },
                  { mode: 'severity'   as SortMode, label: 'Gravité'   },
                ]).map(({ mode, label }) => {
                  const active = pendingSort === mode;
                  return (
                    <Pressable
                      key={mode}
                      style={[styles.sortOption, active && styles.sortOptionActive]}
                      onPress={() => { setPendingSort(mode); applySort(mode); }}
                    >
                      <View style={[styles.radio, active && styles.radioActive]}>
                        {active && <View style={styles.radioInner} />}
                      </View>
                      <Text style={styles.sortOptionLabel}>{label}</Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          </Animated.View>
        </Animated.View>
      </Modal>
    </SafeAreaView>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

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
  scrollContent: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 32, gap: 16 },

  // Chips
  chipsRow: { gap: 8 },
  chipTri: {
    flexDirection: 'row', alignItems: 'center',
    height: 32, paddingHorizontal: 8, gap: 4, borderRadius: 8,
    backgroundColor: '#181818',
  },
  chipTriLabel: { fontSize: 16, fontWeight: '300', color: '#fcfcfc' },
  chip: {
    flexDirection: 'row', alignItems: 'center',
    height: 32, paddingHorizontal: 8, gap: 4, borderRadius: 8,
    backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E8E8E8',
  },
  chipSelected: { backgroundColor: colors.primary.DEFAULT, borderColor: 'transparent' },
  chipLabel: { fontSize: 12, fontWeight: '300', color: '#4F4F4F' },
  chipLabelSelected: { color: '#fcfcfc' },

  // Section & list
  section: { gap: 12 },
  sectionTitle: { fontSize: 16, fontWeight: '500', color: '#717171', lineHeight: 16 * 1.4 },
  allergyList: { gap: 8 },
  allergyRow: {
    flexDirection: 'row', alignItems: 'center',
    height: 64, paddingLeft: 16, paddingRight: 8, gap: 8,
    backgroundColor: '#FFFFFF', borderRadius: 8, borderWidth: 1, borderColor: '#E8E8E8',
  },
  allergyIconBox: {
    width: 28, height: 28, borderRadius: 8,
    backgroundColor: '#F5F5F5', alignItems: 'center', justifyContent: 'center',
  },
  allergyContent: { flex: 1, gap: 8, justifyContent: 'center' },
  allergyName: { fontSize: 16, fontWeight: '300', color: '#181818' },
  tag: { alignSelf: 'flex-start', height: 24, paddingHorizontal: 8, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  tagText: { fontSize: 12, fontWeight: '300' },

  // Empty state
  alertBanner: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 8,
    backgroundColor: '#E5E8FA', borderWidth: 1, borderColor: '#8E9AF6',
    borderRadius: 8, paddingHorizontal: 8, paddingVertical: 13,
  },
  alertText: { fontSize: 16, fontWeight: '300', color: '#39438D', lineHeight: 16 * 1.2 },
  emptyCard: {
    flex: 1, backgroundColor: '#FFFFFF', borderRadius: 16,
    borderWidth: 1, borderColor: '#E8E8E8',
    paddingHorizontal: 16, paddingVertical: 24, gap: 16,
    alignItems: 'center', justifyContent: 'center',
  },
  emptyTitle: { fontSize: 16, fontWeight: '500', color: '#181818', lineHeight: 16 * 1.4 },
  emptyBody: { fontSize: 16, fontWeight: '300', color: '#717171', lineHeight: 16 * 1.4, textAlign: 'center' },

  // Sort bottom sheet
  sortBackdrop: { flex: 1, backgroundColor: 'rgba(9,10,10,0.5)', justifyContent: 'flex-end' },
  sortSheet: {
    backgroundColor: '#FFFFFF', borderTopLeftRadius: 24, borderTopRightRadius: 24,
    shadowColor: '#000', shadowOffset: { width: 0, height: -2 }, shadowOpacity: 0.1, shadowRadius: 8,
    elevation: 8, paddingBottom: 34,
  },
  grabHandleWrap: { paddingVertical: 16, alignItems: 'center' },
  grabHandle: { width: 48, height: 5, backgroundColor: '#DCDCDC', borderRadius: 100 },
  sheetContent: { paddingHorizontal: 16, gap: 16 },
  sheetTitle: { fontSize: 24, fontWeight: '700', color: '#181818', lineHeight: 32 },
  sortOptions: { gap: 8 },
  sortOption: {
    flexDirection: 'row', alignItems: 'center',
    height: 56, paddingHorizontal: 16, gap: 8, borderRadius: 8,
  },
  sortOptionActive: { backgroundColor: '#fcf7f9' },
  sortOptionLabel: { fontSize: 16, fontWeight: '300', color: '#181818', lineHeight: 16 * 1.4 },
  radio: { width: 24, height: 24, borderRadius: 12, borderWidth: 1, borderColor: '#E8E8E8', alignItems: 'center', justifyContent: 'center' },
  radioActive: { borderColor: '#ff5a7d' },
  radioInner: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#ff5a7d' },
});
