/**
 * JSON-LD Schema Generators for SEO
 * Implements structured data for real estate website
 */

import type { Property, BlogPost, BlogPostCard } from "@/types";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://eliterealtypr.com";

// =============================================================================
// TYPES
// =============================================================================

interface SchemaBase {
  "@context": "https://schema.org";
  "@type": string;
}

interface BreadcrumbItem {
  name: string;
  url: string;
}

// =============================================================================
// ORGANIZATION / BUSINESS SCHEMAS
// =============================================================================

/**
 * RealEstateAgent schema for Alexandra Lugo
 */
export function generateAgentSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    "@id": `${baseUrl}/#agent`,
    name: "Alexandra Lugo",
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
    image: `${baseUrl}/images/alexandra-2026.jpg`,
    description:
      "Luxury real estate broker specializing in premium properties in Puerto Rico and Miami. Expert in Condado, Dorado, Coral Gables, and Act 60 investment properties.",
    telephone: "+1 (787) 308-3982",
    email: "info@eliterealtypr.com",
    address: {
      "@type": "PostalAddress",
      streetAddress: "123 Ashford Avenue", // Update with real address
      addressLocality: "San Juan",
      addressRegion: "PR",
      postalCode: "00907",
      addressCountry: "US",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 18.4533,
      longitude: -66.0729,
    },
    areaServed: [
      {
        "@type": "State",
        name: "Puerto Rico",
      },
      {
        "@type": "City",
        name: "Miami",
        containedInPlace: {
          "@type": "State",
          name: "Florida",
        },
      },
    ],
    knowsAbout: [
      "Luxury Real Estate",
      "Puerto Rico Real Estate",
      "Miami Real Estate",
      "Act 60 Tax Incentives",
      "Condado Properties",
      "Dorado Beach Real Estate",
      "Coral Gables Homes",
      "Investment Properties",
    ],
    sameAs: [
      "https://www.instagram.com/eliterealty_pr", // Update with real links
      "https://www.facebook.com/eliterealtypr",
      "https://www.linkedin.com/in/alexandralugo",
    ],
  };
}

/**
 * LocalBusiness schema for Elite Realty
 */
export function generateBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    "@id": `${baseUrl}/#business`,
    name: "Elite Realty",
    alternateName: "Elite Realty PR",
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
    image: `${baseUrl}/images/alexandra-2026.jpg`,
    description:
      "Premier luxury real estate brokerage serving Puerto Rico and Miami. Specializing in high-end condos, beachfront properties, and Act 60 investment opportunities.",
    telephone: "+1 (787) 308-3982",
    email: "info@eliterealtypr.com",
    address: {
      "@type": "PostalAddress",
      streetAddress: "123 Ashford Avenue",
      addressLocality: "San Juan",
      addressRegion: "PR",
      postalCode: "00907",
      addressCountry: "US",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 18.4533,
      longitude: -66.0729,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "09:00",
        closes: "18:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Saturday",
        opens: "10:00",
        closes: "14:00",
      },
    ],
    priceRange: "$$$",
    currenciesAccepted: "USD",
    paymentAccepted: "Cash, Check, Wire Transfer",
  };
}

// =============================================================================
// PROPERTY SCHEMAS
// =============================================================================

/**
 * Generate schema for a single property listing
 */
export function generatePropertySchema(property: Property) {
  const propertyUrl = `${baseUrl}/property/${property.slug?.current || ""}`;
  const imageUrl = property.featuredImage?.asset?.url || `${baseUrl}/og-image.jpg`;

  // Determine property type for schema
  const schemaType = getPropertySchemaType(property.propertyType);

  // Determine offer type based on status
  const isForSale = property.status === "active-sale";
  const isForRent = property.status === "active-rental";
  const isSold = property.status === "sold";
  const isRented = property.status === "rented";

  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": schemaType,
    "@id": propertyUrl,
    name: property.title,
    description: `${property.title} - ${getPropertyTypeLabel(property.propertyType)}${property.location?.neighborhood || property.location?.city || property.location?.state ? ` in ${[property.location?.neighborhood, property.location?.city, property.location?.state].filter(Boolean).join(", ")}` : ""}`,
    url: propertyUrl,
    image: imageUrl,
  };

  if (property.location?.city || property.location?.state) {
    schema.address = {
      "@type": "PostalAddress",
      addressLocality: property.location?.city,
      addressRegion: property.location?.state,
      addressCountry: property.location?.state === "FL" ? "US" : "PR",
    };
  }

  // Add geo if we have city data
  if (property.location?.city) {
    schema.geo = {
      "@type": "GeoCoordinates",
      // Note: Would need actual coordinates per property
      latitude: property.location.state === "FL" ? 25.7617 : 18.4655,
      longitude: property.location.state === "FL" ? -80.1918 : -66.1057,
    };
  }

  // Add property details
  if (property.bedrooms) {
    schema.numberOfRooms = property.bedrooms;
    schema.numberOfBedrooms = property.bedrooms;
  }
  if (property.bathrooms) {
    schema.numberOfBathroomsTotal = property.bathrooms;
  }
  if (property.sqft) {
    schema.floorSize = {
      "@type": "QuantitativeValue",
      value: property.sqft,
      unitCode: "FTK", // Square feet
    };
  }

  // Add offers for active listings
  if ((isForSale || isForRent) && property.price) {
    schema.offers = {
      "@type": "Offer",
      price: property.price,
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      businessFunction: isForSale
        ? "https://schema.org/SellAction"
        : "https://schema.org/LeaseOut",
      seller: {
        "@type": "RealEstateAgent",
        name: "Elite Realty",
        url: baseUrl,
      },
    };
  }

  // Mark as sold/rented
  if (isSold || isRented) {
    schema.offers = {
      "@type": "Offer",
      availability: "https://schema.org/SoldOut",
      businessFunction: isSold
        ? "https://schema.org/SellAction"
        : "https://schema.org/LeaseOut",
    };
  }

  return schema;
}

/**
 * Generate schema for multiple property listings (for portfolio page)
 */
export function generatePropertyListSchema(properties: Property[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Elite Realty Property Listings",
    description: "Luxury properties for sale and rent in Puerto Rico and Miami",
    numberOfItems: properties.length,
    itemListElement: properties.slice(0, 20).map((property, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${baseUrl}/property/${property.slug?.current || ""}`,
      name: property.title,
    })),
  };
}

// =============================================================================
// BREADCRUMB SCHEMA
// =============================================================================

/**
 * Generate breadcrumb schema
 */
export function generateBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

// =============================================================================
// WEBSITE SCHEMA
// =============================================================================

/**
 * WebSite schema with search action
 */
export function generateWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${baseUrl}/#website`,
    name: "Elite Realty",
    url: baseUrl,
    description:
      "Luxury real estate in Puerto Rico and Miami. Find premium condos, homes, and investment properties.",
    publisher: {
      "@id": `${baseUrl}/#business`,
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${baseUrl}/property?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

// =============================================================================
// FAQ SCHEMA
// =============================================================================

interface FAQItem {
  question: string;
  answer: string;
}

/**
 * Generate FAQ schema
 */
export function generateFAQSchema(faqs: FAQItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

// =============================================================================
// LOCATION SCHEMA
// =============================================================================

/**
 * Generate schema for location pages
 */
export function generateLocationSchema(
  name: string,
  description: string,
  city: string,
  state: string
) {
  return {
    "@context": "https://schema.org",
    "@type": "Place",
    name: name,
    description: description,
    address: {
      "@type": "PostalAddress",
      addressLocality: city,
      addressRegion: state,
      addressCountry: state === "FL" ? "US" : "PR",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: state === "FL" ? 25.7617 : 18.4655,
      longitude: state === "FL" ? -80.1918 : -66.1057,
    },
  };
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

function getPropertySchemaType(propertyType?: string): string {
  switch (propertyType) {
    case "residential":
      return "SingleFamilyResidence";
    case "condo":
      return "Apartment";
    case "land":
      return "LandmarksOrHistoricalBuildings"; // Closest match for land
    case "commercial":
      return "RealEstateListing";
    default:
      return "Residence";
  }
}

function getPropertyTypeLabel(propertyType?: string): string {
  switch (propertyType) {
    case "residential":
      return "Residential";
    case "condo":
      return "Condominium";
    case "land":
      return "Land";
    case "commercial":
      return "Commercial Property";
    default:
      return "Property";
  }
}

// =============================================================================
// CONTACT PAGE SCHEMA
// =============================================================================

/**
 * Generate schema for contact page
 */
export function generateContactPageSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contact Elite Realty",
    description:
      "Get in touch with Alexandra Lugo for luxury real estate inquiries in Puerto Rico and Miami.",
    url: `${baseUrl}/contact`,
    mainEntity: {
      "@type": "RealEstateAgent",
      "@id": `${baseUrl}/#agent`,
      name: "Alexandra Lugo",
      telephone: "+1 (787) 308-3982",
      email: "info@eliterealtypr.com",
      address: {
        "@type": "PostalAddress",
        addressLocality: "San Juan",
        addressRegion: "PR",
        addressCountry: "US",
      },
      openingHoursSpecification: [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          opens: "09:00",
          closes: "18:00",
        },
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: "Saturday",
          opens: "10:00",
          closes: "16:00",
        },
      ],
    },
  };
}

// =============================================================================
// BLOG / JOURNAL SCHEMA
// =============================================================================

/**
 * Generate schema for blog listing page
 */
export function generateBlogListSchema(posts: BlogPostCard[]) {
  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": `${baseUrl}/journal`,
    name: "Elite Realty Journal",
    description:
      "Insights on luxury real estate, market trends, and lifestyle in Puerto Rico and Miami.",
    url: `${baseUrl}/journal`,
    publisher: {
      "@type": "Organization",
      name: "Elite Realty",
      url: baseUrl,
    },
    blogPost: posts.slice(0, 10).map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      url: `${baseUrl}/journal/${post.slug?.current}`,
      datePublished: post.publishedAt,
      author: {
        "@type": "Person",
        name: post.author?.name || "Alexandra Lugo",
      },
    })),
  };
}

/**
 * Generate schema for individual blog post
 */
export function generateBlogPostSchema(post: BlogPost, imageUrl?: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${baseUrl}/journal/${post.slug?.current}`,
    headline: post.title,
    description: post.excerpt || `Read ${post.title} on Elite Realty Journal`,
    url: `${baseUrl}/journal/${post.slug?.current}`,
    image: imageUrl || `${baseUrl}/og-image.jpg`,
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    author: {
      "@type": "Person",
      name: post.author?.name || "Alexandra Lugo",
      url: baseUrl,
    },
    publisher: {
      "@type": "Organization",
      name: "Elite Realty",
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/logo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${baseUrl}/journal/${post.slug?.current}`,
    },
  };
}

// =============================================================================
// LOCATIONS LISTING SCHEMA
// =============================================================================

/**
 * Generate schema for locations listing page
 */
export function generateLocationsListSchema() {
  const locations = [
    { name: "Condado", region: "Puerto Rico", slug: "condado" },
    { name: "Dorado", region: "Puerto Rico", slug: "dorado" },
    { name: "Guaynabo", region: "Puerto Rico", slug: "guaynabo" },
    { name: "Miramar", region: "Puerto Rico", slug: "miramar" },
    { name: "Bayamón", region: "Puerto Rico", slug: "bayamon" },
    { name: "Hato Rey", region: "Puerto Rico", slug: "hato-rey" },
    { name: "Santurce", region: "Puerto Rico", slug: "santurce" },
    { name: "Ocean Park", region: "Puerto Rico", slug: "ocean-park" },
    { name: "Coral Gables", region: "Florida", slug: "coral-gables" },
    { name: "Brickell", region: "Florida", slug: "brickell" },
    { name: "Miami Beach", region: "Florida", slug: "miami-beach" },
  ];

  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Luxury Locations",
    description:
      "Explore luxury locations in Puerto Rico and Miami served by Elite Realty.",
    url: `${baseUrl}/locations`,
    mainEntity: {
      "@type": "ItemList",
      name: "Locations Served by Elite Realty",
      numberOfItems: locations.length,
      itemListElement: locations.map((loc, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "Place",
          name: loc.name,
          url: `${baseUrl}/locations/${loc.slug}`,
        },
      })),
    },
  };
}

// =============================================================================
// COMBINED SCHEMA FOR PAGES
// =============================================================================

/**
 * Generate combined schema for homepage
 */
export function generateHomePageSchema() {
  return [
    generateWebsiteSchema(),
    generateBusinessSchema(),
    generateAgentSchema(),
  ];
}

/**
 * Generate combined schema for about page
 */
export function generateAboutPageSchema() {
  return [
    generateAgentSchema(),
    generateBreadcrumbSchema([
      { name: "Home", url: baseUrl },
      { name: "About", url: `${baseUrl}/about` },
    ]),
  ];
}

/**
 * Generate combined schema for portfolio/property listing page
 */
export function generatePortfolioPageSchema(properties: Property[]) {
  return [
    generatePropertyListSchema(properties),
    generateBreadcrumbSchema([
      { name: "Home", url: baseUrl },
      { name: "Property", url: `${baseUrl}/property` },
    ]),
  ];
}

/**
 * Alias for property listing page
 */
export function generatePropertyListingPageSchema(properties: Property[]) {
  return [
    generatePropertyListSchema(properties),
    generateBreadcrumbSchema([
      { name: "Home", url: baseUrl },
      { name: "Property", url: `${baseUrl}/property` },
    ]),
  ];
}

/**
 * Generate combined schema for single property page
 */
export function generatePropertyPageSchema(property: Property) {
  return [
    generatePropertySchema(property),
    generateBreadcrumbSchema([
      { name: "Home", url: baseUrl },
      { name: "Property", url: `${baseUrl}/property` },
      { name: property.title, url: `${baseUrl}/property/${property.slug?.current}` },
    ]),
  ];
}

/**
 * Generate combined schema for location page
 */
export function generateLocationPageSchema(
  name: string,
  description: string,
  city: string,
  state: string,
  slug: string
) {
  return [
    generateLocationSchema(name, description, city, state),
    generateBreadcrumbSchema([
      { name: "Home", url: baseUrl },
      { name: "Locations", url: `${baseUrl}/locations` },
      { name: name, url: `${baseUrl}/locations/${slug}` },
    ]),
  ];
}

/**
 * Generate combined schema for contact page
 */
export function generateContactSchema() {
  return [
    generateContactPageSchema(),
    generateBreadcrumbSchema([
      { name: "Home", url: baseUrl },
      { name: "Contact", url: `${baseUrl}/contact` },
    ]),
  ];
}

/**
 * Generate combined schema for journal listing page
 */
export function generateJournalPageSchema(posts: BlogPostCard[]) {
  return [
    generateBlogListSchema(posts),
    generateBreadcrumbSchema([
      { name: "Home", url: baseUrl },
      { name: "Journal", url: `${baseUrl}/journal` },
    ]),
  ];
}

/**
 * Generate combined schema for single blog post page
 */
export function generateBlogPageSchema(post: BlogPost, imageUrl?: string) {
  return [
    generateBlogPostSchema(post, imageUrl),
    generateBreadcrumbSchema([
      { name: "Home", url: baseUrl },
      { name: "Journal", url: `${baseUrl}/journal` },
      { name: post.title, url: `${baseUrl}/journal/${post.slug?.current}` },
    ]),
  ];
}

/**
 * Generate combined schema for locations listing page
 */
export function generateLocationsPageSchema() {
  return [
    generateLocationsListSchema(),
    generateBreadcrumbSchema([
      { name: "Home", url: baseUrl },
      { name: "Locations", url: `${baseUrl}/locations` },
    ]),
  ];
}
