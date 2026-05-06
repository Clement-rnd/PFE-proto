import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { ArrowLeft01Icon, ArrowRight01Icon, HelpCircleIcon } from '@hugeicons/core-free-icons';
import { usePets } from '../../src/data/petStore';
import { CHRONIC_DISEASES, DISEASE_CATEGORIES } from '../../src/data/chronicDiseasesData';
import { colors } from '../../src/theme/colors';
import { ScreenBackground } from '../../src/components/ui/ScreenBackground';
import { AnimatedEntry } from '../../src/components/ui/AnimatedEntry';

// ── Screen ────────────────────────────────────────────────────────────────────

export default function AnimalChronicDiseasesScreen() {
  const { index } = useLocalSearchParams<{ index?: string }>();
  const petIndex = parseInt(index ?? '0', 10);
  const pets = usePets();
  const pet = pets[petIndex];

  if (!pet) return null;

  const hasData = petIndex === 0;

  const groups = DISEASE_CATEGORIES
    .map(cat => ({
      key: cat,
      title: `${cat} (${CHRONIC_DISEASES.filter(d => d.category === cat).length})`,
      items: CHRONIC_DISEASES.filter(d => d.category === cat),
    }))
    .filter(g => g.items.length > 0);

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
      <ScreenBackground />

      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <HugeiconsIcon icon={ArrowLeft01Icon} size={28} color={colors.neutral[900]} strokeWidth={1.5} />
        </Pressable>
        <Text style={styles.title}>Maladies chroniques</Text>
        <View style={{ width: 28 }} />
      </View>

      {hasData ? (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <AnimatedEntry delay={80}>
            <View style={styles.alertBanner}>
              <HugeiconsIcon icon={HelpCircleIcon} size={16} color="#39438D" strokeWidth={1.5} />
              <Text style={styles.alertText}>
                Ces informations sont mises à jour uniquement par votre vétérinaire.
              </Text>
            </View>
          </AnimatedEntry>

          <AnimatedEntry delay={140}>
            <View style={{ gap: 24 }}>
              {groups.map(group => (
                <View key={group.key} style={styles.section}>
                  <Text style={styles.sectionTitle}>{group.title}</Text>
                  <View style={styles.diseaseList}>
                    {group.items.map(disease => (
                      <Pressable
                        key={disease.name}
                        style={styles.diseaseRow}
                        onPress={() => router.push({
                          pathname: '/(health)/animal-chronic-disease-detail',
                          params: { name: disease.name, petIndex: String(petIndex) },
                        })}
                      >
                        <View style={styles.diseaseIconBox}>
                          <HugeiconsIcon icon={disease.icon} size={20} color={colors.neutral[900]} strokeWidth={1.5} />
                        </View>
                        <View style={styles.diseaseContent}>
                          <Text style={styles.diseaseName} numberOfLines={1}>{disease.name}</Text>
                          <View style={styles.diseaseTag}>
                            <Text style={styles.diseaseTagText}>{disease.category}</Text>
                          </View>
                        </View>
                        <HugeiconsIcon icon={ArrowRight01Icon} size={20} color={colors.neutral[400]} strokeWidth={1.5} />
                      </Pressable>
                    ))}
                  </View>
                </View>
              ))}
            </View>
          </AnimatedEntry>
        </ScrollView>
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
                  Seul votre vétérinaire peut renseigner les maladies chroniques de votre animal.
                </Text>
                <Text style={styles.alertText}>
                  Pensez à prendre RDV pour un suivi régulier.
                </Text>
              </View>
            </View>
            <View style={styles.emptyCard}>
              <Text style={styles.emptyTitle}>Aucune maladie connue</Text>
              <Text style={styles.emptyBody}>
                {pet.name} n'a pas de maladie chronique diagnostiquée. Cette section sera mise à jour par votre vétérinaire.
              </Text>
            </View>
          </ScrollView>
        </AnimatedEntry>
      )}
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
  scrollContent: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 32, gap: 16 },

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

  section: { gap: 12 },
  sectionTitle: { fontSize: 16, fontWeight: '500', color: '#717171', lineHeight: 16 * 1.4 },
  diseaseList: { gap: 8 },
  diseaseRow: {
    flexDirection: 'row', alignItems: 'center',
    height: 64, paddingLeft: 16, paddingRight: 8, gap: 8,
    backgroundColor: '#FFFFFF', borderRadius: 8, borderWidth: 1, borderColor: '#E8E8E8',
  },
  diseaseIconBox: {
    width: 28, height: 28, borderRadius: 8,
    backgroundColor: '#F5F5F5', alignItems: 'center', justifyContent: 'center',
  },
  diseaseContent: { flex: 1, gap: 4, justifyContent: 'center' },
  diseaseName: { fontSize: 16, fontWeight: '300', color: '#181818' },
  diseaseTag: {
    alignSelf: 'flex-start', height: 24, paddingHorizontal: 8,
    borderRadius: 8, backgroundColor: '#E5E8FA',
    alignItems: 'center', justifyContent: 'center',
  },
  diseaseTagText: { fontSize: 12, fontWeight: '300', color: '#39438D' },

  emptyCard: {
    flex: 1, backgroundColor: '#FFFFFF', borderRadius: 16,
    borderWidth: 1, borderColor: '#E8E8E8',
    paddingHorizontal: 16, paddingVertical: 24, gap: 16,
    alignItems: 'center', justifyContent: 'center',
  },
  emptyTitle: { fontSize: 16, fontWeight: '500', color: '#181818', lineHeight: 16 * 1.4 },
  emptyBody: { fontSize: 16, fontWeight: '300', color: '#717171', lineHeight: 16 * 1.4, textAlign: 'center' },
});
