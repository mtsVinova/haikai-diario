import type { Metadata } from "next";
import { Cormorant_Garamond } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://treslinhas.com.br"),
  title: {
    default: "três linhas — um haikai todo dia",
    template: "%s | três linhas",
  },
  description: "Um haikai novo todo dia, em português, inglês e espanhol.",
  keywords: ["haikai", "haiku", "poesia", "poema diário", "três linhas", "poesia brasileira"],
  authors: [{ name: "três linhas" }],
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://treslinhas.com.br",
    siteName: "três linhas",
    title: "três linhas — um haikai todo dia",
    description: "Um haikai novo todo dia, em português, inglês e espanhol.",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "três linhas" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "três linhas — um haikai todo dia",
    description: "Um haikai novo todo dia, em português, inglês e espanhol.",
    images: ["/og.png"],
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  alternates: { canonical: "https://treslinhas.com.br" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className={cormorant.variable}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
