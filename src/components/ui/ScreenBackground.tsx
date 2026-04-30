import { StyleSheet, useWindowDimensions } from 'react-native';
import Svg, { Defs, RadialGradient, Stop, Rect } from 'react-native-svg';

export function ScreenBackground() {
  const { width, height } = useWindowDimensions();
  const r = Math.sqrt(width * width + height * height) * 1.8;

  return (
    <Svg width={width} height={height} style={StyleSheet.absoluteFillObject}>
      <Defs>
        <RadialGradient
          id="screenBg"
          cx={0}
          cy={0}
          r={r}
          gradientUnits="userSpaceOnUse"
        >
          <Stop offset="0" stopColor="#FDF7F9" stopOpacity="1" />
          <Stop offset="1" stopColor="#FFFFFF" stopOpacity="1" />
        </RadialGradient>
      </Defs>
      <Rect width={width} height={height} fill="url(#screenBg)" />
    </Svg>
  );
}
