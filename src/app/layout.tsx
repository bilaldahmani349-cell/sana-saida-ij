import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "عيد ميلاد سعيد يا أغلى البشر | موقع الاحتفال الخاص",
  description: "موقع إلكتروني احترافي مصمم خصيصاً للاحتفال بعيد ميلاد صديقتي الغالية مع كافة الذكريات والمفاجآت ولوحة التحكم السرية.",
  keywords: ["عيد ميلاد", "صديقتي", "احتفال", "ذكريات", "مفاجأة عيد ميلاد"],
  authors: [{ name: "Birthday App" }],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="bg-[#0b0512] text-[#fce7f3] min-h-screen selection:bg-rose-500 selection:text-white antialiased overflow-x-hidden font-sans">
        {children}
      </body>
    </html>
  );
}
