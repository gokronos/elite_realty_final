import { createClient } from "@sanity/client";

const currentSlug = "14-ave-delcasse-unit-703-san-juan";
const newSlug = "14-ave-delcasse-unit-703";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "gn3kobnn",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-01-01",
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

if (!process.env.SANITY_API_TOKEN) {
  console.error("SANITY_API_TOKEN is required to update Sanity content.");
  process.exit(1);
}

const property = await client.fetch(
  `*[_type == "property" && slug.current in [$currentSlug, $newSlug]][0]{
    _id,
    title,
    slug,
    legacySlugs
  }`,
  { currentSlug, newSlug }
);

if (!property?._id) {
  console.error(`Property not found for slug: ${currentSlug}`);
  process.exit(1);
}

const legacySlugs = Array.from(
  new Set([...(property.legacySlugs || []), currentSlug].filter((slug) => slug !== newSlug))
);

const updated = await client
  .patch(property._id)
  .set({
    title: "14 Ave. Delcasse Unit 703,",
    slug: { _type: "slug", current: newSlug },
    legacySlugs,
    status: "forSale",
    propertyType: "condo",
    price: 1650000,
    priceType: "salePrice",
    bedrooms: 2,
    bathrooms: 2.5,
    sqft: 1420,
    squareFeet: 1420,
    streetAddress: "14 Ave. Delcasse, Unit 703",
    market: "Condado",
    communityOrBuilding: "Condado Blú",
    city: "San Juan",
    state: "PR",
    zipCode: "00907",
    country: "USA",
    location: {
      address: "14 Ave. Delcasse, Unit 703",
      city: "San Juan",
      state: "PR",
      neighborhood: "Condado",
    },
    seoTitle: "14 Ave. Delcasse Unit 703 | Elite Realty",
    seoDescription:
      "Condo for sale at 14 Ave. Delcasse Unit 703 in Condado, San Juan, PR.",
  })
  .commit();

console.log(`Updated property ${updated._id}: ${updated.title}`);
