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

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://eliterealtypr.com";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Elite Realty | Luxury Real Estate in Puerto Rico & Miami",
    template: "%s | Elite Realty",
  },
  description:
    "Alexandra Lugo, corredora de bienes raíces de lujo en Puerto Rico y Miami. Propiedades premium en Condado, Dorado, Miramar, Coral Gables y Brickell. Luxury real estate broker Puerto Rico & Miami.",
  keywords: [
    "luxury real estate",
    "real estate Puerto Rico",
    "bienes raíces Puerto Rico",
    "corredora de bienes raíces Puerto Rico",
    "Puerto Rico real estate",
    "Miami real estate",
    "Condado condos",
    "Condado real estate",
    "Dorado homes",
    "Dorado real estate",
    "Miramar condos",
    "Hato Rey real estate",
    "Santurce properties",
    "Ocean Park real estate",
    "Coral Gables real estate",
    "Brickell condos",
    "Brickell real estate",
    "Miami Beach luxury homes",
    "Edgewater Miami real estate",
    "Act 60 real estate",
    "Act 60 Puerto Rico",
    "Act 60 incentives real estate",
    "beachfront property Puerto Rico",
    "luxury homes Miami",
    "Alexandra Lugo real estate",
    "Elite Realty PR",
    "propiedades de lujo Puerto Rico",
    "waterfront condos Puerto Rico",
    "luxury broker San Juan",
  ],
  authors: [{ name: "Alexandra Lugo", url: baseUrl }],
  creator: "Elite Realty",
  publisher: "Elite Realty",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: baseUrl,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: "es_PR",
    url: baseUrl,
    siteName: "Elite Realty",
    title: "Elite Realty | Luxury Real Estate in Puerto Rico & Miami",
    description:
      "Alexandra Lugo, luxury real estate broker in Puerto Rico & Miami. Condado, Dorado, Brickell, Coral Gables. Act 60 specialists.",
    images: [
      {
        url: `${baseUrl}/images/alexandra2.png`,
        width: 1200,
        height: 1200,
        alt: "Elite Realty - Luxury Real Estate",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Elite Realty | Luxury Real Estate in Puerto Rico & Miami",
    description:
      "Alexandra Lugo, luxury real estate broker in Puerto Rico & Miami. Condado, Dorado, Brickell, Coral Gables.",
    images: [`${baseUrl}/images/alexandra2.png`],
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
    // google: "PASTE_YOUR_GOOGLE_SEARCH_CONSOLE_CODE_HERE",
  },
  other: {
    "geo.region": "US-PR",
    "geo.placename": "San Juan, Puerto Rico",
    "geo.position": "18.4655;-66.1057",
    "ICBM": "18.4655, -66.1057",
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
