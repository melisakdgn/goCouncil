import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, StyleSheet, Text, TextInput, View } from "react-native";
import AppLayout from "@/components/layout/AppLayout";
import CandidateCard from "@/components/cards/CandidateCard";
import SectionTitle from "@/components/ui/SectionTitle";
import { MOCK_CANDIDATES } from "@/constants/mockData";
import { borderRadius, colors, spacing, typography } from "@/constants/theme";
import { useCandidates } from "@/hooks/useCandidates";

export default function CandidatesPage() {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const { data, isLoading, isError } = useCandidates();

  const candidates = useMemo(() => {
    if (data?.items?.length) return data.items;
    if (isError) return MOCK_CANDIDATES;
    return [];
  }, [data, isError]);

  const filtered = candidates.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.role.toLowerCase().includes(search.toLowerCase()) ||
      c.team?.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <AppLayout>
      <SectionTitle title={t("candidates.title")} subtitle={t("candidates.subtitle")} />

      <TextInput
        style={styles.search}
        value={search}
        onChangeText={setSearch}
        placeholder={t("candidates.searchPlaceholder")}
        placeholderTextColor={colors.textMuted}
      />

      {isLoading && candidates.length === 0 ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primaryNavy} />
        </View>
      ) : filtered.length === 0 ? (
        <Text style={styles.empty}>{t("candidates.noResults")}</Text>
      ) : (
        <View style={styles.grid}>
          {filtered.map((c) => (
            <View key={c.id} style={styles.cell}>
              <CandidateCard candidate={c} />
            </View>
          ))}
        </View>
      )}
    </AppLayout>
  );
}

const styles = StyleSheet.create({
  search: {
    borderWidth: 1,
    borderColor: colors.borderColor,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    fontSize: typography.fontSize.base,
    color: colors.textPrimary,
    backgroundColor: colors.backgroundWhite,
    marginBottom: spacing.xl,
  },
  centered: {
    alignItems: "center",
    paddingVertical: spacing["4xl"],
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.lg,
  },
  cell: {
    flex: 1,
    minWidth: 160,
    maxWidth: 220,
  },
  empty: {
    textAlign: "center",
    color: colors.textMuted,
    fontSize: typography.fontSize.base,
    marginTop: spacing["3xl"],
  },
});
