export const colors = {
  // Primary palette
  primaryNavy: "#0D2E5C",
  primaryNavyLight: "#1A3F7A",
  accentOrange: "#E87722",
  accentOrangeLight: "#F5A54B",

  // Backgrounds
  backgroundWhite: "#FFFFFF",
  backgroundLight: "#F7F8FC",
  backgroundCard: "#FFFFFF",
  backgroundSection: "#F0F2F7",

  // Text
  textPrimary: "#0D2E5C",
  textSecondary: "#4A5568",
  textMuted: "#8A9AB0",
  textOnDark: "#FFFFFF",
  textAccent: "#E87722",

  // Border & divider
  borderColor: "#E2E8F0",
  borderLight: "#EDF2F7",

  // Status
  success: "#38A169",
  warning: "#D69E2E",
  error: "#E53E3E",
  info: "#3182CE",

  // Step states
  stepCompleted: "#0D2E5C",
  stepCurrent: "#E87722",
  stepPending: "#CBD5E0",
} as const;

export const typography = {
  fontFamily: {
    regular: "System",
    medium: "System",
    semiBold: "System",
    bold: "System",
  },
  fontSize: {
    xs: 11,
    sm: 13,
    base: 15,
    md: 17,
    lg: 19,
    xl: 22,
    "2xl": 26,
    "3xl": 32,
    "4xl": 40,
  },
  fontWeight: {
    regular: "400" as const,
    medium: "500" as const,
    semiBold: "600" as const,
    bold: "700" as const,
    extraBold: "800" as const,
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.7,
  },
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  "2xl": 32,
  "3xl": 48,
  "4xl": 64,
  "5xl": 80,
} as const;

export const borderRadius = {
  sm: 6,
  md: 10,
  lg: 14,
  xl: 20,
  full: 9999,
} as const;

export const shadows = {
  card: {
    shadowColor: "#0D2E5C",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 3,
  },
  cardHover: {
    shadowColor: "#0D2E5C",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 6,
  },
  nav: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
} as const;

export const layout = {
  maxContentWidth: 1280,
  containerPaddingH: spacing.xl,
  navHeight: 64,
  footerHeight: 80,
  columnGap: spacing.lg,
  rowGap: spacing.lg,
} as const;

const theme = { colors, typography, spacing, borderRadius, shadows, layout };
export default theme;
