import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors, spacing, typography } from "@/constants/theme";
import type { NewsUpdate } from "@/types";

interface NewsUpdateCardProps {
  item: NewsUpdate;
  onPress?: () => void;
}

export default function NewsUpdateCard({ item, onPress }: NewsUpdateCardProps) {
  const { i18n } = useTranslation();
  const isDE = i18n.language === "de";

  const title = isDE && item.title_de ? item.title_de : item.title;
  const summary = isDE && item.summary_de ? item.summary_de : item.summary;

  const formattedDate = new Date(item.date).toLocaleDateString(
    isDE ? "de-DE" : "en-US",
    { day: "2-digit", month: "2-digit", year: "numeric" }
  );

  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.row}>
        <View style={styles.info}>
          <Text style={styles.date}>{formattedDate}</Text>
          <Text style={styles.title}>{title}</Text>
          {summary ? <Text style={styles.summary} numberOfLines={2}>{summary}</Text> : null}
        </View>
        <Text style={styles.arrow}>›</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  info: { flex: 1, marginRight: spacing.md },
  date: {
    fontSize: typography.fontSize.xs,
    color: colors.textMuted,
    marginBottom: 2,
  },
  title: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.primaryNavy,
    marginBottom: 2,
  },
  summary: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    lineHeight: typography.fontSize.sm * 1.5,
  },
  arrow: {
    fontSize: 20,
    color: colors.textMuted,
  },
});
