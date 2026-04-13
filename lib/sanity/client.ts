/**
 * Sanity client configuration
 * Used for fetching data from Sanity
 */

import { createClient } from "next-sanity";
import { projectId, dataset, apiVersion } from "@/sanity/env";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  // Use fresh reads in development so Studio changes appear immediately.
  useCdn: process.env.NODE_ENV === "production",
});

// Preview client (no CDN, for draft content)
export const previewClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  perspective: "previewDrafts",
});
