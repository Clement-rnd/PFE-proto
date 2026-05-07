import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { ArrowLeft01Icon, InjectionIcon, Alert01Icon, CalendarAdd01Icon } from '@hugeicons/core-free-icons';
import { usePets } from '../../src/data/petStore';
import { VACCINS, type VaccineStatus } from '../../src/data/vaccinsData';
import { colors } from '../../src/theme/colors';
import { ScreenBackground } from '../../src/components/ui/ScreenBackground';
import { PetCard } from '../../src/components/ui/PetCard';
import { Button } from '../../src/components/ui/Button';
import { AnimatedEntry } from '../../src/components/ui/AnimatedEntry';

const STATUS_STYLES: Record<VaccineStatus, { bg: string; text: string; label: string }> = {
  upToDate: { bg: colors.success[50],  text: colors.success.DEFAULT,  label: 'À jour' },
  toDo:     { bg: colors.warning[50],  text: colors.warning.DEFAULT,  label: 'À faire' },
  late:     { bg: colors.danger[50],   text: colors.danger.DEFAULT,   label: 'En retard' },
};

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

export default function VaccinDetailScreen() {
  const { id, petIndex: petIndexParam, fromAnimal } = useLocalSearchParams<{
    id?: string; petIndex?: string; fromAnimal?: string;
  }>();
  const petIndex = parseInt(petIndexParam ?? '0', 10);
  const pets = usePets();
  const pet = pets[petIndex];

  const vaccin = VACCINS.find(v => v.id === id);
  const showAnimalCard = fromAnimal !== 'true';

  if (!vaccin) return null;

  const tag = STATUS_STYLES[vaccin.status];
  const isLate = vaccin.status === 'late';

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
      <ScreenBackground />

      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <HugeiconsIcon icon={ArrowLeft01Icon} size={28} color={colors.neutral[900]} strokeWidth={1.5} />
        </Pressable>
        <Text style={styles.title}>Détails d'un vaccin</Text>
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
              <HugeiconsIcon icon={InjectionIcon} size={28} color={colors.neutral[900]} strokeWidth={1.5} />
            </View>
            <View style={styles.heroContent}>
              <Text style={styles.heroName} numberOfLines={1}>{vaccin.name}</Text>
              <View style={[styles.statusTag, { backgroundColor: tag.bg }]}>
                <Text style={[styles.statusTagText, { color: tag.text }]}>{tag.label}</Text>
              </View>
            </View>
          </View>

          {/* Alert banner (late only) */}
          {isLate && (
            <View style={styles.lateBanner}>
              <HugeiconsIcon icon={Alert01Icon} size={16} color={colors.danger.DEFAULT} strokeWidth={1.5} />
              <Text style={styles.lateBannerText}>
                Vaccin en retard. Prenez rendez-vous dès que possible.
              </Text>
            </View>
          )}

          {/* Dates */}
          <View style={styles.section}>
            <SectionTitle label="Dates" />
            <View style={styles.infoCard}>
              {vaccin.lastInjection && (
                <>
                  <InfoRow label="Dernière injection" value={vaccin.lastInjection} />
                </>
              )}
              <InfoRow
                label="Prochaine injection"
                value={isLate ? `${vaccin.nextInjection} (dépassé)` : vaccin.nextInjection}
                last
              />
            </View>
          </View>

          {/* Prendre RDV button (late only) */}
          {isLate && (
            <Button
              label="Prendre rendez-vous"
              icon={CalendarAdd01Icon}
              onPress={() => {}}
            />
          )}

          {/* Informations */}
          <View style={styles.section}>
            <SectionTitle label="Informations" />
            <View style={styles.infoCard}>
              <InfoRow label="Vétérinaire" value={vaccin.doctor} />
              <InfoRow label="Clinique" value={vaccin.clinic} last />
            </View>
          </View>

          {/* Animal concerné (only from global flow) */}
          {showAnimalCard && pet && (
            <View style={styles.section}>
              <SectionTitle label="Animal concerné" />
              <PetCard pet={pet} index={petIndex} />
            </View>
          )}

          {/* Historique */}
          {vaccin.history.length > 0 && (
            <View style={styles.section}>
              <SectionTitle label="Historique" />
              <View style={styles.infoCard}>
                {vaccin.history.map((entry, i) => (
                  <View key={i}>
                    <View style={styles.historyRow}>
                      <Text style={styles.historyDate}>{entry.date}</Text>
                      <Text style={styles.historyMeta}>{entry.doctor} · {entry.clinic}</Text>
                    </View>
                    {i < vaccin.history.length - 1 && <View style={styles.divider} />}
                  </View>
                ))}
              </View>
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

  // Late banner
  lateBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: colors.danger[50],
    borderWidth: 1,
    borderColor: colors.danger.DEFAULT,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  lateBannerText: { flex: 1, fontSize: 14, fontWeight: '300', color: colors.danger.DEFAULT, lineHeight: 14 * 1.4 },

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

  // Historique
  historyRow: { minHeight: 56, paddingHorizontal: 16, paddingVertical: 12, gap: 4, justifyContent: 'center' },
  historyDate: { fontSize: 16, fontWeight: '300', color: '#181818', lineHeight: 16 * 1.4 },
  historyMeta: { fontSize: 12, fontWeight: '300', color: '#B2B2B2', lineHeight: 12 * 1.4 },
});
