import { useTranslation } from "react-i18next";
import AppLayout from "@/components/layout/AppLayout";
import ContactForm from "@/components/forms/ContactForm";
import Card from "@/components/ui/Card";
import SectionTitle from "@/components/ui/SectionTitle";

export default function ContactPage() {
  const { t } = useTranslation();

  return (
    <AppLayout>
      <SectionTitle title={t("contact.title")} subtitle={t("contact.subtitle")} />
      <Card style={{ maxWidth: 600, alignSelf: "center", width: "100%" }}>
        <ContactForm />
      </Card>
    </AppLayout>
  );
}
