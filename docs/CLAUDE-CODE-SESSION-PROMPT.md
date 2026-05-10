# Elite Realty: Project Completion & SEO Implementation Brief

**Copy everything below this line and paste into Claude Code to start your session.**

---

## Context for Claude

I just finished a 12-hour coding session building this Elite Realty website for Alexandra Lugo (luxury real estate broker in Puerto Rico and Miami). Before we continue, I need you to:

1. **Audit the current state** of the project
2. **Identify gaps** against the CLAUDE.md build order
3. **Plan the remaining work** with me before taking any action
4. **Implement SEO best practices** based on competitive research

**IMPORTANT: Plan with me first. Do NOT make changes until I approve the plan.**

---

## Part 1: Project Audit

Please analyze the codebase and create a status report:

### 1.1 Read These Files First
- `CLAUDE.md` (project instructions & build order)
- `docs/PRD.md` (requirements)
- `package.json` (dependencies)

### 1.2 Check Completion Status

For each item in the CLAUDE.md "Build Order" section, verify if it exists and is complete:

**Phase 1: Foundation**
- [ ] Next.js initialized
- [ ] Tailwind configured with brand tokens
- [ ] Fonts set up (Playfair Display + Inter)
- [ ] `lib/utils.ts` with `cn()` helper
- [ ] `types/index.ts` with all TypeScript types

**Phase 2: Sanity**
- [ ] Sanity config files
- [ ] All schemas (property, blogPost, author, siteSettings)
- [ ] Sanity client and image helper
- [ ] GROQ queries with typed functions
- [ ] Studio at `/studio`
- [ ] Test content exists

**Phase 3: Layout**
- [ ] Header component
- [ ] Footer component
- [ ] Site layout `(site)/layout.tsx`
- [ ] Mobile menu

**Phase 4: Components**
- [ ] Button, Badge components
- [ ] PropertyCard, PropertyGrid
- [ ] PropertyFilter, PropertyModal
- [ ] BlogCard, ContactForm
- [ ] Hero, FeaturedProperties sections

**Phase 5: Pages**
- [ ] Homepage (`/`)
- [ ] Portfolio page (`/portfolio`)
- [ ] Blog listing (`/journal`)
- [ ] Blog detail (`/journal/[slug]`) ⚠️ LIKELY MISSING
- [ ] About page (`/about`)
- [ ] Contact page (`/contact`)
- [ ] Neighborhoods page (`/neighborhoods`)
- [ ] API route: `/api/contact` ⚠️ LIKELY MISSING
- [ ] API route: `/api/revalidate` ⚠️ LIKELY MISSING

**Phase 6: Polish**
- [ ] SEO metadata on all pages
- [ ] OpenGraph tags
- [ ] Sitemap (`/sitemap.ts`) ⚠️ LIKELY MISSING
- [ ] Robots (`/robots.ts`) ⚠️ LIKELY MISSING
- [ ] Error pages (404, error) styled
- [ ] Loading states (`loading.tsx`) ⚠️ LIKELY MISSING

After checking, give me a summary like:
```
COMPLETED: X/52 items
MISSING: [list the specific missing items]
PRIORITY FIXES: [what blocks launch]
```

---

## Part 2: Critical Gaps to Fix

### 2.1 Contact Form Backend
The contact form exists but needs an API route. We're using **Gmail** for simplicity (Alexandra's Gmail).

**Requirements:**
- `/app/api/contact/route.ts`
- Simple email sending (can use nodemailer with Gmail or just log for now)
- Form validation with Zod
- Success/error responses
- CORS handling

### 2.2 Blog Detail Page
`/journal` listing exists but `/journal/[slug]` is missing.

**Requirements:**
- `/app/(site)/journal/[slug]/page.tsx`
- Use `getBlogPostBySlug` from queries
- Render Portable Text for blog body (use @portabletext/react)
- Show author info
- Back link to journal
- Dynamic SEO metadata
- generateStaticParams for static generation

### 2.3 Revalidation API
For Sanity webhook to trigger ISR.

**Requirements:**
- `/app/api/revalidate/route.ts`
- Validate SANITY_WEBHOOK_SECRET
- Revalidate by tag based on document type
- Return proper status codes

---

## Part 3: SEO Implementation

### 3.1 Schema Markup

Create `/lib/schema.ts` with JSON-LD generators:

```typescript
// We need these schema types:

// 1. RealEstateAgent - Alexandra's profile
{
  "@type": "RealEstateAgent",
  "name": "Alexandra Lugo",
  "description": "Luxury real estate broker specializing in Puerto Rico and Miami",
  "url": "https://eliterealtypr.com",
  "telephone": "+1 (787) 308-3982",
  "email": "info@eliterealty.com",
  "address": { "@type": "PostalAddress", "addressLocality": "San Juan", "addressRegion": "PR" },
  "areaServed": ["Puerto Rico", "Miami, FL"],
  "image": "/images/alexandra.png"
}

// 2. LocalBusiness - Elite Realty
{
  "@type": "RealEstateAgent", // or LocalBusiness
  "name": "Elite Realty",
  "@id": "https://eliterealtypr.com/#business",
  // ... similar fields
}

// 3. RealEstateListing - For properties
{
  "@type": "RealEstateListing",
  "name": "[Property Title]",
  "description": "[Property Description]",
  "url": "[Property URL]",
  "image": "[Property Image]",
  "address": { "@type": "PostalAddress", ... },
  "geo": { "@type": "GeoCoordinates", "latitude": X, "longitude": Y },
  "offers": {
    "@type": "Offer",
    "price": "[Price]",
    "priceCurrency": "USD",
    "availability": "https://schema.org/InStock"
  }
}

// 4. BreadcrumbList - Navigation
{
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "/" },
    { "@type": "ListItem", "position": 2, "name": "Portfolio", "item": "/portfolio" }
  ]
}

// 5. Article - For blog posts
{
  "@type": "Article",
  "headline": "[Post Title]",
  "author": { "@type": "Person", "name": "Alexandra Lugo" },
  "datePublished": "[Date]",
  "image": "[Featured Image]"
}
```

Create helper functions that generate these and return them as `<script type="application/ld+json">`.

### 3.2 Metadata Templates

**Homepage metadata:**
```typescript
export const metadata: Metadata = {
  title: "Elite Realty | Luxury Real Estate in Puerto Rico & Miami",
  description: "Discover luxury homes, beachfront condos, and exclusive properties in Dorado, Condado, Brickell, and Coral Gables. Alexandra Lugo - Your trusted luxury real estate broker.",
  keywords: ["luxury real estate Puerto Rico", "Miami luxury homes", "Dorado Beach real estate", "Condado condos", "Act 60 real estate"],
  openGraph: {
    title: "Elite Realty | Luxury Real Estate in Puerto Rico & Miami",
    description: "Premium properties curated by Alexandra Lugo",
    url: "https://eliterealtypr.com",
    siteName: "Elite Realty",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Elite Realty | Luxury Real Estate",
    description: "Premium properties in Puerto Rico & Miami",
    images: ["/og-image.jpg"],
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "https://eliterealtypr.com" },
};
```

Apply similar patterns to all pages with page-specific content.

### 3.3 Sitemap

Create `/app/sitemap.ts`:
```typescript
import { MetadataRoute } from 'next'
import { getPropertyPaths, getBlogPostPaths } from '@/lib/sanity/queries'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://eliterealtypr.com'
  
  // Static pages
  const staticPages = [
    { url: baseUrl, lastModified: new Date(), priority: 1.0 },
    { url: `${baseUrl}/about`, lastModified: new Date(), priority: 0.8 },
    { url: `${baseUrl}/property`, lastModified: new Date(), priority: 0.9 },
    { url: `${baseUrl}/journal`, lastModified: new Date(), priority: 0.7 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), priority: 0.8 },
    { url: `${baseUrl}/locations`, lastModified: new Date(), priority: 0.7 },
  ]
  
  // Dynamic property pages (if we add /property/[slug])
  const propertySlugs = await getPropertyPaths()
  const propertyPages = propertySlugs.map(slug => ({
    url: `${baseUrl}/property/${slug}`,
    lastModified: new Date(),
    priority: 0.8,
  }))
  
  // Dynamic blog pages
  const blogSlugs = await getBlogPostPaths()
  const blogPages = blogSlugs.map(slug => ({
    url: `${baseUrl}/journal/${slug}`,
    lastModified: new Date(),
    priority: 0.6,
  }))
  
  return [...staticPages, ...propertyPages, ...blogPages]
}
```

### 3.4 Robots

Create `/app/robots.ts`:
```typescript
import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/studio/',
    },
    sitemap: 'https://eliterealtypr.com/sitemap.xml',
  }
}
```

---

## Part 4: Loading States

Create skeleton loaders for major pages:

### `/app/(site)/loading.tsx`
```typescript
export default function Loading() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
      <div className="animate-pulse text-[#d4af37]">Loading...</div>
    </div>
  )
}
```

### `/app/(site)/portfolio/loading.tsx`
```typescript
export default function PortfolioLoading() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-16 px-4">
      <div className="container mx-auto">
        <div className="h-12 w-48 bg-[#1a1a1a] rounded mb-8 animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="aspect-[4/3] bg-[#1a1a1a] rounded animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  )
}
```

---

## Part 5: Target Keywords Reference

Use these in metadata, alt text, and content:

**Puerto Rico:**
- luxury homes Puerto Rico
- Dorado Beach real estate  
- Condado luxury condos
- Act 60 real estate Puerto Rico
- beachfront property Puerto Rico
- Guaynabo homes for sale
- Miramar real estate

**Miami:**
- luxury homes Miami
- Brickell condos for sale
- Coral Gables luxury real estate
- Coconut Grove homes
- Key Biscayne waterfront
- Miami Beach luxury condos

**Long-tail:**
- luxury beachfront homes Puerto Rico for sale
- Act 60 tax benefits real estate
- relocating to Puerto Rico from Miami
- gated community homes Dorado Beach

---

## How to Proceed

1. **First:** Complete the audit (Part 1) and show me the status report
2. **Second:** For each gap, propose a specific plan before implementing  
3. **Third:** Wait for my approval before making changes
4. **Fourth:** Implement one section at a time, showing me results
5. **Fifth:** After each major change, verify it works

**Start with the audit. What's the current state of the project?**
