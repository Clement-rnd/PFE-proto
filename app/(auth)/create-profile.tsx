import { View, Text, Pressable, ScrollView, StyleSheet, Platform } from 'react-native';
import { SquircleView } from 'react-native-figma-squircle';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { ArrowLeft01Icon, ArrowDown01Icon, Calendar04Icon } from '@hugeicons/core-free-icons';
import { Textfield } from '../../src/components/ui/Textfield';
import { Button } from '../../src/components/ui/Button';
import { CountryPicker } from '../../src/components/ui/CountryPicker';
import { FlagIcon } from '../../src/components/ui/FlagIcon';
import { DEFAULT_COUNTRY } from '../../src/data/countries';
import type { Country } from '../../src/data/countries';
import { formatDate, isDateComplete } from '../../src/utils/date';
import { colors } from '../../src/theme/colors';
import { AnimatedEntry } from '../../src/components/ui/AnimatedEntry';

type CountryWithFlag = Country & { flag: string };

export default function CreateProfileScreen() {
  const insets = useSafeAreaInsets();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [email, setEmail] = useState('');
  const [country, setCountry] = useState<CountryWithFlag>(DEFAULT_COUNTRY as CountryWithFlag);
  const [pickerOpen, setPickerOpen] = useState(false);

  const isValid = firstName.trim().length > 0
    && lastName.trim().length > 0
    && isDateComplete(birthDate);

  function handleContinue() {
    if (isValid) {
      router.push('/(auth)/terms');
    }
  }

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <AnimatedEntry delay={0}>
      {/* Header fixe */}
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Pressable onPress={() => router.replace('/(auth)/login')} hitSlop={12}>
            <HugeiconsIcon icon={ArrowLeft01Icon} size={28} color={colors.neutral[900]} strokeWidth={1.5} />
          </Pressable>
          <Text style={styles.title}>Complétez votre profil</Text>
        </View>
        <Text style={styles.description}>
          Ajoutez vos informations personnelles pour terminer la configuration de votre compte.
        </Text>
      </View>
      </AnimatedEntry>

      <AnimatedEntry delay={100} style={{ flex: 1 }}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 16 }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        automaticallyAdjustKeyboardInsets
      >
        {/* Champs */}
        <View style={styles.form}>
          <Textfield
            label="Prénom"
            required
            placeholder="Entrez votre prénom"
            value={firstName}
            onChangeText={setFirstName}
            returnKeyType="next"
          />
          <Textfield
            label="Nom de famille"
            required
            placeholder="Entrez votre nom de famille"
            value={lastName}
            onChangeText={setLastName}
            returnKeyType="next"
          />
          <Textfield
            label="Date de naissance"
            required
            placeholder="JJ/MM/AAAA"
            value={birthDate}
            onChangeText={t => setBirthDate(formatDate(t))}
            keyboardType="number-pad"
            returnKeyType="next"
            rightSlot={
              <HugeiconsIcon icon={Calendar04Icon} size={24} color={colors.neutral[400]} strokeWidth={1.5} />
            }
          />
          <Textfield
            label="Adresse mail"
            placeholder="Entrez votre adresse mail"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            returnKeyType="done"
          />

          {/* Dropdown pays de résidence */}
          <View style={styles.dropdownWrapper}>
            <Text style={styles.dropdownLabel}>
              Pays de résidence<Text style={styles.asterisk}>*</Text>
            </Text>
            <Pressable
              onPress={() => setPickerOpen(true)}
              style={[
                styles.dropdown,
                Platform.OS === 'web' && { backgroundColor: '#FFFFFF', borderRadius: 8, borderWidth: 1, borderColor: '#E8E8E8' },
              ]}
            >
              {Platform.OS !== 'web' && (
                <SquircleView
                  squircleParams={{ cornerRadius: 8, cornerSmoothing: 1, fillColor: '#FFFFFF', strokeColor: '#E8E8E8', strokeWidth: 1 }}
                  style={StyleSheet.absoluteFillObject}
                  pointerEvents="none"
                />
              )}
              <View style={styles.flagBox}>
                <FlagIcon code={country.code} width={36} height={24} />
              </View>
              <Text style={styles.dropdownValue}>{country.name}</Text>
              <HugeiconsIcon icon={ArrowDown01Icon} size={24} color={colors.neutral[500]} strokeWidth={1.5} />
            </Pressable>
          </View>
        </View>

        <View style={{ flex: 1 }} />
        <Button label="Créer un compte" onPress={handleContinue} disabled={!isValid} />
      </ScrollView>
      </AnimatedEntry>

      <CountryPicker
        visible={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={setCountry}
        selected={country}
        showDialCode={false}
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
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 30,
    gap: 24,
  },
  header: {
    gap: 4,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    height: 44,
  },
  title: {
    fontSize: 20,
    fontWeight: '500',
    color: '#181818',
    flex: 1,
  },
  description: {
    fontSize: 16,
    fontWeight: '300',
    color: colors.neutral[600],
    lineHeight: 16 * 1.4,
  },
  form: {
    gap: 16,
  },
  dropdownWrapper: {
    gap: 8,
  },
  dropdownLabel: {
    fontSize: 14,
    fontWeight: '300',
    color: colors.neutral[700],
    lineHeight: 14 * 1.2,
  },
  asterisk: {
    color: colors.danger.DEFAULT,
  },
  dropdown: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 8,
  },
  flagBox: {
    width: 36,
    height: 24,
    borderRadius: 3,
    overflow: 'hidden',
  },
  dropdownValue: {
    flex: 1,
    fontSize: 16,
    fontWeight: '400',
    color: '#181818',
  },
});
