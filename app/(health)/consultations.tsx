import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { ArrowLeft01Icon, ArrowRight01Icon } from '@hugeicons/core-free-icons';
import { AppIcon } from '../../src/components/ui/AppIcon';
import { CONSULTATIONS, type ConsultationStatus } from '../../src/data/consultationsData';
import { colors } from '../../src/theme/colors';
import { AnimatedEntry } from '../../src/components/ui/AnimatedEntry';

const STATUS_STYLES: Record<ConsultationStatus, { bg: string; text: string; label: string }> = {
  upcoming: { bg: '#E5E8FA', text: '#39438D', label: 'À venir' },
  done: { bg: '#F5F5F5', text: '#4F4F4F', label: 'Passée' },
};

const years = [...new Set(CONSULTATIONS.map(c => c.year))].sort((a, b) => b - a);
const groups = years.map(year => ({
  year,
  items: CONSULTATIONS.filter(c => c.year === year),
}));

export default function ConsultationsScreen() {
  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>

      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <HugeiconsIcon icon={ArrowLeft01Icon} size={28} color={colors.neutral[900]} strokeWidth={1.5} />
        </Pressable>
        <Text style={styles.title}>Consultations</Text>
        <View style={{ width: 28 }} />
      </View>

      {CONSULTATIONS.length > 0 ? (
        <AnimatedEntry delay={80} style={{ flex: 1 }}>
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {groups.map(group => (
              <View key={group.year} style={styles.yearGroup}>
                <Text style={styles.yearLabel}>{group.year}</Text>
                <View style={styles.consultationList}>
                  {group.items.map(consult => {
                    const tag = STATUS_STYLES[consult.status];
                    return (
                      <Pressable
                        key={consult.id}
                        style={styles.consultRow}
                        onPress={() => router.push({
                          pathname: '/(health)/consultation-detail',
                          params: { id: consult.id, petIndex: String(consult.petIndex) },
                        })}
                      >
                        <View style={styles.consultIconBox}>
                          <AppIcon icon={consult.icon} size={20} color={colors.neutral[900]} strokeWidth={1.5} />
                        </View>
                        <View style={styles.consultContent}>
                          <Text style={styles.consultName} numberOfLines={1}>
                            {consult.title} de {consult.petName}
                          </Text>
                          <View style={styles.consultMeta}>
                            <View style={[styles.statusTag, { backgroundColor: tag.bg }]}>
                              <Text style={[styles.statusTagText, { color: tag.text }]}>{tag.label}</Text>
                            </View>
                            <Text style={styles.consultDate}>· {consult.dateLabel}</Text>
                          </View>
                        </View>
                        <HugeiconsIcon icon={ArrowRight01Icon} size={20} color={colors.neutral[400]} strokeWidth={1.5} />
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            ))}
          </ScrollView>
        </AnimatedEntry>
      ) : (
        <AnimatedEntry delay={80} style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={styles.emptyText}>Aucune consultation</Text>
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
  title: { flex: 1, fontSize: 24, fontWeight: '500', color: '#181818' },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 32, gap: 24 },

  yearGroup: { gap: 12 },
  yearLabel: { fontSize: 16, fontWeight: '500', color: '#717171', lineHeight: 16 * 1.4 },
  consultationList: { gap: 8 },
  consultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 64,
    paddingLeft: 16,
    paddingRight: 8,
    gap: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  consultIconBox: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  consultContent: { flex: 1, gap: 8, justifyContent: 'center' },
  consultName: { fontSize: 16, fontWeight: '300', color: '#181818', lineHeight: 16 * 1.4 },
  consultMeta: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  statusTag: {
    height: 20,
    paddingHorizontal: 6,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusTagText: { fontSize: 12, fontWeight: '300', lineHeight: 12 * 1.4 },
  consultDate: { fontSize: 12, fontWeight: '300', color: '#B2B2B2', lineHeight: 12 * 1.4 },

  emptyText: { fontSize: 16, fontWeight: '300', color: '#717171', lineHeight: 16 * 1.4 },
});
