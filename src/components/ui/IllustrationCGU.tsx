import Svg, { G, Circle, Rect, Ellipse, Defs, ClipPath } from 'react-native-svg';

interface IllustrationCGUProps {
  size?: number;
}

export function IllustrationCGU({ size = 140 }: IllustrationCGUProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 140 140" fill="none">
      <Defs>
        <ClipPath id="clip0_1868_8362">
          <Rect width="140" height="140" fill="white" />
        </ClipPath>
      </Defs>
      <G clipPath="url(#clip0_1868_8362)">
        <Circle cx="70" cy="70" r="70" fill="#FF597D" fillOpacity="0.07" />
        <Rect x="40" y="30" width="60" height="80" rx="6" fill="white" />
        <Rect x="41" y="31" width="58" height="78" rx="5" stroke="#FF597D" strokeOpacity="0.4" strokeWidth="2" />
        <Rect x="50" y="48" width="40" height="3" rx="1.5" fill="#FF597D" fillOpacity="0.2" />
        <Rect x="50" y="58" width="40" height="3" rx="1.5" fill="#FF597D" fillOpacity="0.2" />
        <Rect x="50" y="68" width="40" height="3" rx="1.5" fill="#FF597D" fillOpacity="0.2" />
        <Rect x="50" y="78" width="28" height="3" rx="1.5" fill="#FF597D" fillOpacity="0.2" />
        <Ellipse cx="80.6846" cy="88.8549" rx="3" ry="3.5" fill="#FF597D" fillOpacity="0.6" />
        <Ellipse cx="87.6846" cy="88.8549" rx="3" ry="3.5" fill="#FF597D" fillOpacity="0.6" />
        <Ellipse cx="75.9507" cy="94.5276" rx="2.5" ry="3" fill="#FF597D" fillOpacity="0.6" />
        <Ellipse cx="92.6318" cy="94.5276" rx="2.5" ry="3" fill="#FF597D" fillOpacity="0.6" />
        <Ellipse cx="84.6846" cy="100.144" rx="7" ry="5" fill="#FF597D" fillOpacity="0.6" />
      </G>
    </Svg>
  );
}
