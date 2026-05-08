import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { ArrowLeft01Icon, ArrowRight01Icon, HelpCircleIcon } from '@hugeicons/core-free-icons';
import { AppIcon } from '../../src/components/ui/AppIcon';
import { TRAITEMENTS, type TreatmentStatus } from '../../src/data/traitementsData';
import { colors } from '../../src/theme/colors';
import { AnimatedEntry } from '../../src/components/ui/AnimatedEntry';

const STATUS_STYLES: Record<TreatmentStatus, { bg: string; text: string; label: string }> = {
  active:   { bg: '#EDFAF2', text: '#52A76A', label: 'En cours' },
  finished: { bg: '#F5F5F5', text: '#4F4F4F', label: 'Terminé' },
  paused:   { bg: '#FFF8EC', text: '#F5A623', label: 'Suspendu' },
};

const STATUS_ORDER: TreatmentStatus[] = ['active', 'paused', 'finished'];

const SECTION_LABELS: Record<TreatmentStatus, string> = {
  active:   'Traitements en cours',
  paused:   'Traitements suspendus',
  finished: 'Traitements terminés',
};

const groups = STATUS_ORDER.map(status => ({
  status,
  items: TRAITEMENTS.filter(t => t.status === status),
})).filter(g => g.items.length > 0);

export default function TraitementsScreen() {
  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>

      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <HugeiconsIcon icon={ArrowLeft01Icon} size={28} color={colors.neutral[900]} strokeWidth={1.5} />
        </Pressable>
        <Text style={styles.title}>Traitements</Text>
        <View style={{ width: 28 }} />
      </View>

      {TRAITEMENTS.length > 0 ? (
        <AnimatedEntry delay={80} style={{ flex: 1 }}>
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.alertBanner}>
              <HugeiconsIcon icon={HelpCircleIcon} size={16} color="#39438D" strokeWidth={1.5} />
              <Text style={styles.alertText}>
                Seul votre vétérinaire peut renseigner les traitements de vos animaux.
              </Text>
            </View>

            {groups.map(group => {
              const tag = STATUS_STYLES[group.status];
              return (
                <View key={group.status} style={styles.group}>
                  <Text style={styles.groupLabel}>{SECTION_LABELS[group.status]}</Text>
                  <View style={styles.itemList}>
                    {group.items.map(t => (
                      <Pressable
                        key={t.id}
                        style={styles.row}
                        onPress={() => router.push({
                          pathname: '/(health)/traitement-detail',
                          params: { id: t.id, petIndex: String(t.petIndex) },
                        })}
                      >
                        <View style={styles.iconBox}>
                          <AppIcon icon={t.icon} size={20} color={colors.neutral[900]} strokeWidth={1.5} />
                        </View>
                        <View style={styles.content}>
                          <Text style={styles.name} numberOfLines={1}>{t.name}</Text>
                          <View style={styles.meta}>
                            <View style={[styles.statusTag, { backgroundColor: tag.bg }]}>
                              <Text style={[styles.statusTagText, { color: tag.text }]}>{tag.label}</Text>
                            </View>
                            <Text style={styles.subtitle}>· {t.petName} · Depuis {t.startDate}</Text>
                          </View>
                        </View>
                        <HugeiconsIcon icon={ArrowRight01Icon} size={20} color={colors.neutral[400]} strokeWidth={1.5} />
                      </Pressable>
                    ))}
                  </View>
                </View>
              );
            })}
          </ScrollView>
        </AnimatedEntry>
      ) : (
        <AnimatedEntry delay={80} style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={styles.emptyText}>Aucun traitement en cours</Text>
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

  group: { gap: 12 },
  groupLabel: { fontSize: 16, fontWeight: '500', color: '#717171', lineHeight: 16 * 1.4 },
  itemList: { gap: 8 },
  row: {
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
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: { flex: 1, gap: 8, justifyContent: 'center' },
  name: { fontSize: 16, fontWeight: '300', color: '#181818', lineHeight: 16 * 1.4 },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  statusTag: {
    height: 20,
    paddingHorizontal: 6,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusTagText: { fontSize: 12, fontWeight: '300', lineHeight: 12 * 1.4 },
  subtitle: { fontSize: 12, fontWeight: '300', color: '#B2B2B2', lineHeight: 12 * 1.4 },

  emptyText: { fontSize: 16, fontWeight: '300', color: '#717171' },
});
