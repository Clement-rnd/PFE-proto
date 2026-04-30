import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { ImageAdd02Icon, ArrowDown01Icon, Calendar04Icon } from '@hugeicons/core-free-icons';
import Svg, { Defs, ClipPath, Path, Image as SvgImage } from 'react-native-svg';
import { getSvgPath, SquircleView } from 'react-native-figma-squircle';
import { Textfield } from '../../src/components/ui/Textfield';
import { Button } from '../../src/components/ui/Button';
import { Chip } from '../../src/components/ui/Chip';
import { BottomSheet } from '../../src/components/ui/BottomSheet';
import { RacePicker } from '../../src/components/ui/RacePicker';
import { PhotoPickerSheet } from '../../src/components/ui/PhotoPickerSheet';
import { addPet, getPets } from '../../src/data/petStore';
import { formatDate } from '../../src/utils/date';
import { colors } from '../../src/theme/colors';
import { ScreenBackground } from '../../src/components/ui/ScreenBackground';

const AVATAR_SIZE = 80;
// Inset path by 0.5px so the 1px stroke stays fully within the SVG viewport
const AVATAR_INNER = AVATAR_SIZE - 1;
const AVATAR_PATH = getSvgPath({ width: AVATAR_INNER, height: AVATAR_INNER, cornerRadius: 15.5, cornerSmoothing: 1 });

const SPECIES = ['Chien', 'Chat', 'Lapin', 'Cochon d\'Inde', 'Hamster', 'Oiseau', 'Reptile', 'Poisson', 'Autre'];
const SEX_OPTIONS = ['Femelle', 'Mâle', 'Inconnu'];
const STERILIZED_OPTIONS = ['Oui', 'Non', 'Inconnu'];

export default function AddPetScreen() {
  const hasPets = getPets().length > 0;
  const [name, setName] = useState('');
  const [species, setSpecies] = useState('');
  const [race, setRace] = useState('');
  const [sex, setSex] = useState('');
  const [sterilized, setSterilized] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [speciesPickerOpen, setSpeciesPickerOpen] = useState(false);
  const [racePickerOpen, setRacePickerOpen] = useState(false);
  const [races, setRaces] = useState<string[]>([]);
  const [photoPickerOpen, setPhotoPickerOpen] = useState(false);
  const [photoUri, setPhotoUri] = useState<string | null>(null);

  const isValid = name.trim().length > 0 && species.length > 0 && sex.length > 0 && sterilized.length > 0;

  function handleSubmit() {
    addPet({ name, species, races, sex, sterilized, birthDate });
    router.push('/(auth)/my-pets');
  }

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
      <ScreenBackground />
      {/* Header fixe */}
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>Ajoutez votre animal</Text>
          {!hasPets && (
            <Pressable onPress={() => router.replace('/(tabs)/home')} hitSlop={8}>
              <Text style={styles.skip}>Passer</Text>
            </Pressable>
          )}
        </View>
        <Text style={styles.description}>
          Ajoutez votre animal pour gérer les rendez-vous et les dossiers de santé.
        </Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        automaticallyAdjustKeyboardInsets
      >
        {/* Avatar */}
        <View style={styles.avatarSection}>
          <Pressable onPress={() => setPhotoPickerOpen(true)}>
            <Svg width={AVATAR_SIZE} height={AVATAR_SIZE}>
              <Defs>
                <ClipPath id="avatar-squircle">
                  <Path d={AVATAR_PATH} transform="translate(0.5 0.5)" />
                </ClipPath>
              </Defs>
              <Path d={AVATAR_PATH} transform="translate(0.5 0.5)" fill="#FFFFFF" stroke="#E8E8E8" strokeWidth={1} />
              {photoUri && (
                <SvgImage
                  href={photoUri}
                  width={AVATAR_SIZE}
                  height={AVATAR_SIZE}
                  clipPath="url(#avatar-squircle)"
                  preserveAspectRatio="xMidYMid slice"
                />
              )}
            </Svg>
            {!photoUri && (
              <View style={StyleSheet.absoluteFill} pointerEvents="none">
                <View style={styles.avatarIconWrap}>
                  <HugeiconsIcon icon={ImageAdd02Icon} size={24} color={colors.neutral[400]} strokeWidth={1.5} />
                </View>
              </View>
            )}
          </Pressable>
          <Text style={styles.avatarLabel}>{photoUri ? 'Modifier la photo' : 'Ajouter une photo'}</Text>
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

          {/* Espèce — dropdown */}
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

          {/* Race — dropdown multi-sélection (max 2) */}
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

          {/* Sexe — chips */}
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

          {/* Stérilisé — chips */}
          <View style={styles.fieldWrapper}>
            <Text style={styles.fieldLabel}>
              Animal stérilisé<Text style={styles.asterisk}>*</Text>
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

        <Button label="Valider" onPress={handleSubmit} disabled={!isValid} />
        {hasPets && (
          <Pressable onPress={() => router.back()} style={styles.cancelLink} hitSlop={8}>
            <Text style={styles.cancelLinkText}>Annuler</Text>
          </Pressable>
        )}
      </ScrollView>

      <RacePicker
        visible={racePickerOpen}
        onClose={() => setRacePickerOpen(false)}
        onConfirm={setRaces}
        initial={races}
      />

      <PhotoPickerSheet
        visible={photoPickerOpen}
        onClose={() => setPhotoPickerOpen(false)}
        onPhoto={setPhotoUri}
      />

      {/* Picker espèce */}
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: 'transparent' },
  scroll: { flex: 1, backgroundColor: 'transparent' },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 40,
    gap: 24,
  },
  header: {
    gap: 4,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 44,
  },
  title: { fontSize: 20, fontWeight: '500', color: '#181818' },
  skip: { fontSize: 16, fontWeight: '400', color: '#181818' },
  description: {
    fontSize: 16,
    fontWeight: '300',
    color: '#4F4F4F',
    lineHeight: 16 * 1.4,
  },
  avatarSection: { alignItems: 'center', gap: 8 },
  avatarIconWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarLabel: {
    fontSize: 14,
    fontWeight: '400',
    color: '#717171',
  },
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
  pickerSheet: {
    paddingHorizontal: 16,
    paddingBottom: 32,
    gap: 4,
  },
  pickerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#181818',
    paddingVertical: 12,
    textAlign: 'center',
  },
  pickerRow: {
    paddingVertical: 16,
    paddingHorizontal: 8,
  },
  pickerRowText: { fontSize: 16, fontWeight: '300', color: '#181818' },
  pickerRowTextSelected: { color: colors.primary.DEFAULT, fontWeight: '500' },
  cancelLink: { alignItems: 'center', paddingVertical: 8 },
  cancelLinkText: { fontSize: 16, fontWeight: '500', color: '#181818' },
});
