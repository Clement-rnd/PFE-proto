import {
  View, Text, Pressable, ScrollView, StyleSheet, Image,
  Platform, Modal, KeyboardAvoidingView,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react-native';
import {
  ArrowLeft01Icon, ArrowDown01Icon, ImageAdd02Icon, CloudUploadIcon,
} from '@hugeicons/core-free-icons';
import Svg, { Defs, ClipPath, Path, Image as SvgImage } from 'react-native-svg';
import { getSvgPath, SquircleView } from 'react-native-figma-squircle';
import { Textfield } from '../../src/components/ui/Textfield';
import { Button } from '../../src/components/ui/Button';
import { Chip } from '../../src/components/ui/Chip';
import { BottomSheet } from '../../src/components/ui/BottomSheet';
import { RacePicker } from '../../src/components/ui/RacePicker';
import { PhotoPickerSheet } from '../../src/components/ui/PhotoPickerSheet';
import { getPets, updatePet, deletePet } from '../../src/data/petStore';
import { formatDate, isDateComplete } from '../../src/utils/date';
import { colors } from '../../src/theme/colors';
import { ScreenBackground } from '../../src/components/ui/ScreenBackground';
import { AnimatedEntry } from '../../src/components/ui/AnimatedEntry';

const AVATAR_SIZE = 80;
const AVATAR_PATH = getSvgPath({ width: AVATAR_SIZE - 1, height: AVATAR_SIZE - 1, cornerRadius: 15.5, cornerSmoothing: 1 });

const SPECIES = ['Chien', 'Chat', 'Lapin', "Cochon d'Inde", 'Hamster', 'Oiseau', 'Reptile', 'Poisson', 'Autre'];
const SEX_OPTIONS = ['Femelle', 'Mâle', 'Inconnu'];
const STERILIZED_OPTIONS = ['Oui', 'Non', 'Inconnu'];
const IDENT_TYPES = ['Tatouage', 'Puce'];
const INSURANCE_OPTIONS = ['Oui', 'Non'];
const DROPDOWN_WEB = { backgroundColor: '#FFFFFF', borderRadius: 8, borderWidth: 1, borderColor: '#E8E8E8' };

export default function AnimalEditScreen() {
  const insets = useSafeAreaInsets();
  const { index } = useLocalSearchParams<{ index?: string }>();
  const petIndex = parseInt(index ?? '0', 10);
  const pet = getPets()[petIndex];

  const [name, setName] = useState(pet?.name ?? '');
  const [species, setSpecies] = useState(pet?.species ?? '');
  const [races, setRaces] = useState<string[]>(pet?.races ?? []);
  const [sex, setSex] = useState(pet?.sex ?? '');
  const [sterilized, setSterilized] = useState(pet?.sterilized ?? '');
  const [birthDate, setBirthDate] = useState(pet?.birthDate ?? '');
  const [photoUri, setPhotoUri] = useState<string | null>(pet?.photoUri ?? null);
  const [coatColor, setCoatColor] = useState(pet?.coatColor ?? '');
  const [identType, setIdentType] = useState(pet?.identType ?? '');
  const [identNumber, setIdentNumber] = useState(pet?.identNumber ?? '');
  const [insurance, setInsurance] = useState(pet?.insurance ?? '');

  const [speciesPickerOpen, setSpeciesPickerOpen] = useState(false);
  const [racePickerOpen, setRacePickerOpen] = useState(false);
  const [photoPickerOpen, setPhotoPickerOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  if (!pet) {
    router.back();
    return null;
  }

  const isValid = name.trim().length > 0 && species.length > 0 && sex.length > 0 && sterilized.length > 0
    && (birthDate.length === 0 || isDateComplete(birthDate));

  function handleSave() {
    if (!isValid) return;
    updatePet(petIndex, {
      name: name.trim(), species, races, sex, sterilized, birthDate,
      photoUri: photoUri ?? undefined,
      coatColor: coatColor || undefined,
      identType: identType || undefined,
      identNumber: identNumber || undefined,
      insurance: insurance || undefined,
    });
    router.back();
  }

  function handleDeleteConfirm() {
    setDeleteOpen(false);
    deletePet(petIndex);
    router.back();
  }

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <ScreenBackground />

      <AnimatedEntry delay={0}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} hitSlop={12}>
            <HugeiconsIcon icon={ArrowLeft01Icon} size={28} color={colors.neutral[900]} strokeWidth={1.5} />
          </Pressable>
          <Text style={styles.title}>Modifier votre animal</Text>
          <Pressable hitSlop={12} onPress={handleSave} disabled={!isValid}>
            <Text style={[styles.confirmBtn, !isValid && styles.confirmBtnDisabled]}>Confirmer</Text>
          </Pressable>
        </View>
      </AnimatedEntry>

      <AnimatedEntry delay={100} style={styles.body}>
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 30 }]}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Avatar */}
            <View style={styles.avatarSection}>
              <Pressable onPress={() => setPhotoPickerOpen(true)}>
                {Platform.OS === 'web' ? (
                  <View style={styles.avatarWeb}>
                    {photoUri
                      ? <Image source={{ uri: photoUri }} style={styles.avatarWebImg} resizeMode="cover" />
                      : <HugeiconsIcon icon={ImageAdd02Icon} size={24} color={colors.neutral[400]} strokeWidth={1.5} />
                    }
                  </View>
                ) : (
                  <>
                    <Svg width={AVATAR_SIZE} height={AVATAR_SIZE}>
                      <Defs>
                        <ClipPath id="edit-avatar-clip">
                          <Path d={AVATAR_PATH} transform="translate(0.5 0.5)" />
                        </ClipPath>
                      </Defs>
                      <Path d={AVATAR_PATH} transform="translate(0.5 0.5)" fill="#FFFFFF" stroke="#E8E8E8" strokeWidth={1} />
                      {photoUri && (
                        <SvgImage
                          href={photoUri}
                          width={AVATAR_SIZE}
                          height={AVATAR_SIZE}
                          clipPath="url(#edit-avatar-clip)"
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

            {/* Identité */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Identité</Text>
              <View style={styles.fields}>
                <Textfield label="Nom de l'animal" required placeholder="Ajouter un nom" value={name} onChangeText={setName} returnKeyType="next" />

                <View style={styles.fieldWrapper}>
                  <Text style={styles.fieldLabel}>Espèce<Text style={styles.asterisk}>*</Text></Text>
                  <Pressable onPress={() => setSpeciesPickerOpen(true)} style={[styles.dropdown, Platform.OS === 'web' && DROPDOWN_WEB]}>
                    {Platform.OS !== 'web' && (
                      <SquircleView squircleParams={{ cornerRadius: 8, cornerSmoothing: 1, fillColor: '#FFFFFF', strokeColor: '#E8E8E8', strokeWidth: 1 }} style={StyleSheet.absoluteFillObject} pointerEvents="none" />
                    )}
                    <Text style={[styles.dropdownText, !species && styles.dropdownPlaceholder]}>{species || 'Choisir une espèce'}</Text>
                    <HugeiconsIcon icon={ArrowDown01Icon} size={24} color={colors.neutral[400]} strokeWidth={1.5} />
                  </Pressable>
                </View>

                <View style={styles.fieldWrapper}>
                  <Text style={styles.fieldLabel}>Race</Text>
                  <Pressable onPress={() => setRacePickerOpen(true)} style={[styles.dropdown, Platform.OS === 'web' && DROPDOWN_WEB]}>
                    {Platform.OS !== 'web' && (
                      <SquircleView squircleParams={{ cornerRadius: 8, cornerSmoothing: 1, fillColor: '#FFFFFF', strokeColor: '#E8E8E8', strokeWidth: 1 }} style={StyleSheet.absoluteFillObject} pointerEvents="none" />
                    )}
                    <Text style={[styles.dropdownText, races.length === 0 && styles.dropdownPlaceholder]}>{races.length > 0 ? races.join(' · ') : 'Choisir une race'}</Text>
                    <HugeiconsIcon icon={ArrowDown01Icon} size={24} color={colors.neutral[400]} strokeWidth={1.5} />
                  </Pressable>
                </View>

                <View style={styles.fieldWrapper}>
                  <Text style={styles.fieldLabel}>Sexe<Text style={styles.asterisk}>*</Text></Text>
                  <View style={styles.chips}>
                    {SEX_OPTIONS.map(opt => <Chip key={opt} label={opt} selected={sex === opt} onPress={() => setSex(opt)} />)}
                  </View>
                </View>

                <View style={styles.fieldWrapper}>
                  <Text style={styles.fieldLabel}>Animal stérilisé<Text style={styles.asterisk}>*</Text></Text>
                  <View style={styles.chips}>
                    {STERILIZED_OPTIONS.map(opt => <Chip key={opt} label={opt} selected={sterilized === opt} onPress={() => setSterilized(opt)} />)}
                  </View>
                </View>

                <Textfield label="Date de naissance" placeholder="JJ/MM/AAAA" value={birthDate} onChangeText={t => setBirthDate(formatDate(t))} keyboardType="number-pad" />
              </View>
            </View>

            {/* Caractéristiques */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Caractéristiques</Text>
              <View style={styles.fields}>
                <Textfield label="Couleur du pelage" placeholder="Ex : noir et blanc" value={coatColor} onChangeText={setCoatColor} />
              </View>
            </View>

            {/* Administratif */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Administratif</Text>
              <View style={styles.fields}>
                <View style={styles.fieldWrapper}>
                  <Text style={styles.fieldLabel}>Type d'identification</Text>
                  <View style={styles.smallChips}>
                    {IDENT_TYPES.map(opt => (
                      <Pressable
                        key={opt}
                        onPress={() => setIdentType(identType === opt ? '' : opt)}
                        style={[styles.smallChip, Platform.OS === 'web' && {
                          backgroundColor: identType === opt ? colors.primary.DEFAULT : '#FFFFFF',
                          borderRadius: 100,
                          borderWidth: 1,
                          borderColor: identType === opt ? colors.primary.DEFAULT : '#E8E8E8',
                        }]}
                      >
                        {Platform.OS !== 'web' && (
                          <SquircleView
                            squircleParams={{ cornerRadius: 100, cornerSmoothing: 1, fillColor: identType === opt ? colors.primary.DEFAULT : '#FFFFFF', strokeColor: identType === opt ? colors.primary.DEFAULT : '#E8E8E8', strokeWidth: 1 }}
                            style={StyleSheet.absoluteFillObject}
                            pointerEvents="none"
                          />
                        )}
                        <Text style={[styles.smallChipLabel, identType === opt && styles.smallChipLabelSelected]}>{opt}</Text>
                      </Pressable>
                    ))}
                  </View>
                </View>

                <Textfield
                  label="Numéro d'identification"
                  placeholder="Ex : 250269500000000"
                  value={identNumber}
                  onChangeText={setIdentNumber}
                  keyboardType="number-pad"
                  helperText="15 chiffres pour la puce électronique, 5 pour le tatouage"
                />

                <View style={styles.fieldWrapper}>
                  <Text style={styles.fieldLabel}>Assurance</Text>
                  <View style={styles.chips}>
                    {INSURANCE_OPTIONS.map(opt => <Chip key={opt} label={opt} selected={insurance === opt} onPress={() => setInsurance(opt)} />)}
                  </View>
                </View>

                <View style={styles.fieldWrapper}>
                  <Text style={styles.fieldLabel}>Attestation d'assurance</Text>
                  <Pressable style={[styles.uploadZone, Platform.OS === 'web' && styles.uploadZoneWeb]}>
                    {Platform.OS !== 'web' && (
                      <SquircleView squircleParams={{ cornerRadius: 8, cornerSmoothing: 1, fillColor: '#FAFAFA', strokeColor: '#E8E8E8', strokeWidth: 1 }} style={StyleSheet.absoluteFillObject} pointerEvents="none" />
                    )}
                    <View style={styles.uploadIcon}>
                      <HugeiconsIcon icon={CloudUploadIcon} size={20} color={colors.neutral[400]} strokeWidth={1.5} />
                    </View>
                    <Text style={styles.uploadLabel}>Sélectionner un fichier</Text>
                  </Pressable>
                </View>
              </View>
            </View>

            <Button label="Sauvegarder" onPress={handleSave} disabled={!isValid} />

            <Pressable onPress={() => setDeleteOpen(true)} style={styles.deleteLink} hitSlop={8}>
              <Text style={styles.deleteLinkText}>Supprimer mon animal</Text>
            </Pressable>
          </ScrollView>
        </KeyboardAvoidingView>
      </AnimatedEntry>

      {/* Delete dialog */}
      <Modal visible={deleteOpen} transparent animationType="fade" onRequestClose={() => setDeleteOpen(false)}>
        <View style={styles.dialogBackdrop}>
          <View style={styles.dialog}>
            <Text style={styles.dialogTitle}>Supprimer {pet.name}</Text>
            <View style={styles.dialogBody}>
              <Text style={styles.dialogText}>Cette action est irréversible. </Text>
              <Text style={styles.dialogText}>
                Toutes les données de {pet.name}, y compris son carnet de santé et ses documents, seront définitivement supprimées.
              </Text>
            </View>
            <View style={styles.dialogActions}>
              <Pressable style={styles.dialogBtnCancel} onPress={() => setDeleteOpen(false)}>
                <Text style={styles.dialogBtnCancelLabel}>Annuler</Text>
              </Pressable>
              <Pressable style={styles.dialogBtnDelete} onPress={handleDeleteConfirm}>
                <Text style={styles.dialogBtnDeleteLabel}>Supprimer</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      <RacePicker visible={racePickerOpen} onClose={() => setRacePickerOpen(false)} onConfirm={setRaces} initial={races} />
      <PhotoPickerSheet visible={photoPickerOpen} onClose={() => setPhotoPickerOpen(false)} onPhoto={setPhotoUri} />

      <BottomSheet visible={speciesPickerOpen} onClose={() => setSpeciesPickerOpen(false)}>
        <View style={styles.pickerSheet}>
          <Text style={styles.pickerTitle}>Choisir une espèce</Text>
          {SPECIES.map(opt => (
            <Pressable
              key={opt}
              onPress={() => { setSpecies(opt); setSpeciesPickerOpen(false); }}
              style={[styles.pickerRow, Platform.OS === 'web' && opt === species && { backgroundColor: colors.primary[50], borderRadius: 8 }]}
            >
              {Platform.OS !== 'web' && opt === species && (
                <SquircleView squircleParams={{ cornerRadius: 8, cornerSmoothing: 1, fillColor: colors.primary[50] }} style={StyleSheet.absoluteFillObject} pointerEvents="none" />
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    height: 60,
    gap: 8,
  },
  title: { flex: 1, fontSize: 20, fontWeight: '500', color: '#181818' },
  confirmBtn: { fontSize: 16, fontWeight: '500', color: colors.primary.DEFAULT },
  confirmBtnDisabled: { color: colors.neutral[300] },
  body: { flex: 1 },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 16, paddingTop: 16, gap: 48 },

  avatarSection: { alignItems: 'center', gap: 8 },
  avatarWeb: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: 15,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8E8E8',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarWebImg: { width: AVATAR_SIZE, height: AVATAR_SIZE },
  avatarIconWrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  avatarLabel: { fontSize: 14, fontWeight: '400', color: '#717171' },

  section: { gap: 16 },
  sectionTitle: { fontSize: 20, fontWeight: '500', color: '#181818' },
  fields: { gap: 16 },
  fieldWrapper: { gap: 8 },
  fieldLabel: { fontSize: 14, fontWeight: '300', color: colors.neutral[700], lineHeight: 14 * 1.2 },
  asterisk: { color: colors.danger.DEFAULT },

  dropdown: { height: 56, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, gap: 8 },
  dropdownText: { flex: 1, fontSize: 16, fontWeight: '400', color: '#181818' },
  dropdownPlaceholder: { color: '#B2B2B2', fontWeight: '300' },

  chips: { flexDirection: 'row', gap: 16 },
  smallChips: { flexDirection: 'row', gap: 8 },
  smallChip: { height: 32, paddingHorizontal: 16, alignItems: 'center', justifyContent: 'center' },
  smallChipLabel: { fontSize: 14, fontWeight: '400', color: '#4F4F4F' },
  smallChipLabelSelected: { color: '#FFFFFF', fontWeight: '500' },

  uploadZone: { height: 64, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, gap: 12 },
  uploadZoneWeb: { backgroundColor: '#FAFAFA', borderRadius: 8, borderWidth: 1, borderColor: '#E8E8E8' },
  uploadIcon: { width: 36, height: 36, backgroundColor: '#FFFFFF', borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  uploadLabel: { fontSize: 14, fontWeight: '300', color: '#717171' },

  deleteLink: { alignItems: 'center', paddingVertical: 8 },
  deleteLinkText: { fontSize: 16, fontWeight: '500', color: colors.danger.DEFAULT },

  dialogBackdrop: { flex: 1, backgroundColor: 'rgba(9,10,10,0.5)', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 16 },
  dialog: { backgroundColor: '#FFFFFF', borderRadius: 24, padding: 16, gap: 24, width: '100%' },
  dialogTitle: { fontSize: 20, fontWeight: '500', color: '#181818' },
  dialogBody: { gap: 8 },
  dialogText: { fontSize: 16, fontWeight: '300', color: '#181818', lineHeight: 16 * 1.4 },
  dialogActions: { flexDirection: 'row', gap: 16 },
  dialogBtnCancel: { flex: 1, height: 48, backgroundColor: '#EDEDED', borderRadius: 8, borderWidth: 1, borderColor: '#E8E8E8', alignItems: 'center', justifyContent: 'center' },
  dialogBtnCancelLabel: { fontSize: 14, fontWeight: '300', color: '#181818' },
  dialogBtnDelete: { flex: 1, height: 48, backgroundColor: '#E11D48', borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  dialogBtnDeleteLabel: { fontSize: 14, fontWeight: '300', color: '#FFF1F2' },

  pickerSheet: { paddingHorizontal: 16, paddingBottom: 32, gap: 4 },
  pickerTitle: { fontSize: 16, fontWeight: '600', color: '#181818', paddingVertical: 12, textAlign: 'center' },
  pickerRow: { paddingVertical: 16, paddingHorizontal: 8 },
  pickerRowText: { fontSize: 16, fontWeight: '300', color: '#181818' },
  pickerRowTextSelected: { color: colors.primary.DEFAULT, fontWeight: '500' },
});
