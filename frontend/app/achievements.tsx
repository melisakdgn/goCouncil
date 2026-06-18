import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import AppLayout from "@/components/layout/AppLayout";
import AchievementCard from "@/components/cards/AchievementCard";
import SectionTitle from "@/components/ui/SectionTitle";
import { MOCK_ACHIEVEMENTS } from "@/constants/mockData";
import { borderRadius, colors, shadows, spacing } from "@/constants/theme";

export default function AchievementsPage() {
  const { t } = useTranslation();

  return (
    <AppLayout>
      <SectionTitle title={t("achievements.title")} subtitle={t("achievements.subtitle")} />
      <View style={styles.grid}>
        {MOCK_ACHIEVEMENTS.map((a) => (
          <View key={a.id} style={styles.cell}>
            <View style={styles.card}>
              <AchievementCard achievement={a} />
            </View>
          </View>
        ))}
      </View>
    </AppLayout>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.lg,
  },
  cell: {
    flex: 1,
    minWidth: 200,
  },
  card: {
    backgroundColor: colors.backgroundWhite,
    borderRadius: borderRadius.lg,
    ...shadows.card,
  },
});
