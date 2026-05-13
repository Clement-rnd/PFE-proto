import { View, Text, FlatList, Pressable, StyleSheet, Dimensions } from 'react-native';
import { useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { Search01Icon, Tick01Icon } from '@hugeicons/core-free-icons';
import { BottomSheet } from './BottomSheet';
import { Textfield } from './Textfield';
import { Button } from './Button';
import { colors } from '../../theme/colors';

const BREEDS = [
  'Akita', 'Berger allemand', 'Berger australien', 'Berger belge', 'Basset Hound',
  'Beagle', 'Bichon frisé', 'Border Collie', 'Bouledogue français', 'Bouvier bernois',
  'Boxer', 'Braque de Weimar', 'Caniche', 'Cavalier King Charles', 'Chihuahua',
  'Chow-Chow', 'Cocker Spaniel', 'Dalmatien', 'Dobermann', 'Dogue de Bordeaux',
  'Golden Retriever', 'Husky sibérien', 'Jack Russell', 'Labrador', 'Leonberg',
  'Lhassa Apso', 'Malinois belge', 'Maltais', 'Mastiff', 'Montagne des Pyrénées',
  'Pinscher nain', 'Pointer', 'Rottweiler', 'Saint-Bernard', 'Samoyède',
  'Setter irlandais', 'Shiba Inu', 'Shih Tzu', 'Spitz nain', 'Teckel',
  'Yorkshire Terrier',
];

const MAX_SELECTION = 2;
const UNKNOWN = 'Race inconnue';

interface RacePickerProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (races: string[]) => void;
  initial: string[];
}

function CheckboxItem({
  label,
  checked,
  onPress,
  disabled,
}: {
  label: string;
  checked: boolean;
  onPress: () => void;
  disabled: boolean;
}) {
  const isDisabled = disabled && !checked;
  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={[styles.row, isDisabled && styles.rowDisabled]}
    >
      <View style={[styles.checkbox, checked && styles.checkboxChecked, isDisabled && styles.checkboxDisabled]}>
        {checked && <HugeiconsIcon icon={Tick01Icon} size={12} color="#FFFFFF" strokeWidth={2.5} />}
      </View>
      <Text style={[styles.rowLabel, checked && styles.rowLabelSelected, isDisabled && styles.rowLabelDisabled]}>
        {label}
      </Text>
    </Pressable>
  );
}

const SCREEN_HEIGHT = Dimensions.get('screen').height;

export function RacePicker({ visible, onClose, onConfirm, initial }: RacePickerProps) {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<string[]>(initial);

  const filtered = BREEDS.filter(b =>
    b.toLowerCase().includes(search.toLowerCase())
  );

  function toggle(breed: string) {
    setSelected(prev => {
      if (prev.includes(breed)) return prev.filter(b => b !== breed);
      if (prev.length >= MAX_SELECTION) return prev;
      return [...prev, breed];
    });
  }

  function handleConfirm() {
    onConfirm(selected);
    setSearch('');
    onClose();
  }

  const atMax = selected.length >= MAX_SELECTION || selected.includes(UNKNOWN);

  return (
    <BottomSheet visible={visible} onClose={onClose} snapHeight={SCREEN_HEIGHT * 0.9}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Sélectionner une race</Text>
        </View>

        <Textfield
          placeholder="Rechercher une race..."
          value={search}
          onChangeText={setSearch}
          leftSlot={
            <HugeiconsIcon icon={Search01Icon} size={18} color={colors.neutral[400]} strokeWidth={1.5} />
          }
        />

        <FlatList
          data={filtered}
          keyExtractor={item => item}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          ListHeaderComponent={
            (search === '' || filtered.length === 0) ? (
              <>
                <CheckboxItem
                  label={UNKNOWN}
                  checked={selected.includes(UNKNOWN)}
                  onPress={() => toggle(UNKNOWN)}
                  disabled={atMax}
                />
                <View style={styles.separator} />
              </>
            ) : null
          }
          renderItem={({ item }) => (
            <CheckboxItem
              label={item}
              checked={selected.includes(item)}
              onPress={() => toggle(item)}
              disabled={atMax}
            />
          )}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />

        <Button
          label="Valider"
          onPress={handleConfirm}
          disabled={selected.length === 0}
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#181818',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 10,
    gap: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: colors.primary.DEFAULT,
    borderColor: colors.primary.DEFAULT,
  },
  rowDisabled: {
    opacity: 0.35,
  },
  checkboxDisabled: {
    borderColor: '#D0D0D0',
  },
  rowLabel: {
    fontSize: 15,
    fontWeight: '300',
    color: '#181818',
    flex: 1,
  },
  rowLabelSelected: {
    fontWeight: '500',
    color: colors.primary.DEFAULT,
  },
  rowLabelDisabled: {
    color: '#717171',
  },
  separator: {
    height: 1,
    backgroundColor: colors.neutral[100],
    marginHorizontal: 10,
  },
});
