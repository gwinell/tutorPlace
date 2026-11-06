import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "codeTogether — программируем вместе с Русланом",
  description: "Индивидуальные занятия по информатике и Python с Русланом Гильметдиновым. От первой программы до собственного проекта. Бесплатный пробный урок — 45 минут.",
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
    <html lang="ru" suppressHydrationWarning>
      <body className="antialiased">{children}</body>
    </html>
  );
}
