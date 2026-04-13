/**
 * Sanity image URL builder
 * Generates optimized image URLs from Sanity assets
 */

import { createImageUrlBuilder } from "@sanity/image-url";
import { client } from "./client";
import type { SanityImage } from "@/types";

const builder = createImageUrlBuilder(client);

/**
 * Build a URL for a Sanity image with transformations
 * @example urlFor(property.featuredImage).width(800).height(600).url()
 */
export function urlFor(source: SanityImage | undefined | null) {
  // Check for valid asset with a non-empty _id (handles placeholder/mock data)
  if (!source?.asset || !source.asset._id) {
    // Return a builder that produces a placeholder or empty string
    return {
      width: () => ({ height: () => ({ url: () => "" }) }),
      height: () => ({ url: () => "" }),
      url: () => "",
    };
  }
  return builder.image(source);
}

/**
 * Get a responsive image URL with automatic format selection
 */
export function getImageUrl(
  source: SanityImage | undefined | null,
  width: number,
  height?: number
): string {
  if (!source?.asset) return "";

  let img = builder.image(source).width(width).auto("format").quality(85);

  if (height) {
    img = img.height(height);
  }

  return img.url();
}

/**
 * Get image dimensions from Sanity metadata
 */
export function getImageDimensions(source: SanityImage | undefined | null): {
  width: number;
  height: number;
  aspectRatio: number;
} | null {
  if (!source?.asset?.metadata?.dimensions) return null;
  return source.asset.metadata.dimensions;
}
