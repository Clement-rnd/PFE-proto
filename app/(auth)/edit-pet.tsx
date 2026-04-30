import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { SquircleView } from 'react-native-figma-squircle';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { ArrowLeft01Icon, ArrowDown01Icon, Calendar04Icon, ImageAdd02Icon } from '@hugeicons/core-free-icons';
import { Textfield } from '../../src/components/ui/Textfield';
import { Button } from '../../src/components/ui/Button';
import { Chip } from '../../src/components/ui/Chip';
import { BottomSheet } from '../../src/components/ui/BottomSheet';
import { RacePicker } from '../../src/components/ui/RacePicker';
import { getPets, updatePet, deletePet } from '../../src/data/petStore';
import { formatDate } from '../../src/utils/date';
import { colors } from '../../src/theme/colors';
import { ScreenBackground } from '../../src/components/ui/ScreenBackground';

const SPECIES = ['Chien', 'Chat', 'Lapin', "Cochon d'Inde", 'Hamster', 'Oiseau', 'Reptile', 'Poisson', 'Autre'];
const SEX_OPTIONS = ['Femelle', 'Mâle', 'Inconnu'];
const STERILIZED_OPTIONS = ['Oui', 'Non', 'Inconnu'];

export default function EditPetScreen() {
  const { index } = useLocalSearchParams<{ index: string }>();
  const petIndex = parseInt(index ?? '0', 10);
  const original = getPets()[petIndex];

  const [name, setName] = useState(original?.name ?? '');
  const [species, setSpecies] = useState(original?.species ?? '');
  const [races, setRaces] = useState<string[]>(original?.races ?? []);
  const [sex, setSex] = useState(original?.sex ?? '');
  const [sterilized, setSterilized] = useState(original?.sterilized ?? '');
  const [birthDate, setBirthDate] = useState(original?.birthDate ?? '');
  const [speciesPickerOpen, setSpeciesPickerOpen] = useState(false);
  const [racePickerOpen, setRacePickerOpen] = useState(false);
  const [deleteSheetOpen, setDeleteSheetOpen] = useState(false);

  const isValid = name.trim().length > 0 && species.length > 0 && sex.length > 0 && sterilized.length > 0;

  function handleConfirm() {
    if (!isValid) return;
    updatePet(petIndex, { name, species, races, sex, sterilized, birthDate });
    router.back();
  }

  function handleDelete() {
    setDeleteSheetOpen(false);
    deletePet(petIndex);
    // Wait for the sheet close animation before navigating so useFocusEffect fires cleanly
    setTimeout(() => router.back(), 300);
  }

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
      <ScreenBackground />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} hitSlop={12}>
            <HugeiconsIcon icon={ArrowLeft01Icon} size={28} color={colors.neutral[900]} strokeWidth={1.5} />
          </Pressable>
          <Text style={styles.title}>Modifier votre animal</Text>
          <Pressable onPress={handleConfirm} disabled={!isValid} hitSlop={8}>
            <Text style={[styles.confirm, !isValid && styles.confirmDisabled]}>Confirmer</Text>
          </Pressable>
        </View>

        {/* Photo */}
        <View style={styles.avatarSection}>
          <Pressable style={styles.avatar}>
            <SquircleView
              squircleParams={{ cornerRadius: 16, cornerSmoothing: 1, fillColor: '#E8E8E8' }}
              style={StyleSheet.absoluteFillObject}
              pointerEvents="none"
            />
            <SquircleView
              squircleParams={{ cornerRadius: 16, cornerSmoothing: 1, fillColor: 'rgba(0,0,0,0.3)' }}
              style={StyleSheet.absoluteFillObject}
              pointerEvents="none"
            />
            <View style={styles.avatarIcon}>
              <HugeiconsIcon icon={ImageAdd02Icon} size={20} color="#FFFFFF" strokeWidth={1.5} />
            </View>
          </Pressable>
          <Text style={styles.avatarLabel}>Modifier la photo</Text>
        </View>

        {/* Champs */}
        <View style={styles.form}>
          <Textfield
            label="Nom de l'animal"
            required
            placeholder="Ajouter un nom"
            value={name}
            onChangeText={setName}
            returnKeyType="next"
          />

          <View style={styles.fieldWrapper}>
            <Text style={styles.fieldLabel}>
              Espèce<Text style={styles.asterisk}>*</Text>
            </Text>
            <Pressable onPress={() => setSpeciesPickerOpen(true)} style={styles.dropdown}>
              <SquircleView
                squircleParams={{ cornerRadius: 8, cornerSmoothing: 1, fillColor: '#FFFFFF', strokeColor: '#E8E8E8', strokeWidth: 1 }}
                style={StyleSheet.absoluteFillObject}
                pointerEvents="none"
              />
              <Text style={[styles.dropdownText, !species && styles.dropdownPlaceholder]}>
                {species || 'Choisir une espèce'}
              </Text>
              <HugeiconsIcon icon={ArrowDown01Icon} size={24} color={colors.neutral[400]} strokeWidth={1.5} />
            </Pressable>
          </View>

          <View style={styles.fieldWrapper}>
            <Text style={styles.fieldLabel}>Race</Text>
            <Pressable onPress={() => setRacePickerOpen(true)} style={styles.dropdown}>
              <SquircleView
                squircleParams={{ cornerRadius: 8, cornerSmoothing: 1, fillColor: '#FFFFFF', strokeColor: '#E8E8E8', strokeWidth: 1 }}
                style={StyleSheet.absoluteFillObject}
                pointerEvents="none"
              />
              <Text style={[styles.dropdownText, races.length === 0 && styles.dropdownPlaceholder]}>
                {races.length > 0 ? races.join(' · ') : 'Choisir une race'}
              </Text>
              <HugeiconsIcon icon={ArrowDown01Icon} size={24} color={colors.neutral[400]} strokeWidth={1.5} />
            </Pressable>
          </View>

          <View style={styles.fieldWrapper}>
            <Text style={styles.fieldLabel}>
              Sexe<Text style={styles.asterisk}>*</Text>
            </Text>
            <View style={styles.chips}>
              {SEX_OPTIONS.map(opt => (
                <Chip key={opt} label={opt} selected={sex === opt} onPress={() => setSex(opt)} />
              ))}
            </View>
          </View>

          <View style={styles.fieldWrapper}>
            <Text style={styles.fieldLabel}>
              Stérilisé ?<Text style={styles.asterisk}>*</Text>
            </Text>
            <View style={styles.chips}>
              {STERILIZED_OPTIONS.map(opt => (
                <Chip key={opt} label={opt} selected={sterilized === opt} onPress={() => setSterilized(opt)} />
              ))}
            </View>
          </View>

          <Textfield
            label="Date de naissance"
            placeholder="JJ/MM/AAAA"
            value={birthDate}
            onChangeText={t => setBirthDate(formatDate(t))}
            keyboardType="number-pad"
          />
        </View>

        {/* Supprimer */}
        <Pressable onPress={() => setDeleteSheetOpen(true)} style={styles.deleteLink}>
          <Text style={styles.deleteLinkText}>Supprimer mon animal</Text>
        </Pressable>
      </ScrollView>

      <RacePicker
        visible={racePickerOpen}
        onClose={() => setRacePickerOpen(false)}
        onConfirm={setRaces}
        initial={races}
      />

      <BottomSheet visible={speciesPickerOpen} onClose={() => setSpeciesPickerOpen(false)}>
        <View style={styles.pickerSheet}>
          <Text style={styles.pickerTitle}>Choisir une espèce</Text>
          {SPECIES.map(opt => (
            <Pressable
              key={opt}
              onPress={() => { setSpecies(opt); setSpeciesPickerOpen(false); }}
              style={styles.pickerRow}
            >
              {opt === species && (
                <SquircleView
                  squircleParams={{ cornerRadius: 8, cornerSmoothing: 1, fillColor: colors.primary[50] }}
                  style={StyleSheet.absoluteFillObject}
                  pointerEvents="none"
                />
              )}
              <Text style={[styles.pickerRowText, opt === species && styles.pickerRowTextSelected]}>{opt}</Text>
            </Pressable>
          ))}
        </View>
      </BottomSheet>

      <BottomSheet visible={deleteSheetOpen} onClose={() => setDeleteSheetOpen(false)}>
        <View style={styles.deleteSheet}>
          <Text style={styles.deleteTitle}>Supprimer mon animal ?</Text>
          <Text style={styles.deleteDesc}>
            Les informations que vous avez saisies pour cet animal seront supprimées.
          </Text>
          <Button label="Supprimer" onPress={handleDelete} variant="danger" />
          <Pressable onPress={() => setDeleteSheetOpen(false)} style={styles.cancelBtn} hitSlop={8}>
            <Text style={styles.cancelText}>Annuler</Text>
          </Pressable>
        </View>
      </BottomSheet>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: 'transparent' },
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 40,
    gap: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 44,
    gap: 8,
  },
  title: {
    flex: 1,
    fontSize: 20,
    fontWeight: '500',
    color: '#181818',
  },
  confirm: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.primary.DEFAULT,
  },
  confirmDisabled: {
    color: colors.neutral[300],
  },
  avatarSection: { alignItems: 'center', gap: 8 },
  avatar: {
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarIcon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarLabel: { fontSize: 14, fontWeight: '400', color: '#717171' },
  form: { gap: 16 },
  fieldWrapper: { gap: 8 },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '300',
    color: colors.neutral[700],
    lineHeight: 14 * 1.2,
  },
  asterisk: { color: colors.danger.DEFAULT },
  dropdown: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 8,
  },
  dropdownText: { flex: 1, fontSize: 16, fontWeight: '400', color: '#181818' },
  dropdownPlaceholder: { flex: 1, fontSize: 16, fontWeight: '300', color: '#B2B2B2' },
  chips: { flexDirection: 'row', gap: 16 },
  deleteLink: { alignItems: 'center', paddingVertical: 8 },
  deleteLinkText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.primary.DEFAULT,
  },
  pickerSheet: { paddingHorizontal: 16, paddingBottom: 32, gap: 4 },
  pickerTitle: {
    fontSize: 16, fontWeight: '600', color: '#181818',
    paddingVertical: 12, textAlign: 'center',
  },
  pickerRow: { paddingVertical: 16, paddingHorizontal: 8 },
  pickerRowText: { fontSize: 16, fontWeight: '300', color: '#181818' },
  pickerRowTextSelected: { color: colors.primary.DEFAULT, fontWeight: '500' },
  deleteSheet: {
    paddingHorizontal: 16,
    paddingBottom: 32,
    gap: 16,
  },
  deleteTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#181818',
    textAlign: 'center',
    paddingTop: 8,
  },
  deleteDesc: {
    fontSize: 16,
    fontWeight: '300',
    color: '#4F4F4F',
    lineHeight: 16 * 1.4,
    textAlign: 'center',
  },
  cancelBtn: { alignItems: 'center', paddingVertical: 8 },
  cancelText: { fontSize: 16, fontWeight: '500', color: '#181818' },
});
