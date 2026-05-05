import { View, Text, Pressable, StyleSheet, Platform } from 'react-native';
import { SquircleView } from 'react-native-figma-squircle';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { Add01Icon } from '@hugeicons/core-free-icons';
import { PetCard } from '../../src/components/ui/PetCard';
import { Button } from '../../src/components/ui/Button';
import { getPets, subscribe } from '../../src/data/petStore';
import { colors } from '../../src/theme/colors';
import { ScreenBackground } from '../../src/components/ui/ScreenBackground';
import { AnimatedEntry } from '../../src/components/ui/AnimatedEntry';

export default function MyPetsScreen() {
  const [pets, setPets] = useState(getPets());

  useEffect(() => {
    return subscribe(() => setPets(getPets()));
  }, []);

  useFocusEffect(useCallback(() => {
    setPets(getPets());
  }, []));

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
      <ScreenBackground />
      <View style={styles.body}>
        <AnimatedEntry delay={0}>
          <Text style={styles.title}>Vos animaux</Text>
        </AnimatedEntry>

        <AnimatedEntry delay={100} style={styles.content}>
          <View style={styles.list}>
            {pets.map((pet, i) => (
              <PetCard
                key={i}
                pet={pet}
                onPress={() => router.push({ pathname: '/(auth)/edit-pet', params: { index: i } })}
              />
            ))}
          </View>

          <Pressable
            onPress={() => router.push('/(auth)/add-pet')}
            style={[styles.addBtn, Platform.OS === 'web' && { backgroundColor: '#FAFAFA', borderRadius: 8, borderWidth: 1, borderColor: '#E8E8E8' }]}
          >
            {Platform.OS !== 'web' && (
              <SquircleView
                squircleParams={{ cornerRadius: 8, cornerSmoothing: 1, fillColor: '#FAFAFA', strokeColor: '#E8E8E8', strokeWidth: 1 }}
                style={StyleSheet.absoluteFillObject}
                pointerEvents="none"
              />
            )}
            <HugeiconsIcon icon={Add01Icon} size={24} color="#181818" strokeWidth={1.5} />
            <Text style={styles.addBtnLabel}>Ajouter un animal</Text>
          </Pressable>
        </AnimatedEntry>

        <AnimatedEntry delay={200}>
          <Button label="Terminer" onPress={() => router.replace('/(tabs)/home')} />
        </AnimatedEntry>
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
  content: {
    flex: 1,
    gap: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '500',
    color: '#181818',
    height: 44,
    lineHeight: 44,
  },
  list: { gap: 8 },
  addBtn: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  addBtnLabel: { fontSize: 16, fontWeight: '400', color: '#181818' },
});
