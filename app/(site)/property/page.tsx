import { getAllProperties } from "@/lib/sanity/queries";
import { PropertyClient } from "./PropertyClient";
import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { generatePropertyListingPageSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Property | Elite Realty",
  description: "Browse our collection of luxury properties in Puerto Rico and Miami",
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
