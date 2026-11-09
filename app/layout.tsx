import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://code-together.ru"),
  title: "codeTogether — программируем вместе с Русланом",
  description: "Индивидуальные занятия по информатике и Python с Русланом Гильметдиновым. От первой программы до собственного проекта. Бесплатный пробный урок — 45 минут.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: "/",
    siteName: "codeTogether",
    title: "codeTogether — программируем вместе с Русланом",
    description: "Индивидуальные занятия по информатике и Python с Русланом Гильметдиновым.",
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
    <html lang="ru" suppressHydrationWarning>
      <script src="https://mcp.figma.com/mcp/html-to-design/capture.js" async />
      <body className="antialiased">{children}</body>
    </html>
  );
}
