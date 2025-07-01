// Modern Dark Mode Theme System
export const theme = {
  colors: {
    // Primary Dark Mode Colors
    background: '#0A0A0B',           // Deep black background
    surface: '#1C1C1E',             // Slightly lighter surface
    surfaceSecondary: '#2C2C2E',    // Even lighter surface for cards
    surfaceTertiary: '#3A3A3C',     // Lightest surface for elevated elements
    
    // Text Colors
    text: '#FFFFFF',                // Primary white text
    textSecondary: '#8E8E93',       // Secondary gray text
    textTertiary: '#6D6D70',        // Tertiary muted text
    textInverse: '#000000',         // Black text for light backgrounds
    
    // Accent Colors
    primary: '#007AFF',             // iOS Blue
    primaryDark: '#0056CC',         // Darker blue for pressed states
    success: '#34C759',             // Green for success/money
    warning: '#FF9500',             // Orange for warnings
    error: '#FF3B30',               // Red for errors
    
    // Modern Accent Colors (Robinhood-inspired)
    teal: '#00D4AA',               // Modern teal
    tealDark: '#00B794',           // Darker teal
    purple: '#6C5CE7',             // Modern purple
    purpleDark: '#574BCE',         // Darker purple
    mint: '#63E6BE',               // Mint green
    mintDark: '#4ECDC4',           // Darker mint
    coral: '#FF6B6B',              // Coral red
    coralDark: '#FF5252',          // Darker coral
    
    // Soft pastels for subtle accents
    softTeal: 'rgba(0, 212, 170, 0.1)',
    softPurple: 'rgba(108, 92, 231, 0.1)',
    softMint: 'rgba(99, 230, 190, 0.1)',
    softCoral: 'rgba(255, 107, 107, 0.1)',
    
    // Borders and Dividers
    border: '#38383A',             // Subtle borders
    divider: '#48484A',            // Dividers between sections
    
    // Special Effects
    shadow: 'rgba(0, 0, 0, 0.3)',
    shadowLight: 'rgba(0, 0, 0, 0.15)',
    overlay: 'rgba(0, 0, 0, 0.6)',
    card: '#1C1C1E',
    cardElevated: '#2C2C2E',
    cardHighlight: '#3A3A3C',
  },
  
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
    xxxl: 64,
    xxxxl: 80,
  },
  
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 28,
    xxxl: 36,
    pill: 50,
    circle: 999,
  },
  
  typography: {
    // Massive display numbers (Robinhood-style)
    hero: {
      fontSize: 72,
      fontWeight: '100',
      lineHeight: 80,
    },
    // Large Display Numbers
    display: {
      fontSize: 56,
      fontWeight: '200',
      lineHeight: 64,
    },
    // Main Amount Numbers
    amount: {
      fontSize: 48,
      fontWeight: '300',
      lineHeight: 56,
    },
    // Medium amounts
    amountMedium: {
      fontSize: 36,
      fontWeight: '300',
      lineHeight: 42,
    },
    // Section Headers
    title: {
      fontSize: 28,
      fontWeight: '600',
      lineHeight: 34,
    },
    // Card Headers
    heading: {
      fontSize: 20,
      fontWeight: '600',
      lineHeight: 25,
    },
    // Body Text
    body: {
      fontSize: 17,
      fontWeight: '400',
      lineHeight: 22,
    },
    // Secondary Text
    caption: {
      fontSize: 15,
      fontWeight: '400',
      lineHeight: 20,
    },
    // Small Text
    footnote: {
      fontSize: 13,
      fontWeight: '400',
      lineHeight: 18,
    },
    // Tiny text
    micro: {
      fontSize: 11,
      fontWeight: '400',
      lineHeight: 14,
    },
  },
  
  shadows: {
    none: {},
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 4,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 16,
      elevation: 8,
    },
    xl: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.25,
      shadowRadius: 24,
      elevation: 12,
    },
    // Soft shadows for modern cards
    soft: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.08,
      shadowRadius: 12,
      elevation: 6,
    },
  },
  
  // Animation timing
  animation: {
    fast: 150,
    normal: 250,
    slow: 350,
  },
};

// Helper functions for common styling patterns
export const createButtonStyle = (variant = 'primary', size = 'md') => {
  const baseStyle = {
    borderRadius: theme.borderRadius.pill,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  };
  
  const variants = {
    primary: {
      backgroundColor: theme.colors.primary,
    },
    secondary: {
      backgroundColor: theme.colors.surfaceSecondary,
    },
    success: {
      backgroundColor: theme.colors.success,
    },
    teal: {
      backgroundColor: theme.colors.teal,
    },
    purple: {
      backgroundColor: theme.colors.purple,
    },
    coral: {
      backgroundColor: theme.colors.coral,
    },
    dark: {
      backgroundColor: theme.colors.surfaceTertiary,
    },
    ghost: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
  };
  
  const sizes = {
    sm: {
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      minHeight: 36,
    },
    md: {
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      minHeight: 48,
    },
    lg: {
      paddingHorizontal: theme.spacing.xl,
      paddingVertical: theme.spacing.lg,
      minHeight: 56,
    },
    xl: {
      paddingHorizontal: theme.spacing.xxl,
      paddingVertical: theme.spacing.xl,
      minHeight: 64,
    },
  };
  
  return {
    ...baseStyle,
    ...variants[variant],
    ...sizes[size],
  };
};

export const createCardStyle = (elevation = 'md', variant = 'default') => {
  const base = {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.xl,
    ...theme.shadows[elevation],
  };
  
  if (variant === 'elevated') {
    base.backgroundColor = theme.colors.cardElevated;
  } else if (variant === 'highlight') {
    base.backgroundColor = theme.colors.cardHighlight;
  }
  
  return base;
};

export const createCircularButtonStyle = (size = 64, elevation = 'sm') => ({
  width: size,
  height: size,
  borderRadius: size / 2,
  backgroundColor: theme.colors.surfaceSecondary,
  justifyContent: 'center',
  alignItems: 'center',
  ...theme.shadows[elevation],
});

// New helpers for modern components
export const createPillCardStyle = (variant = 'default') => ({
  backgroundColor: theme.colors.card,
  borderRadius: theme.borderRadius.pill,
  paddingHorizontal: theme.spacing.lg,
  paddingVertical: theme.spacing.md,
  ...theme.shadows.soft,
});

export const createMinimalCardStyle = () => ({
  backgroundColor: 'transparent',
  borderRadius: theme.borderRadius.xxl,
  padding: theme.spacing.xl,
});