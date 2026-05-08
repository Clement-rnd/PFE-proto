import { View, Text, Pressable, ScrollView, TextInput, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { ArrowLeft01Icon, ArrowRight01Icon, HelpCircleIcon, Search01Icon } from '@hugeicons/core-free-icons';
import { AppIcon } from '../../src/components/ui/AppIcon';
import { usePets } from '../../src/data/petStore';
import { DOCUMENTS, DOC_TYPE_STYLE, DOC_STATUS_STYLE, type DocumentType } from '../../src/data/documentsData';
import { colors } from '../../src/theme/colors';
import { AnimatedEntry } from '../../src/components/ui/AnimatedEntry';
import { ScreenBackground } from '../../src/components/ui/ScreenBackground';

const FILTERS: { label: string; type: DocumentType | null }[] = [
  { label: 'Tout',           type: null },
  { label: 'Ordonnances',    type: 'ordonnance' },
  { label: 'Analyses',       type: 'analyse' },
  { label: 'Comptes-rendus', type: 'compte-rendu' },
];

export default function AnimalDocumentsScreen() {
  const { index } = useLocalSearchParams<{ index?: string }>();
  const petIndex = parseInt(index ?? '0', 10);
  const pets = usePets();
  const pet = pets[petIndex];
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState<DocumentType | null>(null);

  if (!pet) return null;

  const petDocs = DOCUMENTS.filter(d => d.petIndex === petIndex);
  const hasData = petDocs.length > 0;

  const counts: Record<string, number> = {
    all: petDocs.length,
    ordonnance: petDocs.filter(d => d.type === 'ordonnance').length,
    analyse: petDocs.filter(d => d.type === 'analyse').length,
    'compte-rendu': petDocs.filter(d => d.type === 'compte-rendu').length,
  };

  const filtered = petDocs
    .filter(d => !activeFilter || d.type === activeFilter)
    .filter(d => !search || d.title.toLowerCase().includes(search.toLowerCase()));

  const years = [...new Set(filtered.map(d => d.year))].sort((a, b) => b - a);

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
      <ScreenBackground />

      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <HugeiconsIcon icon={ArrowLeft01Icon} size={28} color={colors.neutral[900]} strokeWidth={1.5} />
        </Pressable>
        <Text style={styles.title}>Documents de {pet.name}</Text>
        <View style={{ width: 28 }} />
      </View>

      <AnimatedEntry delay={80} style={{ flex: 1 }}>
        {!hasData ? (
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={[styles.scrollContent, { flexGrow: 1 }]}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.alertBanner}>
              <HugeiconsIcon icon={HelpCircleIcon} size={16} color="#39438D" strokeWidth={1.5} />
              <View style={{ flex: 1, gap: 8 }}>
                <Text style={styles.alertText}>Seul votre vétérinaire peut ajouter des documents concernant votre animal.</Text>
                <Text style={styles.alertText}>Pensez à prendre RDV pour un suivi régulier.</Text>
              </View>
            </View>
            <Text style={styles.emptyBody}>Votre vétérinaire n'a pas encore ajouté de documents concernant {pet.name}.</Text>
          </ScrollView>
        ) : (
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Search */}
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

            {/* Filter chips */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.chipsRow}
            >
              {FILTERS.map(f => {
                const isActive = activeFilter === f.type;
                const count = f.type === null ? counts.all : counts[f.type];
                return (
                  <Pressable
                    key={f.label}
                    style={[styles.chip, isActive && styles.chipActive]}
                    onPress={() => setActiveFilter(f.type)}
                  >
                    <Text style={[styles.chipLabel, isActive && styles.chipLabelActive]}>
                      {f.label} ({count})
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>

            {/* Year groups */}
            {years.map(year => {
              const yearDocs = filtered.filter(d => d.year === year);
              return (
                <View key={year} style={styles.group}>
                  <Text style={styles.groupLabel}>{year}</Text>
                  <View style={styles.docList}>
                    {yearDocs.map(doc => {
                      const typeStyle = DOC_TYPE_STYLE[doc.type];
                      const statusStyle = doc.status ? DOC_STATUS_STYLE[doc.status] : null;
                      return (
                        <Pressable
                          key={doc.id}
                          style={styles.row}
                          onPress={() => router.push({
                            pathname: '/(health)/animal-document-detail',
                            params: { id: doc.id, petIndex: String(petIndex) },
                          })}
                        >
                          <View style={styles.iconBox}>
                            <AppIcon icon={typeStyle.icon} size={20} color={colors.neutral[900]} strokeWidth={1.5} />
                          </View>
                          <View style={styles.rowContent}>
                            <Text style={styles.rowTitle} numberOfLines={1}>{doc.title}</Text>
                            <View style={styles.rowMeta}>
                              <View style={[styles.typeTag, { backgroundColor: typeStyle.bg }]}>
                                <Text style={[styles.typeTagText, { color: typeStyle.text }]}>{typeStyle.label}</Text>
                              </View>
                              {statusStyle && (
                                <View style={[styles.typeTag, { backgroundColor: statusStyle.bg }]}>
                                  <Text style={[styles.typeTagText, { color: statusStyle.text }]}>{statusStyle.label}</Text>
                                </View>
                              )}
                              <Text style={styles.rowDate}>· {doc.date}</Text>
                            </View>
                          </View>
                          <HugeiconsIcon icon={ArrowRight01Icon} size={20} color={colors.neutral[400]} strokeWidth={1.5} />
                        </Pressable>
                      );
                    })}
                  </View>
                </View>
              );
            })}
          </ScrollView>
        )}
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
  scrollContent: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 32, gap: 16 },

  // Search
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

  // Chips
  chipsRow: { gap: 8, flexDirection: 'row' },
  chip: {
    height: 32,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8E8E8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipActive: { backgroundColor: colors.primary.DEFAULT, borderColor: colors.primary.DEFAULT },
  chipLabel: { fontSize: 12, fontWeight: '300', color: '#4F4F4F' },
  chipLabelActive: { color: '#FFFFFF', fontWeight: '500' },

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

  // Empty
  emptyBody: { fontSize: 16, fontWeight: '300', color: '#717171', lineHeight: 16 * 1.4, textAlign: 'center', paddingHorizontal: 16 },

  // List
  group: { gap: 12 },
  groupLabel: { fontSize: 16, fontWeight: '500', color: '#717171', lineHeight: 16 * 1.4 },
  docList: { gap: 8 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 64,
    paddingLeft: 16,
    paddingRight: 8,
    paddingVertical: 10,
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
  rowContent: { flex: 1, gap: 6, justifyContent: 'center' },
  rowTitle: { fontSize: 16, fontWeight: '300', color: '#181818', lineHeight: 16 * 1.4 },
  rowMeta: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 4 },
  typeTag: {
    height: 20,
    paddingHorizontal: 6,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  typeTagText: { fontSize: 12, fontWeight: '300' },
  rowDate: { fontSize: 12, fontWeight: '300', color: '#B2B2B2' },
});
