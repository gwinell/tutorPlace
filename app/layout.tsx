import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://code-together.ru"),
  title: "codeTogether — репетитор по информатике и Python",
  description: "Индивидуальные онлайн-занятия по информатике и Python с Русланом Гильметдиновым. Подготовка к школьным темам и экзаменам, основы программирования и проекты. Пробный урок — 45 минут.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: "/",
    siteName: "codeTogether",
    title: "codeTogether — репетитор по информатике и Python",
    description: "Онлайн-занятия по информатике и Python с Русланом Гильметдиновым.",
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
