type IconProps = {
  size?: number;
  color?: string;
  strokeWidth?: number;
};

function stroke(color: string, w: number) {
  return {
    stroke: color,
    strokeWidth: w,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    fill: 'none',
  };
}

function Svg({ size, children }: { size: number; children: React.ReactNode }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
      {children}
    </svg>
  );
}

export const ChevronRightIcon = ({ size = 20, color = '#FFFFFF', strokeWidth = 2 }: IconProps) => (
  <Svg size={size}><path d="m9 18 6-6-6-6" {...stroke(color, strokeWidth)} /></Svg>
);
export const ChevronLeftIcon = ({ size = 24, color = '#111827', strokeWidth = 2 }: IconProps) => (
  <Svg size={size}><path d="m15 18-6-6 6-6" {...stroke(color, strokeWidth)} /></Svg>
);
export const ChevronDownIcon = ({ size = 20, color = '#6B7280', strokeWidth = 2 }: IconProps) => (
  <Svg size={size}><path d="m6 9 6 6 6-6" {...stroke(color, strokeWidth)} /></Svg>
);
export const EyeIcon = ({ size = 16, color = '#374151', strokeWidth = 2 }: IconProps) => (
  <Svg size={size}>
    <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" {...stroke(color, strokeWidth)} />
    <circle cx={12} cy={12} r={3} {...stroke(color, strokeWidth)} />
  </Svg>
);
export const EyeOffIcon = ({ size = 16, color = '#374151', strokeWidth = 2 }: IconProps) => (
  <Svg size={size}>
    <path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49" {...stroke(color, strokeWidth)} />
    <path d="M14.084 14.158a3 3 0 0 1-4.242-4.242" {...stroke(color, strokeWidth)} />
    <path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143" {...stroke(color, strokeWidth)} />
    <path d="m2 2 20 20" {...stroke(color, strokeWidth)} />
  </Svg>
);
export const UserIcon = ({ size = 20, color = '#6B7280', strokeWidth = 2 }: IconProps) => (
  <Svg size={size}>
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" {...stroke(color, strokeWidth)} />
    <circle cx={12} cy={7} r={4} {...stroke(color, strokeWidth)} />
  </Svg>
);
export const MailIcon = ({ size = 20, color = '#6B7280', strokeWidth = 2 }: IconProps) => (
  <Svg size={size}>
    <rect x={2} y={4} width={20} height={16} rx={2} {...stroke(color, strokeWidth)} />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" {...stroke(color, strokeWidth)} />
  </Svg>
);
export const PhoneIcon = ({ size = 20, color = '#6B7280', strokeWidth = 2 }: IconProps) => (
  <Svg size={size}>
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" {...stroke(color, strokeWidth)} />
  </Svg>
);
export const CheckIcon = ({ size = 16, color = '#FFFFFF', strokeWidth = 3 }: IconProps) => (
  <Svg size={size}><path d="M20 6 9 17l-5-5" {...stroke(color, strokeWidth)} /></Svg>
);
export const CheckCircleIcon = ({ size = 16, color = '#16A34A', strokeWidth = 2 }: IconProps) => (
  <Svg size={size}>
    <path d="M21.801 10A10 10 0 1 1 17 3.335" {...stroke(color, strokeWidth)} />
    <path d="m9 11 3 3L22 4" {...stroke(color, strokeWidth)} />
  </Svg>
);
export const GraduationCapIcon = ({ size = 56, color = '#0E3A9A', strokeWidth = 2 }: IconProps) => (
  <Svg size={size}>
    <path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z" {...stroke(color, strokeWidth)} />
    <path d="M22 10v6" {...stroke(color, strokeWidth)} />
    <path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5" {...stroke(color, strokeWidth)} />
  </Svg>
);
export const BriefcaseBusinessIcon = ({ size = 56, color = '#107535', strokeWidth = 2 }: IconProps) => (
  <Svg size={size}>
    <path d="M12 12h.01" {...stroke(color, strokeWidth)} />
    <path d="M16 6V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" {...stroke(color, strokeWidth)} />
    <path d="M22 13a18.15 18.15 0 0 1-20 0" {...stroke(color, strokeWidth)} />
    <rect x={2} y={6} width={20} height={14} rx={2} {...stroke(color, strokeWidth)} />
  </Svg>
);
export const BellIcon = ({ size = 24, color = '#111827', strokeWidth = 2 }: IconProps) => (
  <Svg size={size}>
    <path d="M10.268 21a2 2 0 0 0 3.464 0" {...stroke(color, strokeWidth)} />
    <path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326" {...stroke(color, strokeWidth)} />
  </Svg>
);
export const WalletIcon = ({ size = 20, color = '#6014E0', strokeWidth = 2 }: IconProps) => (
  <Svg size={size}>
    <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1" {...stroke(color, strokeWidth)} />
    <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4" {...stroke(color, strokeWidth)} />
  </Svg>
);
export const SearchIcon = ({ size = 20, color = '#111827', strokeWidth = 2 }: IconProps) => (
  <Svg size={size}>
    <circle cx={11} cy={11} r={8} {...stroke(color, strokeWidth)} />
    <path d="m21 21-4.3-4.3" {...stroke(color, strokeWidth)} />
  </Svg>
);
export const UsersIcon = ({ size = 20, color = '#111827', strokeWidth = 2 }: IconProps) => (
  <Svg size={size}>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" {...stroke(color, strokeWidth)} />
    <circle cx={9} cy={7} r={4} {...stroke(color, strokeWidth)} />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" {...stroke(color, strokeWidth)} />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" {...stroke(color, strokeWidth)} />
  </Svg>
);
export const ClipboardListIcon = ({ size = 48, color = '#6014E0', strokeWidth = 2 }: IconProps) => (
  <Svg size={size}>
    <rect x={8} y={2} width={8} height={4} rx={1} {...stroke(color, strokeWidth)} />
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" {...stroke(color, strokeWidth)} />
    <path d="M12 11h4" {...stroke(color, strokeWidth)} />
    <path d="M12 16h4" {...stroke(color, strokeWidth)} />
    <path d="M8 11h.01" {...stroke(color, strokeWidth)} />
    <path d="M8 16h.01" {...stroke(color, strokeWidth)} />
  </Svg>
);
export const HomeIcon = ({ size = 22, color = '#111827', strokeWidth = 2 }: IconProps) => (
  <Svg size={size}>
    <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" {...stroke(color, strokeWidth)} />
    <path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" {...stroke(color, strokeWidth)} />
  </Svg>
);
export const ActivityIcon = ({ size = 16, color = '#6014E0', strokeWidth = 2 }: IconProps) => (
  <Svg size={size}>
    <path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2" {...stroke(color, strokeWidth)} />
  </Svg>
);
export const DollarSignIcon = ({ size = 16, color = '#16A34A', strokeWidth = 2 }: IconProps) => (
  <Svg size={size}>
    <path d="M12 2v20" {...stroke(color, strokeWidth)} />
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" {...stroke(color, strokeWidth)} />
  </Svg>
);
export const IdCardIcon = ({ size = 18, color = '#6014E0', strokeWidth = 2 }: IconProps) => (
  <Svg size={size}>
    <path d="M16 10h2" {...stroke(color, strokeWidth)} />
    <path d="M16 14h2" {...stroke(color, strokeWidth)} />
    <path d="M6.17 15a3 3 0 0 1 5.66 0" {...stroke(color, strokeWidth)} />
    <circle cx={9} cy={11} r={2} {...stroke(color, strokeWidth)} />
    <rect x={2} y={5} width={20} height={14} rx={2} {...stroke(color, strokeWidth)} />
  </Svg>
);
export const MessageSquareIcon = ({ size = 18, color = '#6014E0', strokeWidth = 2 }: IconProps) => (
  <Svg size={size}>
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" {...stroke(color, strokeWidth)} />
  </Svg>
);
export const SlidersIcon = ({ size = 20, color = '#374151', strokeWidth = 2 }: IconProps) => (
  <Svg size={size}>
    <path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3" {...stroke(color, strokeWidth)} />
    <path d="M1 14h6M9 8h6M17 16h6" {...stroke(color, strokeWidth)} />
  </Svg>
);
export const BookmarkIcon = ({ size = 20, color = '#124CC9', strokeWidth = 2, filled = false }: IconProps & { filled?: boolean }) => (
  <Svg size={size}>
    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" fill={filled ? color : 'none'} />
  </Svg>
);
export const DownloadIcon = ({ size = 18, color = '#124CC9', strokeWidth = 2 }: IconProps) => (
  <Svg size={size}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" {...stroke(color, strokeWidth)} />
    <path d="M7 10l5 5 5-5M12 15V3" {...stroke(color, strokeWidth)} />
  </Svg>
);
export const FileIcon = ({ size = 22, color = '#DC2626', strokeWidth = 2 }: IconProps) => (
  <Svg size={size}>
    <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z" {...stroke(color, strokeWidth)} />
    <path d="M14 2v5h5" {...stroke(color, strokeWidth)} />
  </Svg>
);
export const UploadCloudIcon = ({ size = 28, color = '#124CC9', strokeWidth = 2 }: IconProps) => (
  <Svg size={size}>
    <path d="M12 13v8M8 17l4-4 4 4" {...stroke(color, strokeWidth)} />
    <path d="M20 16.58A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25" {...stroke(color, strokeWidth)} />
  </Svg>
);
export const ArrowRightCircleIcon = ({ size = 20, color = '#124CC9', strokeWidth = 2 }: IconProps) => (
  <Svg size={size}>
    <circle cx={12} cy={12} r={10} {...stroke(color, strokeWidth)} />
    <path d="M12 8l4 4-4 4M8 12h8" {...stroke(color, strokeWidth)} />
  </Svg>
);
export const StarIcon = ({ size = 16, color = '#F0A32E' }: IconProps) => (
  <Svg size={size}>
    <path
      d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.12 2.12 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.12 2.12 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.12 2.12 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.12 2.12 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.12 2.12 0 0 0 1.597-1.16z"
      fill={color}
    />
  </Svg>
);
export const CameraIcon = ({ size = 16, color = '#FFFFFF', strokeWidth = 2 }: IconProps) => (
  <Svg size={size}>
    <path
      d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3z"
      {...stroke(color, strokeWidth)}
    />
    <circle cx={12} cy={13} r={3} {...stroke(color, strokeWidth)} />
  </Svg>
);
export const CopyIcon = ({ size = 18, color = '#FFFFFF', strokeWidth = 2 }: IconProps) => (
  <Svg size={size}>
    <rect x={8} y={8} width={14} height={14} rx={2} {...stroke(color, strokeWidth)} />
    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" {...stroke(color, strokeWidth)} />
  </Svg>
);
