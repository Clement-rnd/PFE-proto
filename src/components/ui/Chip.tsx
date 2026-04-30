import { Pressable, Text, StyleSheet } from 'react-native';
import { SquircleView } from 'react-native-figma-squircle';
import { colors } from '../../theme/colors';

interface ChipProps {
  label: string;
  selected: boolean;
  onPress: () => void;
}

export function Chip({ label, selected, onPress }: ChipProps) {
  return (
    <Pressable onPress={onPress} style={styles.chip}>
      <SquircleView
        squircleParams={{
          cornerRadius: 8,
          cornerSmoothing: 1,
          fillColor: selected ? colors.primary[50] : '#FFFFFF',
          strokeColor: selected ? colors.primary.DEFAULT : '#E8E8E8',
          strokeWidth: 1,
        }}
        style={StyleSheet.absoluteFillObject}
        pointerEvents="none"
      />
      <Text style={[styles.label, selected && styles.labelSelected]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    flex: 1,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '400',
    color: '#4F4F4F',
  },
  labelSelected: {
    color: colors.primary.DEFAULT,
    fontWeight: '500',
  },
});
