import { View, Text, Pressable, ScrollView, StyleSheet, Image, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react-native';
import {
  ArrowLeft01Icon, ArrowRight01Icon,
  TapeMeasureIcon, WeightScaleIcon, BloodIcon,
  AlertCircleIcon, PulseRectangle01Icon, TransactionHistoryIcon,
  HelpCircleIcon,
} from '@hugeicons/core-free-icons';
import Svg, { Defs, ClipPath, Path, Image as SvgImage } from 'react-native-svg';
import { getSvgPath } from 'react-native-figma-squircle';
import { usePets } from '../../src/data/petStore';
import { colors } from '../../src/theme/colors';
import { ScreenBackground } from '../../src/components/ui/ScreenBackground';
import { AnimatedEntry } from '../../src/components/ui/AnimatedEntry';

const AVATAR_SIZE = 80;
const AVATAR_PATH = getSvgPath({ width: AVATAR_SIZE - 1, height: AVATAR_SIZE - 1, cornerRadius: 13, cornerSmoothing: 1 });

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
};
function MedicalRow({ icon, label, subtitle, hasArrow = false }: MedicalRowProps) {
  return (
    <View style={styles.medRow}>
      <View style={styles.medRowIcon}>
        <HugeiconsIcon icon={icon} size={24} color={colors.neutral[900]} strokeWidth={1.5} />
      </View>
      <View style={styles.medRowContent}>
        <Text style={styles.medRowLabel}>{label}</Text>
        {subtitle ? <Text style={styles.medRowSub}>{subtitle}</Text> : null}
      </View>
      {hasArrow && (
        <HugeiconsIcon icon={ArrowRight01Icon} size={24} color={colors.neutral[400]} strokeWidth={1.5} />
      )}
    </View>
  );
}

// ── Screen ────────────────────────────────────────────────────────────────────

export default function AnimalInfoScreen() {
  const { index } = useLocalSearchParams<{ index?: string }>();
  const petIndex = parseInt(index ?? '0', 10);

  const pets = usePets();
  const pet = pets[petIndex];
  const [tab, setTab] = useState<Tab>('general');

  if (!pet) return null;

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
      <ScreenBackground />

      <AnimatedEntry delay={0}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} hitSlop={12}>
            <HugeiconsIcon icon={ArrowLeft01Icon} size={28} color={colors.neutral[900]} strokeWidth={1.5} />
          </Pressable>
          <Text style={styles.title}>Informations</Text>
          <Pressable
            hitSlop={12}
            onPress={() => router.push({ pathname: '/(health)/animal-edit', params: { index: String(petIndex) } })}
          >
            <Text style={styles.actionBtn}>Modifier</Text>
          </Pressable>
        </View>
      </AnimatedEntry>

      <AnimatedEntry delay={100} style={styles.body}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Segmented control */}
          <View style={styles.segmented}>
            <Pressable style={[styles.segment, tab === 'general' && styles.segmentActive]} onPress={() => setTab('general')}>
              <Text style={[styles.segmentLabel, tab === 'general' && styles.segmentLabelActive]}>Général</Text>
            </Pressable>
            <Pressable style={[styles.segment, tab === 'medical' && styles.segmentActive]} onPress={() => setTab('medical')}>
              <Text style={[styles.segmentLabel, tab === 'medical' && styles.segmentLabelActive]}>Médical</Text>
            </Pressable>
          </View>

          {tab === 'general' ? (
            <>
              {/* Avatar */}
              <View style={styles.avatarRow}>
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
                      <ClipPath id={`info-clip-${petIndex}`}>
                        <Path d={AVATAR_PATH} transform="translate(0.5 0.5)" />
                      </ClipPath>
                    </Defs>
                    <Path d={AVATAR_PATH} transform="translate(0.5 0.5)" fill="#FFFFFF" stroke="#E8E8E8" strokeWidth={1} />
                    {pet.photoUri && (
                      <SvgImage
                        href={pet.photoUri}
                        width={AVATAR_SIZE}
                        height={AVATAR_SIZE}
                        clipPath={`url(#info-clip-${petIndex})`}
                        preserveAspectRatio="xMidYMid slice"
                      />
                    )}
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
                <MedicalRow icon={TapeMeasureIcon} label="Taille" subtitle="45 cm" hasArrow />
                <MedicalRow icon={WeightScaleIcon} label="Poids" subtitle="30 kg" hasArrow />
              </MedicalSection>

              {/* Informations médicales */}
              <MedicalSection title="Informations médicales">
                <MedicalRow icon={BloodIcon} label="Groupe sanguin" subtitle="DEA 1.1 positif" />
                <MedicalRow icon={AlertCircleIcon} label="Allergies" subtitle="4 allergies diagnostiquées" hasArrow />
                <MedicalRow icon={PulseRectangle01Icon} label="Maladies chroniques" subtitle="3 maladies chroniques diagnostiquées" hasArrow />
                <MedicalRow icon={TransactionHistoryIcon} label="Antécédents médicaux" hasArrow />
              </MedicalSection>
            </>
          )}
        </ScrollView>
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
  segment: { flex: 1, alignItems: 'center', justifyContent: 'center', borderRadius: 6 },
  segmentActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  segmentLabel: { fontSize: 16, fontWeight: '300', color: '#717171' },
  segmentLabelActive: { color: '#181818' },

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
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarWebImg: { width: AVATAR_SIZE, height: AVATAR_SIZE },
  avatarPlaceholder: { flex: 1, backgroundColor: '#F5F5F5' },

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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
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
  medRowContent: { flex: 1, gap: 4, justifyContent: 'center' },
  medRowLabel: { fontSize: 16, fontWeight: '300', color: '#181818', lineHeight: 16 * 1.4 },
  medRowSub: { fontSize: 12, fontWeight: '300', color: '#B2B2B2', lineHeight: 12 * 1.4 },
});
