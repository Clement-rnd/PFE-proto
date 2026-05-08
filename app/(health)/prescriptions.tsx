import { View, Text, Pressable, ScrollView, TextInput, StyleSheet, Animated, Dimensions, Easing } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useState, useRef } from 'react';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { ArrowLeft01Icon, ArrowRight01Icon, HelpCircleIcon, Search01Icon } from '@hugeicons/core-free-icons';
import { AppIcon } from '../../src/components/ui/AppIcon';
import { DOCUMENTS, DOC_TYPE_STYLE } from '../../src/data/documentsData';
import { colors } from '../../src/theme/colors';
import { AnimatedEntry } from '../../src/components/ui/AnimatedEntry';
import { ScreenBackground } from '../../src/components/ui/ScreenBackground';

const SLIDE_DISTANCE = Dimensions.get('window').width;

export default function PrescriptionsScreen() {
  const [tab, setTab] = useState(0);
  const [search, setSearch] = useState('');
  const [segContainerWidth, setSegContainerWidth] = useState(0);
  const segAnim = useRef(new Animated.Value(0)).current;
  const contentTranslateX = useRef(new Animated.Value(0)).current;
  const segWidth = segContainerWidth > 0 ? (segContainerWidth - 16) / 2 : 0;
  const pillTranslateX = segAnim.interpolate({ inputRange: [0, 1], outputRange: [0, segWidth + 8] });

  function switchTab(i: number) {
    if (i === tab) return;
    const direction = i > tab ? 1 : -1;

    Animated.spring(segAnim, { toValue: i, useNativeDriver: true, damping: 32, stiffness: 180 }).start();

    Animated.timing(contentTranslateX, {
      toValue: direction * -SLIDE_DISTANCE,
      duration: 210,
      easing: Easing.inOut(Easing.quad),
      useNativeDriver: true,
    }).start(() => {
      contentTranslateX.setValue(direction * SLIDE_DISTANCE);
      setTab(i);
      setSearch('');
      Animated.timing(contentTranslateX, {
        toValue: 0,
        duration: 260,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }).start();
    });
  }

  const allOrdonnances = DOCUMENTS.filter(d => d.type === 'ordonnance');
  const activeItems = allOrdonnances.filter(d => d.status !== 'expired');
  const expiredItems = allOrdonnances.filter(d => d.status === 'expired');

  const filteredExpired = search
    ? expiredItems.filter(d => d.title.toLowerCase().includes(search.toLowerCase()))
    : expiredItems;

  const typeStyle = DOC_TYPE_STYLE['ordonnance'];

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
      <ScreenBackground />

      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <HugeiconsIcon icon={ArrowLeft01Icon} size={28} color={colors.neutral[900]} strokeWidth={1.5} />
        </Pressable>
        <Text style={styles.title}>Ordonnances</Text>
        <View style={{ width: 28 }} />
      </View>

      <AnimatedEntry delay={60}>
        <View style={styles.segmentWrapper}>
          <View
            style={styles.segmented}
            onLayout={(e) => setSegContainerWidth(e.nativeEvent.layout.width)}
          >
            {segWidth > 0 && (
              <Animated.View style={[styles.segmentPill, { width: segWidth, transform: [{ translateX: pillTranslateX }] }]} />
            )}
            <Pressable style={styles.segment} onPress={() => switchTab(0)}>
              <Text style={[styles.segmentLabel, tab === 0 && styles.segmentLabelActive]}>
                En cours ({activeItems.length})
              </Text>
            </Pressable>
            <Pressable style={styles.segment} onPress={() => switchTab(1)}>
              <Text style={[styles.segmentLabel, tab === 1 && styles.segmentLabelActive]}>
                Expirées ({expiredItems.length})
              </Text>
            </Pressable>
          </View>
        </View>
      </AnimatedEntry>

      {/* Zone clippée qui slide */}
      <View style={styles.contentClip}>
        <Animated.View style={[styles.contentSlide, { transform: [{ translateX: contentTranslateX }] }]}>
          {tab === 0 ? (
            activeItems.length > 0 ? (
              <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
              >
                <View style={styles.group}>
                  <Text style={styles.groupLabel}>En cours</Text>
                  <View style={styles.itemList}>
                    {activeItems.map(doc => (
                      <Pressable
                        key={doc.id}
                        style={styles.row}
                        onPress={() => router.push({
                          pathname: '/(health)/animal-document-detail',
                          params: { id: doc.id, petIndex: String(doc.petIndex) },
                        })}
                      >
                        <View style={styles.iconBox}>
                          <AppIcon icon={typeStyle.icon} size={20} color={colors.neutral[900]} strokeWidth={1.5} />
                        </View>
                        <View style={styles.content}>
                          <Text style={styles.name} numberOfLines={1}>{doc.title}</Text>
                          <View style={styles.meta}>
                            <View style={styles.tagActive}>
                              <Text style={styles.tagActiveText}>En cours</Text>
                            </View>
                            <Text style={styles.metaDot}>·</Text>
                            <View style={styles.tagPet}>
                              <Text style={styles.tagPetText}>{doc.petName}</Text>
                            </View>
                            <Text style={styles.metaDot}>·</Text>
                            <Text style={styles.metaDate}>{doc.date}</Text>
                          </View>
                        </View>
                        <HugeiconsIcon icon={ArrowRight01Icon} size={20} color={colors.neutral[400]} strokeWidth={1.5} />
                      </Pressable>
                    ))}
                  </View>
                </View>
              </ScrollView>
            ) : (
              <ScrollView
                style={styles.scroll}
                contentContainerStyle={[styles.scrollContent, { flexGrow: 1 }]}
                showsVerticalScrollIndicator={false}
              >
                <View style={styles.alertBanner}>
                  <HugeiconsIcon icon={HelpCircleIcon} size={16} color="#39438D" strokeWidth={1.5} />
                  <View style={{ flex: 1, gap: 8 }}>
                    <Text style={styles.alertText}>Seul votre vétérinaire peut ajouter les ordonnances concernant vos animaux.</Text>
                    <Text style={styles.alertText}>Pensez à prendre RDV pour un suivi régulier.</Text>
                  </View>
                </View>
                <Text style={styles.emptyText}>Votre vétérinaire n'a pas encore ajouté d'ordonnances concernant vos animaux.</Text>
              </ScrollView>
            )
          ) : (
            <>
              <View style={styles.searchWrapper}>
                <View style={styles.searchBar}>
                  <HugeiconsIcon icon={Search01Icon} size={24} color={colors.neutral[400]} strokeWidth={1.5} />
                  <TextInput
                    style={styles.searchInput}
                    placeholder="Rechercher"
                    placeholderTextColor="#B2B2B2"
                    value={search}
                    onChangeText={setSearch}
                  />
                </View>
              </View>

              {filteredExpired.length > 0 ? (
                <ScrollView
                  style={styles.scroll}
                  contentContainerStyle={styles.scrollContent}
                  showsVerticalScrollIndicator={false}
                >
                  <View style={styles.group}>
                    <Text style={styles.groupLabel}>Expirées</Text>
                    <View style={styles.itemList}>
                      {filteredExpired.map(doc => (
                        <Pressable
                          key={doc.id}
                          style={styles.row}
                          onPress={() => router.push({
                            pathname: '/(health)/animal-document-detail',
                            params: { id: doc.id, petIndex: String(doc.petIndex) },
                          })}
                        >
                          <View style={styles.iconBox}>
                            <AppIcon icon={typeStyle.icon} size={20} color={colors.neutral[900]} strokeWidth={1.5} />
                          </View>
                          <View style={styles.content}>
                            <Text style={styles.name} numberOfLines={1}>{doc.title}</Text>
                            <View style={styles.meta}>
                              <View style={styles.tagExpired}>
                                <Text style={styles.tagExpiredText}>expirée</Text>
                              </View>
                              <Text style={styles.metaDot}>·</Text>
                              <Text style={styles.metaDate}>{doc.date}</Text>
                            </View>
                          </View>
                          <HugeiconsIcon icon={ArrowRight01Icon} size={20} color={colors.neutral[400]} strokeWidth={1.5} />
                        </Pressable>
                      ))}
                    </View>
                  </View>
                </ScrollView>
              ) : (
                <View style={styles.emptyCenter}>
                  <Text style={styles.emptyText}>Aucune ordonnance expirée</Text>
                </View>
              )}
            </>
          )}
        </Animated.View>
      </View>
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

  // Segmented control
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

  // Slide zone
  contentClip: { flex: 1, overflow: 'hidden' },
  contentSlide: { flex: 1 },

  // Search
  searchWrapper: { paddingHorizontal: 16, paddingBottom: 8 },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    height: 56,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    paddingHorizontal: 16,
  },
  searchInput: { flex: 1, fontSize: 16, fontWeight: '300', color: '#181818' },

  // Scroll
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 32, gap: 24 },

  // Alert
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

  // Groups
  group: { gap: 12 },
  groupLabel: { fontSize: 16, fontWeight: '500', color: '#717171', lineHeight: 16 * 1.4 },
  itemList: { gap: 8 },

  // Row
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
  meta: { flexDirection: 'row', alignItems: 'center', gap: 4 },

  // Tags
  tagActive: {
    height: 24,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: '#E5FAF5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tagActiveText: { fontSize: 12, fontWeight: '300', color: '#1D745F' },
  tagPet: {
    height: 24,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: '#FCEEF1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tagPetText: { fontSize: 12, fontWeight: '300', color: '#FF5A7D' },
  tagExpired: {
    height: 24,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tagExpiredText: { fontSize: 12, fontWeight: '300', color: '#4F4F4F' },
  metaDot: { fontSize: 12, fontWeight: '300', color: '#B2B2B2' },
  metaDate: { fontSize: 12, fontWeight: '300', color: '#B2B2B2' },

  // Empty
  emptyCenter: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 },
  emptyText: { fontSize: 16, fontWeight: '300', color: '#717171', lineHeight: 16 * 1.4, textAlign: 'center' },
});
