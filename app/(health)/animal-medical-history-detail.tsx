import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { ArrowLeft01Icon, ArrowRight01Icon, File02Icon } from '@hugeicons/core-free-icons';
import { MEDICAL_HISTORY } from '../../src/data/medicalHistoryData';
import { colors } from '../../src/theme/colors';
import { AnimatedEntry } from '../../src/components/ui/AnimatedEntry';
import { ScreenBackground } from '../../src/components/ui/ScreenBackground';

function SectionTitle({ label }: { label: string }) {
  return <Text style={styles.sectionTitle}>{label}</Text>;
}

function InfoCard({ children }: { children: React.ReactNode }) {
  return <View style={styles.infoCard}>{children}</View>;
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

function TreatmentRow({ label, traitementId, last }: { label: string; traitementId?: string; last?: boolean }) {
  const inner = (
    <View style={styles.treatmentRow}>
      <View style={styles.treatmentRowContent}>
        <Text style={styles.infoRowLabel}>Médicament</Text>
        <Text style={styles.infoRowValue} numberOfLines={1}>{label}</Text>
      </View>
      {traitementId && (
        <HugeiconsIcon icon={ArrowRight01Icon} size={24} color={colors.neutral[400]} strokeWidth={1.5} />
      )}
    </View>
  );
  return (
    <>
      {traitementId ? (
        <Pressable onPress={() => router.push({
          pathname: '/(health)/traitement-detail',
          params: { id: traitementId, petIndex: '0', fromMedHistory: 'true' },
        })}>
          {inner}
        </Pressable>
      ) : inner}
      {!last && <View style={styles.divider} />}
    </>
  );
}

function DocumentRow({ name, size, date, last }: { name: string; size: string; date: string; last?: boolean }) {
  return (
    <>
      <Pressable style={styles.documentRow}>
        <View style={styles.documentIconBox}>
          <HugeiconsIcon icon={File02Icon} size={20} color={colors.neutral[900]} strokeWidth={1.5} />
        </View>
        <View style={styles.documentContent}>
          <Text style={styles.documentName} numberOfLines={1}>{name}</Text>
          <Text style={styles.documentMeta}>{date} · {size}</Text>
        </View>
        <HugeiconsIcon icon={ArrowRight01Icon} size={24} color={colors.neutral[400]} strokeWidth={1.5} />
      </Pressable>
      {!last && <View style={styles.divider} />}
    </>
  );
}

export default function AnimalMedicalHistoryDetailScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();

  const event = MEDICAL_HISTORY.find(e => e.id === id);

  if (!event) return null;

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
      <ScreenBackground />

      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <HugeiconsIcon icon={ArrowLeft01Icon} size={28} color={colors.neutral[900]} strokeWidth={1.5} />
        </Pressable>
        <Text style={styles.title}>Détails d'un antécédent médical</Text>
        <View style={{ width: 28 }} />
      </View>

      <AnimatedEntry delay={80} style={{ flex: 1 }}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Event header */}
          <View style={styles.eventHeader}>
            <View style={styles.eventIconBox}>
              <HugeiconsIcon icon={event.icon} size={28} color={colors.neutral[900]} strokeWidth={1.5} />
            </View>
            <View style={styles.eventHeaderContent}>
              <Text style={styles.eventName} numberOfLines={1}>{event.title}</Text>
              <View style={styles.statusTag}>
                <Text style={styles.statusTagText}>{event.status}</Text>
              </View>
            </View>
          </View>

          {/* Informations */}
          <View style={styles.section}>
            <SectionTitle label="Informations" />
            <InfoCard>
              <InfoRow label="Vétérinaire" value={event.doctor} />
              <InfoRow label="Clinique" value={event.clinic} />
              {event.duration
                ? <InfoRow label="Durée" value={event.duration} last />
                : <InfoRow label="Date" value={event.dateLabel} last />
              }
            </InfoCard>
          </View>

          {/* Motif */}
          {event.reason && (
            <View style={styles.section}>
              <SectionTitle label="Motif" />
              <View style={[styles.infoCard, styles.reasonCard]}>
                <Text style={styles.reasonText}>{event.reason}</Text>
              </View>
            </View>
          )}

          {/* Traitements */}
          {event.treatments.length > 0 && (
            <View style={styles.section}>
              <SectionTitle label="Traitements" />
              <InfoCard>
                {event.treatments.map((t, i) => (
                  <TreatmentRow key={i} label={t.label} traitementId={t.traitementId} last={i === event.treatments.length - 1} />
                ))}
              </InfoCard>
            </View>
          )}

          {/* Documents */}
          {event.documents.length > 0 && (
            <View style={styles.section}>
              <SectionTitle label="Documents" />
              <InfoCard>
                {event.documents.map((doc, i) => (
                  <DocumentRow key={i} name={doc.name} size={doc.size} date={doc.date} last={i === event.documents.length - 1} />
                ))}
              </InfoCard>
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

  // Event header
  eventHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    minHeight: 64,
  },
  eventIconBox: {
    width: 52,
    height: 52,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  eventHeaderContent: { flex: 1, gap: 6, justifyContent: 'center' },
  eventName: { fontSize: 24, fontWeight: '500', color: '#181818', lineHeight: 24 * 1.2 },
  statusTag: {
    alignSelf: 'flex-start',
    height: 24,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusTagText: { fontSize: 12, fontWeight: '300', color: '#4F4F4F' },

  // Sections
  section: { gap: 12 },
  sectionTitle: { fontSize: 16, fontWeight: '500', color: '#717171', lineHeight: 16 * 1.4 },

  // Cards
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    overflow: 'hidden',
  },
  infoRow: {
    minHeight: 56,
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 4,
    justifyContent: 'center',
  },
  infoRowLabel: { fontSize: 14, fontWeight: '300', color: '#B2B2B2', lineHeight: 14 * 1.4 },
  infoRowValue: { fontSize: 16, fontWeight: '300', color: '#181818', lineHeight: 16 * 1.4 },
  divider: { height: 1, backgroundColor: '#DCDCDC', marginHorizontal: 16 },

  treatmentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 56,
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  treatmentRowContent: { flex: 1, gap: 4, justifyContent: 'center' },
  reasonCard: { paddingHorizontal: 16, paddingVertical: 16 },
  reasonText: { fontSize: 16, fontWeight: '300', color: '#181818', lineHeight: 16 * 1.4 },

  documentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 64,
    paddingLeft: 16,
    paddingRight: 8,
    gap: 8,
  },
  documentIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#FAFAFA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  documentContent: { flex: 1, gap: 8, justifyContent: 'center' },
  documentName: { fontSize: 16, fontWeight: '300', color: '#181818', lineHeight: 16 * 1.4 },
  documentMeta: { fontSize: 14, fontWeight: '300', color: '#B2B2B2', lineHeight: 14 * 1.2 },
});
