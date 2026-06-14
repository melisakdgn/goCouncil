import { useTranslation } from "react-i18next";
import { StyleSheet, Text } from "react-native";
import AppLayout from "@/components/layout/AppLayout";
import SectionTitle from "@/components/ui/SectionTitle";
import { colors, spacing, typography } from "@/constants/theme";

interface LegalPageProps {
  titleKey: string;
  bodyKey: string;
}

export default function LegalPage({ titleKey, bodyKey }: LegalPageProps) {
  const { t } = useTranslation();

  return (
    <AppLayout>
      <SectionTitle title={t(titleKey)} />
      <Text style={styles.body}>{t(bodyKey)}</Text>
    </AppLayout>
  );
}

const styles = StyleSheet.create({
  body: {
    fontSize: typography.fontSize.base,
    color: colors.textSecondary,
    lineHeight: typography.fontSize.base * typography.lineHeight.relaxed,
  },
});
