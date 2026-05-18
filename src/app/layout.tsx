import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GrowthForge Mission Monitor",
  description: "Read-only observability dashboard for GrowthForge systems.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
