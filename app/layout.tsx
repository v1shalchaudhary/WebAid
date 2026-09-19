import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SiteVitals — Diagnose your site",
  description:
    "Find out what's actually wrong with your site — then fix it, step by step.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-ink text-[#EAF0FA] font-sans">{children}</body>
    </html>
  );
}
