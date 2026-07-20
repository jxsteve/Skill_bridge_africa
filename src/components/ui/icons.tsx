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

export function UserIcon({ size = 20, color = '#6B7280', strokeWidth = 2 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" {...strokeProps(color, strokeWidth)} />
      <Circle cx={12} cy={7} r={4} {...strokeProps(color, strokeWidth)} />
    </Svg>
  );
}

export function MailIcon({ size = 20, color = '#6B7280', strokeWidth = 2 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Rect x={2} y={4} width={20} height={16} rx={2} {...strokeProps(color, strokeWidth)} />
      <Path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" {...strokeProps(color, strokeWidth)} />
    </Svg>
  );
}

export function PhoneIcon({ size = 20, color = '#6B7280', strokeWidth = 2 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
        {...strokeProps(color, strokeWidth)}
      />
    </Svg>
  );
}

export function LockIcon({ size = 20, color = '#6B7280', strokeWidth = 2 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Rect x={3} y={11} width={18} height={11} rx={2} {...strokeProps(color, strokeWidth)} />
      <Path d="M7 11V7a5 5 0 0 1 10 0v4" {...strokeProps(color, strokeWidth)} />
    </Svg>
  );
}

export function CheckIcon({ size = 16, color = '#FFFFFF', strokeWidth = 3 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M20 6 9 17l-5-5" {...strokeProps(color, strokeWidth)} />
    </Svg>
  );
}

export function PlusIcon({ size = 24, color = '#6B7280', strokeWidth = 2 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M5 12h14" {...strokeProps(color, strokeWidth)} />
      <Path d="M12 5v14" {...strokeProps(color, strokeWidth)} />
    </Svg>
  );
}

export function CloseIcon({ size = 14, color = '#FFFFFF', strokeWidth = 2.5 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M18 6 6 18" {...strokeProps(color, strokeWidth)} />
      <Path d="m6 6 12 12" {...strokeProps(color, strokeWidth)} />
    </Svg>
  );
}

export function ChevronLeftIcon({ size = 24, color = '#111827', strokeWidth = 2 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="m15 18-6-6 6-6" {...strokeProps(color, strokeWidth)} />
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
