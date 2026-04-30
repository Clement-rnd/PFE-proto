import { Pressable, Text, StyleSheet } from 'react-native';
import { SquircleView } from 'react-native-figma-squircle';
import { colors } from '../../theme/colors';

interface ButtonProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'danger';
}

export function Button({ label, onPress, disabled = false, variant = 'primary' }: ButtonProps) {
  const fillColor = disabled ? '#E8E8E8' : variant === 'danger' ? colors.danger.DEFAULT : colors.primary.DEFAULT;
  return (
    <Pressable onPress={onPress} disabled={disabled} style={styles.btn}>
      <SquircleView
        squircleParams={{ cornerRadius: 8, cornerSmoothing: 1, fillColor }}
        style={StyleSheet.absoluteFillObject}
        pointerEvents="none"
      />
      <Text style={[styles.label, disabled && styles.labelDisabled]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '400',
    color: '#FCFCFC',
  },
  labelDisabled: {
    color: '#B2B2B2',
  },
});
