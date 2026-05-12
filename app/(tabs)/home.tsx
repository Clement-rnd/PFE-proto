import { View, Text, Pressable, ScrollView, StyleSheet, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { HugeiconsIcon } from '@hugeicons/react-native';
import {
  Notification01Icon,
  ArrowRight01Icon,
  CalendarAdd01Icon,
  Tick01Icon,
} from '@hugeicons/core-free-icons';
import { AppIcon } from '../../src/components/ui/AppIcon';
import { Button } from '../../src/components/ui/Button';
import { AnimatedEntry } from '../../src/components/ui/AnimatedEntry';
import { ScreenBackground } from '../../src/components/ui/ScreenBackground';
import { colors } from '../../src/theme/colors';
import { usePets } from '../../src/data/petStore';
import { TRAITEMENTS, type Traitement, type TreatmentStatus } from '../../src/data/traitementsData';
import { CONSULTATIONS } from '../../src/data/consultationsData';

const PET_IMAGES = [
  require('../../assets/images/pet-1.png'),
  require('../../assets/images/pet-2.png'),
  require('../../assets/images/pet-3.png'),
  require('../../assets/images/pet-4.png'),
  require('../../assets/images/pet-5.png'),
];

const STATUS_TAG: Record<TreatmentStatus, { bg: string; text: string; label: string }> = {
  active:   { bg: colors.success[50],  text: colors.success.DEFAULT,  label: 'En cours' },
  upcoming: { bg: '#E5E8FA',           text: '#39438D',               label: 'À venir' },
  finished: { bg: '#F5F5F5',           text: '#4F4F4F',               label: 'Terminé' },
  paused:   { bg: colors.warning[50],  text: colors.warning.DEFAULT,  label: 'Suspendu' },
};

function TreatmentProgressCard({ t }: { t: Traitement }) {
  const pct = Math.min(Math.max((t.elapsedDays ?? 0) / (t.totalDays ?? 1), 0), 1);
  const remaining = (t.totalDays ?? 0) - (t.elapsedDays ?? 0);
  return (
    <Pressable
      style={styles.progressCard}
      onPress={() => router.push({ pathname: '/(health)/traitement-detail', params: { id: t.id, petIndex: String(t.petIndex) } })}
    >
      <View style={styles.progressCardRow}>
        <Text style={styles.progressCardName} numberOfLines={1}>{t.name} · {t.petName}</Text>
        <HugeiconsIcon icon={ArrowRight01Icon} size={20} color={colors.neutral[400]} strokeWidth={1.5} />
      </View>
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${pct * 100}%` as any }]} />
      </View>
      <View style={styles.progressFooter}>
        <Text style={styles.progressLeft}>{t.elapsedDays} jours sur {t.totalDays}</Text>
        <Text style={styles.progressRight}>{remaining} jour{remaining > 1 ? 's' : ''} restant{remaining > 1 ? 's' : ''}</Text>
      </View>
    </Pressable>
  );
}

function TreatmentListCard({ t }: { t: Traitement }) {
  const tag = STATUS_TAG[t.status];
  return (
    <Pressable
      style={styles.listCard}
      onPress={() => router.push({ pathname: '/(health)/traitement-detail', params: { id: t.id, petIndex: String(t.petIndex) } })}
    >
      <View style={styles.listCardIconBox}>
        <AppIcon icon={t.icon} size={20} color={colors.neutral[900]} strokeWidth={1.5} />
      </View>
      <View style={styles.listCardContent}>
        <Text style={styles.listCardName} numberOfLines={1}>{t.name}</Text>
        <View style={styles.listCardMeta}>
          <View style={[styles.tag, { backgroundColor: tag.bg }]}>
            <Text style={[styles.tagText, { color: tag.text }]}>{tag.label}</Text>
          </View>
          {t.daysInfo && (
            <>
              <Text style={styles.metaDot}>·</Text>
              <Text style={styles.metaText} numberOfLines={1}>{t.daysInfo}</Text>
            </>
          )}
        </View>
      </View>
      <HugeiconsIcon icon={ArrowRight01Icon} size={20} color={colors.neutral[400]} strokeWidth={1.5} />
    </Pressable>
  );
}

export default function HomeScreen() {
  const pets = usePets();
  const activeTreatments = TRAITEMENTS.filter(
    t => t.status === 'active' || t.status === 'upcoming'
  ).slice(0, 1);
  const nextConsultation = CONSULTATIONS.find(c => c.status === 'upcoming');

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <ScreenBackground />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <AnimatedEntry delay={0}>
          <View style={styles.header}>
            <Text style={styles.greeting}>Bienvenue Clément !</Text>
            <Pressable style={styles.notifBtn} hitSlop={8}>
              <HugeiconsIcon icon={Notification01Icon} size={28} color={colors.neutral[900]} strokeWidth={1.5} />
            </Pressable>
          </View>
        </AnimatedEntry>

        {/* Traitements en cours */}
        {activeTreatments.length > 0 && (
          <AnimatedEntry delay={80}>
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Traitement en cours</Text>
                <Pressable style={styles.seeAllBtn} onPress={() => router.push('/(health)/traitements')}>
                  <Text style={styles.seeAllText}>Voir tout</Text>
                  <HugeiconsIcon icon={ArrowRight01Icon} size={20} color={colors.neutral[900]} strokeWidth={1.5} />
                </Pressable>
              </View>
              <View style={styles.cardsList}>
                {activeTreatments.map(t =>
                  t.totalDays != null && t.elapsedDays != null
                    ? <TreatmentProgressCard key={t.id} t={t} />
                    : <TreatmentListCard key={t.id} t={t} />
                )}
              </View>
            </View>
          </AnimatedEntry>
        )}

        {/* Prochain RDV */}
        {nextConsultation && (
          <AnimatedEntry delay={120}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Prochain RDV</Text>
              <Pressable
                style={styles.listCard}
                onPress={() => router.push('/(health)/consultations')}
              >
                <View style={styles.listCardIconBox}>
                  <HugeiconsIcon icon={nextConsultation.icon} size={20} color={colors.neutral[900]} strokeWidth={1.5} />
                </View>
                <View style={styles.listCardContent}>
                  <Text style={styles.listCardName} numberOfLines={1}>
                    {nextConsultation.title} de {nextConsultation.petName}
                  </Text>
                  <View style={[styles.tag, { backgroundColor: colors.primary[50], alignSelf: 'flex-start' }]}>
                    <Text style={[styles.tagText, { color: colors.primary.DEFAULT }]}>
                      {nextConsultation.dateTime}
                    </Text>
                  </View>
                </View>
                <HugeiconsIcon icon={ArrowRight01Icon} size={20} color={colors.neutral[400]} strokeWidth={1.5} />
              </Pressable>
            </View>
          </AnimatedEntry>
        )}

        {/* Mes animaux */}
        {pets.length > 0 && (
          <AnimatedEntry delay={160}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Mes animaux</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.petsRow}>
                {pets.map((pet, i) => (
                  <Pressable
                    key={i}
                    style={styles.petCard}
                    onPress={() => router.push('/(health)/my-animals')}
                  >
                    <Image
                      source={pet.photoUri ? { uri: pet.photoUri } : PET_IMAGES[i % PET_IMAGES.length]}
                      style={styles.petPhoto}
                      resizeMode="cover"
                    />
                    <Text style={styles.petName}>{pet.name}</Text>
                    <View style={styles.petTag}>
                      <HugeiconsIcon icon={Tick01Icon} size={16} color={colors.success.DEFAULT} strokeWidth={2} />
                      <Text style={styles.petTagText}>À jour</Text>
                    </View>
                  </Pressable>
                ))}
              </ScrollView>
            </View>
          </AnimatedEntry>
        )}

      </ScrollView>

      {/* CTA sticky */}
      <View style={styles.stickyBar}>
        <Button
          label="Planifier un rendez-vous"
          icon={CalendarAdd01Icon}
          onPress={() => router.push('/(health)/consultations')}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: 'transparent' },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 16, paddingTop: 32, paddingBottom: 24, gap: 24 },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 44,
  },
  greeting: {
    flex: 1,
    fontSize: 24,
    fontWeight: '500',
    color: '#181818',
    lineHeight: 24 * 1.2,
  },
  notifBtn: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: colors.neutral[100],
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Sections
  section: { gap: 12 },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#717171',
    lineHeight: 16 * 1.4,
  },
  seeAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    height: 32,
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '300',
    color: '#181818',
  },

  // Cards list
  cardsList: { gap: 8 },

  // Treatment progress card
  progressCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  progressCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  progressCardName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '300',
    color: '#181818',
    lineHeight: 16 * 1.4,
  },
  progressTrack: {
    height: 6,
    backgroundColor: '#E8E8E8',
    borderRadius: 99,
    overflow: 'hidden',
  },
  progressFill: {
    height: 6,
    backgroundColor: '#8E9AF6',
    borderRadius: 99,
  },
  progressFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressLeft: {
    fontSize: 14,
    fontWeight: '300',
    color: '#8E9AF6',
    lineHeight: 14 * 1.2,
  },
  progressRight: {
    fontSize: 14,
    fontWeight: '300',
    color: '#717171',
    lineHeight: 14 * 1.2,
  },

  // List card (treatment + RDV)
  listCard: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 64,
    paddingLeft: 16,
    paddingRight: 8,
    gap: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  listCardIconBox: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  listCardContent: {
    flex: 1,
    gap: 8,
    justifyContent: 'center',
  },
  listCardName: {
    fontSize: 16,
    fontWeight: '300',
    color: '#181818',
    lineHeight: 16 * 1.4,
  },
  listCardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  // Tags
  tag: {
    height: 24,
    paddingHorizontal: 8,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tagText: { fontSize: 12, fontWeight: '300' },
  metaDot: { fontSize: 12, fontWeight: '300', color: '#B2B2B2' },
  metaText: { fontSize: 12, fontWeight: '300', color: '#B2B2B2' },

  // Sticky CTA
  stickyBar: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E8E8E8',
    backgroundColor: '#FDF7F9',
  },

  // Pet cards
  petsRow: { gap: 8 },
  petCard: {
    width: 148,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    padding: 8,
    gap: 8,
    alignItems: 'center',
  },
  petPhoto: {
    width: 48,
    height: 48,
    borderRadius: 4,
  },
  petName: {
    fontSize: 20,
    fontWeight: '500',
    color: '#181818',
    lineHeight: 20 * 1.2,
  },
  petTag: {
    flexDirection: 'row',
    height: 24,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: colors.success[50],
    alignItems: 'center',
    gap: 4,
  },
  petTagText: {
    fontSize: 12,
    fontWeight: '300',
    color: colors.success.DEFAULT,
  },
});
