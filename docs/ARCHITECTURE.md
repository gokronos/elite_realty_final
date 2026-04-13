# Elite Realty — Technical Architecture

**Version:** 1.0  
**Last Updated:** December 25, 2024  
**References:** PRD.md  

---

## 1. Technology Stack

### 1.1 Core Technologies

| Layer | Technology | Version | Notes |
|-------|------------|---------|-------|
| Framework | Next.js | 15.x | App Router |
| Language | TypeScript | 5.x | Strict mode enabled |
| Styling | Tailwind CSS | 3.4.x | Custom theme |
| CMS | Sanity.io | 3.x | Embedded Studio |
| Deployment | Vercel | - | Auto-deploy from GitHub |
| Package Manager | bun | 1.x | Faster than npm |

### 1.2 Dependencies

```json
{
  "dependencies": {
    "next": "^15.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "sanity": "^3.0.0",
    "next-sanity": "^9.0.0",
    "@sanity/image-url": "^1.0.0",
    "@portabletext/react": "^3.0.0",
    "framer-motion": "^11.0.0",
    "lucide-react": "^0.400.0",
    "zod": "^3.23.0",
    "resend": "^3.0.0"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "@types/react": "^18.2.0",
    "@types/node": "^20.0.0",
    "tailwindcss": "^3.4.0",
    "postcss": "^8.4.0",
    "autoprefixer": "^10.4.0"
  }
}
```

---

## 2. Project Structure

```
C:\Users\sergi\Desktop\ALEX\
│
├── docs/                        # Project documentation
│   ├── PRD.md                   # Product requirements
│   ├── ARCHITECTURE.md          # This file
│   ├── DESIGN-SYSTEM.md         # Visual specifications
│   └── SANITY-SPEC.md           # CMS schema specs
│
├── _staging/                    # Content staging (gitignored)
│   ├── properties/              # Property photos organized
│   └── creative-reference/      # Design reference images
│
├── app/                         # Next.js App Router
│   ├── (site)/                  # Public pages with shared layout
│   │   ├── layout.tsx           # Header + Footer wrapper
│   │   ├── page.tsx             # Homepage
│   │   ├── portfolio/
│   │   │   └── page.tsx         # Property grid + filters
│   │   ├── blog/
│   │   │   ├── page.tsx         # Blog listing
│   │   │   └── [slug]/
│   │   │       └── page.tsx     # Individual post
│   │   ├── about/
│   │   │   └── page.tsx         # About page
│   │   └── contact/
│   │       └── page.tsx         # Contact form
│   │
│   ├── studio/                  # Sanity Studio
│   │   └── [[...index]]/
│   │       └── page.tsx         # Catch-all for Studio
│   │
│   ├── api/                     # API routes
│   │   ├── revalidate/
│   │   │   └── route.ts         # Webhook handler
│   │   └── contact/
│   │       └── route.ts         # Form submission
│   │
│   ├── layout.tsx               # Root layout
│   ├── globals.css              # Global styles
│   ├── sitemap.ts               # Auto-generated sitemap
│   ├── robots.ts                # Robots.txt config
│   └── not-found.tsx            # 404 page
│
├── components/
│   ├── ui/                      # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Badge.tsx
│   │   ├── Card.tsx
│   │   └── ...
│   │
│   ├── layout/                  # Layout components
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── MobileMenu.tsx
│   │   └── PageWrapper.tsx
│   │
│   ├── property/                # Property-specific components
│   │   ├── PropertyCard.tsx
│   │   ├── PropertyGrid.tsx
│   │   ├── PropertyFilter.tsx
│   │   └── PropertyModal.tsx
│   │
│   ├── blog/                    # Blog components
│   │   ├── BlogCard.tsx
│   │   └── BlogGrid.tsx
│   │
│   └── sections/                # Page sections
│       ├── Hero.tsx
│       ├── FeaturedProperties.tsx
│       ├── AboutPreview.tsx
│       └── ContactCTA.tsx
│
├── lib/
│   ├── sanity/
│   │   ├── client.ts            # Sanity client config
│   │   ├── queries.ts           # GROQ queries
│   │   ├── image.ts             # Image URL builder
│   │   └── portable-text.tsx    # Rich text components
│   │
│   ├── utils.ts                 # Utility functions (cn, etc.)
│   └── validation.ts            # Zod schemas
│
├── sanity/
│   ├── sanity.config.ts         # Studio configuration
│   ├── sanity.cli.ts            # CLI configuration
│   ├── env.ts                   # Typed env access
│   └── schemas/
│       ├── index.ts             # Schema registry
│       ├── property.ts
│       ├── blogPost.ts
│       ├── author.ts
│       └── siteSettings.ts
│
├── types/
│   └── index.ts                 # TypeScript types
│
├── public/
│   ├── favicon.ico
│   └── og-image.jpg             # Default OG image
│
├── .env.local                   # Environment variables (gitignored)
├── .env.example                 # Example env file
├── .gitignore
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── package.json
├── CLAUDE.md                    # Instructions for Claude Code
└── README.md
```

---

## 3. Data Flow

### 3.1 Content Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         DATA FLOW                                   │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│   CONTENT CREATION                                                  │
│   ════════════════                                                  │
│                                                                     │
│   Alexandra (iPhone/Desktop)                                        │
│         │                                                           │
│         ▼                                                           │
│   ┌─────────────────┐                                               │
│   │  Sanity Studio  │  eliterealty.vercel.app/studio                │
│   │  (/studio)      │                                               │
│   └────────┬────────┘                                               │
│            │                                                        │
│            ▼                                                        │
│   ┌─────────────────┐                                               │
│   │  Sanity Content │  Content Lake (cloud)                         │
│   │     Lake        │  + Sanity CDN (images)                        │
│   └────────┬────────┘                                               │
│            │                                                        │
│            │  Webhook (on publish)                                  │
│            ▼                                                        │
│   ┌─────────────────┐                                               │
│   │  /api/revalidate│  Triggers revalidatePath()                    │
│   └────────┬────────┘                                               │
│            │                                                        │
│            ▼                                                        │
│   CONTENT DELIVERY                                                  │
│   ════════════════                                                  │
│                                                                     │
│   ┌─────────────────┐         ┌─────────────────┐                   │
│   │   Next.js App   │────────▶│   Vercel Edge   │                   │
│   │   (SSG + ISR)   │         │   (CDN)         │                   │
│   └─────────────────┘         └────────┬────────┘                   │
│                                        │                            │
│                                        ▼                            │
│                               ┌─────────────────┐                   │
│                               │    Visitors     │                   │
│                               │  (Browser)      │                   │
│                               └─────────────────┘                   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### 3.2 Rendering Strategy

| Route | Strategy | Revalidation | Reason |
|-------|----------|--------------|--------|
| `/` (Homepage) | SSG + ISR | 60s + on-demand | Featured properties change occasionally |
| `/portfolio` | SSG + ISR | 60s + on-demand | Property listings need freshness |
| `/blog` | SSG + ISR | 60s + on-demand | New posts added periodically |
| `/blog/[slug]` | SSG + ISR | 60s + on-demand | Content may be updated |
| `/about` | SSG + ISR | 3600s | Rarely changes |
| `/contact` | Static | None | No dynamic content |
| `/studio` | Client-side | N/A | Sanity handles everything |

### 3.3 Data Fetching Pattern

```typescript
// lib/sanity/client.ts
import { createClient } from 'next-sanity'

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION,
  useCdn: true, // Enable CDN for production reads
})

// lib/sanity/queries.ts
export async function getProperties() {
  return client.fetch(
    propertiesQuery,
    {},
    { next: { revalidate: 60 } } // ISR: regenerate every 60s
  )
}

export async function getFeaturedProperties() {
  return client.fetch(
    featuredPropertiesQuery,
    {},
    { next: { revalidate: 60, tags: ['properties'] } }
  )
}
```

### 3.4 On-Demand Revalidation

```typescript
// app/api/revalidate/route.ts
import { revalidatePath, revalidateTag } from 'next/cache'
import { parseBody } from 'next-sanity/webhook'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { isValidSignature, body } = await parseBody<{
      _type: string
      slug?: { current: string }
    }>(req, process.env.SANITY_WEBHOOK_SECRET)

    if (!isValidSignature) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }

    // Revalidate based on content type
    switch (body._type) {
      case 'property':
        revalidatePath('/portfolio')
        revalidatePath('/')
        revalidateTag('properties')
        break
      case 'blogPost':
        revalidatePath('/blog')
        if (body.slug?.current) {
          revalidatePath(`/blog/${body.slug.current}`)
        }
        revalidateTag('blog')
        break
      case 'siteSettings':
        revalidatePath('/', 'layout') // Revalidate all pages
        break
    }

    return NextResponse.json({ revalidated: true })
  } catch (err) {
    console.error('Revalidation error:', err)
    return NextResponse.json({ error: 'Error revalidating' }, { status: 500 })
  }
}
```

---

## 4. Sanity Configuration

### 4.1 Project Settings

| Setting | Value |
|---------|-------|
| Project ID | `6ostes35` |
| Dataset | `production` |
| API Version | `2024-01-01` |
| Studio Path | `/studio` |

### 4.2 CORS Origins

**Important:** No wildcard origins with credentials.

| Origin | Purpose |
|--------|---------|
| `http://localhost:3000` | Local development |
| `https://elite-realty-*.vercel.app` | Preview deployments |
| `https://eliterealty.pr` | Production (when ready) |

### 4.3 Webhook Configuration

Configure in Sanity Dashboard → API → Webhooks:

| Setting | Value |
|---------|-------|
| Name | `Vercel Revalidation` |
| URL | `https://[deployment].vercel.app/api/revalidate` |
| Trigger on | Create, Update, Delete |
| Filter | `_type in ["property", "blogPost", "siteSettings"]` |
| Secret | `[SANITY_WEBHOOK_SECRET]` |
| HTTP Method | POST |

---

## 5. Environment Variables

### 5.1 Required Variables

```bash
# .env.local

# Sanity (Public - exposed to browser for Studio)
NEXT_PUBLIC_SANITY_PROJECT_ID=6ostes35
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01

# Sanity (Private - server only)
SANITY_WEBHOOK_SECRET=your-webhook-secret-here

# Site
NEXT_PUBLIC_SITE_URL=https://elite-realty.vercel.app

# Email (Resend)
RESEND_API_KEY=re_xxxxxxxxxxxx
```

### 5.2 Vercel Environment Setup

Add the same variables in Vercel Dashboard → Settings → Environment Variables:
- Set different `NEXT_PUBLIC_SITE_URL` for Preview vs Production
- Keep `SANITY_WEBHOOK_SECRET` and `RESEND_API_KEY` server-only

---

## 6. Image Pipeline

### 6.1 Flow

```
Alexandra uploads image
        │
        ▼
┌─────────────────┐
│  Sanity Studio  │  Hotspot/crop selection
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Sanity CDN     │  Auto-optimization, WebP, responsive
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  next/image     │  Additional optimization, lazy loading
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Vercel Edge    │  Edge caching
└────────┬────────┘
         │
         ▼
     User's browser
```

### 6.2 Configuration

```typescript
// next.config.ts
import type { NextConfig } from 'next'

const config: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
    ],
  },
}

export default config
```

### 6.3 Image URL Builder

```typescript
// lib/sanity/image.ts
import imageUrlBuilder from '@sanity/image-url'
import { client } from './client'

const builder = imageUrlBuilder(client)

export function urlFor(source: any) {
  return builder.image(source)
}

// Usage in components:
// urlFor(property.featuredImage).width(800).height(600).url()
```

---

## 7. Security

### 7.1 Studio Protection

```typescript
// app/studio/[[...index]]/page.tsx
import { metadata as studioMetadata } from 'next-sanity/studio'

export const metadata = {
  ...studioMetadata,
  robots: 'noindex, nofollow', // Don't index Studio
}
```

```typescript
// app/robots.ts
export default function robots() {
  return {
    rules: [
      { userAgent: '*', allow: '/' },
      { userAgent: '*', disallow: '/studio' },
    ],
    sitemap: `${process.env.NEXT_PUBLIC_SITE_URL}/sitemap.xml`,
  }
}
```

### 7.2 Webhook Verification

Always verify webhook signatures using `parseBody` from `next-sanity/webhook` (see Section 3.4).

### 7.3 Form Spam Protection

```typescript
// Honeypot field in contact form
<input
  type="text"
  name="website" // Bots fill this
  className="hidden"
  tabIndex={-1}
  autoComplete="off"
/>

// Server-side check
if (formData.website) {
  return NextResponse.json({ error: 'Invalid submission' }, { status: 400 })
}
```

---

## 8. Contact Form Implementation

### 8.1 Client Component

```typescript
// components/ContactForm.tsx
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { contactFormSchema, type ContactFormData } from '@/lib/validation'

export function ContactForm() {
  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
  })

  async function onSubmit(data: ContactFormData) {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    // Handle response...
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      {/* Form fields */}
    </form>
  )
}
```

### 8.2 API Route

```typescript
// app/api/contact/route.ts
import { Resend } from 'resend'
import { NextResponse } from 'next/server'
import { contactFormSchema } from '@/lib/validation'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
  try {
    const body = await req.json()
    
    // Honeypot check
    if (body.website) {
      return NextResponse.json({ error: 'Invalid' }, { status: 400 })
    }

    // Validate
    const data = contactFormSchema.parse(body)

    // Send email
    await resend.emails.send({
      from: 'Elite Realty <noreply@eliterealty.pr>',
      to: 'alexandra@eliterealty.pr',
      subject: `New Contact: ${data.name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Phone:</strong> ${data.phone || 'Not provided'}</p>
        <p><strong>Message:</strong></p>
        <p>${data.message}</p>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json({ error: 'Failed to send' }, { status: 500 })
  }
}
```

---

## 9. SEO Implementation

### 9.1 Metadata Pattern

```typescript
// app/(site)/portfolio/page.tsx
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Luxury Properties | Elite Realty',
  description: 'Browse luxury real estate listings in Puerto Rico and Miami. Condos, homes, and penthouses in Condado, Dorado, Coral Gables, and more.',
  openGraph: {
    title: 'Luxury Properties | Elite Realty',
    description: 'Browse luxury real estate listings in Puerto Rico and Miami.',
    images: ['/og-image.jpg'],
  },
}
```

### 9.2 Dynamic Metadata

```typescript
// app/(site)/blog/[slug]/page.tsx
import { Metadata } from 'next'
import { getBlogPost } from '@/lib/sanity/queries'

export async function generateMetadata({ params }): Promise<Metadata> {
  const post = await getBlogPost(params.slug)
  
  return {
    title: `${post.title} | Elite Realty Blog`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: post.featuredImage ? [urlFor(post.featuredImage).url()] : [],
    },
  }
}
```

### 9.3 Sitemap

```typescript
// app/sitemap.ts
import { MetadataRoute } from 'next'
import { getAllProperties, getAllBlogPosts } from '@/lib/sanity/queries'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL

  // Static pages
  const staticPages = [
    { url: baseUrl, lastModified: new Date(), priority: 1 },
    { url: `${baseUrl}/portfolio`, lastModified: new Date(), priority: 0.9 },
    { url: `${baseUrl}/blog`, lastModified: new Date(), priority: 0.8 },
    { url: `${baseUrl}/about`, lastModified: new Date(), priority: 0.7 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), priority: 0.7 },
  ]

  // Dynamic pages from Sanity
  const properties = await getAllProperties()
  const posts = await getAllBlogPosts()

  const propertyPages = properties.map((p) => ({
    url: `${baseUrl}/portfolio/${p.slug.current}`,
    lastModified: p._updatedAt,
    priority: 0.8,
  }))

  const blogPages = posts.map((p) => ({
    url: `${baseUrl}/blog/${p.slug.current}`,
    lastModified: p._updatedAt,
    priority: 0.6,
  }))

  return [...staticPages, ...propertyPages, ...blogPages]
}
```

---

## 10. Deployment

### 10.1 GitHub → Vercel Flow

```
Developer pushes to GitHub
        │
        ▼
┌─────────────────┐
│  GitHub Repo    │
└────────┬────────┘
         │
         │  Webhook trigger
         ▼
┌─────────────────┐
│  Vercel Build   │  bun install → bun run build
└────────┬────────┘
         │
         │  Branch = main?
         ▼
┌─────────────────┬─────────────────┐
│  Yes: Production│  No: Preview    │
│  deployment     │  deployment     │
└─────────────────┴─────────────────┘
```

### 10.2 Build Configuration

```json
// vercel.json (optional - Vercel auto-detects Next.js)
{
  "buildCommand": "bun run build",
  "installCommand": "bun install",
  "framework": "nextjs"
}
```

### 10.3 Domain Setup (When Ready)

1. Add domain in Vercel Dashboard → Settings → Domains
2. Configure DNS records as instructed
3. Update `NEXT_PUBLIC_SITE_URL` in Vercel env vars
4. Add domain to Sanity CORS origins
5. Update webhook URL to production domain

---

## 11. Development Workflow

### 11.1 Local Setup

```bash
# Clone and install
git clone [repo-url]
cd ALEX
bun install

# Copy env file
cp .env.example .env.local
# Fill in values

# Start dev server
bun dev

# Open browser
# App: http://localhost:3000
# Studio: http://localhost:3000/studio
```

### 11.2 Commands

| Command | Purpose |
|---------|---------|
| `bun dev` | Start development server |
| `bun build` | Production build |
| `bun start` | Run production build locally |
| `bun lint` | Run ESLint |
| `bun type-check` | TypeScript type checking |

---

## 12. Monitoring & Analytics

### 12.1 Recommended Setup

| Tool | Purpose | Cost |
|------|---------|------|
| Vercel Analytics | Core Web Vitals | Free tier |
| Vercel Speed Insights | Performance monitoring | Free tier |
| Google Analytics | Traffic analytics | Free |

### 12.2 Implementation

```typescript
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
```

---

## Appendix: Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2024-12-25 | Initial architecture document |

---

*This document defines how Elite Realty is built. For what we're building, see PRD.md.*
