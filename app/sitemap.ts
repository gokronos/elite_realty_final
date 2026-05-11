import { MetadataRoute } from "next";
import { client } from "@/lib/sanity/client";
import { groq } from "next-sanity";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://eliterealtypr.com";

// Get all property slugs
async function getPropertySlugs(): Promise<string[]> {
  try {
    return await client.fetch(
      groq`*[_type == "property" && defined(slug.current)][].slug.current`
    );
  } catch (error) {
    console.error("[sitemap] property slugs fetch failed", error);
    return [];
  }
}

// Get all blog post slugs with dates
async function getBlogPosts(): Promise<{ slug: string; publishedAt: string }[]> {
  try {
    return await client.fetch(
      groq`*[_type == "blogPost" && defined(slug.current)]{
        "slug": slug.current,
        publishedAt
      }`
    );
  } catch (error) {
    console.error("[sitemap] blog posts fetch failed", error);
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/property`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/locations`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/journal`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  // Location pages
  const locations = [
    "condado",
    "dorado",
    "guaynabo",
    "miramar",
    "hato-rey",
    "santurce",
    "ocean-park",
    "coral-gables",
    "brickell",
    "miami-beach",
    "edgewater",
  ];

  const locationPages: MetadataRoute.Sitemap = locations.map((slug) => ({
    url: `${baseUrl}/locations/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  // Property pages (if you have individual property pages)
  const propertySlugs = [...new Set(await getPropertySlugs())];
  const propertyPages: MetadataRoute.Sitemap = propertySlugs.map((slug) => ({
    url: `${baseUrl}/property/${encodeURIComponent(slug)}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  // Blog post pages
  const blogPosts = [...new Map((await getBlogPosts()).map((post) => [post.slug, post])).values()];
  const blogPages: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${baseUrl}/journal/${post.slug}`,
    lastModified: post.publishedAt ? new Date(post.publishedAt) : new Date(),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticPages, ...locationPages, ...propertyPages, ...blogPages];
}
