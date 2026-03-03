import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: " AI Movie Insight Builder",
  description:
    "Enter an IMDb movie ID and get detailed movie info with AI-powered audience sentiment analysis.",
  keywords: ["movie", "sentiment analysis", "AI", "IMDb", "reviews", "Next.js"],
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
