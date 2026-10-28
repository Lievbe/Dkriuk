import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "D'Kriuk Finance - Kelola Keuangan, Kembangkan Usaha",
  description:
    "Aplikasi pencatatan keuangan dan POS khusus outlet franchise F&B Ayam Crispy D'Kriuk. Hitung laba kotor, HPP, beban operasional, dan laba bersih secara otomatis.",
  icons: {
    icon: "/images/dkriuk-logo.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#E52D27",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="id">
      <body className="bg-slate-900 text-slate-900 antialiased">{children}</body>
    </html>
  );
}
