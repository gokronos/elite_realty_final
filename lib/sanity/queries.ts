/**
 * GROQ queries and fetch functions for Sanity content
 */

import { groq } from "next-sanity";
import { client } from "./client";
import type {
  Property,
  BlogPost,
  BlogPostCard,
  SiteSettings,
  FeaturedProperty,
  Author,
} from "@/types";

// =============================================================================
// PROPERTY QUERIES
// =============================================================================

const publicPropertySlugs = [
  "plantation-village-building-ii-unit-404-for-rent",
  "mirador-del-parque-ph-1702-for-rent",
  "waymouth-st-550-miramar-pr-for-rent",
  "14-ave-delcasse-unit-703-for-rent",
  "14-ave-delcasse-unit-703",
  "la-villa-de-torrimar-rey-gustavo-201",
  "mirador-del-parque-ph-1702-hato-rey-pr",
  "waymouth-st-550-miramar-pr",
  "plantation-village-building-ii-unit-404",
  "costa-dorada-k4",
  "dorado-del-mar-dorado-pr",
  "riviera-village-68-bayamon",
  "1519-parada-23-ave-ponce-de-leon-esq-calle-del-parque",
  "dorado-beach-east-28",
  "condado-plaza-unit-7a-sold",
  "ciudadela-800-unit-842-sold",
  "aquablue-2806-sold",
  "estancias-de-torrimar-calle-8-j7-lot-sold",
  "escuela-cupey-sold",
  "cond-treasure-point-unit-362-sold",
  "cond-ridgetop-c210-sold",
  "kings-court-playa-unit-104",
  "torrimar-calle-barcelona-17-rented",
  "sabanera-616-rented",
  "paseo-caribe-bahia-plaza-unit-409-rented",
  "mirador-del-parque-torre-1-apt-904-rented",
  "mirador-del-parque-ph-1701-rented",
  "metro-plaza-unit-502-rented",
  "garden-hills-estates-calle-1-2-rented",
  "gallery-plaza-unit-1201-rented",
];

const publicPropertiesFilter = groq`
  _type == "property" &&
  hiddenFromWebsite != true &&
  slug.current in ${JSON.stringify(publicPropertySlugs)}
`;

/** All active properties (for sale or rent) */
export const activePropertiesQuery = groq`
  *[${publicPropertiesFilter} && status in ["active-sale", "active-rental", "forSale", "forRent"]] | order(_createdAt desc) {
    _id,
    _createdAt,
    title,
    slug,
    status,
    historicalRecord,
    hiddenFromWebsite,
    propertyType,
    price,
    priceType,
    shortDescription,
    streetAddress,
    market,
    communityOrBuilding,
    city,
    state,
    zipCode,
    country,
    bedrooms,
    bathrooms,
    halfBathrooms,
    sqft,
    squareFeet,
    lotSize,
    yearBuilt,
    location,
    "featuredImage": featuredImage {
      asset->,
      alt
    },
    "gallery": gallery[] {
      asset->,
      alt
    },
    "featuredImageUrl": featuredImage.asset->url,
    externalUrl,
    externalListingUrl
  }
`;

/** All properties (including sold/rented) - ordered by year transacted */
export const allPropertiesQuery = groq`
  *[${publicPropertiesFilter}] | order(yearTransacted desc, _createdAt desc) {
    _id,
    _createdAt,
    title,
    slug,
    status,
    historicalRecord,
    hiddenFromWebsite,
    propertyType,
    price,
    priceType,
    shortDescription,
    streetAddress,
    market,
    communityOrBuilding,
    city,
    state,
    zipCode,
    country,
    bedrooms,
    bathrooms,
    halfBathrooms,
    sqft,
    squareFeet,
    lotSize,
    yearBuilt,
    yearTransacted,
    location,
    "featuredImage": featuredImage {
      asset->,
      alt
    },
    "gallery": gallery[] {
      asset->,
      alt
    },
    "featuredImageUrl": featuredImage.asset->url,
    externalUrl,
    externalListingUrl
  }
`;

/** Featured properties for homepage (or recent active if none featured) */
export const featuredPropertiesQuery = groq`
  *[${publicPropertiesFilter} && (featured == true || featuredOnHomepage == true || status in ["active-sale", "active-rental", "forSale", "forRent"])] | order(featured desc, featuredOrder asc, _createdAt desc) [0...6] {
    _id,
    title,
    slug,
    status,
    hiddenFromWebsite,
    propertyType,
    price,
    priceType,
    bedrooms,
    bathrooms,
    halfBathrooms,
    sqft,
    squareFeet,
    market,
    communityOrBuilding,
    city,
    state,
    location,
    "featuredImage": featuredImage {
      asset->,
      alt
    },
    "featuredImageUrl": featuredImage.asset->url
  }
`;

/** Single property by slug */
export const propertyBySlugQuery = groq`
  *[${publicPropertiesFilter} && (slug.current == $slug || $slug in legacySlugs)][0] {
    _id,
    _createdAt,
    title,
    slug,
    legacySlugs,
    status,
    hiddenFromWebsite,
    propertyType,
    price,
    priceType,
    shortDescription,
    streetAddress,
    market,
    communityOrBuilding,
    city,
    state,
    zipCode,
    country,
    bedrooms,
    bathrooms,
    halfBathrooms,
    sqft,
    squareFeet,
    lotSize,
    yearBuilt,
    yearTransacted,
    description,
    location,
    "featuredImage": featuredImage {
      asset->,
      alt
    },
    "gallery": gallery[] {
      asset->,
      alt
    },
    externalUrl,
    externalListingUrl,
    virtualTourUrl,
    videoUrl,
    featured,
    featuredOnHomepage,
    featuredOrder,
    seoTitle,
    seoDescription
  }
`;

/** Single property by ID */
export const propertyByIdQuery = groq`
  *[${publicPropertiesFilter} && _id == $id][0] {
    _id,
    _createdAt,
    title,
    slug,
    legacySlugs,
    status,
    hiddenFromWebsite,
    propertyType,
    price,
    priceType,
    shortDescription,
    streetAddress,
    market,
    communityOrBuilding,
    city,
    state,
    zipCode,
    country,
    bedrooms,
    bathrooms,
    halfBathrooms,
    sqft,
    squareFeet,
    lotSize,
    yearBuilt,
    yearTransacted,
    description,
    location,
    "featuredImage": featuredImage {
      asset->,
      alt
    },
    "gallery": gallery[] {
      asset->,
      alt
    },
    externalUrl,
    externalListingUrl,
    virtualTourUrl,
    videoUrl,
    featured,
    featuredOnHomepage,
    featuredOrder,
    seoTitle,
    seoDescription
  }
`;

/** Property slugs for static generation */
export const propertyPathsQuery = groq`
  *[${publicPropertiesFilter} && defined(slug.current)]{
    "slugs": array::compact([slug.current] + coalesce(legacySlugs, []))
  }.slugs[]
`;

/** Properties for sale (active-sale status) */
export const propertiesForSaleQuery = groq`
  *[${publicPropertiesFilter} && status in ["active-sale", "forSale"]] | order(_createdAt desc) {
    _id,
    title,
    slug,
    status,
    hiddenFromWebsite,
    propertyType,
    price,
    priceType,
    market,
    communityOrBuilding,
    city,
    state,
    location,
    bedrooms,
    bathrooms,
    halfBathrooms,
    sqft,
    squareFeet,
    lotSize,
    yearBuilt,
    "featuredImage": featuredImage {
      asset->,
      alt
    },
    "featuredImageUrl": featuredImage.asset->url
  }
`;

/** Properties for rent (active-rental status) */
export const propertiesForRentQuery = groq`
  *[${publicPropertiesFilter} && status in ["active-rental", "forRent"]] | order(_createdAt desc) {
    _id,
    title,
    slug,
    status,
    hiddenFromWebsite,
    propertyType,
    price,
    priceType,
    market,
    communityOrBuilding,
    city,
    state,
    location,
    bedrooms,
    bathrooms,
    halfBathrooms,
    sqft,
    squareFeet,
    lotSize,
    yearBuilt,
    "featuredImage": featuredImage {
      asset->,
      alt
    },
    "featuredImageUrl": featuredImage.asset->url
  }
`;

/** Sold properties (most recent) */
export const soldPropertiesQuery = groq`
  *[${publicPropertiesFilter} && status == "sold"] | order(yearTransacted desc, _createdAt desc) {
    _id,
    title,
    slug,
    status,
    hiddenFromWebsite,
    propertyType,
    price,
    priceType,
    market,
    communityOrBuilding,
    city,
    state,
    location,
    yearTransacted,
    "featuredImage": featuredImage {
      asset->,
      alt
    },
    "featuredImageUrl": featuredImage.asset->url
  }
`;

/** Rented properties (most recent) */
export const rentedPropertiesQuery = groq`
  *[${publicPropertiesFilter} && status == "rented"] | order(yearTransacted desc, _createdAt desc) {
    _id,
    title,
    slug,
    status,
    hiddenFromWebsite,
    propertyType,
    price,
    priceType,
    market,
    communityOrBuilding,
    city,
    state,
    location,
    yearTransacted,
    "featuredImage": featuredImage {
      asset->,
      alt
    },
    "featuredImageUrl": featuredImage.asset->url
  }
`;

/** Properties by neighborhood or market */
export const propertiesByNeighborhoodQuery = groq`
  *[${publicPropertiesFilter} && (location.neighborhood in $neighborhoods || market in $neighborhoods)] | order(status asc, _createdAt desc) {
    _id,
    title,
    slug,
    status,
    hiddenFromWebsite,
    propertyType,
    price,
    priceType,
    market,
    communityOrBuilding,
    city,
    state,
    location,
    bedrooms,
    bathrooms,
    halfBathrooms,
    sqft,
    squareFeet,
    lotSize,
    yearBuilt,
    yearTransacted,
    "featuredImage": featuredImage {
      asset->,
      alt
    },
    "featuredImageUrl": featuredImage.asset->url
  }
`;

/** Related active properties for a property detail page */
export const relatedPropertiesQuery = groq`
  *[
    ${publicPropertiesFilter} &&
    _id != $id &&
    status in ["active-sale", "active-rental", "forSale", "forRent"]
  ] | order(_createdAt desc) [0...24] {
    _id,
    _createdAt,
    title,
    slug,
    status,
    hiddenFromWebsite,
    propertyType,
    price,
    priceType,
    shortDescription,
    streetAddress,
    market,
    communityOrBuilding,
    city,
    state,
    zipCode,
    country,
    location,
    bedrooms,
    bathrooms,
    halfBathrooms,
    sqft,
    squareFeet,
    lotSize,
    yearBuilt,
    "featuredImage": featuredImage {
      asset->,
      alt
    },
    "featuredImageUrl": featuredImage.asset->url
  }
`;


// =============================================================================
// BLOG QUERIES
// =============================================================================

/** All blog posts */
export const allBlogPostsQuery = groq`
  *[_type == "blogPost"] | order(publishedAt desc) {
    _id,
    title,
    slug,
    publishedAt,
    excerpt,
    "featuredImage": featuredImage {
      asset->,
      alt
    },
    "featuredImageUrl": featuredImage.asset->url,
    "author": author-> {
      name,
      slug,
      "image": image {
        asset->,
        alt
      },
      "imageUrl": image.asset->url
    },
    categories
  }
`;

/** Single blog post by slug */
export const blogPostBySlugQuery = groq`
  *[_type == "blogPost" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    publishedAt,
    body,
    excerpt,
    "featuredImage": featuredImage {
      asset->,
      alt
    },
    "featuredImageUrl": featuredImage.asset->url,
    "author": author-> {
      name,
      slug,
      "image": image {
        asset->,
        alt
      },
      "imageUrl": image.asset->url,
      bio
    },
    categories
  }
`;

/** Blog post slugs for static generation */
export const blogPostPathsQuery = groq`
  *[_type == "blogPost" && defined(slug.current)][].slug.current
`;

// =============================================================================
// AUTHOR QUERIES
// =============================================================================

/** Get primary author (Alexandra) for About page */
export const primaryAuthorQuery = groq`
  *[_type == "author"] | order(_createdAt asc) [0] {
    _id,
    name,
    slug,
    bio,
    "image": image {
      asset->,
      alt
    },
    "imageUrl": image.asset->url
  }
`;

// =============================================================================
// SITE SETTINGS QUERY
// =============================================================================

/** Site settings (singleton) */
export const siteSettingsQuery = groq`
  *[_type == "siteSettings"][0] {
    siteName,
    tagline,
    email,
    phone,
    address,
    socialLinks,
    footerText,
    historicalPropertiesLayout
  }
`;

// =============================================================================
// FETCH FUNCTIONS
// =============================================================================
const revalidateSeconds = process.env.NODE_ENV === "development" ? 0 : 60;

type QueryFetchOptions = {
  next?: {
    revalidate?: number;
    tags?: string[];
  };
};

async function fetchWithFallback<T>(
  label: string,
  query: string,
  fallback: T,
  params: Record<string, unknown> = {},
  options?: QueryFetchOptions
): Promise<T> {
  try {
    if (options) {
      return await client.fetch<T>(query, params, options);
    }
    return await client.fetch<T>(query, params);
  } catch (error) {
    console.error(`[sanity] ${label} fetch failed`, error);
    return fallback;
  }
}

// Properties
export async function getActiveProperties(): Promise<Property[]> {
  return fetchWithFallback(
    "getActiveProperties",
    activePropertiesQuery,
    [],
    {},
    { next: { revalidate: revalidateSeconds } }
  );
}

export async function getAllProperties(): Promise<Property[]> {
  return fetchWithFallback(
    "getAllProperties",
    allPropertiesQuery,
    [],
    {},
    { next: { revalidate: revalidateSeconds } }
  );
}

export async function getFeaturedProperties(): Promise<FeaturedProperty[]> {
  return fetchWithFallback(
    "getFeaturedProperties",
    featuredPropertiesQuery,
    [],
    {},
    { next: { revalidate: revalidateSeconds, tags: ["properties"] } }
  );
}

export async function getPropertyBySlug(
  slug: string
): Promise<Property | null> {
  return fetchWithFallback(
    "getPropertyBySlug",
    propertyBySlugQuery,
    null,
    { slug },
    { next: { revalidate: revalidateSeconds } }
  );
}

export async function getPropertyById(
  id: string
): Promise<Property | null> {
  return fetchWithFallback(
    "getPropertyById",
    propertyByIdQuery,
    null,
    { id },
    { next: { revalidate: revalidateSeconds } }
  );
}

export async function getPropertyPaths(): Promise<string[]> {
  return fetchWithFallback("getPropertyPaths", propertyPathsQuery, []);
}

export async function getPropertiesForSale(): Promise<FeaturedProperty[]> {
  return fetchWithFallback(
    "getPropertiesForSale",
    propertiesForSaleQuery,
    [],
    {},
    { next: { revalidate: revalidateSeconds } }
  );
}

export async function getPropertiesForRent(): Promise<FeaturedProperty[]> {
  return fetchWithFallback(
    "getPropertiesForRent",
    propertiesForRentQuery,
    [],
    {},
    { next: { revalidate: revalidateSeconds } }
  );
}

export async function getSoldProperties(): Promise<FeaturedProperty[]> {
  return fetchWithFallback(
    "getSoldProperties",
    soldPropertiesQuery,
    [],
    {},
    { next: { revalidate: revalidateSeconds } }
  );
}

export async function getRentedProperties(): Promise<FeaturedProperty[]> {
  return fetchWithFallback(
    "getRentedProperties",
    rentedPropertiesQuery,
    [],
    {},
    { next: { revalidate: revalidateSeconds } }
  );
}

export async function getPropertiesByNeighborhood(
  neighborhoods: string[]
): Promise<Property[]> {
  return fetchWithFallback(
    "getPropertiesByNeighborhood",
    propertiesByNeighborhoodQuery,
    [],
    { neighborhoods },
    { next: { revalidate: revalidateSeconds } }
  );
}

export async function getRelatedProperties(property: Property): Promise<Property[]> {
  const propertyMarket = property.market ?? property.location?.neighborhood ?? "";
  const propertyState = property.state ?? property.location?.state ?? "";

  const candidates = await fetchWithFallback(
    "getRelatedProperties",
    relatedPropertiesQuery,
    [],
    {
      id: property._id,
      market: propertyMarket,
      propertyType: property.propertyType ?? "",
      state: propertyState,
    },
    { next: { revalidate: revalidateSeconds } }
  );

  return candidates
    .sort((a, b) => {
      const score = (candidate: Property) => {
        let value = 0;
        const candidateMarket = candidate.market ?? candidate.location?.neighborhood;
        const candidateState = candidate.state ?? candidate.location?.state;

        if (propertyMarket && candidateMarket === propertyMarket) {
          value += 4;
        }
        if (property.propertyType && candidate.propertyType === property.propertyType) {
          value += 2;
        }
        if (propertyState && candidateState === propertyState) {
          value += 1;
        }
        return value;
      };

      return score(b) - score(a);
    })
    .slice(0, 3);
}

// Blog
export async function getAllBlogPosts(): Promise<BlogPostCard[]> {
  return fetchWithFallback(
    "getAllBlogPosts",
    allBlogPostsQuery,
    [],
    {},
    { next: { revalidate: revalidateSeconds } }
  );
}

export async function getBlogPostBySlug(
  slug: string
): Promise<BlogPost | null> {
  return fetchWithFallback(
    "getBlogPostBySlug",
    blogPostBySlugQuery,
    null,
    { slug },
    { next: { revalidate: revalidateSeconds } }
  );
}

export async function getBlogPostPaths(): Promise<string[]> {
  return fetchWithFallback("getBlogPostPaths", blogPostPathsQuery, []);
}

// Author
export async function getPrimaryAuthor(): Promise<Author | null> {
  return fetchWithFallback(
    "getPrimaryAuthor",
    primaryAuthorQuery,
    null,
    {},
    { next: { revalidate: 3600 } }
  );
}

// Site Settings
export async function getSiteSettings(): Promise<SiteSettings | null> {
  return fetchWithFallback(
    "getSiteSettings",
    siteSettingsQuery,
    null,
    {},
    { next: { revalidate: revalidateSeconds, tags: ["settings"] } }
  );
}
