import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "个人健身档案",
  description: "训练记录与身体成分进度可视化",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">{children}</body>
    </html>
  );
}
