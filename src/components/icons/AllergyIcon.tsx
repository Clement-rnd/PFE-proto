import Svg, { Rect } from 'react-native-svg';

export function AllergyIcon({ size = 24, color = '#181818' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="13.75" y="15.75" width="3.5" height="3.5" rx="1.75" stroke={color} strokeWidth="1.5" />
      <Rect x="3.75" y="9.75" width="5.5" height="5.5" rx="2.75" stroke={color} strokeWidth="1.5" />
      <Rect x="11.75" y="3.75" width="7.5" height="7.5" rx="3.75" stroke={color} strokeWidth="1.5" />
    </Svg>
  );
}

export const allergyCustomIcon = { isCustom: true as const, component: AllergyIcon };
