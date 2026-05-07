import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { ArrowLeft01Icon, ArrowRight01Icon, HelpCircleIcon } from '@hugeicons/core-free-icons';
import { usePets } from '../../src/data/petStore';
import { MEDICAL_HISTORY } from '../../src/data/medicalHistoryData';
import { colors } from '../../src/theme/colors';
import { ScreenBackground } from '../../src/components/ui/ScreenBackground';
import { AnimatedEntry } from '../../src/components/ui/AnimatedEntry';

export default function AnimalMedicalHistoryScreen() {
  const { index } = useLocalSearchParams<{ index?: string }>();
  const petIndex = parseInt(index ?? '0', 10);
  const pets = usePets();
  const pet = pets[petIndex];

  if (!pet) return null;

  const hasData = petIndex === 0;

  const years = [...new Set(MEDICAL_HISTORY.map(e => e.year))].sort((a, b) => b - a);
  const groups = years.map(year => ({
    year,
    items: MEDICAL_HISTORY.filter(e => e.year === year),
  }));

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
      <ScreenBackground />

      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <HugeiconsIcon icon={ArrowLeft01Icon} size={28} color={colors.neutral[900]} strokeWidth={1.5} />
        </Pressable>
        <Text style={styles.title}>Antécédents médicaux de {pet.name}</Text>
        <View style={{ width: 28 }} />
      </View>

      {hasData ? (
        <AnimatedEntry delay={80} style={{ flex: 1 }}>
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {groups.map(group => (
              <View key={group.year} style={styles.yearGroup}>
                <Text style={styles.yearLabel}>{group.year}</Text>
                <View style={styles.eventList}>
                  {group.items.map(event => (
                    <Pressable
                      key={event.id}
                      style={styles.eventRow}
                      onPress={() => router.push({
                        pathname: '/(health)/animal-medical-history-detail',
                        params: { id: event.id, petIndex: String(petIndex) },
                      })}
                    >
                      <View style={styles.eventIconBox}>
                        <HugeiconsIcon icon={event.icon} size={20} color={colors.neutral[900]} strokeWidth={1.5} />
                      </View>
                      <View style={styles.eventContent}>
                        <Text style={styles.eventName} numberOfLines={1}>{event.title}</Text>
                        <View style={styles.eventMeta}>
                          <Text style={styles.eventMetaText}>{event.doctor}</Text>
                          <Text style={styles.eventMetaText}>·</Text>
                          <Text style={styles.eventMetaText}>{event.dateLabel}</Text>
                        </View>
                      </View>
                      <HugeiconsIcon icon={ArrowRight01Icon} size={20} color={colors.neutral[400]} strokeWidth={1.5} />
                    </Pressable>
                  ))}
                </View>
              </View>
            ))}
          </ScrollView>
        </AnimatedEntry>
      ) : (
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
                  Seul votre vétérinaire peut renseigner les antécédents médicaux de votre animal.
                </Text>
                <Text style={styles.alertText}>
                  Pensez à prendre RDV pour un suivi régulier.
                </Text>
              </View>
            </View>
            <View style={styles.emptyCard}>
              <Text style={styles.emptyTitle}>Aucun antécédent médical</Text>
              <Text style={styles.emptyBody}>Aucune information n'a été ajoutée.</Text>
            </View>
          </ScrollView>
        </AnimatedEntry>
      )}
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

  yearGroup: { gap: 12 },
  yearLabel: { fontSize: 16, fontWeight: '500', color: '#717171', lineHeight: 16 * 1.4 },
  eventList: { gap: 8 },
  eventRow: {
    flexDirection: 'row', alignItems: 'center',
    height: 64, paddingLeft: 16, paddingRight: 8, gap: 8,
    backgroundColor: '#FFFFFF', borderRadius: 8, borderWidth: 1, borderColor: '#E8E8E8',
  },
  eventIconBox: {
    width: 28, height: 28, borderRadius: 8,
    backgroundColor: '#F5F5F5', alignItems: 'center', justifyContent: 'center',
  },
  eventContent: { flex: 1, gap: 8, justifyContent: 'center' },
  eventName: { fontSize: 16, fontWeight: '300', color: '#181818', lineHeight: 16 * 1.4 },
  eventMeta: { flexDirection: 'row', gap: 4, alignItems: 'center' },
  eventMetaText: { fontSize: 12, fontWeight: '300', color: '#B2B2B2', lineHeight: 12 * 1.4 },

  alertBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: '#E5E8FA',
    borderWidth: 1,
    borderColor: '#8E9AF6',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 13,
  },
  alertText: { flex: 1, fontSize: 16, fontWeight: '300', color: '#39438D', lineHeight: 16 * 1.2 },

  emptyCard: {
    flex: 1, backgroundColor: '#FFFFFF', borderRadius: 16,
    borderWidth: 1, borderColor: '#E8E8E8',
    paddingHorizontal: 16, paddingVertical: 24, gap: 16,
    alignItems: 'center', justifyContent: 'center',
  },
  emptyTitle: { fontSize: 16, fontWeight: '500', color: '#181818', lineHeight: 16 * 1.4 },
  emptyBody: { fontSize: 16, fontWeight: '300', color: '#717171', lineHeight: 16 * 1.4, textAlign: 'center' },
});
