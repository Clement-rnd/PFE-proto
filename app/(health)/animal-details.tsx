import { View, Text, Pressable, StyleSheet, Image, Platform, Modal, Animated, Easing } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { useState, useRef } from 'react';
import { HugeiconsIcon } from '@hugeicons/react-native';
import {
  ArrowLeft01Icon, MoreVerticalIcon, ArrowRight01Icon,
  IdentityCardIcon, Medicine02Icon, InjectionIcon, Folder02Icon,
  FemaleSymbolIcon, MaleSymbolIcon,
  Share05Icon, Share03Icon, Delete02Icon,
} from '@hugeicons/core-free-icons';
import Svg, { Defs, ClipPath, Path, Image as SvgImage } from 'react-native-svg';
import { getSvgPath } from 'react-native-figma-squircle';
import { usePets, deletePet, computeAge } from '../../src/data/petStore';
import { colors } from '../../src/theme/colors';
import { ScreenBackground } from '../../src/components/ui/ScreenBackground';
import { AnimatedEntry } from '../../src/components/ui/AnimatedEntry';

const AVATAR_SIZE = 96;
const AVATAR_PATH = getSvgPath({ width: AVATAR_SIZE - 1, height: AVATAR_SIZE - 1, cornerRadius: 15.5, cornerSmoothing: 1 });

const PET_IMAGES = [
  require('../../assets/images/pet-1.png'),
  require('../../assets/images/pet-2.png'),
  require('../../assets/images/pet-3.png'),
  require('../../assets/images/pet-4.png'),
  require('../../assets/images/pet-5.png'),
];

const MENU_ITEMS = [
  { key: 'info',       label: 'Informations', icon: IdentityCardIcon, subtitle: null },
  { key: 'treatments', label: 'Traitements',  icon: Medicine02Icon,   subtitle: '2 traitements en cours' },
  { key: 'vaccines',   label: 'Vaccins',       icon: InjectionIcon,   subtitle: '1 vaccin à faire' },
  { key: 'documents',  label: 'Documents',     icon: Folder02Icon,    subtitle: '7 documents' },
] as const;

export default function AnimalDetailsScreen() {
  const { index } = useLocalSearchParams<{ index?: string }>();
  const petIndex = parseInt(index ?? '0', 10);
  const pets = usePets();
  const pet = pets[petIndex];

  const fallbackImage = PET_IMAGES[petIndex % PET_IMAGES.length];
  const [menuOpen, setMenuOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const sheetY = useRef(new Animated.Value(300)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  if (!pet) {
    router.back();
    return null;
  }

  const age = computeAge(pet.birthDate);
  const infoLine = [pet.species, pet.races.join(', '), age].filter(Boolean).join(' · ');
  const sexIcon = pet.sex === 'Femelle' ? FemaleSymbolIcon : pet.sex === 'Mâle' ? MaleSymbolIcon : null;
  const sexColor = pet.sex === 'Femelle' ? colors.primary.DEFAULT : '#4A90D9';

  function openMenu() {
    sheetY.setValue(300);
    backdropOpacity.setValue(0);
    setMenuOpen(true);
    Animated.parallel([
      Animated.spring(sheetY, { toValue: 0, useNativeDriver: true, damping: 22, stiffness: 260 }),
      Animated.timing(backdropOpacity, { toValue: 1, duration: 220, useNativeDriver: true }),
    ]).start();
  }

  function closeMenu(callback?: () => void) {
    Animated.parallel([
      Animated.timing(sheetY, { toValue: 300, duration: 260, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      Animated.timing(backdropOpacity, { toValue: 0, duration: 200, useNativeDriver: true }),
    ]).start(() => {
      setMenuOpen(false);
      callback?.();
    });
  }

  function handleDeletePress() {
    closeMenu(() => setDeleteOpen(true));
  }

  function handleDeleteConfirm() {
    setDeleteOpen(false);
    deletePet(petIndex);
    router.back();
  }

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
      <ScreenBackground />

      <AnimatedEntry delay={0}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} hitSlop={12}>
            <HugeiconsIcon icon={ArrowLeft01Icon} size={28} color={colors.neutral[900]} strokeWidth={1.5} />
          </Pressable>
          <Pressable onPress={openMenu} hitSlop={12}>
            <HugeiconsIcon icon={MoreVerticalIcon} size={28} color={colors.neutral[900]} strokeWidth={1.5} />
          </Pressable>
        </View>
      </AnimatedEntry>

      <AnimatedEntry delay={100} style={styles.body}>
        <View style={styles.profile}>
          {Platform.OS === 'web' ? (
            <View style={styles.avatarWeb}>
              <Image
                source={pet.photoUri ? { uri: pet.photoUri } : fallbackImage}
                style={styles.avatarWebImg}
                resizeMode="cover"
              />
            </View>
          ) : (
            <Svg width={AVATAR_SIZE} height={AVATAR_SIZE}>
              <Defs>
                <ClipPath id={`detail-clip-${petIndex}`}>
                  <Path d={AVATAR_PATH} transform="translate(0.5 0.5)" />
                </ClipPath>
              </Defs>
              <Path d={AVATAR_PATH} transform="translate(0.5 0.5)" fill="#FFFFFF" stroke="#E8E8E8" strokeWidth={1} />
              <SvgImage
                href={pet.photoUri ?? fallbackImage}
                width={AVATAR_SIZE}
                height={AVATAR_SIZE}
                clipPath={`url(#detail-clip-${petIndex})`}
                preserveAspectRatio="xMidYMid slice"
              />
            </Svg>
          )}

          <View style={styles.nameRow}>
            <Text style={styles.name}>{pet.name}</Text>
            {sexIcon && (
              <HugeiconsIcon icon={sexIcon} size={16} color={sexColor} strokeWidth={1.5} />
            )}
          </View>

          {infoLine ? <Text style={styles.infoLine}>{infoLine}</Text> : null}
        </View>

        <View style={styles.menu}>
          {MENU_ITEMS.map(item => (
            <Pressable
              key={item.key}
              style={styles.menuItem}
              onPress={
                item.key === 'info'
                  ? () => router.push({ pathname: '/(health)/animal-info', params: { index: petIndex } })
                  : item.key === 'treatments'
                  ? () => router.push({ pathname: '/(health)/animal-traitements', params: { index: petIndex } })
                  : undefined
              }
            >
              <View style={styles.iconSlot}>
                <HugeiconsIcon icon={item.icon} size={24} color={colors.neutral[900]} strokeWidth={1.5} />
              </View>
              <View style={styles.menuContent}>
                <Text style={styles.menuLabel}>{item.label}</Text>
                {item.subtitle && <Text style={styles.menuSubtitle}>{item.subtitle}</Text>}
              </View>
              <HugeiconsIcon icon={ArrowRight01Icon} size={24} color={colors.neutral[400]} strokeWidth={1.5} />
            </Pressable>
          ))}
        </View>
      </AnimatedEntry>

      {/* Action sheet */}
      <Modal visible={menuOpen} transparent animationType="none" onRequestClose={() => closeMenu()}>
        <Animated.View style={[styles.backdrop, { opacity: backdropOpacity }]}>
          <Pressable style={StyleSheet.absoluteFill} onPress={() => closeMenu()} />
          <Animated.View style={[styles.sheet, { transform: [{ translateY: sheetY }] }]}>
            <View style={styles.sheetCard}>
              <Pressable style={styles.sheetItem}>
                <HugeiconsIcon icon={Share05Icon} size={24} color={colors.neutral[900]} strokeWidth={1.5} />
                <Text style={styles.sheetLabel}>Partager le carnet de santé</Text>
              </Pressable>
              <Pressable style={styles.sheetItem}>
                <HugeiconsIcon icon={Share03Icon} size={24} color={colors.neutral[900]} strokeWidth={1.5} />
                <Text style={styles.sheetLabel}>Exporter les informations en PDF</Text>
              </Pressable>
              <Pressable style={styles.sheetItem} onPress={handleDeletePress}>
                <HugeiconsIcon icon={Delete02Icon} size={24} color={colors.danger.DEFAULT} strokeWidth={1.5} />
                <Text style={[styles.sheetLabel, styles.sheetLabelDanger]}>Supprimer mon animal</Text>
              </Pressable>
            </View>
            <Pressable style={styles.sheetCancel} onPress={() => closeMenu()}>
              <Text style={styles.sheetCancelLabel}>Annuler</Text>
            </Pressable>
          </Animated.View>
        </Animated.View>
      </Modal>

      {/* Delete confirmation dialog */}
      <Modal visible={deleteOpen} transparent animationType="fade" onRequestClose={() => setDeleteOpen(false)}>
        <View style={styles.dialogBackdrop}>
          <View style={styles.dialog}>
            <Text style={styles.dialogTitle}>Supprimer {pet.name}</Text>
            <View style={styles.dialogBody}>
              <Text style={styles.dialogText}>
                {'Cette action est irréversible. '}
              </Text>
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: 'transparent' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    height: 44,
  },
  body: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 24,
    gap: 24,
  },
  profile: { alignItems: 'center', gap: 16 },
  avatarWeb: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8E8E8',
    overflow: 'hidden',
  },
  avatarWebImg: { width: AVATAR_SIZE, height: AVATAR_SIZE },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  name: { fontSize: 24, fontWeight: '500', color: '#181818' },
  infoLine: { fontSize: 14, fontWeight: '300', color: '#4F4F4F', lineHeight: 14 * 1.2 },
  menu: { gap: 4 },
  menuItem: { flexDirection: 'row', alignItems: 'center', height: 56, gap: 8 },
  iconSlot: { width: 24, alignItems: 'center', justifyContent: 'center' },
  menuContent: { flex: 1, gap: 8, justifyContent: 'center' },
  menuLabel: { fontSize: 16, fontWeight: '300', color: '#181818' },
  menuSubtitle: { fontSize: 12, fontWeight: '300', color: '#B2B2B2' },

  // Action sheet
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(9,10,10,0.5)',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingBottom: 50,
  },
  sheet: { gap: 8 },
  sheetCard: {
    backgroundColor: '#FAFAFA',
    borderRadius: 16,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  sheetItem: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    paddingHorizontal: 16,
    gap: 4,
    borderRadius: 8,
  },
  sheetLabel: { fontSize: 16, fontWeight: '300', color: '#181818' },
  sheetLabelDanger: { color: '#E11D48' },
  sheetCancel: {
    backgroundColor: '#FAFAFA',
    borderRadius: 16,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sheetCancelLabel: { fontSize: 16, fontWeight: '300', color: '#181818' },

  // Delete dialog
  dialogBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(9,10,10,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  dialog: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 16,
    gap: 24,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  dialogTitle: { fontSize: 20, fontWeight: '500', color: '#181818', lineHeight: 20 * 1.2 },
  dialogBody: { gap: 8 },
  dialogText: { fontSize: 16, fontWeight: '300', color: '#181818', lineHeight: 16 * 1.4 },
  dialogActions: { flexDirection: 'row', gap: 16 },
  dialogBtnCancel: {
    flex: 1,
    height: 48,
    backgroundColor: '#EDEDED',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dialogBtnCancelLabel: { fontSize: 14, fontWeight: '300', color: '#181818' },
  dialogBtnDelete: {
    flex: 1,
    height: 48,
    backgroundColor: '#E11D48',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dialogBtnDeleteLabel: { fontSize: 14, fontWeight: '300', color: '#FFF1F2' },
});
