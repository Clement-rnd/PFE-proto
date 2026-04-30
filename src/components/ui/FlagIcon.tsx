import { SvgXml } from 'react-native-svg';
import * as flags from 'country-flag-icons/string/3x2';

interface FlagIconProps {
  code: string;
  width?: number;
  height?: number;
}

export function FlagIcon({ code, width = 36, height = 24 }: FlagIconProps) {
  const svg = (flags as Record<string, string>)[code.toUpperCase()];
  if (!svg) return null;
  return <SvgXml xml={svg} width={width} height={height} />;
}
