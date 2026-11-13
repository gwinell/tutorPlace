/* eslint-disable @next/next/no-img-element -- the noscript counter uses a 1×1 remote tracking pixel. */
import type { Metadata } from "next";
import YandexMetrika from "@/components/yandex-metrika";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://code-together.ru"),
  title: "codeTogether — репетитор по информатике и Python",
  description: "Индивидуальные онлайн-занятия по информатике и Python с Русланом Гильметдиновым. Подготовка к школьным темам и экзаменам, основы программирования и проекты. Пробный урок — 45 минут.",
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
      {process.env.NODE_ENV === "development" && (
        <script src="https://mcp.figma.com/mcp/html-to-design/capture.js" async />
      )}
      <body className="antialiased">
        <YandexMetrika />
        {children}
        <noscript>
          <div><img className="yandex-metrika-pixel" src="https://mc.yandex.ru/watch/114240976" alt="" /></div>
        </noscript>
      </body>
    </html>
  );
}
