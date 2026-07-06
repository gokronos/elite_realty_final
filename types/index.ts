/**
 * Elite Realty - TypeScript Type Definitions
 *
 * All types for Sanity CMS content and application data.
 * Keep in sync with sanity/schemas/*.ts
 */

// =============================================================================
// UNION TYPES
// =============================================================================

/** Property listing status */
export type PropertyStatus = "active-sale" | "active-rental" | "sold" | "rented";

/** Type of property */
export type PropertyType = "condo" | "residential" | "commercial" | "land";

/** US State abbreviation (markets served) */
export type State = "PR" | "FL";

/** Price classification */
export type PriceType = "sale" | "rent";

/** Social media platforms */
export type SocialPlatform = "instagram" | "linkedin" | "facebook" | "twitter";

/** Historical property display layout */
export type HistoricalPropertiesLayout = "default" | "by-year";

// =============================================================================
// SANITY BASE TYPES
// =============================================================================

/** Sanity document base fields */
export interface SanityDocument {
  _id: string;
  _type: string;
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
}

/** Sanity slug field */
export interface SanitySlug {
  _type: "slug";
  current: string;
}

/** Sanity image asset reference */
export interface SanityImageAsset {
  _id: string;
  _type: "sanity.imageAsset";
  url: string;
  metadata?: {
    dimensions: {
      width: number;
      height: number;
      aspectRatio: number;
    };
    lqip?: string; // Low-quality image placeholder (base64)
  };
}

/** Sanity image with hotspot and alt text */
export interface SanityImage {
  _type: "image";
  asset: SanityImageAsset;
  alt: string;
  hotspot?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  crop?: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
}

/** Sanity image with optional caption (for blog inline images) */
export interface SanityImageWithCaption extends SanityImage {
  caption?: string;
}

// =============================================================================
// PORTABLE TEXT TYPES
// =============================================================================

/** Portable Text block marks */
export interface PortableTextMark {
  _type: string;
  _key: string;
}

/** Portable Text span */
export interface PortableTextSpan {
  _type: "span";
  _key: string;
  text: string;
  marks: string[];
}

/** Portable Text block */
export interface PortableTextBlock {
  _type: "block";
  _key: string;
  style: "normal" | "h1" | "h2" | "h3" | "h4" | "blockquote";
  children: PortableTextSpan[];
  markDefs: PortableTextMark[];
}

/** Portable Text content (blocks and images) */
export type PortableTextContent = (PortableTextBlock | SanityImageWithCaption)[];

// =============================================================================
// LOCATION
// =============================================================================

/** Property location details */
export interface PropertyLocation {
  address?: string;
  city?: string;
  state?: State;
  neighborhood?: string;
}

// =============================================================================
// PROPERTY
// =============================================================================

/** Property listing */
export interface Property extends Pick<SanityDocument, "_id" | "_createdAt"> {
  title: string;
  slug: SanitySlug;
  status: PropertyStatus;
  historicalRecord?: boolean;
  propertyType?: PropertyType;
  price?: number;
  priceType?: PriceType;
  bedrooms?: number;
  bathrooms?: number;
  sqft?: number;
  yearTransacted?: number;
  description?: PortableTextContent;
  location: PropertyLocation;
  featuredImage: SanityImage;
  gallery?: SanityImage[];
  externalUrl?: string;
  featured?: boolean;
  featuredOrder?: number;
}

/** Property card (minimal data for listings) */
export type PropertyCard = Pick<
  Property,
  | "_id"
  | "title"
  | "slug"
  | "status"
  | "price"
  | "priceType"
  | "location"
  | "featuredImage"
>;

/** Featured property (homepage display) */
export type FeaturedProperty = Pick<
  Property,
  | "_id"
  | "title"
  | "slug"
  | "status"
  | "price"
  | "priceType"
  | "location"
  | "featuredImage"
  | "yearTransacted"
>;

// =============================================================================
// AUTHOR
// =============================================================================

/** Blog post author */
export interface Author {
  name: string;
  slug: SanitySlug;
  image?: SanityImage;
  bio?: string;
}

/** Author reference (minimal for blog cards) */
export type AuthorReference = Pick<Author, "name" | "slug" | "image">;

// =============================================================================
// BLOG POST
// =============================================================================

/** Blog post */
export interface BlogPost extends Pick<SanityDocument, "_id"> {
  title: string;
  slug: SanitySlug;
  publishedAt: string;
  excerpt?: string;
  body: PortableTextContent;
  featuredImage?: SanityImage;
  author: Author;
  categories?: string[];
}

/** Blog post card (minimal for listings) */
export interface BlogPostCard
  extends Pick<
    BlogPost,
    "_id" | "title" | "slug" | "publishedAt" | "excerpt" | "featuredImage" | "categories"
  > {
  author: AuthorReference;
}

// =============================================================================
// SITE SETTINGS
// =============================================================================

/** Social media link */
export interface SocialLink {
  platform: SocialPlatform;
  url: string;
}

/** Global site settings (singleton) */
export interface SiteSettings {
  siteName: string;
  tagline?: string;
  email: string;
  phone?: string;
  address?: string;
  socialLinks?: SocialLink[];
  footerText?: string;
  historicalPropertiesLayout?: HistoricalPropertiesLayout;
}

// =============================================================================
// FORM TYPES
// =============================================================================

/** Contact form data */
export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  message: string;
}

/** Contact form response */
export interface ContactFormResponse {
  success: boolean;
  message?: string;
  error?: string;
}

// =============================================================================
// FILTER TYPES
// =============================================================================

/** Property filter options */
export interface PropertyFilters {
  status?: PropertyStatus | "all";
  propertyType?: PropertyType | "all";
  state?: State | "all";
  city?: string;
}

// =============================================================================
// API RESPONSE TYPES
// =============================================================================

/** Revalidation webhook payload from Sanity */
export interface SanityWebhookPayload {
  _type: string;
  _id: string;
  slug?: SanitySlug;
}

/** API response for revalidation */
export interface RevalidateResponse {
  revalidated: boolean;
  now?: number;
  error?: string;
}
