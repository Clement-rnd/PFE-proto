import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { Add01Icon, ArrowLeft01Icon } from '@hugeicons/core-free-icons';
import { PetCard } from '../../src/components/ui/PetCard';
import { Button } from '../../src/components/ui/Button';
import { getPets, subscribe } from '../../src/data/petStore';
import { colors } from '../../src/theme/colors';
import { ScreenBackground } from '../../src/components/ui/ScreenBackground';
import { AnimatedEntry } from '../../src/components/ui/AnimatedEntry';

export default function HealthMyAnimalsScreen() {
  const [pets, setPets] = useState(getPets());

  useEffect(() => {
    return subscribe(() => setPets(getPets()));
  }, []);

  useFocusEffect(useCallback(() => {
    setPets(getPets());
  }, []));

  const isEmpty = pets.length === 0;

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
      <ScreenBackground />

      <AnimatedEntry delay={0}>
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <Pressable onPress={() => router.back()} hitSlop={12}>
              <HugeiconsIcon icon={ArrowLeft01Icon} size={28} color={colors.neutral[900]} strokeWidth={1.5} />
            </Pressable>
            <Text style={styles.title}>Mes animaux</Text>
          </View>
          <Text style={styles.subtitle}>
            Retrouvez et gérez les profils de vos animaux.
          </Text>
        </View>
      </AnimatedEntry>

      {isEmpty ? (
        <AnimatedEntry delay={100} style={styles.emptyWrapper}>
          <View style={styles.emptyContent}>
            <Text style={styles.emptyText}>Vous n'avez pas encore ajouté d'animal.</Text>
            <Button
              label="Ajouter un animal"
              icon={Add01Icon}
              onPress={() => router.push({ pathname: '/(auth)/add-pet', params: { returnBack: '1' } })}
            />
          </View>
        </AnimatedEntry>
      ) : (
        <AnimatedEntry delay={100} style={styles.listWrapper}>
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.list}>
              {pets.map((pet, i) => (
                <PetCard
                  key={i}
                  pet={pet}
                  onPress={() => router.push({ pathname: '/(auth)/edit-pet', params: { index: i } })}
                />
              ))}
            </View>

            <Button
              label="Ajouter un animal"
              icon={Add01Icon}
              onPress={() => router.push({ pathname: '/(auth)/add-pet', params: { returnBack: '1' } })}
            />
          </ScrollView>
        </AnimatedEntry>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: 'transparent' },
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
  title: { fontSize: 20, fontWeight: '500', color: '#181818', flex: 1 },
  subtitle: {
    fontSize: 16,
    fontWeight: '300',
    color: '#4F4F4F',
    lineHeight: 16 * 1.4,
  },
  emptyWrapper: { flex: 1 },
  emptyContent: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 24,
    gap: 24,
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '300',
    color: '#4F4F4F',
    textAlign: 'center',
    lineHeight: 16 * 1.4,
  },
  listWrapper: { flex: 1 },
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 24,
    gap: 16,
  },
  list: { gap: 4 },
});
