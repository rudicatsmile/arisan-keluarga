import React from "react";
import type { Metadata } from "next";
import { AppLayoutWrapper } from "@/components/layout/app-layout-wrapper";

export const metadata: Metadata = {
  title: {
    template: "%s | ArisanKeluarga",
    default: "Dashboard | ArisanKeluarga",
  },
  description: "Area internal pengelolaan kas, iuran bulanan, dan silsilah keluarga besar Bani Sutrisno.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppLayoutWrapper>{children}</AppLayoutWrapper>;
}
