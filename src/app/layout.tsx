import type { Metadata } from "next";
import { Cormorant_Garamond } from "next/font/google";
import "./globals.scss";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Cire Trudon — Votre senteur vous attend",
  description: "Une expérience olfactive immersive pour découvrir votre bougie Cire Trudon.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${cormorant.variable}`}>
      <body>{children}</body>
    </html>
  );
}
