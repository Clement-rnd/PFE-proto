import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { ArrowLeft01Icon, LinkSquare02Icon } from '@hugeicons/core-free-icons';
import { AppIcon } from '../../src/components/ui/AppIcon';
import { usePets } from '../../src/data/petStore';
import { DOCUMENTS, DOC_TYPE_STYLE, DOC_STATUS_STYLE } from '../../src/data/documentsData';
import { colors } from '../../src/theme/colors';
import { AnimatedEntry } from '../../src/components/ui/AnimatedEntry';
import { ScreenBackground } from '../../src/components/ui/ScreenBackground';

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

export default function AnimalDocumentDetailScreen() {
  const { id, petIndex: petIndexParam } = useLocalSearchParams<{ id?: string; petIndex?: string }>();
  const petIndex = parseInt(petIndexParam ?? '0', 10);
  const pets = usePets();
  const pet = pets[petIndex];

  const doc = DOCUMENTS.find(d => d.id === id);
  if (!doc || !pet) return null;

  const typeStyle = DOC_TYPE_STYLE[doc.type];
  const statusStyle = doc.status ? DOC_STATUS_STYLE[doc.status] : null;

  const screenTitle = typeStyle.label;
  const heroTitle = `${typeStyle.label} de ${pet.name}`;

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
      <ScreenBackground />

      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <HugeiconsIcon icon={ArrowLeft01Icon} size={28} color={colors.neutral[900]} strokeWidth={1.5} />
        </Pressable>
        <Text style={styles.title}>{screenTitle}</Text>
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
              <AppIcon icon={typeStyle.icon} size={28} color={colors.neutral[900]} strokeWidth={1.5} />
            </View>
            <View style={styles.heroContent}>
              <Text style={styles.heroName} numberOfLines={1}>{heroTitle}</Text>
              {statusStyle && (
                <View style={[styles.statusTag, { backgroundColor: statusStyle.bg }]}>
                  <Text style={[styles.statusTagText, { color: statusStyle.text }]}>{statusStyle.label}</Text>
                </View>
              )}
            </View>
          </View>

          {/* Détails */}
          {(doc.doctor || doc.clinic || doc.deliveryDate || doc.validity) && (
            <View style={styles.section}>
              <SectionTitle label={`Détails de l'${doc.type === 'ordonnance' ? 'ordonnance' : doc.type === 'analyse' ? 'analyse' : 'compte-rendu'}`} />
              <View style={styles.infoCard}>
                {doc.doctor && <InfoRow label="Vétérinaire" value={doc.doctor} />}
                {doc.clinic && <InfoRow label="Clinique" value={doc.clinic} />}
                {doc.deliveryDate && <InfoRow label="Date de délivrance" value={doc.deliveryDate} />}
                {doc.validity && <InfoRow label="Validité" value={doc.validity} last />}
                {!doc.validity && doc.clinic && <View />}
              </View>
            </View>
          )}

          {/* Médicaments (ordonnances) */}
          {doc.medications && doc.medications.length > 0 && (
            <View style={styles.section}>
              <SectionTitle label={`Médicaments (${doc.medications.length})`} />
              {doc.medications.map((med, i) => (
                <View key={i} style={styles.infoCard}>
                  <View style={styles.medNameRow}>
                    <AppIcon icon={typeStyle.icon} size={20} color={colors.neutral[700]} strokeWidth={1.5} />
                    <Text style={styles.medName}>{med.name}</Text>
                  </View>
                  <View style={styles.divider} />
                  <InfoRow label="Fréquence" value={med.frequence} />
                  <InfoRow label="Durée" value={med.duree} last={!med.instructions} />
                  {med.instructions && (
                    <InfoRow label="Information complémentaire" value={med.instructions} last />
                  )}
                </View>
              ))}
            </View>
          )}

          {/* Contenu (comptes-rendus / analyses) */}
          {doc.content && (
            <View style={styles.section}>
              <SectionTitle label="Contenu" />
              <View style={[styles.infoCard, styles.contentCard]}>
                <Text style={styles.contentText}>{doc.content}</Text>
              </View>
            </View>
          )}

          {/* Bouton PDF (ordonnances uniquement) */}
          {doc.type === 'ordonnance' && (
            <Pressable style={styles.pdfButton}>
              <Text style={styles.pdfButtonText}>Ouvrir l'ordonnance en PDF</Text>
              <HugeiconsIcon icon={LinkSquare02Icon} size={20} color="#FFFFFF" strokeWidth={1.5} />
            </Pressable>
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

  // Medication
  medNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    paddingHorizontal: 16,
    gap: 12,
  },
  medName: { flex: 1, fontSize: 16, fontWeight: '300', color: '#181818', lineHeight: 16 * 1.4 },

  // Content (compte-rendu / analyse)
  contentCard: { paddingHorizontal: 16, paddingVertical: 16 },
  contentText: { fontSize: 16, fontWeight: '300', color: '#181818', lineHeight: 16 * 1.4 },

  // PDF button
  pdfButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 48,
    backgroundColor: colors.primary.DEFAULT,
    borderRadius: 8,
  },
  pdfButtonText: { fontSize: 14, fontWeight: '300', color: '#FFFFFF' },
});
