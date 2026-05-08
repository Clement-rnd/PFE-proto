import { View, Text, Pressable, ScrollView, StyleSheet, Animated, Dimensions, Easing } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useState, useRef } from 'react';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { ArrowLeft01Icon, ArrowRight01Icon, HelpCircleIcon } from '@hugeicons/core-free-icons';
import { AppIcon } from '../../src/components/ui/AppIcon';
import { TRAITEMENTS, type TreatmentStatus } from '../../src/data/traitementsData';
import { colors } from '../../src/theme/colors';
import { AnimatedEntry } from '../../src/components/ui/AnimatedEntry';
import { ScreenBackground } from '../../src/components/ui/ScreenBackground';

const SLIDE_DISTANCE = Dimensions.get('window').width;

const STATUS_STYLES: Record<TreatmentStatus, { bg: string; text: string; label: string }> = {
  active:   { bg: '#E5FAF5', text: '#1D745F', label: 'En cours' },
  upcoming: { bg: '#E5E8FA', text: '#39438D', label: 'À venir' },
  finished: { bg: '#F5F5F5', text: '#4F4F4F', label: 'Terminé' },
  paused:   { bg: '#FCEEE3', text: '#EA863E', label: 'Suspendu' },
};

const ACTIVE_ORDER: TreatmentStatus[] = ['active', 'upcoming', 'paused'];
const ACTIVE_SECTION_LABELS: Partial<Record<TreatmentStatus, string>> = {
  active:   'En cours',
  upcoming: 'À venir',
  paused:   'Suspendus',
};

export default function TraitementsScreen() {
  const [tab, setTab] = useState(0);
  const [segContainerWidth, setSegContainerWidth] = useState(0);
  const segAnim = useRef(new Animated.Value(0)).current;
  const contentTranslateX = useRef(new Animated.Value(0)).current;
  const segWidth = segContainerWidth > 0 ? (segContainerWidth - 16) / 2 : 0;
  const pillTranslateX = segAnim.interpolate({ inputRange: [0, 1], outputRange: [0, segWidth + 8] });

  function switchTab(index: number) {
    if (index === tab) return;
    const direction = index > tab ? 1 : -1;
    Animated.spring(segAnim, { toValue: index, useNativeDriver: true, damping: 32, stiffness: 180 }).start();
    Animated.timing(contentTranslateX, {
      toValue: direction * -SLIDE_DISTANCE,
      duration: 210,
      easing: Easing.inOut(Easing.quad),
      useNativeDriver: true,
    }).start(() => {
      contentTranslateX.setValue(direction * SLIDE_DISTANCE);
      setTab(index);
      Animated.timing(contentTranslateX, {
        toValue: 0,
        duration: 260,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }).start();
    });
  }

  const activeItems = TRAITEMENTS.filter(t => t.status === 'active' || t.status === 'upcoming' || t.status === 'paused');
  const expiredItems = TRAITEMENTS.filter(t => t.status === 'finished');

  const activeGroups = ACTIVE_ORDER.map(status => ({
    status,
    items: activeItems.filter(t => t.status === status),
  })).filter(g => g.items.length > 0);

  const yearGroups: { year: number; items: typeof expiredItems }[] = [];
  for (const t of expiredItems) {
    const y = t.year ?? 0;
    const existing = yearGroups.find(g => g.year === y);
    if (existing) existing.items.push(t);
    else yearGroups.push({ year: y, items: [t] });
  }
  yearGroups.sort((a, b) => b.year - a.year);

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
      <ScreenBackground />

      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <HugeiconsIcon icon={ArrowLeft01Icon} size={28} color={colors.neutral[900]} strokeWidth={1.5} />
        </Pressable>
        <Text style={styles.title}>Traitements</Text>
        <View style={{ width: 28 }} />
      </View>

      <View style={styles.segmentWrapper}>
        <View
          style={styles.segmented}
          onLayout={(e) => setSegContainerWidth(e.nativeEvent.layout.width)}
        >
          {segWidth > 0 && (
            <Animated.View style={[styles.segmentPill, { width: segWidth, transform: [{ translateX: pillTranslateX }] }]} />
          )}
          <Pressable style={styles.segment} onPress={() => switchTab(0)}>
            <Text style={[styles.segmentLabel, tab === 0 && styles.segmentLabelActive]}>En cours</Text>
          </Pressable>
          <Pressable style={styles.segment} onPress={() => switchTab(1)}>
            <Text style={[styles.segmentLabel, tab === 1 && styles.segmentLabelActive]}>Expiré</Text>
          </Pressable>
        </View>
      </View>

      <AnimatedEntry delay={80} style={{ flex: 1 }}>
        <View style={styles.contentClip}>
          <Animated.View style={[styles.contentSlide, { transform: [{ translateX: contentTranslateX }] }]}>
        {tab === 0 ? (
          activeItems.length > 0 ? (
            <ScrollView
              key="active"
              style={styles.scroll}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              {activeGroups.map(group => {
                const tag = STATUS_STYLES[group.status];
                return (
                  <View key={group.status} style={styles.group}>
                    <Text style={styles.groupLabel}>{ACTIVE_SECTION_LABELS[group.status]}</Text>
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
                            <Text style={styles.name} numberOfLines={1}>{t.name} · {t.posologie}</Text>
                            <View style={styles.meta}>
                              <View style={[styles.statusTag, { backgroundColor: tag.bg }]}>
                                <Text style={[styles.statusTagText, { color: tag.text }]}>{tag.label}</Text>
                              </View>
                              <Text style={styles.metaDot}>·</Text>
                              <View style={styles.tagPet}>
                                <Text style={styles.tagPetText}>{t.petName}</Text>
                              </View>
                              {t.daysInfo && <Text style={styles.subtitle}>· {t.daysInfo}</Text>}
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
          ) : (
            <ScrollView
              style={styles.scroll}
              contentContainerStyle={[styles.scrollContent, { flexGrow: 1 }]}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.alertBanner}>
                <HugeiconsIcon icon={HelpCircleIcon} size={16} color="#39438D" strokeWidth={1.5} />
                <Text style={styles.alertText}>
                  Seul votre vétérinaire peut renseigner les traitements de vos animaux.
                </Text>
              </View>
              <View style={styles.emptyCenter}>
                <Text style={styles.emptyText}>Aucun traitement en cours</Text>
              </View>
            </ScrollView>
          )
        ) : (
          expiredItems.length > 0 ? (
            <ScrollView
              key="expired"
              style={styles.scroll}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              {yearGroups.map(group => (
                <View key={group.year} style={styles.group}>
                  <Text style={styles.groupLabel}>{group.year}</Text>
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
                          <Text style={styles.name} numberOfLines={1}>{t.name} · {t.posologie}</Text>
                          <View style={styles.meta}>
                            <View style={styles.tagPet}>
                              <Text style={styles.tagPetText}>{t.petName}</Text>
                            </View>
                            {t.dateRange && <Text style={styles.subtitle}>· {t.dateRange}</Text>}
                          </View>
                        </View>
                        <HugeiconsIcon icon={ArrowRight01Icon} size={20} color={colors.neutral[400]} strokeWidth={1.5} />
                      </Pressable>
                    ))}
                  </View>
                </View>
              ))}
            </ScrollView>
          ) : (
            <View style={styles.emptyCenter}>
              <Text style={styles.emptyText}>Aucun traitement expiré</Text>
            </View>
          )
        )}
          </Animated.View>
        </View>
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
  segmentWrapper: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 },
  segmented: {
    flexDirection: 'row',
    backgroundColor: '#EDEDED',
    borderRadius: 8,
    padding: 4,
    height: 56,
    gap: 8,
  },
  segmentPill: {
    position: 'absolute',
    top: 4, left: 4, bottom: 4,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  segment: { flex: 1, alignItems: 'center', justifyContent: 'center', borderRadius: 6 },
  segmentLabel: { fontSize: 16, fontWeight: '300', color: '#717171' },
  segmentLabelActive: { color: '#181818' },
  contentClip: { flex: 1, overflow: 'hidden' },
  contentSlide: { flex: 1 },
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
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 8,
    elevation: 3,
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
  metaDot: { fontSize: 12, fontWeight: '300', color: '#B2B2B2' },
  tagPet: {
    height: 20,
    paddingHorizontal: 6,
    borderRadius: 6,
    backgroundColor: '#FCEEF1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tagPetText: { fontSize: 12, fontWeight: '300', color: '#FF5A7D' },

  emptyCenter: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyText: { fontSize: 16, fontWeight: '300', color: '#717171' },
});
