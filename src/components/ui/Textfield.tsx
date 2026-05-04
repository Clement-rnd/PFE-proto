import { View, Text, TextInput, Pressable, StyleSheet, Platform } from 'react-native';
import { useRef, useState } from 'react';
import type { KeyboardTypeOptions, ReturnKeyTypeOptions, TextInput as TextInputType } from 'react-native';
import { SquircleView } from 'react-native-figma-squircle';
import { colors } from '../../theme/colors';

interface TextfieldProps {
  label?: string;
  required?: boolean;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  leftSlot?: React.ReactNode;
  rightSlot?: React.ReactNode;
  helperText?: string;
  helperTextType?: 'default' | 'info' | 'success' | 'warning' | 'danger';
  keyboardType?: KeyboardTypeOptions;
  onSubmitEditing?: () => void;
  returnKeyType?: ReturnKeyTypeOptions;
  autoFocus?: boolean;
  secureTextEntry?: boolean;
  editable?: boolean;
}

const helperColors: Record<NonNullable<TextfieldProps['helperTextType']>, string> = {
  default: colors.neutral[500],
  info:    colors.info.DEFAULT,
  success: colors.success.DEFAULT,
  warning: colors.warning.DEFAULT,
  danger:  colors.danger.DEFAULT,
};

export function Textfield({
  label,
  required,
  placeholder,
  value,
  onChangeText,
  leftSlot,
  rightSlot,
  helperText,
  helperTextType = 'default',
  keyboardType = 'default',
  onSubmitEditing,
  returnKeyType,
  autoFocus,
  secureTextEntry,
  editable = true,
}: TextfieldProps) {
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<TextInputType>(null);

  const fillColor = !editable ? colors.neutral[50] : '#FFFFFF';
  const strokeColor = !editable ? colors.neutral[200] : focused ? colors.primary.DEFAULT : '#E8E8E8';

  return (
    <View style={styles.wrapper}>
      {label ? (
        <Text style={styles.label}>
          {label}
          {required ? <Text style={styles.asterisk}>*</Text> : null}
        </Text>
      ) : null}

      <Pressable onPress={() => inputRef.current?.focus()}>
        <View style={styles.content}>
          <SquircleView
            squircleParams={{ cornerRadius: 8, cornerSmoothing: 1, fillColor, strokeColor, strokeWidth: 1 }}
            style={StyleSheet.absoluteFillObject}
            pointerEvents="none"
          />
          {leftSlot ?? null}

          <TextInput
            ref={inputRef}
            style={[styles.input, Platform.OS === 'web' && styles.inputWeb]}
            placeholder={placeholder}
            placeholderTextColor="#B2B2B2"
            value={value}
            onChangeText={onChangeText}
            keyboardType={keyboardType}
            onSubmitEditing={onSubmitEditing}
            returnKeyType={returnKeyType}
            autoFocus={autoFocus}
            secureTextEntry={secureTextEntry}
            editable={editable}
            autoCorrect={keyboardType !== 'email-address'}
            spellCheck={keyboardType !== 'email-address'}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
          />

          {rightSlot ?? null}
        </View>
      </Pressable>

      {helperText ? (
        <Text style={[styles.helperText, { color: helperColors[helperTextType] }]}>
          {helperText}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '300',
    color: colors.neutral[700],
    lineHeight: 14 * 1.2,
  },
  asterisk: {
    color: colors.danger.DEFAULT,
  },
  content: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontWeight: '300',
    color: colors.neutral[900],
    lineHeight: 16 * 1.2,
    paddingVertical: 0,
  },
  inputWeb: {
    outlineStyle: 'none',
  } as any,
  helperText: {
    fontSize: 12,
    fontWeight: '300',
    lineHeight: 12 * 1.2,
  },
});
