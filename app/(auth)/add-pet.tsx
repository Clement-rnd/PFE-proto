import { View, Text, Pressable, ScrollView, StyleSheet, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { ImageAdd02Icon, ArrowDown01Icon, ArrowLeft01Icon } from '@hugeicons/core-free-icons';
import Svg, { Defs, ClipPath, Path, Image as SvgImage } from 'react-native-svg';
import { getSvgPath, SquircleView } from 'react-native-figma-squircle';
import { Textfield } from '../../src/components/ui/Textfield';
import { Button } from '../../src/components/ui/Button';
import { Chip } from '../../src/components/ui/Chip';
import { BottomSheet } from '../../src/components/ui/BottomSheet';
import { RacePicker } from '../../src/components/ui/RacePicker';
import { PhotoPickerSheet } from '../../src/components/ui/PhotoPickerSheet';
import { addPet, getPets } from '../../src/data/petStore';
import { formatDate, isDateComplete } from '../../src/utils/date';
import { colors } from '../../src/theme/colors';
import { ScreenBackground } from '../../src/components/ui/ScreenBackground';
import { AnimatedEntry } from '../../src/components/ui/AnimatedEntry';

const AVATAR_SIZE = 80;
const AVATAR_INNER = AVATAR_SIZE - 1;
const AVATAR_PATH = getSvgPath({ width: AVATAR_INNER, height: AVATAR_INNER, cornerRadius: 15.5, cornerSmoothing: 1 });

const SPECIES = ['Chien', 'Chat', 'Lapin', 'Cochon d\'Inde', 'Hamster', 'Oiseau', 'Reptile', 'Poisson', 'Autre'];
const SEX_OPTIONS = ['Femelle', 'Mâle', 'Inconnu'];
const STERILIZED_OPTIONS = ['Oui', 'Non', 'Inconnu'];

const DROPDOWN_WEB = { backgroundColor: '#FFFFFF', borderRadius: 8, borderWidth: 1, borderColor: '#E8E8E8' };

export default function AddPetScreen() {
  const insets = useSafeAreaInsets();
  const { returnBack } = useLocalSearchParams<{ returnBack?: string }>();
  const hasPets = getPets().length > 0;
  const [name, setName] = useState('');
  const [species, setSpecies] = useState('');
  const [sex, setSex] = useState('');
  const [sterilized, setSterilized] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [speciesPickerOpen, setSpeciesPickerOpen] = useState(false);
  const [racePickerOpen, setRacePickerOpen] = useState(false);
  const [races, setRaces] = useState<string[]>([]);
  const [photoPickerOpen, setPhotoPickerOpen] = useState(false);
  const [photoUri, setPhotoUri] = useState<string | null>(null);

  const isValid = name.trim().length > 0 && species.length > 0 && sex.length > 0 && sterilized.length > 0
    && (birthDate.length === 0 || isDateComplete(birthDate));

  function handleSubmit() {
    addPet({ name, species, races, sex, sterilized, birthDate });
    if (returnBack === '1') {
      router.back();
    } else {
      router.push('/(auth)/my-pets');
    }
  }

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <ScreenBackground />
      <AnimatedEntry delay={0}>
        <View style={styles.titleRow}>
          <Pressable onPress={() => router.back()} hitSlop={12}>
            <HugeiconsIcon icon={ArrowLeft01Icon} size={28} color={colors.neutral[900]} strokeWidth={1.5} />
          </Pressable>
          <Text style={styles.title}>Ajoutez votre animal</Text>
          {!hasPets && (
            <Pressable onPress={() => router.push('/(auth)/my-pets')} hitSlop={12}>
              <Text style={styles.skipLink}>Passer</Text>
            </Pressable>
          )}
        </View>
      </AnimatedEntry>

      <AnimatedEntry delay={100} style={{ flex: 1 }}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 30 }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.description}>
          Ajoutez votre animal pour gérer les rendez-vous et les dossiers de santé.
        </Text>

        {/* Avatar */}
        <View style={styles.avatarSection}>
          <Pressable onPress={() => setPhotoPickerOpen(true)}>
            {Platform.OS === 'web' ? (
              <View style={styles.avatarWeb}>
                {photoUri
                  ? <Image source={{ uri: photoUri }} style={styles.avatarWebImage} resizeMode="cover" />
                  : <HugeiconsIcon icon={ImageAdd02Icon} size={24} color={colors.neutral[400]} strokeWidth={1.5} />
                }
              </View>
            ) : (
              <>
                <Svg width={AVATAR_SIZE} height={AVATAR_SIZE}>
                  <Defs>
                    <ClipPath id="avatar-squircle-add">
                      <Path d={AVATAR_PATH} transform="translate(0.5 0.5)" />
                    </ClipPath>
                  </Defs>
                  <Path d={AVATAR_PATH} transform="translate(0.5 0.5)" fill="#FFFFFF" stroke="#E8E8E8" strokeWidth={1} />
                  {photoUri && (
                    <SvgImage
                      href={photoUri}
                      width={AVATAR_SIZE}
                      height={AVATAR_SIZE}
                      clipPath="url(#avatar-squircle-add)"
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
              </>
            )}
          </Pressable>
          <Text style={styles.avatarLabel}>{photoUri ? 'Modifier la photo' : 'Ajouter une photo'}</Text>
        </View>

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
            <Pressable
              onPress={() => setSpeciesPickerOpen(true)}
              style={[styles.dropdown, Platform.OS === 'web' && DROPDOWN_WEB]}
            >
              {Platform.OS !== 'web' && (
                <SquircleView
                  squircleParams={{ cornerRadius: 8, cornerSmoothing: 1, fillColor: '#FFFFFF', strokeColor: '#E8E8E8', strokeWidth: 1 }}
                  style={StyleSheet.absoluteFillObject}
                  pointerEvents="none"
                />
              )}
              <Text style={[styles.dropdownText, !species && styles.dropdownPlaceholder]}>
                {species || 'Choisir une espèce'}
              </Text>
              <HugeiconsIcon icon={ArrowDown01Icon} size={24} color={colors.neutral[400]} strokeWidth={1.5} />
            </Pressable>
          </View>

          <View style={styles.fieldWrapper}>
            <Text style={styles.fieldLabel}>Race</Text>
            <Pressable
              onPress={() => setRacePickerOpen(true)}
              style={[styles.dropdown, Platform.OS === 'web' && DROPDOWN_WEB]}
            >
              {Platform.OS !== 'web' && (
                <SquircleView
                  squircleParams={{ cornerRadius: 8, cornerSmoothing: 1, fillColor: '#FFFFFF', strokeColor: '#E8E8E8', strokeWidth: 1 }}
                  style={StyleSheet.absoluteFillObject}
                  pointerEvents="none"
                />
              )}
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
      </KeyboardAvoidingView>
      </AnimatedEntry>

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

      <BottomSheet visible={speciesPickerOpen} onClose={() => setSpeciesPickerOpen(false)}>
        <View style={styles.pickerSheet}>
          <Text style={styles.pickerTitle}>Choisir une espèce</Text>
          {SPECIES.map(opt => (
            <Pressable
              key={opt}
              onPress={() => { setSpecies(opt); setSpeciesPickerOpen(false); }}
              style={[
                styles.pickerRow,
                Platform.OS === 'web' && opt === species && { backgroundColor: colors.primary[50], borderRadius: 8 },
              ]}
            >
              {Platform.OS !== 'web' && opt === species && (
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
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    height: 44,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  title: { fontSize: 20, fontWeight: '500', color: '#181818', flex: 1 },
  description: {
    fontSize: 16,
    fontWeight: '300',
    color: '#4F4F4F',
    lineHeight: 16 * 1.4,
  },
  avatarSection: { alignItems: 'center', gap: 8 },
  avatarWeb: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8E8E8',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarWebImage: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
  },
  avatarIconWrap: {
    flex: 1,
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
  pickerSheet: { paddingHorizontal: 16, paddingBottom: 32, gap: 4 },
  pickerTitle: {
    fontSize: 16, fontWeight: '600', color: '#181818',
    paddingVertical: 12, textAlign: 'center',
  },
  pickerRow: { paddingVertical: 16, paddingHorizontal: 8 },
  pickerRowText: { fontSize: 16, fontWeight: '300', color: '#181818' },
  pickerRowTextSelected: { color: colors.primary.DEFAULT, fontWeight: '500' },
  cancelLink: { alignItems: 'center', paddingVertical: 8 },
  cancelLinkText: { fontSize: 16, fontWeight: '500', color: '#181818' },
  skipLink: { fontSize: 16, fontWeight: '300', color: colors.neutral[500] },
});
