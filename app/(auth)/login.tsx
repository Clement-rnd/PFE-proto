import {
  View, Text, Pressable, TextInput, StyleSheet, Image,
  Keyboard, Platform, Animated, Easing,
} from 'react-native';
import { SquircleView } from 'react-native-figma-squircle';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { router, useFocusEffect } from 'expo-router';
import { useState, useRef, useEffect, useCallback } from 'react';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { ArrowDown01Icon, ArrowRight01Icon } from '@hugeicons/core-free-icons';
import { CountryPicker } from '../../src/components/ui/CountryPicker';
import { FlagIcon } from '../../src/components/ui/FlagIcon';
import { LogoNaya } from '../../src/components/ui/LogoNaya';
import { DEFAULT_COUNTRY } from '../../src/data/countries';
import type { Country } from '../../src/data/countries';
import { colors } from '../../src/theme/colors';
import { ScreenBackground } from '../../src/components/ui/ScreenBackground';

type CountryWithFlag = Country & { flag: string };

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const mosaicTranslateY = useRef(new Animated.Value(0)).current;
  const mosaicOpacity = useRef(new Animated.Value(1)).current;
  const bottomAnim = useRef(new Animated.Value(0)).current;

  const [country, setCountry] = useState<CountryWithFlag>(DEFAULT_COUNTRY as CountryWithFlag);
  const [phone, setPhone] = useState('');
  const [focused, setFocused] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const inputRef = useRef<TextInput>(null);

  useFocusEffect(useCallback(() => {
    mosaicTranslateY.setValue(0);
    mosaicOpacity.setValue(1);
    bottomAnim.setValue(0);
  }, []));

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showSub = Keyboard.addListener(showEvent, (e) => {
      const h = e.endCoordinates.height;
      const dur = Platform.OS === 'ios' ? e.duration : 280;
      Animated.parallel([
        Animated.timing(mosaicTranslateY, {
          toValue: -h * 0.35,
          duration: dur,
          useNativeDriver: true,
        }),
        Animated.timing(mosaicOpacity, {
          toValue: 0.45,
          duration: dur,
          useNativeDriver: true,
        }),
        Animated.timing(bottomAnim, {
          toValue: -(h - insets.bottom) + 30,
          duration: dur,
          useNativeDriver: true,
        }),
      ]).start();
    });

    const hideSub = Keyboard.addListener(hideEvent, (e) => {
      const dur = Platform.OS === 'ios' ? e.duration + 100 : 380;
      const easing = Easing.out(Easing.cubic);
      Animated.parallel([
        Animated.timing(mosaicTranslateY, {
          toValue: 0,
          duration: dur,
          easing,
          useNativeDriver: true,
        }),
        Animated.timing(mosaicOpacity, {
          toValue: 1,
          duration: dur,
          easing,
          useNativeDriver: true,
        }),
        Animated.timing(bottomAnim, {
          toValue: 0,
          duration: dur,
          easing,
          useNativeDriver: true,
        }),
      ]).start();
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, [insets.bottom]);

  function formatPhone(raw: string): string {
    const d = raw.replace(/\D/g, '').slice(0, 9);
    let out = d.slice(0, 1);
    if (d.length > 1) out += ' ' + d.slice(1, 3);
    if (d.length > 3) out += ' ' + d.slice(3, 5);
    if (d.length > 5) out += ' ' + d.slice(5, 7);
    if (d.length > 7) out += ' ' + d.slice(7, 9);
    return out;
  }

  const isValid = phone.replace(/\D/g, '').length === 9;

  function handleContinue() {
    if (isValid) {
      router.push({
        pathname: '/(auth)/verify',
        params: { phone: `${country.dialCode} ${phone}` },
      });
    }
  }

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
      <ScreenBackground />
      <Pressable style={styles.inner} onPress={Keyboard.dismiss}>

        {/* Zone illustration */}
        <View style={styles.illustrationArea}>
          {/* Mosaïque : glisse vers le haut et fade out */}
          <Animated.View style={[
            styles.mosaicWrapper,
            { transform: [{ translateY: mosaicTranslateY }], opacity: mosaicOpacity },
          ]}>
            <Image
              source={require('../../assets/images/mosaic.png')}
              style={styles.mosaicImage}
              resizeMode="contain"
            />
          </Animated.View>

          {/* Logo : fixe, toujours au-dessus */}
          <View style={styles.logoWrapper} pointerEvents="none">
            <LogoNaya width={197} height={80} />
          </View>
        </View>

        {/* Champ téléphone + lien : remonte avec le clavier */}
        <Animated.View style={[styles.bottom, { transform: [{ translateY: bottomAnim }] }]}>
          <View
            style={[
              styles.field,
              Platform.OS === 'web' && {
                backgroundColor: '#FFFFFF',
                borderRadius: 8,
                borderWidth: 1,
                borderColor: focused ? colors.primary.DEFAULT : '#E8E8E8',
                overflow: 'hidden',
              },
            ]}
          >
            {Platform.OS !== 'web' && (
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
            )}
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
              onChangeText={t => setPhone(formatPhone(t))}
              keyboardType="phone-pad"
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              onSubmitEditing={handleContinue}
              returnKeyType="go"
            />
            {isValid && (
              <Pressable onPress={handleContinue} style={styles.continueBtn}>
                <HugeiconsIcon icon={ArrowRight01Icon} size={20} color="#FFFFFF" strokeWidth={2} />
              </Pressable>
            )}
          </View>

          <Pressable style={styles.problemLink}>
            <Text style={styles.problemText}>Un problème pour vous connecter ?</Text>
          </Pressable>
        </Animated.View>

      </Pressable>

      <CountryPicker
        visible={sheetOpen}
        onClose={() => setSheetOpen(false)}
        onSelect={(c) => { setCountry(c); setPhone(''); }}
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
  },
  mosaicWrapper: {
    ...StyleSheet.absoluteFillObject,
    top: 130,
  },
  mosaicImage: {
    flex: 1,
    width: '100%',
  },
  // Le logo est positionné au-dessus de la mosaïque (rendu après = devant)
  logoWrapper: {
    position: 'absolute',
    top: 70,
    left: 0,
    right: 0,
    alignItems: 'center',
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
  continueBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary.DEFAULT,
    alignItems: 'center',
    justifyContent: 'center',
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
