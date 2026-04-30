import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import { useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { Search01Icon } from '@hugeicons/core-free-icons';
import { SquircleView } from 'react-native-figma-squircle';
import { BottomSheet } from './BottomSheet';
import { Textfield } from './Textfield';
import { FlagIcon } from './FlagIcon';
import { COUNTRIES } from '../../data/countries';
import type { Country } from '../../data/countries';
import { colors } from '../../theme/colors';

interface CountryPickerProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (country: Country & { flag: string }) => void;
  selected: Country & { flag: string };
  showDialCode?: boolean;
}

export function CountryPicker({ visible, onClose, onSelect, selected, showDialCode = true }: CountryPickerProps) {
  const { height } = useWindowDimensions();
  const [search, setSearch] = useState('');

  const france = COUNTRIES.find(c => c.code === 'FR') as Country & { flag: string };
  const isSearching = search.length > 0;

  const filtered = COUNTRIES.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    (showDialCode && c.dialCode.includes(search))
  ) as (Country & { flag: string })[];

  const listData = isSearching
    ? filtered
    : COUNTRIES.filter(c => c.code !== 'FR') as (Country & { flag: string })[];

  function handleSelect(country: Country & { flag: string }) {
    onSelect(country);
    setSearch('');
    onClose();
  }

  function renderRow(item: Country & { flag: string }) {
    const isSelected = item.code === selected.code;
    return (
      <Pressable
        onPress={() => handleSelect(item)}
        style={styles.row}
      >
        {isSelected && (
          <SquircleView
            squircleParams={{ cornerRadius: 8, cornerSmoothing: 1, fillColor: colors.primary[50] }}
            style={StyleSheet.absoluteFillObject}
            pointerEvents="none"
          />
        )}
        <View style={styles.flagBox}>
          <FlagIcon code={item.code} width={36} height={24} />
        </View>
        <Text style={styles.countryName}>{item.name}</Text>
        {showDialCode && <Text style={styles.dialCode}>{item.dialCode}</Text>}
      </Pressable>
    );
  }

  return (
    <BottomSheet visible={visible} onClose={onClose} snapHeight={height * 0.9}>
      <View style={styles.container}>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>
            {showDialCode ? 'Indicatif de votre pays' : 'Votre pays'}
          </Text>
          <Text style={styles.description}>
            {showDialCode
              ? 'Sélectionnez le pays correspondant à votre numéro de téléphone.'
              : 'Sélectionnez votre pays de résidence.'}
          </Text>
        </View>

        <Textfield
          placeholder="Rechercher un pays..."
          value={search}
          onChangeText={setSearch}
          leftSlot={
            <HugeiconsIcon
              icon={Search01Icon}
              size={18}
              color={colors.neutral[400]}
              strokeWidth={1.5}
            />
          }
        />

        <FlatList
          data={listData}
          keyExtractor={item => item.code}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          ListHeaderComponent={
            !isSearching ? (
              <>
                {renderRow(france)}
                <View style={styles.favSeparator}>
                  <View style={styles.separator} />
                </View>
              </>
            ) : null
          }
          renderItem={({ item }) => renderRow(item)}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 24,
    gap: 12,
  },
  header: {
    gap: 4,
    paddingVertical: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#181818',
  },
  description: {
    fontSize: 14,
    fontWeight: '300',
    color: colors.neutral[500],
    lineHeight: 14 * 1.5,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 10,
    gap: 12,
  },
  // Flag/Large DS : 36×24, borderRadius 3, overflow hidden
  flagBox: {
    width: 36,
    height: 24,
    borderRadius: 3,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  countryName: {
    flex: 1,
    fontSize: 15,
    fontWeight: '300',
    color: '#181818',
  },
  dialCode: {
    fontSize: 14,
    fontWeight: '300',
    color: colors.neutral[500],
  },
  separator: {
    height: 1,
    backgroundColor: colors.neutral[100],
    marginHorizontal: 10,
  },
  favSeparator: {
    paddingVertical: 8,
  },
});
