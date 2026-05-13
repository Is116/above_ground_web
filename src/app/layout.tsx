import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AboveGround — Really Underground, Really Outside",
  description: "AboveGround music collective. Est. 2021. Events, music, community.",
  openGraph: {
    title: "AboveGround",
    description: "Really Underground, Really Outside. Est. 2021.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Mono:ital,wght@0,400;0,700;1,400&family=Inter:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
        <div className="noise-overlay" />
        <div className="scanlines" />
        {children}
      </body>
    </html>
  );
}
