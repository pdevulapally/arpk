import type { Metadata } from "next";
import { Inter, Sora } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/shared/Header";
import { Footer } from "@/components/shared/Footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const sora = Sora({ subsets: ["latin"], variable: "--font-sora" });

export const metadata: Metadata = {
  title: {
    default: "ARPK — Web & Software Studio",
    template: "%s | ARPK Studio",
  },
  description: "Premium web and software development studio delivering exceptional websites, AI integrations, automation systems, chatbots, and payment solutions with transparent processes, clear milestones, and outcomes that move your business forward.",
  keywords: ["web development", "software development", "custom web apps", "Next.js", "React", "web design", "software consulting", "AI integration", "automation", "chatbots", "payment integration", "Stripe integration", "e-commerce development"],
  authors: [{ name: "ARPK Studio" }],
  creator: "ARPK Studio",
  publisher: "ARPK Studio",
  metadataBase: process.env.NEXT_PUBLIC_SITE_URL ? new URL(process.env.NEXT_PUBLIC_SITE_URL) : undefined,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: process.env.NEXT_PUBLIC_SITE_URL || undefined,
    siteName: "ARPK Studio",
    title: "ARPK — Web & Software Studio",
    description: "Premium web and software development studio delivering exceptional websites and applications with transparent processes.",
    images: [
      {
        url: "/Images/ARPK_Official_Logo.png",
        width: 1200,
        height: 630,
        alt: "ARPK Studio Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ARPK — Web & Software Studio",
    description: "Premium web and software development studio delivering exceptional websites and applications.",
    images: ["/Images/ARPK_Official_Logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // Add your verification codes here when available
    // google: "your-google-verification-code",
    // yandex: "your-yandex-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${sora.variable} antialiased bg-background text-foreground`}>
        {children}
      </body>
    </html>
  );
}
