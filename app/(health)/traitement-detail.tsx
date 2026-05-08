import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { ArrowLeft01Icon, ArrowRight01Icon } from '@hugeicons/core-free-icons';
import { AppIcon } from '../../src/components/ui/AppIcon';
import { usePets } from '../../src/data/petStore';
import { TRAITEMENTS, type TreatmentStatus } from '../../src/data/traitementsData';
import { colors } from '../../src/theme/colors';
import { PetCard } from '../../src/components/ui/PetCard';
import { AnimatedEntry } from '../../src/components/ui/AnimatedEntry';
import { ScreenBackground } from '../../src/components/ui/ScreenBackground';

const STATUS_STYLES: Record<TreatmentStatus, { bg: string; text: string; label: string }> = {
  active:   { bg: '#EDFAF2', text: '#52A76A', label: 'En cours' },
  finished: { bg: '#F5F5F5', text: '#4F4F4F', label: 'Terminé' },
  paused:   { bg: '#FFF8EC', text: '#F5A623', label: 'Suspendu' },
};

function SectionTitle({ label }: { label: string }) {
  return <Text style={styles.sectionTitle}>{label}</Text>;
}

function InfoRow({ label, value, last }: { label: string; value: string; last?: boolean }) {
  return (
    <>
      <View style={styles.infoRow}>
        <ScreenBackground />
        <Text style={styles.infoRowLabel}>{label}</Text>
        <Text style={styles.infoRowValue}>{value}</Text>
      </View>
      {!last && <View style={styles.divider} />}
    </>
  );
}

export default function TraitementDetailScreen() {
  const { id, petIndex: petIndexParam, fromAnimal } = useLocalSearchParams<{
    id?: string; petIndex?: string; fromAnimal?: string;
  }>();
  const petIndex = parseInt(petIndexParam ?? '0', 10);
  const pets = usePets();
  const pet = pets[petIndex];

  const traitement = TRAITEMENTS.find(t => t.id === id);
  const showAnimalCard = fromAnimal !== 'true';

  if (!traitement) return null;

  const tag = STATUS_STYLES[traitement.status];

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>

      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <HugeiconsIcon icon={ArrowLeft01Icon} size={28} color={colors.neutral[900]} strokeWidth={1.5} />
        </Pressable>
        <Text style={styles.title}>Traitement</Text>
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

          {/* Informations */}
          <View style={styles.section}>
            <SectionTitle label="Informations" />
            <View style={styles.infoCard}>
              <InfoRow label="Vétérinaire" value={traitement.doctor} />
              <InfoRow label="Clinique" value={traitement.clinic} />
              <InfoRow label="Date de début" value={traitement.startDate} />
              <InfoRow
                label="Date de fin"
                value={traitement.endDate ?? 'En cours'}
                last
              />
            </View>
          </View>

          {/* Posologie */}
          <View style={styles.section}>
            <SectionTitle label="Posologie" />
            <View style={styles.infoCard}>
              <View style={styles.posologieRow}>
                <Text style={styles.posologieLabel}>Posologie</Text>
                <Text style={styles.posologieValue}>{traitement.posologie}</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.posologieRow}>
                <Text style={styles.posologieLabel}>Prise</Text>
                <Text style={styles.posologieValue}>{traitement.prise}</Text>
              </View>
            </View>
          </View>

          {/* Animal concerné — seulement depuis le flow global */}
          {showAnimalCard && pet && (
            <View style={styles.section}>
              <SectionTitle label="Animal concerné" />
              <PetCard pet={pet} index={petIndex} />
            </View>
          )}

          {/* Motif */}
          {traitement.reason && (
            <View style={styles.section}>
              <SectionTitle label="Motif" />
              <View style={[styles.infoCard, styles.reasonCard]}>
                <Text style={styles.reasonText}>{traitement.reason}</Text>
              </View>
            </View>
          )}

          {/* Maladie associée */}
          {traitement.diseaseId && (
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
        </ScrollView>
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
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 32, gap: 24 },

  // Hero
  hero: { flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 64 },
  heroIconBox: {
    width: 52, height: 52, borderRadius: 8,
    backgroundColor: '#F5F5F5', alignItems: 'center', justifyContent: 'center',
  },
  heroContent: { flex: 1, gap: 8, justifyContent: 'center' },
  heroName: { fontSize: 24, fontWeight: '500', color: '#181818', lineHeight: 24 * 1.2 },
  statusTag: {
    alignSelf: 'flex-start', height: 24, paddingHorizontal: 8,
    borderRadius: 8, alignItems: 'center', justifyContent: 'center',
  },
  statusTagText: { fontSize: 12, fontWeight: '300' },

  // Sections
  section: { gap: 12 },
  sectionTitle: { fontSize: 16, fontWeight: '500', color: '#717171', lineHeight: 16 * 1.4 },

  // Info card
  infoCard: {
    backgroundColor: '#FFFFFF', borderRadius: 16,
    borderWidth: 1, borderColor: '#E8E8E8', overflow: 'hidden',
  },
  infoRow: { minHeight: 56, paddingHorizontal: 16, paddingVertical: 8, gap: 4, justifyContent: 'center' },
  infoRowLabel: { fontSize: 14, fontWeight: '300', color: '#B2B2B2', lineHeight: 14 * 1.4 },
  infoRowValue: { fontSize: 16, fontWeight: '300', color: '#181818', lineHeight: 16 * 1.4 },
  divider: { height: 1, backgroundColor: '#DCDCDC', marginHorizontal: 16 },

  // Posologie
  posologieRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', height: 56, paddingHorizontal: 16,
  },
  posologieLabel: { fontSize: 16, fontWeight: '300', color: '#717171' },
  posologieValue: { fontSize: 16, fontWeight: '300', color: '#4F4F4F' },

  // Reason
  reasonCard: { paddingHorizontal: 16, paddingVertical: 16 },
  reasonText: { fontSize: 16, fontWeight: '300', color: '#181818', lineHeight: 16 * 1.4 },

  // Disease link
  diseaseRow: {
    flexDirection: 'row', alignItems: 'center',
    height: 56, paddingLeft: 16, paddingRight: 8,
    backgroundColor: '#FFFFFF', borderRadius: 8,
    borderWidth: 1, borderColor: '#E8E8E8', gap: 8,
  },
  diseaseName: { flex: 1, fontSize: 16, fontWeight: '300', color: '#181818' },
});
