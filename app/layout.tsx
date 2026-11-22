/* eslint-disable @next/next/no-img-element -- the noscript counter uses a 1×1 remote tracking pixel. */
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("http://localhost:3000"),
  title: "TutorPlace — найдите своего репетитора",
  description: "Индивидуальные онлайн-занятия с репетиторами разных направлений. Каталог преподавателей, расписание, чат и онлайн-урок в одном месте.",
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
        {children}
      </body>
    </html>
  );
}
