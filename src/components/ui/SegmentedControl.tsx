import { View, Text, Pressable, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';

type Option = { label: string; count: number };

type Props = {
  options: Option[];
  selected: number;
  onChange: (index: number) => void;
};

export function SegmentedControl({ options, selected, onChange }: Props) {
  return (
    <View style={styles.container}>
      {options.map((opt, i) => (
        <Pressable
          key={i}
          style={[styles.segment, i === selected && styles.segmentActive]}
          onPress={() => onChange(i)}
        >
          <Text style={[styles.label, i === selected ? styles.labelActive : styles.labelInactive]}>
            {opt.label} ({opt.count})
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.neutral[100],
    borderRadius: 10,
    padding: 3,
    height: 44,
  },
  segment: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  segmentActive: {
    backgroundColor: colors.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  label: {
    fontSize: 14,
    lineHeight: 14 * 1.2,
  },
  labelActive: {
    fontWeight: '500',
    color: colors.neutral[900],
  },
  labelInactive: {
    fontWeight: '300',
    color: colors.neutral[400],
  },
});
