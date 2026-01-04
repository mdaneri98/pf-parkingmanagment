/**
 * Color Palette
 * Defines the color scheme for the app
 */

export const colors = {
  // Primary colors
  primary: '#2563EB', // Blue
  primaryDark: '#1D4ED8',
  primaryLight: '#60A5FA',

  // Secondary colors
  secondary: '#10B981', // Green
  secondaryDark: '#059669',
  secondaryLight: '#34D399',

  // Accent colors
  accent: '#F59E0B', // Amber
  accentDark: '#D97706',
  accentLight: '#FBBF24',

  // Neutral colors
  white: '#FFFFFF',
  black: '#000000',
  gray50: '#F9FAFB',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray300: '#D1D5DB',
  gray400: '#9CA3AF',
  gray500: '#6B7280',
  gray600: '#4B5563',
  gray700: '#374151',
  gray800: '#1F2937',
  gray900: '#111827',

  // Semantic colors
  success: '#10B981',
  error: '#EF4444',
  warning: '#F59E0B',
  info: '#3B82F6',

  // Background colors
  background: '#FFFFFF',
  backgroundSecondary: '#F9FAFB',
  backgroundDark: '#1F2937',

  // Text colors
  textPrimary: '#111827',
  textSecondary: '#6B7280',
  textTertiary: '#9CA3AF',
  textInverse: '#FFFFFF',

  // Border colors
  border: '#E5E7EB',
  borderDark: '#D1D5DB',

  // Status colors
  statusActive: '#10B981',
  statusPending: '#F59E0B',
  statusCompleted: '#6B7280',
  statusCancelled: '#EF4444',

  // Transparent overlays
  overlay: 'rgba(0, 0, 0, 0.5)',
  overlayLight: 'rgba(0, 0, 0, 0.3)',
} as const;

export type Colors = typeof colors;
export type ColorKey = keyof Colors;

export default colors;
