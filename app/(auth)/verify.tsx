import { View, Text, Pressable, TextInput, StyleSheet, ScrollView, Keyboard, useWindowDimensions } from 'react-native';
import { SquircleView } from 'react-native-figma-squircle';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { useRef, useState, useEffect } from 'react';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { ArrowLeft01Icon } from '@hugeicons/core-free-icons';
import { colors } from '../../src/theme/colors';
import { ScreenBackground } from '../../src/components/ui/ScreenBackground';

const CODE_LENGTH = 6;

export default function VerifyScreen() {
  const { height } = useWindowDimensions();
  const { phone } = useLocalSearchParams<{ phone: string }>();
  const [code, setCode] = useState('');
  const inputRef = useRef<TextInput>(null);

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
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        automaticallyAdjustKeyboardInsets
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Pressable style={styles.inner} onPress={() => Keyboard.dismiss()}>
          {/* Header */}
          <Pressable onPress={() => router.back()} style={styles.backBtn} hitSlop={12}>
            <HugeiconsIcon icon={ArrowLeft01Icon} size={24} color={colors.neutral[900]} strokeWidth={1.5} />
            <Text style={styles.title}>Vérifiez votre numéro</Text>
          </Pressable>

          {/* Illustration */}
          <SquircleView
            squircleParams={{ cornerRadius: 12, cornerSmoothing: 1, fillColor: '#D9D9D9' }}
            style={[styles.illustration, { height: height * 0.28 }]}
          />

          {/* Zone bas */}
          <View style={styles.bottom}>
            <Text style={styles.instruction}>
              Entrez le code que vous avez reçu au{'\n'}
              <Text style={styles.phone}>{phone}</Text>
            </Text>
            <Pressable onPress={() => inputRef.current?.focus()} style={styles.otpRow}>
              {Array.from({ length: CODE_LENGTH }).map((_, i) => {
                const isActive = code.length < CODE_LENGTH && i === activeIndex;
                return (
                  <SquircleView
                    key={i}
                    squircleParams={{ cornerRadius: 8, cornerSmoothing: 1, fillColor: '#FFFFFF', strokeColor: isActive ? colors.primary.DEFAULT : '#E8E8E8', strokeWidth: 1 }}
                    style={styles.otpBox}
                  >
                    <Text style={styles.otpDigit}>{code[i] ?? ''}</Text>
                  </SquircleView>
                );
              })}
            </Pressable>
            <Pressable style={styles.resendLink}>
              <Text style={styles.resendText}>Envoyer un nouveau code</Text>
            </Pressable>
          </View>
        </Pressable>
      </ScrollView>

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
  screen: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  scroll: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 50,
  },
  inner: {
    flex: 1,
    gap: 24,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.neutral[900],
  },
  illustration: {},
  bottom: {
    gap: 16,
  },
  instruction: {
    fontSize: 14,
    fontWeight: '300',
    color: colors.neutral[700],
    textAlign: 'center',
    lineHeight: 14 * 1.5,
  },
  phone: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.neutral[900],
  },
  otpRow: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
  },
  otpBox: {
    flex: 1,
    aspectRatio: 1,
    maxWidth: 52,
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
    fontSize: 14,
    fontWeight: '300',
    color: '#181818',
    textDecorationLine: 'underline',
    lineHeight: 14 * 1.2,
  },
  hiddenInput: {
    position: 'absolute',
    opacity: 0,
    width: 0,
    height: 0,
  },
});
