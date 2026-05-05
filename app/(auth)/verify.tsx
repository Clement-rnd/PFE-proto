import { View, Text, Pressable, TextInput, StyleSheet, Platform } from 'react-native';
import { SquircleView } from 'react-native-figma-squircle';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { useRef, useState, useEffect } from 'react';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { ArrowLeft01Icon } from '@hugeicons/core-free-icons';
import { colors } from '../../src/theme/colors';
import { ScreenBackground } from '../../src/components/ui/ScreenBackground';
import { AnimatedEntry } from '../../src/components/ui/AnimatedEntry';

const CODE_LENGTH = 6;

export default function VerifyScreen() {
  const { phone } = useLocalSearchParams<{ phone: string }>();
  const [code, setCode] = useState('');
  const inputRef = useRef<TextInput>(null);

  const spaceIdx = phone?.indexOf(' ') ?? -1;
  const dialCode = spaceIdx > -1 ? phone.slice(0, spaceIdx) : '';
  const localNumber = spaceIdx > -1 ? phone.slice(spaceIdx + 1) : phone;

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 100);
  }, []);

  function handleChangeCode(text: string) {
    const digits = text.replace(/\D/g, '').slice(0, CODE_LENGTH);
    setCode(digits);
    if (digits.length === CODE_LENGTH) {
      router.push('/(auth)/create-profile');
    }
  }

  const activeIndex = Math.min(code.length, CODE_LENGTH - 1);

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
      <ScreenBackground />

      <View style={styles.body}>
        {/* Header */}
        <AnimatedEntry delay={0}>
          <Pressable onPress={() => router.back()} style={styles.headerRow} hitSlop={12}>
            <HugeiconsIcon icon={ArrowLeft01Icon} size={28} color={colors.neutral[900]} strokeWidth={1.5} />
            <Text style={styles.title}>Vérifiez votre numéro</Text>
          </Pressable>
        </AnimatedEntry>

        {/* Centre — instruction + OTP + resend */}
        <AnimatedEntry delay={120} style={styles.center}>
          <Text style={styles.instruction}>
            {'Entrez le code que vous avez reçu au\n'}
            <Text style={styles.dialCodeText}>{dialCode} </Text>
            <Text style={styles.phoneText}>{localNumber}</Text>
          </Text>

          <View style={styles.otpSection}>
            <Pressable onPress={() => inputRef.current?.focus()} style={styles.otpRow}>
              {Array.from({ length: CODE_LENGTH }).map((_, i) => {
                const isActive = code.length < CODE_LENGTH && i === activeIndex;
                return (
                  <View
                    key={i}
                    style={[
                      styles.otpBox,
                      Platform.OS === 'web' && {
                        backgroundColor: '#FFFFFF',
                        borderRadius: 8,
                        borderWidth: 1,
                        borderColor: isActive ? colors.primary.DEFAULT : '#E8E8E8',
                      },
                    ]}
                  >
                    {Platform.OS !== 'web' && (
                      <SquircleView
                        squircleParams={{
                          cornerRadius: 8,
                          cornerSmoothing: 1,
                          fillColor: '#FFFFFF',
                          strokeColor: isActive ? colors.primary.DEFAULT : '#E8E8E8',
                          strokeWidth: 1,
                        }}
                        style={StyleSheet.absoluteFillObject}
                        pointerEvents="none"
                      />
                    )}
                    <Text style={styles.otpDigit}>{code[i] ?? ''}</Text>
                  </View>
                );
              })}
            </Pressable>

            <Pressable style={styles.resendLink}>
              <Text style={styles.resendText}>Envoyer un nouveau code</Text>
            </Pressable>
          </View>
        </AnimatedEntry>
      </View>

      {/* Input caché */}
      <TextInput
        ref={inputRef}
        value={code}
        onChangeText={handleChangeCode}
        keyboardType="number-pad"
        maxLength={CODE_LENGTH}
        style={styles.hiddenInput}
        caretHidden
      />
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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 44,
    gap: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: '500',
    color: colors.neutral[900],
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    gap: 24,
  },
  instruction: {
    fontSize: 16,
    fontWeight: '300',
    color: colors.neutral[900],
    textAlign: 'center',
    lineHeight: 16 * 1.4,
  },
  dialCodeText: {
    fontSize: 16,
    fontWeight: '300',
    color: '#717171',
  },
  phoneText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.neutral[900],
  },
  otpSection: {
    gap: 24,
    alignItems: 'center',
  },
  otpRow: {
    flexDirection: 'row',
    gap: 16,
    justifyContent: 'center',
    width: '100%',
  },
  otpBox: {
    width: 40,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  otpDigit: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.neutral[900],
  },
  resendLink: {
    alignItems: 'center',
    paddingTop: 4,
  },
  resendText: {
    fontSize: 16,
    fontWeight: '300',
    color: '#717171',
    textDecorationLine: 'underline',
    lineHeight: 16 * 1.4,
  },
  hiddenInput: {
    position: 'absolute',
    opacity: 0,
    width: 0,
    height: 0,
  },
});
