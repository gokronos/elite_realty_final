import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://elite-realty.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Elite Realty | Luxury Real Estate in Puerto Rico & Miami",
    template: "%s | Elite Realty",
  },
  description:
    "Alexandra Lugo, luxury real estate broker specializing in premium properties in Puerto Rico and Miami. Condos, residential, and commercial properties in Condado, Dorado, Coral Gables, and more.",
  keywords: [
    "luxury real estate",
    "Puerto Rico real estate",
    "Miami real estate",
    "Condado condos",
    "Dorado homes",
    "Coral Gables real estate",
    "Brickell condos",
    "Act 60 real estate",
    "beachfront property Puerto Rico",
    "luxury homes Miami",
  ],
  authors: [{ name: "Alexandra Lugo", url: baseUrl }],
  creator: "Elite Realty",
  publisher: "Elite Realty",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: baseUrl,
    siteName: "Elite Realty",
    title: "Elite Realty | Luxury Real Estate in Puerto Rico & Miami",
    description:
      "Alexandra Lugo, luxury real estate broker specializing in premium properties in Puerto Rico and Miami.",
    images: [
      {
        url: `${baseUrl}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "Elite Realty - Luxury Real Estate",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Elite Realty | Luxury Real Estate in Puerto Rico & Miami",
    description:
      "Alexandra Lugo, luxury real estate broker specializing in premium properties in Puerto Rico and Miami.",
    images: [`${baseUrl}/og-image.jpg`],
    creator: "@eliterealty_pr",
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
    // Add these when you have them
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
      <body className={`${cormorant.variable} ${inter.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
