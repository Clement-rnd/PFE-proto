import { View, Text, Pressable, StyleSheet, Platform } from 'react-native';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { ArrowRight01Icon, FemaleSymbolIcon, MaleSymbolIcon } from '@hugeicons/core-free-icons';
import { SquircleView } from 'react-native-figma-squircle';
import { colors } from '../../theme/colors';
import type { Pet } from '../../data/petStore';
import { computeAge } from '../../data/petStore';

interface PetCardProps {
  pet: Pet;
  onPress?: () => void;
}

export function PetCard({ pet, onPress }: PetCardProps) {
  const age = computeAge(pet.birthDate);
  const raceLabel = pet.races.length === 2 ? 'croisé' : pet.races.join(' · ');
  const breedLine = [pet.species, raceLabel].filter(Boolean).join(' · ');
  const isFemale = pet.sex === 'Femelle';
  const isMale = pet.sex === 'Mâle';

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.card,
        Platform.OS === 'web' && { backgroundColor: '#FFFFFF', borderRadius: 8, borderWidth: 1, borderColor: '#FCEEF1' },
      ]}
    >
      {Platform.OS !== 'web' && (
        <SquircleView
          squircleParams={{ cornerRadius: 8, cornerSmoothing: 1, fillColor: '#FFFFFF', strokeColor: '#FCEEF1', strokeWidth: 1 }}
          style={StyleSheet.absoluteFillObject}
          pointerEvents="none"
        />
      )}

      {/* Avatar */}
      <View style={styles.avatar}>
        <View style={styles.avatarPlaceholder} />
      </View>

      {/* Info */}
      <View style={styles.info}>
        <View style={styles.nameRow}>
          <Text style={styles.name}>{pet.name}</Text>
          {isFemale && (
            <HugeiconsIcon icon={FemaleSymbolIcon} size={16} color={colors.primary.DEFAULT} strokeWidth={1.5} />
          )}
          {isMale && (
            <HugeiconsIcon icon={MaleSymbolIcon} size={16} color="#4F9EF8" strokeWidth={1.5} />
          )}
        </View>
        {breedLine ? <Text style={styles.sub} numberOfLines={1}>{breedLine}</Text> : null}
        {age ? <Text style={styles.sub}>{age}</Text> : null}
      </View>

      {/* Chevron */}
      <HugeiconsIcon icon={ArrowRight01Icon} size={20} color={colors.neutral[400]} strokeWidth={1.5} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    gap: 8,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 4,
    overflow: 'hidden',
  },
  avatarPlaceholder: {
    flex: 1,
    backgroundColor: '#E8E8E8',
  },
  info: {
    flex: 1,
    gap: 4,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  name: {
    fontSize: 20,
    fontWeight: '500',
    color: '#181818',
  },
  sub: {
    fontSize: 14,
    fontWeight: '300',
    color: '#4F4F4F',
    lineHeight: 14 * 1.2,
  },
});
