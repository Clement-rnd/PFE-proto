import { View, Text, Pressable, ScrollView, StyleSheet, Image, Platform, Animated, Dimensions, Easing } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { useState, useRef } from 'react';
import { HugeiconsIcon } from '@hugeicons/react-native';
import {
  ArrowLeft01Icon, ArrowRight01Icon,
  TapeMeasureIcon, WeightScaleIcon, BloodIcon,
  PulseRectangle01Icon, TransactionHistoryIcon,
  HelpCircleIcon,
} from '@hugeicons/core-free-icons';
import { AppIcon } from '../../src/components/ui/AppIcon';
import { allergyCustomIcon } from '../../src/components/icons/AllergyIcon';
import Svg, { Defs, ClipPath, Path, Image as SvgImage } from 'react-native-svg';
import { getSvgPath } from 'react-native-figma-squircle';
import { usePets } from '../../src/data/petStore';
import { colors } from '../../src/theme/colors';
import { AnimatedEntry } from '../../src/components/ui/AnimatedEntry';
import { ScreenBackground } from '../../src/components/ui/ScreenBackground';

const AVATAR_SIZE = 80;
const AVATAR_PATH = getSvgPath({ width: AVATAR_SIZE - 1, height: AVATAR_SIZE - 1, cornerRadius: 13, cornerSmoothing: 1 });
const SLIDE_DISTANCE = Dimensions.get('window').width;

const PET_IMAGES = [
  require('../../assets/images/pet-1.png'),
  require('../../assets/images/pet-2.png'),
  require('../../assets/images/pet-3.png'),
  require('../../assets/images/pet-4.png'),
  require('../../assets/images/pet-5.png'),
];

type Tab = 'general' | 'medical';

// ── Général tab components ────────────────────────────────────────────────────

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoRowLabel}>{label}</Text>
      <Text style={styles.infoRowValue}>{value || '—'}</Text>
    </View>
  );
}
function Divider() { return <View style={styles.divider} />; }
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.card}>{children}</View>
    </View>
  );
}

// ── Médical tab components ────────────────────────────────────────────────────

function MedicalSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.medSection}>
      <Text style={styles.medSectionTitle}>{title}</Text>
      <View style={styles.medRows}>{children}</View>
    </View>
  );
}

type MedicalRowProps = {
  icon: any;
  label: string;
  subtitle?: string;
  hasArrow?: boolean;
  onPress?: () => void;
};
function MedicalRow({ icon, label, subtitle, hasArrow = false, onPress }: MedicalRowProps) {
  return (
    <Pressable style={styles.medRow} onPress={onPress} disabled={!onPress}>
      <View style={styles.medRowIcon}>
        <AppIcon icon={icon} size={24} color={colors.neutral[900]} strokeWidth={1.5} />
      </View>
      <View style={styles.medRowContent}>
        <Text style={styles.medRowLabel}>{label}</Text>
        {subtitle ? <Text style={styles.medRowSub}>{subtitle}</Text> : null}
      </View>
      {hasArrow && (
        <HugeiconsIcon icon={ArrowRight01Icon} size={24} color={colors.neutral[400]} strokeWidth={1.5} />
      )}
    </Pressable>
  );
}

// ── Screen ────────────────────────────────────────────────────────────────────

export default function AnimalInfoScreen() {
  const { index } = useLocalSearchParams<{ index?: string }>();
  const petIndex = parseInt(index ?? '0', 10);

  const pets = usePets();
  const pet = pets[petIndex];
  const [tab, setTab] = useState<Tab>('general');
  const [segContainerWidth, setSegContainerWidth] = useState(0);

  const segAnim = useRef(new Animated.Value(0)).current;
  const contentTranslateX = useRef(new Animated.Value(0)).current;
  const modifierOpacity = segAnim.interpolate({
    inputRange: [0, 0.4, 1],
    outputRange: [1, 0, 0],
    extrapolate: 'clamp',
  });

  if (!pet) return null;

  const fallbackImage = PET_IMAGES[petIndex % PET_IMAGES.length];
  const segWidth = segContainerWidth > 0 ? (segContainerWidth - 16) / 2 : 0;
  const pillTranslateX = segAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, segWidth + 8],
  });

  function switchTab(newTab: Tab) {
    if (newTab === tab) return;
    const direction = newTab === 'medical' ? 1 : -1;

    Animated.spring(segAnim, {
      toValue: newTab === 'general' ? 0 : 1,
      useNativeDriver: true,
      damping: 32,
      stiffness: 180,
    }).start();

    Animated.timing(contentTranslateX, {
      toValue: direction * -SLIDE_DISTANCE,
      duration: 210,
      easing: Easing.inOut(Easing.quad),
      useNativeDriver: true,
    }).start(() => {
      contentTranslateX.setValue(direction * SLIDE_DISTANCE);
      setTab(newTab);
      Animated.timing(contentTranslateX, {
        toValue: 0,
        duration: 260,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }).start();
    });
  }

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
      <ScreenBackground />

      {/* Header — pas d'animation d'entrée */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <HugeiconsIcon icon={ArrowLeft01Icon} size={28} color={colors.neutral[900]} strokeWidth={1.5} />
        </Pressable>
        <Text style={styles.title}>Informations</Text>
        <Animated.View
          style={{ opacity: modifierOpacity, width: 60, alignItems: 'flex-end' }}
          pointerEvents={tab === 'general' ? 'auto' : 'none'}
        >
          <Pressable
            hitSlop={12}
            onPress={() => router.push({ pathname: '/(health)/animal-edit', params: { index: String(petIndex) } })}
          >
            <Text style={styles.actionBtn}>Modifier</Text>
          </Pressable>
        </Animated.View>
      </View>

      <ScrollView
        style={[styles.scroll, styles.body]}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Segmented control */}
        <AnimatedEntry delay={60}>
          <View
            style={styles.segmented}
            onLayout={(e) => setSegContainerWidth(e.nativeEvent.layout.width)}
          >
            {segWidth > 0 && (
              <Animated.View
                style={[styles.segmentPill, { width: segWidth, transform: [{ translateX: pillTranslateX }] }]}
              />
            )}
            <Pressable style={styles.segment} onPress={() => switchTab('general')}>
              <Text style={[styles.segmentLabel, tab === 'general' && styles.segmentLabelActive]}>Général</Text>
            </Pressable>
            <Pressable style={styles.segment} onPress={() => switchTab('medical')}>
              <Text style={[styles.segmentLabel, tab === 'medical' && styles.segmentLabelActive]}>Médical</Text>
            </Pressable>
          </View>
        </AnimatedEntry>

        {/* Contenu qui slide gauche/droite */}
        <AnimatedEntry delay={130}>
          <View style={styles.tabContentClip}>
            <Animated.View style={[styles.tabContent, { transform: [{ translateX: contentTranslateX }] }]}>
              {tab === 'general' ? (
                <>
                  {/* Avatar */}
                  <View style={styles.avatarRow}>
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
                          <ClipPath id={`info-clip-${petIndex}`}>
                            <Path d={AVATAR_PATH} transform="translate(0.5 0.5)" />
                          </ClipPath>
                        </Defs>
                        <Path d={AVATAR_PATH} transform="translate(0.5 0.5)" fill="#FFFFFF" stroke="#E8E8E8" strokeWidth={1} />
                        <SvgImage
                          href={pet.photoUri ?? fallbackImage}
                          width={AVATAR_SIZE}
                          height={AVATAR_SIZE}
                          clipPath={`url(#info-clip-${petIndex})`}
                          preserveAspectRatio="xMidYMid slice"
                        />
                      </Svg>
                    )}
                  </View>

                  <Section title="Identité">
                    <InfoRow label="Nom de l'animal" value={pet.name} />
                    <Divider />
                    <InfoRow label="Espèce" value={pet.species} />
                    <Divider />
                    <InfoRow label="Race" value={pet.races.join(', ')} />
                    <Divider />
                    <InfoRow label="Sexe" value={pet.sex} />
                    <Divider />
                    <InfoRow label="Date de naissance" value={pet.birthDate} />
                  </Section>

                  <Section title="Caractéristiques">
                    <InfoRow label="Stérilisation" value={pet.sterilized} />
                    <Divider />
                    <InfoRow label="Couleur du pelage" value={pet.coatColor ?? '—'} />
                  </Section>

                  <Section title="Administratif">
                    <InfoRow label="Type d'identification" value={pet.identType ?? '—'} />
                    <Divider />
                    <InfoRow label="Numéro d'identification" value={pet.identNumber ?? '—'} />
                    <Divider />
                    <InfoRow label="Assurance" value={pet.insurance ?? '—'} />
                  </Section>
                </>
              ) : (
                <>
                  {/* Info banner */}
                  <View style={styles.alertBanner}>
                    <HugeiconsIcon icon={HelpCircleIcon} size={16} color="#39438D" strokeWidth={1.5} />
                    <Text style={styles.alertText}>
                      Ces informations sont mises à jour uniquement par votre vétérinaire.
                    </Text>
                  </View>

                  {/* Mensurations */}
                  <MedicalSection title="Mensurations">
                    <MedicalRow
                      icon={TapeMeasureIcon}
                      label="Taille"
                      subtitle="59 cm"
                      hasArrow
                      onPress={() => router.push({ pathname: '/(health)/animal-size', params: { index: String(petIndex) } })}
                    />
                    <MedicalRow icon={WeightScaleIcon} label="Poids" subtitle="30 kg" hasArrow onPress={() => router.push({ pathname: '/(health)/animal-weight', params: { index: String(petIndex) } })} />
                  </MedicalSection>

                  {/* Informations médicales */}
                  <MedicalSection title="Informations médicales">
                    <MedicalRow icon={BloodIcon} label="Groupe sanguin" subtitle="DEA 1.1 positif" />
                    <MedicalRow
                      icon={allergyCustomIcon}
                      label="Allergies"
                      subtitle="4 allergies diagnostiquées"
                      hasArrow
                      onPress={() => router.push({ pathname: '/(health)/animal-allergies', params: { index: String(petIndex) } })}
                    />
                    <MedicalRow icon={PulseRectangle01Icon} label="Maladies chroniques" subtitle="3 maladies chroniques diagnostiquées" hasArrow onPress={() => router.push({ pathname: '/(health)/animal-chronic-diseases', params: { index: String(petIndex) } })} />
                    <MedicalRow icon={TransactionHistoryIcon} label="Antécédents médicaux" hasArrow onPress={() => router.push({ pathname: '/(health)/animal-medical-history', params: { index: String(petIndex) } })} />
                  </MedicalSection>
                </>
              )}
            </Animated.View>
          </View>
        </AnimatedEntry>
      </ScrollView>
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
  actionBtn: { fontSize: 16, fontWeight: '300', color: '#181818' },
  body: { flex: 1 },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 32, gap: 24 },

  // Segmented control
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
    top: 4,
    left: 4,
    bottom: 4,
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

  // Sliding tab content
  tabContentClip: { overflow: 'hidden' },
  tabContent: { gap: 24 },

  // Avatar (Général tab)
  avatarRow: { alignItems: 'center' },
  avatarWeb: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: 13,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8E8E8',
    overflow: 'hidden',
  },
  avatarWebImg: { width: AVATAR_SIZE, height: AVATAR_SIZE },

  // Général tab — sections
  section: { gap: 12 },
  sectionTitle: { fontSize: 16, fontWeight: '500', color: '#717171', lineHeight: 16 * 1.4 },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    overflow: 'hidden',
  },
  infoRow: { height: 56, paddingHorizontal: 16, justifyContent: 'center', gap: 4 },
  infoRowLabel: { fontSize: 14, fontWeight: '300', color: '#B2B2B2', lineHeight: 14 * 1.4 },
  infoRowValue: { fontSize: 16, fontWeight: '300', color: '#181818', lineHeight: 16 * 1.4 },
  divider: { height: 1, backgroundColor: '#DCDCDC', marginHorizontal: 16 },

  // Médical tab — alert banner
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
  },
  alertText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '300',
    color: '#39438D',
    lineHeight: 16 * 1.2,
  },

  // Médical tab — sections
  medSection: { gap: 4 },
  medSectionTitle: { fontSize: 16, fontWeight: '500', color: '#717171', lineHeight: 16 * 1.4, marginBottom: 8 },
  medRows: { gap: 0 },
  medRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    gap: 8,
  },
  medRowIcon: { width: 24, alignItems: 'center', justifyContent: 'center' },
  medRowContent: { flex: 1, gap: 8, justifyContent: 'center' },
  medRowLabel: { fontSize: 16, fontWeight: '300', color: '#181818', lineHeight: 16 * 1.4 },
  medRowSub: { fontSize: 12, fontWeight: '300', color: '#B2B2B2', lineHeight: 12 * 1.4 },
});
