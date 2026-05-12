import { Pressable, Text, StyleSheet, Platform, View } from 'react-native';
import { SquircleView } from 'react-native-figma-squircle';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { colors } from '../../theme/colors';

type IconType = React.ComponentProps<typeof HugeiconsIcon>['icon'];

interface ButtonProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
  icon?: IconType;
}

export function Button({ label, onPress, disabled = false, variant = 'primary', icon }: ButtonProps) {
  const isSecondary = variant === 'secondary';
  const fillColor = disabled
    ? '#E8E8E8'
    : isSecondary
    ? colors.neutral[100]
    : variant === 'danger'
    ? colors.danger.DEFAULT
    : colors.primary.DEFAULT;
  const contentColor = disabled ? '#B2B2B2' : isSecondary ? colors.neutral[900] : '#FCFCFC';

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.btn,
        Platform.OS === 'web' && { backgroundColor: fillColor, borderRadius: 8 },
      ]}
    >
      {Platform.OS !== 'web' && (
        <SquircleView
          squircleParams={{ cornerRadius: 8, cornerSmoothing: 1, fillColor }}
          style={StyleSheet.absoluteFillObject}
          pointerEvents="none"
        />
      )}
      <View style={styles.content}>
        {icon && <HugeiconsIcon icon={icon} size={24} color={contentColor} strokeWidth={1.5} />}
        <Text style={[styles.label, { color: contentColor }, disabled && styles.labelDisabled]}>{label}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  label: {
    fontSize: 16,
    fontWeight: '400',
  },
  labelDisabled: {
    color: '#B2B2B2',
  },
});
