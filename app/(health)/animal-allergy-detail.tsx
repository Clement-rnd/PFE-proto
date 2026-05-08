import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { ArrowLeft01Icon } from '@hugeicons/core-free-icons';
import { usePets } from '../../src/data/petStore';
import { ALLERGIES, RISK_STYLE } from '../../src/data/allergiesData';
import { colors } from '../../src/theme/colors';
import { PetCard } from '../../src/components/ui/PetCard';
import { AnimatedEntry } from '../../src/components/ui/AnimatedEntry';
import { ScreenBackground } from '../../src/components/ui/ScreenBackground';

// ── Sub-components ────────────────────────────────────────────────────────────

function SectionTitle({ label }: { label: string }) {
  return <Text style={styles.sectionTitle}>{label}</Text>;
}

function BulletList({ items, bulletColor }: { items: string[]; bulletColor: string }) {
  return (
    <View style={styles.bulletCard}>
      {items.map((item, i) => (
        <View key={i}>
          <View style={styles.bulletRow}>
            <View style={[styles.bullet, { backgroundColor: bulletColor }]} />
            <Text style={styles.bulletText}>{item}</Text>
          </View>
          {i < items.length - 1 && <View style={styles.divider} />}
        </View>
      ))}
    </View>
  );
}

// ── Screen ────────────────────────────────────────────────────────────────────

export default function AnimalAllergyDetailScreen() {
  const { name, petIndex: petIndexParam } = useLocalSearchParams<{ name?: string; petIndex?: string }>();
  const petIndex = parseInt(petIndexParam ?? '0', 10);
  const pets = usePets();
  const pet = pets[petIndex];

  const allergy = ALLERGIES.find(a => a.name === name);

  if (!pet || !allergy) return null;

  const risk = RISK_STYLE[allergy.severity];

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
      <ScreenBackground />

      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <HugeiconsIcon icon={ArrowLeft01Icon} size={28} color={colors.neutral[900]} strokeWidth={1.5} />
        </Pressable>
        <Text style={styles.title}>Détails d'une allergie</Text>
        <View style={{ width: 28 }} />
      </View>

      <AnimatedEntry delay={80} style={{ flex: 1 }}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Allergy header */}
          <View style={styles.allergyHeader}>
            <View style={styles.allergyIconBox}>
              <HugeiconsIcon icon={allergy.icon} size={28} color={colors.neutral[900]} strokeWidth={1.5} />
            </View>
            <View style={styles.allergyHeaderContent}>
              <Text style={styles.allergyName} numberOfLines={1}>{allergy.name}</Text>
              <View style={styles.allergyMeta}>
                <View style={[styles.riskTag, { backgroundColor: risk.bg }]}>
                  <Text style={[styles.riskTagText, { color: risk.text }]}>{allergy.severity}</Text>
                </View>
                <Text style={styles.metaSep}>·</Text>
                <Text style={styles.metaCategory}>{allergy.category}</Text>
              </View>
            </View>
          </View>

          {/* Animal concerné */}
          <View style={styles.section}>
            <SectionTitle label="Animal concerné" />
            <PetCard pet={pet} index={petIndex} />
          </View>

          {/* Symptômes observés */}
          <View style={styles.section}>
            <SectionTitle label="Symptômes observés" />
            <BulletList items={allergy.symptoms} bulletColor="#8E9AF6" />
          </View>

          {/* À éviter */}
          <View style={styles.section}>
            <SectionTitle label="À éviter" />
            <BulletList items={allergy.avoidance} bulletColor="#E11D48" />
          </View>
        </ScrollView>
      </AnimatedEntry>
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
  scrollContent: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 32, gap: 24 },

  // Allergy header card
  allergyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    height: 64,
  },
  allergyIconBox: {
    width: 52,
    height: 52,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  allergyHeaderContent: { flex: 1, gap: 4, justifyContent: 'center' },
  allergyName: { fontSize: 24, fontWeight: '500', color: '#181818', lineHeight: 24 * 1.2 },
  allergyMeta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  riskTag: {
    height: 24, paddingHorizontal: 8, borderRadius: 8,
    alignItems: 'center', justifyContent: 'center',
  },
  riskTagText: { fontSize: 16, fontWeight: '300' },
  metaSep: { fontSize: 16, fontWeight: '300', color: '#B2B2B2' },
  metaCategory: { fontSize: 16, fontWeight: '300', color: '#B2B2B2' },

  // Sections
  section: { gap: 12 },
  sectionTitle: { fontSize: 16, fontWeight: '500', color: '#717171', lineHeight: 16 * 1.4 },

  // Bullet list card
  bulletCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    overflow: 'hidden',
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 56,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    flexShrink: 0,
  },
  bulletText: { flex: 1, fontSize: 16, fontWeight: '300', color: '#181818', lineHeight: 16 * 1.4 },
  divider: { height: 1, backgroundColor: '#DCDCDC', marginHorizontal: 16 },
});
