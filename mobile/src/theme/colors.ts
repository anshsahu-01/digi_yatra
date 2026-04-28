export const Colors = {
  // Core backgrounds
  background: '#0F1419',
  surface: '#1A1F26',
  card: '#242A33',
  cardElevated: '#2D3640',

  // Brand
  primary: '#467EE5',
  primaryLight: '#6B9BF2',
  primaryDark: '#3566C0',
  primaryMuted: 'rgba(70, 126, 229, 0.15)',

  // Accent (green energy)
  accent: '#22C55E',
  accentLight: '#4ADE80',
  accentDark: '#16A34A',
  accentMuted: 'rgba(34, 197, 94, 0.15)',

  // Text
  text: '#F5F5F5',
  textSecondary: '#94A3B8',
  textMuted: '#64748B',
  textInverse: '#0F172A',

  // Status
  success: '#22C55E',
  warning: '#F59E0B',
  error: '#F43F5E',
  info: '#3B82F6',

  // Status muted
  successMuted: 'rgba(34, 197, 94, 0.15)',
  warningMuted: 'rgba(245, 158, 11, 0.15)',
  errorMuted: 'rgba(244, 63, 94, 0.15)',
  infoMuted: 'rgba(59, 130, 246, 0.15)',

  // Borders
  border: '#2D3640',
  borderLight: '#3D4A56',
  borderFocus: '#467EE5',

  // Misc
  white: '#FFFFFF',
  black: '#000000',
  overlay: 'rgba(0, 0, 0, 0.6)',
  skeleton: '#2D3640',
  skeletonHighlight: '#3D4A56',

  // Gradient presets
  gradientPrimary: ['#467EE5', '#3566C0'] as const,
  gradientAccent: ['#22C55E', '#16A34A'] as const,
  gradientDark: ['#1A1F26', '#0F1419'] as const,
  gradientCard: ['rgba(36, 42, 51, 0.9)', 'rgba(26, 31, 38, 0.95)'] as const,
};

export type ColorKey = keyof typeof Colors;
