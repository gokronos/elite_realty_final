import { getAllProperties } from "@/lib/sanity/queries";
import { PropertyClient } from "./PropertyClient";
import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { generatePropertyListingPageSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Luxury Properties for Sale & Rent | Elite Realty Puerto Rico & Miami",
  description:
    "Browse luxury condos, residences, and commercial properties for sale and rent in Puerto Rico and Miami. Condado, Dorado, Brickell, Coral Gables and more. Act 60 specialists.",
  keywords: [
    "luxury properties Puerto Rico",
    "condos for sale Condado",
    "homes for sale Dorado",
    "Brickell condos for sale",
    "Coral Gables real estate",
    "propiedades en venta Puerto Rico",
    "Act 60 properties Puerto Rico",
    "beachfront condos San Juan",
  ],
  alternates: {
    canonical: "https://eliterealtypr.com/property",
  },
  openGraph: {
    title: "Luxury Properties for Sale & Rent | Elite Realty",
    description:
      "Luxury condos, residences, and commercial properties in Puerto Rico and Miami.",
    url: "https://eliterealtypr.com/property",
  },
};

export default async function PropertyPage() {
  const properties = await getAllProperties();
  const schemaData = generatePropertyListingPageSchema(properties);

  return (
    <>
      <JsonLd data={schemaData} />
      <PropertyClient properties={properties} />
    </>
  );
}
