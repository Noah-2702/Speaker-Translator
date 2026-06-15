import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RT Translate",
  description: "Real-time AI translation and voice cloning platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
