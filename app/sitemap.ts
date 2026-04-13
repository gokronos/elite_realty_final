import { MetadataRoute } from "next";
import { client } from "@/lib/sanity/client";
import { groq } from "next-sanity";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://elite-realty.vercel.app";

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
      url: `${baseUrl}/portfolio`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/neighborhoods`,
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

  // Neighborhood pages
  const neighborhoods = [
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
  ];

  const neighborhoodPages: MetadataRoute.Sitemap = neighborhoods.map((slug) => ({
    url: `${baseUrl}/neighborhoods/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  // Property pages (if you have individual property pages)
  const propertySlugs = await getPropertySlugs();
  const propertyPages: MetadataRoute.Sitemap = propertySlugs.map((slug) => ({
    url: `${baseUrl}/portfolio/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  // Blog post pages
  const blogPosts = await getBlogPosts();
  const blogPages: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${baseUrl}/journal/${post.slug}`,
    lastModified: post.publishedAt ? new Date(post.publishedAt) : new Date(),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticPages, ...neighborhoodPages, ...propertyPages, ...blogPages];
}
