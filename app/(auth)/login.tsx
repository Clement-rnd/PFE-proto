import {
  View, Text, Pressable, TextInput, StyleSheet, Image,
  Keyboard, KeyboardAvoidingView, Platform,
} from 'react-native';
import { SquircleView } from 'react-native-figma-squircle';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useState, useRef } from 'react';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { ArrowDown01Icon } from '@hugeicons/core-free-icons';
import { CountryPicker } from '../../src/components/ui/CountryPicker';
import { FlagIcon } from '../../src/components/ui/FlagIcon';
import { LogoNaya } from '../../src/components/ui/LogoNaya';
import { DEFAULT_COUNTRY } from '../../src/data/countries';
import type { Country } from '../../src/data/countries';
import { colors } from '../../src/theme/colors';
import { ScreenBackground } from '../../src/components/ui/ScreenBackground';

type CountryWithFlag = Country & { flag: string };

// z-order: first = bottom, last = top
const PHOTOS = [
  { src: require('../../assets/images/pet-1.png'), top: 444, left: 0,    width: 200, height: 133 },
  { src: require('../../assets/images/pet-2.png'), top: 192, left: 173,  width: 200, height: 133 },
  { src: require('../../assets/images/pet-3.png'), top: 433, left: 161,  width: 200, height: 133 },
  { src: require('../../assets/images/pet-4.png'), top: 325, left: 109,  width: 200, height: 133 },
  { src: require('../../assets/images/pet-5.png'), top: 226, left: -6,   width: 200, height: 133 },
];

export default function LoginScreen() {
  const [country, setCountry] = useState<CountryWithFlag>(DEFAULT_COUNTRY as CountryWithFlag);
  const [phone, setPhone] = useState('');
  const [focused, setFocused] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const inputRef = useRef<TextInput>(null);

  function formatPhone(raw: string): string {
    const d = raw.replace(/\D/g, '').slice(0, 9);
    let out = d.slice(0, 1);
    if (d.length > 1) out += ' ' + d.slice(1, 3);
    if (d.length > 3) out += ' ' + d.slice(3, 5);
    if (d.length > 5) out += ' ' + d.slice(5, 7);
    if (d.length > 7) out += ' ' + d.slice(7, 9);
    return out;
  }

  function handleContinue() {
    if (phone.replace(/\D/g, '').length >= 6) {
      router.push({
        pathname: '/(auth)/verify',
        params: { phone: `${country.dialCode} ${phone}` },
      });
    }
  }

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
      <ScreenBackground />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <Pressable style={styles.inner} onPress={Keyboard.dismiss}>

          {/* Zone illustration : logo + mosaïque photos */}
          <View style={styles.illustrationArea}>
            {PHOTOS.map((photo, i) => (
              <View
                key={i}
                style={[styles.photoShadow, {
                  top: photo.top, left: photo.left,
                  width: photo.width, height: photo.height,
                }]}
              >
                <View style={styles.photoClip}>
                  <Image source={photo.src} style={StyleSheet.absoluteFillObject} resizeMode="cover" />
                </View>
              </View>
            ))}
            <View style={styles.logoWrapper}>
              <LogoNaya width={197} height={80} />
            </View>
          </View>

          {/* Zone bas : champ téléphone + lien */}
          <View style={styles.bottom}>
            <Pressable onPress={() => inputRef.current?.focus()} style={styles.field}>
              <SquircleView
                squircleParams={{
                  cornerRadius: 8, cornerSmoothing: 1,
                  fillColor: '#FFFFFF',
                  strokeColor: focused ? colors.primary.DEFAULT : '#E8E8E8',
                  strokeWidth: 1,
                }}
                style={StyleSheet.absoluteFillObject}
                pointerEvents="none"
              />
              <Pressable onPress={() => setSheetOpen(true)} style={styles.leftSlot} hitSlop={8}>
                <View style={styles.flagContainer}>
                  <FlagIcon code={country.code} width={36} height={24} />
                </View>
                <HugeiconsIcon icon={ArrowDown01Icon} size={16} color={colors.neutral[500]} strokeWidth={1.5} />
              </Pressable>
              <Text style={styles.dialCode}>{country.dialCode} </Text>
              <TextInput
                ref={inputRef}
                style={styles.input}
                placeholder="6 00 00 00 00"
                placeholderTextColor="#B2B2B2"
                value={phone}
                onChangeText={t => {
                  const formatted = formatPhone(t);
                  setPhone(formatted);
                  if (formatted.replace(/\D/g, '').length === 9) handleContinue();
                }}
                keyboardType="phone-pad"
                returnKeyType="done"
                onSubmitEditing={handleContinue}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
              />
            </Pressable>

            <Pressable style={styles.problemLink}>
              <Text style={styles.problemText}>Un problème pour vous connecter ?</Text>
            </Pressable>
          </View>

        </Pressable>
      </KeyboardAvoidingView>

      <CountryPicker
        visible={sheetOpen}
        onClose={() => setSheetOpen(false)}
        onSelect={setCountry}
        selected={country}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: 'transparent' },
  inner: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 50,
    gap: 24,
  },
  illustrationArea: {
    flex: 1,
    overflow: 'hidden',
  },
  logoWrapper: {
    position: 'absolute',
    top: 53,
    left: 81,
  },
  photoShadow: {
    position: 'absolute',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
    borderRadius: 8,
  },
  photoClip: {
    flex: 1,
    borderRadius: 8,
    overflow: 'hidden',
  },
  bottom: {
    gap: 24,
  },
  field: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 8,
  },
  leftSlot: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  flagContainer: {
    width: 36,
    height: 24,
    borderRadius: 3,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dialCode: {
    fontSize: 16,
    fontWeight: '300',
    color: colors.neutral[900],
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontWeight: '300',
    color: colors.neutral[900],
    paddingVertical: 0,
  },
  problemLink: {
    alignItems: 'center',
  },
  problemText: {
    fontSize: 14,
    fontWeight: '300',
    color: '#181818',
    textDecorationLine: 'underline',
    lineHeight: 14 * 1.2,
  },
});
