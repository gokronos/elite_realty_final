import { createClient } from "@sanity/client";

const slug = "la-villa-de-torrimar-rey-gustavo-201";

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

const description = [
  {
    _type: "block",
    _key: "laVillaDescription",
    style: "normal",
    markDefs: [],
    children: [
      {
        _type: "span",
        _key: "laVillaDescriptionText",
        marks: [],
        text:
          "Located in the renowned La Villa de Torrimar community in Guaynabo, this distinctive residence blends architectural elegance with artistic soul. Flooded with natural light, its open layout features vaulted wood ceilings, marble floors, and crystal chandeliers that highlight an exquisite collection of art and design. The home offers four bedrooms and two and a half bathrooms, along with spacious living, dining, and family areas - perfect for both everyday living and entertaining. Large windows and glass doors seamlessly connect the interior to an expansive terrace surrounded by lush gardens. The outdoor area includes a pool, jacuzzi, and gazebo, creating a serene, resort-like atmosphere. Set on approximately 960 square meters within a gated community with 24/7 security, this residence embodies a rare balance of sophistication, warmth, and creative energy.",
      },
    ],
  },
];

const property = await client.fetch(
  `*[_type == "property" && slug.current == $slug][0]{_id,title,slug}`,
  { slug }
);

if (!property?._id) {
  console.error(`Property not found for slug: ${slug}`);
  process.exit(1);
}

const updated = await client
  .patch(property._id)
  .set({
    title: "La Villa de Torrimar, Rey Gustavo 201",
    slug: { _type: "slug", current: slug },
    status: "forSale",
    propertyType: "residential",
    price: 1600000,
    priceType: "salePrice",
    bedrooms: 4,
    bathrooms: 2.5,
    sqft: 2900,
    squareFeet: 2900,
    lotSize: "2900",
    streetAddress: "201 Calle Rey Gustavo",
    market: "Guaynabo",
    communityOrBuilding: "La Villa de Torrimar",
    city: "Guaynabo",
    state: "PR",
    zipCode: "00969",
    country: "USA",
    location: {
      address: "201 Calle Rey Gustavo",
      city: "Guaynabo",
      state: "PR",
      neighborhood: "Guaynabo",
    },
    description,
    seoTitle: "La Villa de Torrimar, Rey Gustavo 201 | Elite Realty",
    seoDescription:
      "Distinctive four-bedroom residence for sale in La Villa de Torrimar, Guaynabo, PR.",
  })
  .commit();

console.log(`Updated property ${updated._id}: ${updated.title}`);
