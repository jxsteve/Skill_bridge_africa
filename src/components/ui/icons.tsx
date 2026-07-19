import React from 'react';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

type IconProps = {
  size?: number;
  color?: string;
  strokeWidth?: number;
};

const strokeProps = (color: string, strokeWidth: number) =>
  ({
    stroke: color,
    strokeWidth,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    fill: 'none',
  }) as const;

export function ChevronRightIcon({ size = 20, color = '#FFFFFF', strokeWidth = 2 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="m9 18 6-6-6-6" {...strokeProps(color, strokeWidth)} />
    </Svg>
  );
}

export function CornerUpLeftIcon({ size = 16, color = '#124CC9', strokeWidth = 2 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M20 20v-7a4 4 0 0 0-4-4H4" {...strokeProps(color, strokeWidth)} />
      <Path d="M9 14 4 9l5-5" {...strokeProps(color, strokeWidth)} />
    </Svg>
  );
}

export function EyeIcon({ size = 16, color = '#374151', strokeWidth = 2 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"
        {...strokeProps(color, strokeWidth)}
      />
      <Circle cx={12} cy={12} r={3} {...strokeProps(color, strokeWidth)} />
    </Svg>
  );
}

export function EyeOffIcon({ size = 16, color = '#374151', strokeWidth = 2 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49"
        {...strokeProps(color, strokeWidth)}
      />
      <Path d="M14.084 14.158a3 3 0 0 1-4.242-4.242" {...strokeProps(color, strokeWidth)} />
      <Path
        d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143"
        {...strokeProps(color, strokeWidth)}
      />
      <Path d="m2 2 20 20" {...strokeProps(color, strokeWidth)} />
    </Svg>
  );
}

export function GraduationCapIcon({ size = 56, color = '#0E3A9A', strokeWidth = 2 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"
        {...strokeProps(color, strokeWidth)}
      />
      <Path d="M22 10v6" {...strokeProps(color, strokeWidth)} />
      <Path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5" {...strokeProps(color, strokeWidth)} />
    </Svg>
  );
}

export function BriefcaseBusinessIcon({ size = 56, color = '#107535', strokeWidth = 2 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M12 12h.01" {...strokeProps(color, strokeWidth)} />
      <Path d="M16 6V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" {...strokeProps(color, strokeWidth)} />
      <Path d="M22 13a18.15 18.15 0 0 1-20 0" {...strokeProps(color, strokeWidth)} />
      <Rect x={2} y={6} width={20} height={14} rx={2} {...strokeProps(color, strokeWidth)} />
    </Svg>
  );
}
