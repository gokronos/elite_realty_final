/**
 * Sanity environment configuration
 * Provides typed access to environment variables
 */

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "gn3kobnn";
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-01-01";

// Validate required environment variables
function assertValue<T>(v: T | undefined, errorMessage: string): T {
  if (v === undefined) {
    throw new Error(errorMessage);
  }
  return v;
}

assertValue(
  projectId,
  "Missing environment variable: NEXT_PUBLIC_SANITY_PROJECT_ID"
);

assertValue(
  dataset,
  "Missing environment variable: NEXT_PUBLIC_SANITY_DATASET"
);
