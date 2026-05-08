import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { ArrowLeft01Icon, ArrowRight01Icon } from '@hugeicons/core-free-icons';
import { AppIcon } from '../../src/components/ui/AppIcon';
import { CHRONIC_DISEASES, TREATMENT_ICON } from '../../src/data/chronicDiseasesData';
import { colors } from '../../src/theme/colors';
import { AnimatedEntry } from '../../src/components/ui/AnimatedEntry';
import { ScreenBackground } from '../../src/components/ui/ScreenBackground';

// ── Sub-components ────────────────────────────────────────────────────────────

function SectionTitle({ label }: { label: string }) {
  return <Text style={styles.sectionTitle}>{label}</Text>;
}

function BulletRow({ text, last }: { text: string; last: boolean }) {
  return (
    <>
      <View style={styles.bulletRow}>
        <View style={styles.bullet} />
        <Text style={styles.bulletText}>{text}</Text>
      </View>
      {!last && <View style={styles.divider} />}
    </>
  );
}

// ── Screen ────────────────────────────────────────────────────────────────────

export default function AnimalChronicDiseaseDetailScreen() {
  const { name } = useLocalSearchParams<{ name?: string }>();

  const disease = CHRONIC_DISEASES.find(d => d.name === name);

  if (!disease) return null;

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
      <ScreenBackground />

      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <HugeiconsIcon icon={ArrowLeft01Icon} size={28} color={colors.neutral[900]} strokeWidth={1.5} />
        </Pressable>
        <Text style={styles.title}>Détails d'une maladie</Text>
        <View style={{ width: 28 }} />
      </View>

      <AnimatedEntry delay={80} style={{ flex: 1 }}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Disease header */}
          <View style={styles.diseaseHeader}>
            <View style={styles.diseaseIconBox}>
              <AppIcon icon={disease.icon} size={28} color={colors.neutral[900]} strokeWidth={1.5} />
            </View>
            <View style={styles.diseaseHeaderContent}>
              <Text style={styles.diseaseName} numberOfLines={1}>{disease.name}</Text>
              <View style={styles.diseaseTag}>
                <Text style={styles.diseaseTagText}>{disease.category}</Text>
              </View>
            </View>
          </View>

          {/* Traitement en cours */}
          {disease.treatment && (
            <View style={styles.section}>
              <SectionTitle label="Traitement en cours" />
              <View style={styles.treatmentCard}>
                {/* Medication row */}
                <Pressable style={styles.treatmentRow}>
                  <View style={styles.treatmentIconBox}>
                    <HugeiconsIcon icon={TREATMENT_ICON[disease.treatment.type]} size={20} color={colors.neutral[900]} strokeWidth={1.5} />
                  </View>
                  <View style={styles.treatmentContent}>
                    <Text style={styles.treatmentName}>{disease.treatment.name}</Text>
                    <Text style={styles.treatmentSince}>{disease.treatment.since}</Text>
                  </View>
                  <HugeiconsIcon icon={ArrowRight01Icon} size={24} color={colors.neutral[400]} strokeWidth={1.5} />
                </Pressable>

                <View style={styles.treatmentDivider} />

                {/* Posologie + Prise */}
                <View style={styles.treatmentInfoBlock}>
                  <View style={styles.treatmentInfoRow}>
                    <Text style={styles.treatmentInfoLabel}>Posologie</Text>
                    <Text style={styles.treatmentInfoValue}>{disease.treatment.posologie}</Text>
                  </View>
                  <View style={styles.treatmentInfoRow}>
                    <Text style={styles.treatmentInfoLabel}>Prise</Text>
                    <Text style={styles.treatmentInfoValue}>{disease.treatment.prise}</Text>
                  </View>
                </View>
              </View>
            </View>
          )}

          {/* Symptômes */}
          <View style={styles.section}>
            <SectionTitle label="Symptômes" />
            <View style={styles.bulletCard}>
              {disease.symptoms.map((symptom, i) => (
                <BulletRow key={i} text={symptom} last={i === disease.symptoms.length - 1} />
              ))}
            </View>
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

  // Disease header
  diseaseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    height: 64,
  },
  diseaseIconBox: {
    width: 52,
    height: 52,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  diseaseHeaderContent: { flex: 1, gap: 6, justifyContent: 'center' },
  diseaseName: { fontSize: 24, fontWeight: '500', color: '#181818', lineHeight: 24 * 1.2 },
  diseaseTag: {
    alignSelf: 'flex-start',
    height: 24,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: '#E5E8FA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  diseaseTagText: { fontSize: 16, fontWeight: '300', color: '#39438D' },

  // Sections
  section: { gap: 12 },
  sectionTitle: { fontSize: 16, fontWeight: '500', color: '#717171', lineHeight: 16 * 1.4 },

  // Treatment card
  treatmentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    overflow: 'hidden',
  },
  treatmentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    paddingLeft: 16,
    paddingRight: 8,
    gap: 8,
  },
  treatmentIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  treatmentContent: { flex: 1, gap: 2, justifyContent: 'center' },
  treatmentName: { fontSize: 16, fontWeight: '300', color: '#181818', lineHeight: 16 * 1.4 },
  treatmentSince: { fontSize: 12, fontWeight: '300', color: '#B2B2B2', lineHeight: 12 * 1.4 },
  treatmentDivider: { height: 1, backgroundColor: '#DCDCDC', marginHorizontal: 16 },
  treatmentInfoBlock: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  treatmentInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 24,
  },
  treatmentInfoLabel: { fontSize: 16, fontWeight: '300', color: '#717171' },
  treatmentInfoValue: { fontSize: 16, fontWeight: '300', color: '#4F4F4F' },

  // Bullet list
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
    backgroundColor: colors.primary.DEFAULT,
    flexShrink: 0,
  },
  bulletText: { flex: 1, fontSize: 16, fontWeight: '300', color: '#181818', lineHeight: 16 * 1.4 },
  divider: { height: 1, backgroundColor: '#DCDCDC', marginHorizontal: 16 },
});
