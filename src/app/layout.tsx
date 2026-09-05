import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ArisanProvider } from "@/context/arisan-context";
import { ToastProvider } from "@/components/ui/toast-context";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "ArisanKeluarga — Tata Kelola Keuangan & Silaturahmi Keluarga",
  description:
    "Aplikasi web resmi pengelolaan keuangan arisan keluarga, iuran bulanan, pencatatan dana sosial, susunan silsilah pohon keluarga, dan jadwal pertemuan yang transparan dan akuntabel.",
  keywords: ["arisan keluarga", "keuangan arisan", "iuran bulanan", "pohon keluarga", "silaturahmi keluarga"],
  authors: [{ name: "Keluarga Besar Bani Sutrisno" }],
  openGraph: {
    title: "ArisanKeluarga — Tata Kelola Keuangan & Silaturahmi Keluarga",
    description:
      "Kelola iuran arisan, santunan sosial, silsilah keluarga, dan lokasi pertemuan secara transparan dan mudah.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full font-sans bg-slate-50 text-slate-900">
        <ToastProvider>
          <ArisanProvider>{children}</ArisanProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
