import { useTranslation } from "react-i18next";
import AppLayout from "@/components/layout/AppLayout";
import FAQAccordion from "@/components/sections/FAQAccordion";
import SectionTitle from "@/components/ui/SectionTitle";
import { MOCK_FAQS } from "@/constants/mockData";

export default function FAQPage() {
  const { t } = useTranslation();

  return (
    <AppLayout>
      <SectionTitle title={t("faq.title")} subtitle={t("faq.subtitle")} />
      <FAQAccordion items={MOCK_FAQS} />
    </AppLayout>
  );
}
