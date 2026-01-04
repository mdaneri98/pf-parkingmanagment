/**
 * Theme System
 * Central export for all theme-related values
 */

import colors from './colors';
import spacing from './spacing';
import typography from './typography';

// ============================================================================
// Theme Object
// ============================================================================

export const theme = {
  colors,
  spacing,
  typography,

  // Border radius
  borderRadius: {
    none: 0,
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    full: 9999,
  },

  // Shadows (iOS/Android compatible)
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 5,
    },
  },
} as const;

export type Theme = typeof theme;

// ============================================================================
// Exports
// ============================================================================

export { colors } from './colors';
export { spacing } from './spacing';
export { typography } from './typography';

export default theme;
