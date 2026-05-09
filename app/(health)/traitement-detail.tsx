import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { ArrowLeft01Icon, ArrowRight01Icon, File02Icon } from '@hugeicons/core-free-icons';
import { AppIcon } from '../../src/components/ui/AppIcon';
import { usePets } from '../../src/data/petStore';
import { TRAITEMENTS, type TreatmentStatus, type TreatmentDocument } from '../../src/data/traitementsData';
import { colors } from '../../src/theme/colors';
import { PetCard } from '../../src/components/ui/PetCard';
import { AnimatedEntry } from '../../src/components/ui/AnimatedEntry';
import { ScreenBackground } from '../../src/components/ui/ScreenBackground';

const STATUS_STYLES: Record<TreatmentStatus, { bg: string; text: string; label: string }> = {
  active:   { bg: colors.success[50],  text: colors.success.DEFAULT,  label: 'En cours' },
  upcoming: { bg: '#E5E8FA',           text: '#39438D',               label: 'À venir' },
  finished: { bg: '#F5F5F5',           text: '#4F4F4F',               label: 'Terminé' },
  paused:   { bg: colors.warning[50],  text: colors.warning.DEFAULT,  label: 'Suspendu' },
};

// ── Sub-components ────────────────────────────────────────────────────────────

function SectionTitle({ label }: { label: string }) {
  return <Text style={styles.sectionTitle}>{label}</Text>;
}

function InfoRow({ label, value, last }: { label: string; value: string; last?: boolean }) {
  return (
    <>
      <View style={styles.infoRow}>
        <Text style={styles.infoRowLabel}>{label}</Text>
        <Text style={styles.infoRowValue}>{value}</Text>
      </View>
      {!last && <View style={styles.divider} />}
    </>
  );
}

function ProgressSection({ total, elapsed }: { total: number; elapsed: number }) {
  const pct = Math.min(Math.max(elapsed / total, 0), 1);
  const remaining = total - elapsed;
  return (
    <View style={styles.progressCard}>
      <Text style={styles.progressTitle}>Progression du traitement</Text>
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${pct * 100}%` as any }]} />
      </View>
      <View style={styles.progressFooter}>
        <Text style={styles.progressLeft}>{elapsed} jours sur {total}</Text>
        <Text style={styles.progressRight}>{remaining} jour{remaining > 1 ? 's' : ''} restant{remaining > 1 ? 's' : ''}</Text>
      </View>
    </View>
  );
}

function DocumentRow({ doc, last }: { doc: TreatmentDocument; last?: boolean }) {
  return (
    <>
      <Pressable style={styles.documentRow}>
        <View style={styles.documentIconBox}>
          <HugeiconsIcon icon={File02Icon} size={20} color={colors.neutral[900]} strokeWidth={1.5} />
        </View>
        <View style={styles.documentContent}>
          <Text style={styles.documentName} numberOfLines={1}>{doc.name}</Text>
          <Text style={styles.documentMeta}>{doc.date} · {doc.size}</Text>
        </View>
      </Pressable>
      {!last && <View style={styles.divider} />}
    </>
  );
}

// ── Screen ────────────────────────────────────────────────────────────────────

export default function TraitementDetailScreen() {
  const { id, petIndex: petIndexParam, fromAnimal, fromDisease, fromMedHistory } = useLocalSearchParams<{
    id?: string; petIndex?: string; fromAnimal?: string; fromDisease?: string; fromMedHistory?: string;
  }>();
  const petIndex = parseInt(petIndexParam ?? '0', 10);
  const pets = usePets();
  const pet = pets[petIndex];

  const traitement = TRAITEMENTS.find(t => t.id === id);
  const showAnimalCard = fromAnimal !== 'true' && fromDisease !== 'true' && fromMedHistory !== 'true';
  const showDiseaseLink = fromDisease !== 'true';

  if (!traitement) return null;

  const tag = STATUS_STYLES[traitement.status];
  const hasProgress = traitement.totalDays != null && traitement.elapsedDays != null;

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
      <ScreenBackground />

      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <HugeiconsIcon icon={ArrowLeft01Icon} size={28} color={colors.neutral[900]} strokeWidth={1.5} />
        </Pressable>
        <Text style={styles.title}>Détails d'un traitement</Text>
        <View style={{ width: 28 }} />
      </View>

      <AnimatedEntry delay={80} style={{ flex: 1 }}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Hero */}
          <View style={styles.hero}>
            <View style={styles.heroIconBox}>
              <AppIcon icon={traitement.icon} size={28} color={colors.neutral[900]} strokeWidth={1.5} />
            </View>
            <View style={styles.heroContent}>
              <Text style={styles.heroName} numberOfLines={1}>{traitement.name}</Text>
              <View style={[styles.statusTag, { backgroundColor: tag.bg }]}>
                <Text style={[styles.statusTagText, { color: tag.text }]}>{tag.label}</Text>
              </View>
            </View>
          </View>

          {/* Animal concerné */}
          {showAnimalCard && pet && (
            <View style={styles.section}>
              <SectionTitle label="Animal concerné" />
              <PetCard pet={pet} index={petIndex} />
            </View>
          )}

          {/* Posologie */}
          <View style={styles.section}>
            <SectionTitle label="Posologie" />
            <View style={styles.infoCard}>
              <InfoRow label="Dosage" value={traitement.posologie} />
              <InfoRow label="Fréquence" value={traitement.prise} last={!traitement.duree} />
              {traitement.duree && (
                <InfoRow label="Durée" value={traitement.duree} last />
              )}
            </View>
          </View>

          {/* Instructions */}
          {traitement.reason && (
            <View style={styles.section}>
              <SectionTitle label="Instructions" />
              <View style={[styles.infoCard, styles.instructionsCard]}>
                <Text style={styles.instructionsText}>{traitement.reason}</Text>
              </View>
            </View>
          )}

          {/* Suivi */}
          {hasProgress && (
            <View style={styles.section}>
              <SectionTitle label="Suivi" />
              <View style={styles.infoCard}>
                <ProgressSection total={traitement.totalDays!} elapsed={traitement.elapsedDays!} />
              </View>
            </View>
          )}

          {/* Maladie associée */}
          {traitement.diseaseId && showDiseaseLink && (
            <View style={styles.section}>
              <SectionTitle label="Maladie associée" />
              <Pressable
                style={styles.diseaseRow}
                onPress={() => router.push({
                  pathname: '/(health)/animal-chronic-disease-detail',
                  params: { name: traitement.diseaseId },
                })}
              >
                <Text style={styles.diseaseName}>{traitement.diseaseId}</Text>
                <HugeiconsIcon icon={ArrowRight01Icon} size={20} color={colors.neutral[400]} strokeWidth={1.5} />
              </Pressable>
            </View>
          )}

          {/* Documents liés */}
          {traitement.documents && traitement.documents.length > 0 && (
            <View style={styles.section}>
              <SectionTitle label="Documents liés" />
              <View style={styles.infoCard}>
                {traitement.documents.map((doc, i) => (
                  <DocumentRow key={i} doc={doc} last={i === traitement.documents!.length - 1} />
                ))}
              </View>
            </View>
          )}
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

  // Hero
  hero: { flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 64 },
  heroIconBox: {
    width: 52, height: 52, borderRadius: 8,
    backgroundColor: '#F5F5F5', alignItems: 'center', justifyContent: 'center',
  },
  heroContent: { flex: 1, gap: 12, justifyContent: 'center' },
  heroName: { fontSize: 24, fontWeight: '500', color: '#181818', lineHeight: 24 * 1.2 },
  statusTag: {
    alignSelf: 'flex-start', height: 24, paddingHorizontal: 8,
    borderRadius: 8, alignItems: 'center', justifyContent: 'center',
  },
  statusTagText: { fontSize: 16, fontWeight: '300' },

  // Sections
  section: { gap: 12 },
  sectionTitle: { fontSize: 16, fontWeight: '500', color: '#717171', lineHeight: 16 * 1.4 },

  // Card
  infoCard: {
    backgroundColor: '#FFFFFF', borderRadius: 16,
    borderWidth: 1, borderColor: '#E8E8E8', overflow: 'hidden',
  },
  infoRow: { minHeight: 56, paddingHorizontal: 16, paddingVertical: 8, gap: 4, justifyContent: 'center' },
  infoRowLabel: { fontSize: 14, fontWeight: '300', color: '#B2B2B2', lineHeight: 14 * 1.4 },
  infoRowValue: { fontSize: 16, fontWeight: '300', color: '#181818', lineHeight: 16 * 1.4 },
  divider: { height: 1, backgroundColor: '#DCDCDC', marginHorizontal: 16 },

  // Instructions
  instructionsCard: { paddingHorizontal: 16, paddingVertical: 16 },
  instructionsText: { fontSize: 16, fontWeight: '300', color: '#181818', lineHeight: 16 * 1.4 },

  // Progress bar
  progressCard: { paddingHorizontal: 16, paddingVertical: 12, gap: 12 },
  progressTitle: { fontSize: 16, fontWeight: '300', color: '#181818', lineHeight: 16 * 1.4 },
  progressTrack: { height: 6, backgroundColor: '#E8E8E8', borderRadius: 99, overflow: 'hidden' },
  progressFill: { height: 6, backgroundColor: '#8E9AF6', borderRadius: 99 },
  progressFooter: { flexDirection: 'row', justifyContent: 'space-between' },
  progressLeft: { fontSize: 14, fontWeight: '300', color: '#8E9AF6' },
  progressRight: { fontSize: 14, fontWeight: '300', color: '#717171' },

  // Documents
  documentRow: {
    flexDirection: 'row', alignItems: 'center',
    height: 64, paddingLeft: 16, paddingRight: 8, gap: 8,
  },
  documentIconBox: {
    width: 32, height: 32, borderRadius: 8,
    backgroundColor: '#FAFAFA', alignItems: 'center', justifyContent: 'center',
  },
  documentContent: { flex: 1, gap: 8, justifyContent: 'center' },
  documentName: { fontSize: 16, fontWeight: '300', color: '#181818', lineHeight: 16 * 1.4 },
  documentMeta: { fontSize: 14, fontWeight: '300', color: '#B2B2B2', lineHeight: 14 * 1.2 },

  // Disease link
  diseaseRow: {
    flexDirection: 'row', alignItems: 'center',
    height: 56, paddingLeft: 16, paddingRight: 8,
    backgroundColor: '#FFFFFF', borderRadius: 16,
    borderWidth: 1, borderColor: '#E8E8E8', gap: 8,
  },
  diseaseName: { flex: 1, fontSize: 16, fontWeight: '300', color: '#181818' },
});
