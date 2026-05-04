import { StyleSheet, useWindowDimensions } from 'react-native';
import Svg, { Defs, RadialGradient, Stop, Rect } from 'react-native-svg';
import { useId } from 'react';

export function ScreenBackground() {
  const { width, height } = useWindowDimensions();
  const id = useId().replace(/:/g, '');
  const gradientId = `screenBg_${id}`;
  const r = Math.sqrt(width * width + height * height) * 1.8;

  return (
    <Svg width={width} height={height} style={StyleSheet.absoluteFillObject}>
      <Defs>
        <RadialGradient
          id={gradientId}
          cx={0}
          cy={0}
          r={r}
          gradientUnits="userSpaceOnUse"
        >
          <Stop offset="0" stopColor="#FDF7F9" stopOpacity="1" />
          <Stop offset="1" stopColor="#FFFFFF" stopOpacity="1" />
        </RadialGradient>
      </Defs>
      <Rect width={width} height={height} fill={`url(#${gradientId})`} />
    </Svg>
  );
}
