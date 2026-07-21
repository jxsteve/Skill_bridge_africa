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

export function CopyIcon({ size = 18, color = '#FFFFFF', strokeWidth = 2 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Rect x={8} y={8} width={14} height={14} rx={2} {...strokeProps(color, strokeWidth)} />
      <Path
        d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"
        {...strokeProps(color, strokeWidth)}
      />
    </Svg>
  );
}

export function CheckCircleIcon({ size = 16, color = '#16A34A', strokeWidth = 2 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M21.801 10A10 10 0 1 1 17 3.335" {...strokeProps(color, strokeWidth)} />
      <Path d="m9 11 3 3L22 4" {...strokeProps(color, strokeWidth)} />
    </Svg>
  );
}

export function ChevronDownIcon({ size = 20, color = '#6B7280', strokeWidth = 2 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="m6 9 6 6 6-6" {...strokeProps(color, strokeWidth)} />
    </Svg>
  );
}

export function BellIcon({ size = 24, color = '#111827', strokeWidth = 2 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M10.268 21a2 2 0 0 0 3.464 0" {...strokeProps(color, strokeWidth)} />
      <Path
        d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326"
        {...strokeProps(color, strokeWidth)}
      />
    </Svg>
  );
}

export function WalletIcon({ size = 20, color = '#6014E0', strokeWidth = 2 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"
        {...strokeProps(color, strokeWidth)}
      />
      <Path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4" {...strokeProps(color, strokeWidth)} />
    </Svg>
  );
}

export function SearchIcon({ size = 20, color = '#111827', strokeWidth = 2 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Circle cx={11} cy={11} r={8} {...strokeProps(color, strokeWidth)} />
      <Path d="m21 21-4.3-4.3" {...strokeProps(color, strokeWidth)} />
    </Svg>
  );
}

export function UsersIcon({ size = 20, color = '#111827', strokeWidth = 2 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" {...strokeProps(color, strokeWidth)} />
      <Circle cx={9} cy={7} r={4} {...strokeProps(color, strokeWidth)} />
      <Path d="M22 21v-2a4 4 0 0 0-3-3.87" {...strokeProps(color, strokeWidth)} />
      <Path d="M16 3.13a4 4 0 0 1 0 7.75" {...strokeProps(color, strokeWidth)} />
    </Svg>
  );
}

export function ClipboardListIcon({ size = 48, color = '#6014E0', strokeWidth = 2 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Rect x={8} y={2} width={8} height={4} rx={1} {...strokeProps(color, strokeWidth)} />
      <Path
        d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"
        {...strokeProps(color, strokeWidth)}
      />
      <Path d="M12 11h4" {...strokeProps(color, strokeWidth)} />
      <Path d="M12 16h4" {...strokeProps(color, strokeWidth)} />
      <Path d="M8 11h.01" {...strokeProps(color, strokeWidth)} />
      <Path d="M8 16h.01" {...strokeProps(color, strokeWidth)} />
    </Svg>
  );
}

export function HomeIcon({ size = 22, color = '#111827', strokeWidth = 2 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"
        {...strokeProps(color, strokeWidth)}
      />
      <Path
        d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"
        {...strokeProps(color, strokeWidth)}
      />
    </Svg>
  );
}

export function ActivityIcon({ size = 16, color = '#6014E0', strokeWidth = 2 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"
        {...strokeProps(color, strokeWidth)}
      />
    </Svg>
  );
}

export function DollarSignIcon({ size = 16, color = '#16A34A', strokeWidth = 2 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M12 2v20" {...strokeProps(color, strokeWidth)} />
      <Path
        d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"
        {...strokeProps(color, strokeWidth)}
      />
    </Svg>
  );
}

export function IdCardIcon({ size = 18, color = '#6014E0', strokeWidth = 2 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M16 10h2" {...strokeProps(color, strokeWidth)} />
      <Path d="M16 14h2" {...strokeProps(color, strokeWidth)} />
      <Path d="M6.17 15a3 3 0 0 1 5.66 0" {...strokeProps(color, strokeWidth)} />
      <Circle cx={9} cy={11} r={2} {...strokeProps(color, strokeWidth)} />
      <Rect x={2} y={5} width={20} height={14} rx={2} {...strokeProps(color, strokeWidth)} />
    </Svg>
  );
}

export function MessageSquareIcon({ size = 18, color = '#6014E0', strokeWidth = 2 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
        {...strokeProps(color, strokeWidth)}
      />
    </Svg>
  );
}

export function SlidersIcon({ size = 20, color = '#374151', strokeWidth = 2 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3" {...strokeProps(color, strokeWidth)} />
      <Path d="M1 14h6M9 8h6M17 16h6" {...strokeProps(color, strokeWidth)} />
    </Svg>
  );
}

export function BookmarkIcon({ size = 20, color = '#124CC9', strokeWidth = 2, filled = false }: IconProps & { filled?: boolean }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill={filled ? color : 'none'}
      />
    </Svg>
  );
}

export function DownloadIcon({ size = 18, color = '#124CC9', strokeWidth = 2 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" {...strokeProps(color, strokeWidth)} />
      <Path d="M7 10l5 5 5-5M12 15V3" {...strokeProps(color, strokeWidth)} />
    </Svg>
  );
}

export function FileIcon({ size = 22, color = '#DC2626', strokeWidth = 2 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z"
        {...strokeProps(color, strokeWidth)}
      />
      <Path d="M14 2v5h5" {...strokeProps(color, strokeWidth)} />
    </Svg>
  );
}

export function UploadCloudIcon({ size = 28, color = '#124CC9', strokeWidth = 2 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M12 13v8M8 17l4-4 4 4" {...strokeProps(color, strokeWidth)} />
      <Path
        d="M20 16.58A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25"
        {...strokeProps(color, strokeWidth)}
      />
    </Svg>
  );
}

export function ArrowRightCircleIcon({ size = 20, color = '#124CC9', strokeWidth = 2 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Circle cx={12} cy={12} r={10} {...strokeProps(color, strokeWidth)} />
      <Path d="M12 8l4 4-4 4M8 12h8" {...strokeProps(color, strokeWidth)} />
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
