import { View, Text, Pressable, StyleSheet, Image, Platform, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react-native';
import {
  ArrowLeft01Icon, MoreVerticalIcon, ArrowRight01Icon,
  IdentityCardIcon, Medicine02Icon, InjectionIcon, Folder02Icon,
  FemaleSymbolIcon, MaleSymbolIcon,
  Share05Icon, Share03Icon, Delete02Icon,
} from '@hugeicons/core-free-icons';
import Svg, { Defs, ClipPath, Path, Image as SvgImage } from 'react-native-svg';
import { getSvgPath } from 'react-native-figma-squircle';
import { getPets, deletePet, computeAge } from '../../src/data/petStore';
import { colors } from '../../src/theme/colors';
import { ScreenBackground } from '../../src/components/ui/ScreenBackground';
import { AnimatedEntry } from '../../src/components/ui/AnimatedEntry';

const AVATAR_SIZE = 96;
const AVATAR_PATH = getSvgPath({ width: AVATAR_SIZE - 1, height: AVATAR_SIZE - 1, cornerRadius: 15.5, cornerSmoothing: 1 });

const MENU_ITEMS = [
  { key: 'info',       label: 'Informations', icon: IdentityCardIcon, subtitle: null },
  { key: 'treatments', label: 'Traitements',  icon: Medicine02Icon,   subtitle: '2 traitements en cours' },
  { key: 'vaccines',   label: 'Vaccins',       icon: InjectionIcon,   subtitle: '1 vaccin à faire' },
  { key: 'documents',  label: 'Documents',     icon: Folder02Icon,    subtitle: '7 documents' },
] as const;

export default function AnimalDetailsScreen() {
  const { index } = useLocalSearchParams<{ index?: string }>();
  const petIndex = parseInt(index ?? '0', 10);
  const pets = getPets();
  const pet = pets[petIndex];
  const [menuOpen, setMenuOpen] = useState(false);

  if (!pet) {
    router.back();
    return null;
  }

  const age = computeAge(pet.birthDate);
  const infoLine = [pet.species, pet.races.join(', '), age].filter(Boolean).join(' · ');
  const sexIcon = pet.sex === 'Femelle' ? FemaleSymbolIcon : pet.sex === 'Mâle' ? MaleSymbolIcon : null;
  const sexColor = pet.sex === 'Femelle' ? colors.primary.DEFAULT : '#4A90D9';

  function handleDelete() {
    setMenuOpen(false);
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
          <Pressable onPress={() => setMenuOpen(true)} hitSlop={12}>
            <HugeiconsIcon icon={MoreVerticalIcon} size={28} color={colors.neutral[900]} strokeWidth={1.5} />
          </Pressable>
        </View>
      </AnimatedEntry>

      <AnimatedEntry delay={100} style={styles.body}>
        <View style={styles.profile}>
          {Platform.OS === 'web' ? (
            <View style={styles.avatarWeb}>
              {pet.photoUri
                ? <Image source={{ uri: pet.photoUri }} style={styles.avatarWebImg} resizeMode="cover" />
                : <View style={styles.avatarPlaceholder} />
              }
            </View>
          ) : (
            <Svg width={AVATAR_SIZE} height={AVATAR_SIZE}>
              <Defs>
                <ClipPath id={`detail-clip-${petIndex}`}>
                  <Path d={AVATAR_PATH} transform="translate(0.5 0.5)" />
                </ClipPath>
              </Defs>
              <Path d={AVATAR_PATH} transform="translate(0.5 0.5)" fill="#FFFFFF" stroke="#E8E8E8" strokeWidth={1} />
              {pet.photoUri && (
                <SvgImage
                  href={pet.photoUri}
                  width={AVATAR_SIZE}
                  height={AVATAR_SIZE}
                  clipPath={`url(#detail-clip-${petIndex})`}
                  preserveAspectRatio="xMidYMid slice"
                />
              )}
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
            <Pressable key={item.key} style={styles.menuItem}>
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
      <Modal visible={menuOpen} transparent animationType="fade" onRequestClose={() => setMenuOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => setMenuOpen(false)}>
          <Pressable style={styles.sheet} onPress={() => {}}>
            <View style={styles.sheetCard}>
              <Pressable style={styles.sheetItem}>
                <HugeiconsIcon icon={Share05Icon} size={24} color={colors.neutral[900]} strokeWidth={1.5} />
                <Text style={styles.sheetLabel}>Partager le carnet de santé</Text>
              </Pressable>
              <Pressable style={styles.sheetItem}>
                <HugeiconsIcon icon={Share03Icon} size={24} color={colors.neutral[900]} strokeWidth={1.5} />
                <Text style={styles.sheetLabel}>Exporter les informations en PDF</Text>
              </Pressable>
              <Pressable style={styles.sheetItem} onPress={handleDelete}>
                <HugeiconsIcon icon={Delete02Icon} size={24} color={colors.danger.DEFAULT} strokeWidth={1.5} />
                <Text style={[styles.sheetLabel, styles.sheetLabelDanger]}>Supprimer mon animal</Text>
              </Pressable>
            </View>

            <Pressable style={styles.sheetCancel} onPress={() => setMenuOpen(false)}>
              <Text style={styles.sheetCancelLabel}>Annuler</Text>
            </Pressable>
          </Pressable>
        </Pressable>
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
  profile: {
    alignItems: 'center',
    gap: 16,
  },
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
  avatarPlaceholder: { flex: 1, backgroundColor: '#F5F5F5' },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  name: { fontSize: 24, fontWeight: '500', color: '#181818' },
  infoLine: { fontSize: 14, fontWeight: '300', color: '#4F4F4F', lineHeight: 14 * 1.2 },
  menu: { gap: 4 },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    gap: 8,
  },
  iconSlot: { width: 24, alignItems: 'center', justifyContent: 'center' },
  menuContent: { flex: 1, gap: 4, justifyContent: 'center' },
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
  sheet: {
    gap: 8,
  },
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
});
