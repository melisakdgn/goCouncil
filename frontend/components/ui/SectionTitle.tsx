import { StyleSheet, Text, View } from "react-native";
import { colors, spacing, typography } from "@/constants/theme";

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  accentFirst?: boolean;
}

export default function SectionTitle({ title, subtitle, accentFirst = false }: SectionTitleProps) {
  return (
    <View style={styles.container}>
      <Text style={[styles.title, accentFirst && styles.titleAccent]}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: spacing.lg },
  title: {
    fontSize: typography.fontSize["2xl"],
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  titleAccent: { color: colors.accentOrange },
  subtitle: {
    fontSize: typography.fontSize.base,
    color: colors.textSecondary,
    lineHeight: typography.fontSize.base * 1.5,
  },
});
