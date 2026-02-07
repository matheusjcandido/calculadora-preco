import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Calculadora de Preço de Venda - Markup e Margem de Lucro Grátis",
  description: "Calcule o preço ideal de venda dos seus produtos. Descubra markup, margem de lucro e composição do preço. Ideal para MEI, freelancers e pequenos negócios.",
  keywords: "calculadora de preço, markup, margem de lucro, precificação, quanto cobrar, preço de venda, calculadora mei",
  openGraph: {
    title: "Calculadora de Preço de Venda - Markup e Margem",
    description: "Calcule o preço ideal para seus produtos e serviços - 100% grátis!",
    type: "website",
  },
  robots: "index, follow",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
