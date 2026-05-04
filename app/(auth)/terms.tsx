import { View, Text, Pressable, StyleSheet, Platform } from 'react-native';
import { SquircleView } from 'react-native-figma-squircle';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { ArrowLeft01Icon, Tick01Icon } from '@hugeicons/core-free-icons';
import { Button } from '../../src/components/ui/Button';
import { colors } from '../../src/theme/colors';
import { ScreenBackground } from '../../src/components/ui/ScreenBackground';

function Checkbox({ checked, onPress }: { checked: boolean; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.checkbox,
        Platform.OS === 'web' && {
          backgroundColor: checked ? colors.primary.DEFAULT : '#FFFFFF',
          borderRadius: 4,
          borderWidth: 1,
          borderColor: checked ? colors.primary.DEFAULT : '#E8E8E8',
        },
      ]}
      hitSlop={8}
    >
      {Platform.OS !== 'web' && (
        <SquircleView
          squircleParams={{
            cornerRadius: 4,
            cornerSmoothing: 1,
            fillColor: checked ? colors.primary.DEFAULT : 'transparent',
            strokeColor: checked ? colors.primary.DEFAULT : '#E8E8E8',
            strokeWidth: 1,
          }}
          style={StyleSheet.absoluteFillObject}
          pointerEvents="none"
        />
      )}
      {checked && <HugeiconsIcon icon={Tick01Icon} size={16} color="#FFFFFF" strokeWidth={2} />}
    </Pressable>
  );
}

export default function TermsScreen() {
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedPolicy, setAcceptedPolicy] = useState(false);
  const [acceptedCookies, setAcceptedCookies] = useState(false);
  const canContinue = acceptedTerms && acceptedPolicy;

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
      <ScreenBackground />
      <View style={styles.body}>

        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} hitSlop={12}>
            <HugeiconsIcon icon={ArrowLeft01Icon} size={28} color={colors.neutral[900]} strokeWidth={1.5} />
          </Pressable>
          <Text style={styles.title}>Conditions générales d'utilisation</Text>
        </View>

        {/* Contenu centré */}
        <View style={styles.content}>
          <View style={styles.illustration}>
            <View style={styles.illustrationPlaceholder} />
          </View>

          <View style={styles.checks}>
            <Pressable onPress={() => setAcceptedTerms(v => !v)} style={styles.checkRow}>
              <Checkbox checked={acceptedTerms} onPress={() => setAcceptedTerms(v => !v)} />
              <Text style={styles.checkLabel}>
                {"J'accepte les "}
                <Text style={styles.bold}>{"Conditions d'utilisation"}</Text>
                {" de NAYA"}
                <Text style={styles.asterisk}>{"*"}</Text>
              </Text>
            </Pressable>

            <Pressable onPress={() => setAcceptedPolicy(v => !v)} style={styles.checkRow}>
              <Checkbox checked={acceptedPolicy} onPress={() => setAcceptedPolicy(v => !v)} />
              <Text style={[styles.checkLabel, styles.checkLabelFlex]}>
                {"J'accepte la "}
                <Text style={[styles.bold, styles.underline]}>{"Politique de confidentialité"}</Text>
                {" et le traitement de mes "}
                <Text style={[styles.bold, styles.underline]}>{"données personnelles"}</Text>
                <Text style={styles.asterisk}>{"*"}</Text>
              </Text>
            </Pressable>

            <Pressable onPress={() => setAcceptedCookies(v => !v)} style={styles.checkRow}>
              <Checkbox checked={acceptedCookies} onPress={() => setAcceptedCookies(v => !v)} />
              <Text style={[styles.checkLabel, styles.checkLabelFlex]}>
                {"J'accepte "}
                <Text style={[styles.bold, styles.underline]}>{"l'utilisation de cookies"}</Text>
                {", conformément à la politique sur leur utilisation."}
              </Text>
            </Pressable>
          </View>
        </View>

        <Button
          label="Continuer"
          onPress={() => router.push('/(auth)/add-pet')}
          disabled={!canContinue}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: 'transparent' },
  body: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
    gap: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    height: 44,
  },
  title: {
    flex: 1,
    fontSize: 20,
    fontWeight: '500',
    color: '#181818',
  },
  content: {
    flex: 1,
    gap: 24,
    justifyContent: 'center',
  },
  illustration: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 240,
  },
  illustrationPlaceholder: {
    width: 180,
    height: 180,
    backgroundColor: '#D9D9D9',
  },
  checks: {
    gap: 12,
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  checkbox: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkLabel: {
    fontSize: 14,
    fontWeight: '400',
    color: '#181818',
    lineHeight: 14 * 1.4,
  },
  checkLabelFlex: {
    flex: 1,
  },
  bold: {
    fontWeight: '700',
  },
  underline: {
    textDecorationLine: 'underline',
  },
  asterisk: {
    color: colors.primary.DEFAULT,
  },
});
