import { ActivityIndicator, Pressable, StyleSheet, Text, type PressableProps } from "react-native";
import { borderRadius, colors, typography } from "@/constants/theme";

type Variant = "primary" | "secondary" | "outline" | "ghost";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends PressableProps {
  label: string;
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  fullWidth?: boolean;
}

export default function Button({
  label,
  variant = "primary",
  size = "md",
  loading = false,
  fullWidth = false,
  disabled,
  style,
  ...rest
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      {...rest}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        styles[variant],
        styles[`size_${size}`],
        fullWidth && styles.fullWidth,
        (isDisabled || pressed) && styles.pressed,
        typeof style === "function" ? style({ pressed }) : style,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === "outline" || variant === "ghost" ? colors.primaryNavy : colors.textOnDark}
        />
      ) : (
        <Text style={[styles.label, styles[`label_${variant}`], styles[`labelSize_${size}`]]}>
          {label}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: borderRadius.md,
    cursor: "pointer" as const,
  },
  fullWidth: { width: "100%" },
  pressed: { opacity: 0.8 },

  primary: { backgroundColor: colors.primaryNavy },
  secondary: { backgroundColor: colors.accentOrange },
  outline: { backgroundColor: "transparent", borderWidth: 1.5, borderColor: colors.primaryNavy },
  ghost: { backgroundColor: "transparent" },

  size_sm: { paddingHorizontal: 14, paddingVertical: 8 },
  size_md: { paddingHorizontal: 20, paddingVertical: 12 },
  size_lg: { paddingHorizontal: 28, paddingVertical: 16 },

  label: { fontWeight: typography.fontWeight.semiBold },
  label_primary: { color: colors.textOnDark },
  label_secondary: { color: colors.textOnDark },
  label_outline: { color: colors.primaryNavy },
  label_ghost: { color: colors.primaryNavy },

  labelSize_sm: { fontSize: typography.fontSize.sm },
  labelSize_md: { fontSize: typography.fontSize.base },
  labelSize_lg: { fontSize: typography.fontSize.md },
});
