import React from 'react';
import { HugeiconsIcon } from '@hugeicons/react-native';

type CustomIconDef = {
  isCustom: true;
  component: React.FC<{ size: number; color: string }>;
};

type AppIconProps = {
  icon: CustomIconDef | any;
  size: number;
  color: string;
  strokeWidth?: number;
};

export function AppIcon({ icon, size, color, strokeWidth = 1.5 }: AppIconProps) {
  if (icon && icon.isCustom) {
    const Icon = icon.component as React.FC<{ size: number; color: string }>;
    return <Icon size={size} color={color} />;
  }
  return <HugeiconsIcon icon={icon} size={size} color={color} strokeWidth={strokeWidth} />;
}
