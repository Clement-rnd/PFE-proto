import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { ArrowLeft01Icon } from '@hugeicons/core-free-icons';
import { AppIcon } from '../../src/components/ui/AppIcon';
import { CONSULTATIONS, type ConsultationStatus } from '../../src/data/consultationsData';
import { colors } from '../../src/theme/colors';
import { AnimatedEntry } from '../../src/components/ui/AnimatedEntry';

const STATUS_STYLES: Record<ConsultationStatus, { bg: string; text: string; label: string }> = {
  upcoming: { bg: '#E5E8FA', text: '#39438D', label: 'À venir' },
  done: { bg: '#F5F5F5', text: '#4F4F4F', label: 'Passée' },
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

export default function ConsultationDetailScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();

  const consult = CONSULTATIONS.find(c => c.id === id);

  if (!consult) return null;

  const tag = STATUS_STYLES[consult.status];

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>

      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <HugeiconsIcon icon={ArrowLeft01Icon} size={28} color={colors.neutral[900]} strokeWidth={1.5} />
        </Pressable>
        <Text style={styles.title}>Consultation</Text>
        <View style={{ width: 28 }} />
      </View>

      <AnimatedEntry delay={80} style={{ flex: 1 }}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Consultation header */}
          <View style={styles.consultHeader}>
            <View style={styles.consultIconBox}>
              <AppIcon icon={consult.icon} size={28} color={colors.neutral[900]} strokeWidth={1.5} />
            </View>
            <View style={styles.consultHeaderContent}>
              <Text style={styles.consultName} numberOfLines={1}>
                {consult.title} de {consult.petName}
              </Text>
              <View style={[styles.statusTag, { backgroundColor: tag.bg }]}>
                <Text style={[styles.statusTagText, { color: tag.text }]}>{tag.label}</Text>
              </View>
            </View>
          </View>

          {/* Informations */}
          <View style={styles.section}>
            <SectionTitle label="Informations" />
            <View style={styles.infoCard}>
              <InfoRow label="Vétérinaire" value={consult.doctor} />
              <InfoRow label="Clinique" value={consult.clinic} />
              <InfoRow label="Date du rendez-vous" value={consult.dateTime} last />
            </View>
          </View>

          {/* Motif */}
          {consult.reason && (
            <View style={styles.section}>
              <SectionTitle label="Motif" />
              <View style={[styles.infoCard, styles.reasonCard]}>
                <Text style={styles.reasonText}>{consult.reason}</Text>
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

  // Consultation header
  consultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    minHeight: 64,
  },
  consultIconBox: {
    width: 52,
    height: 52,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  consultHeaderContent: { flex: 1, gap: 8, justifyContent: 'center' },
  consultName: { fontSize: 24, fontWeight: '500', color: '#181818', lineHeight: 24 * 1.2 },
  statusTag: {
    alignSelf: 'flex-start',
    height: 24,
    paddingHorizontal: 8,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusTagText: { fontSize: 12, fontWeight: '300' },

  // Sections
  section: { gap: 12 },
  sectionTitle: { fontSize: 16, fontWeight: '500', color: '#717171', lineHeight: 16 * 1.4 },

  // Info card
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

  reasonCard: { paddingHorizontal: 16, paddingVertical: 16 },
  reasonText: { fontSize: 16, fontWeight: '300', color: '#181818', lineHeight: 16 * 1.4 },
});
