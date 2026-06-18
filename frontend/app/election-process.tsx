import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import AppLayout from "@/components/layout/AppLayout";
import ElectionTimeline from "@/components/sections/ElectionTimeline";
import Card from "@/components/ui/Card";
import SectionTitle from "@/components/ui/SectionTitle";
import { MOCK_ELECTION } from "@/constants/mockData";
import { spacing } from "@/constants/theme";

export default function ElectionProcessPage() {
  const { t, i18n } = useTranslation();
  const isDE = i18n.language === "de";

  const title = isDE && MOCK_ELECTION.title_de ? MOCK_ELECTION.title_de : MOCK_ELECTION.title;

  return (
    <AppLayout>
      <SectionTitle title={t("electionProcess.title")} subtitle={t("electionProcess.subtitle")} />
      <Card>
        <ElectionTimeline steps={MOCK_ELECTION.steps} />
      </Card>
    </AppLayout>
  );
}
