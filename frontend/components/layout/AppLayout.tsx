import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { colors, layout } from "@/constants/theme";
import Header from "./Header";
import Footer from "./Footer";

interface AppLayoutProps {
  children: React.ReactNode;
  scrollable?: boolean;
  /** When true, children render full-width without the max-width container.
   *  Each section is responsible for its own inner container. */
  fullWidth?: boolean;
}

export default function AppLayout({
  children,
  scrollable = true,
  fullWidth = false,
}: AppLayoutProps) {
  const pageChildren = fullWidth ? (
    children
  ) : (
    <View style={styles.pageContent}>{children}</View>
  );

  if (!scrollable) {
    return (
      <View style={styles.root}>
        <Header />
        <View style={styles.body}>
          {pageChildren}
          <Footer />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      {/* Header lives outside the ScrollView so it stays fixed at the top */}
      <Header />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {pageChildren}
        <Footer />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.backgroundLight,
  },
  body: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  pageContent: {
    maxWidth: layout.maxContentWidth,
    width: "100%",
    alignSelf: "center",
    paddingHorizontal: layout.containerPaddingH,
    paddingVertical: 32,
  },
});
