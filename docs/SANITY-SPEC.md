# Elite Realty — Sanity CMS Specification

**Version:** 1.0  
**Last Updated:** December 25, 2024  
**References:** PRD.md, ARCHITECTURE.md  

---

## 1. Project Configuration

### 1.1 Sanity Project

| Setting | Value |
|---------|-------|
| Project ID | `6ostes35` |
| Dataset | `production` |
| API Version | `2024-01-01` |
| Studio Path | `/studio` |

### 1.2 Environment Variables

```bash
NEXT_PUBLIC_SANITY_PROJECT_ID=6ostes35
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01
SANITY_WEBHOOK_SECRET=<generate-secure-secret>
```

---

## 2. Schema Definitions

### 2.1 Property Schema

**File:** `sanity/schemas/property.ts`

```typescript
import { defineField, defineType } from 'sanity'

export const property = defineType({
  name: 'property',
  title: 'Property',
  type: 'document',
  groups: [
    { name: 'basic', title: 'Basic Info', default: true },
    { name: 'details', title: 'Details' },
    { name: 'location', title: 'Location' },
    { name: 'media', title: 'Media' },
    { name: 'settings', title: 'Settings' },
  ],
  fields: [
    // === BASIC INFO ===
    defineField({
      name: 'title',
      title: 'Property Title',
      type: 'string',
      description: 'e.g., "Atlantis #308" or "Luxury Penthouse at Condado"',
      group: 'basic',
      validation: (Rule) => Rule.required().error('Property title is required'),
    }),

    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description: 'URL-friendly identifier (auto-generated from title)',
      group: 'basic',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required().error('Slug is required'),
    }),

    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      group: 'basic',
      options: {
        list: [
          { title: 'For Sale', value: 'active-sale' },
          { title: 'For Rent', value: 'active-rental' },
          { title: 'Sold', value: 'sold' },
          { title: 'Rented', value: 'rented' },
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required().error('Status is required'),
    }),

    defineField({
      name: 'propertyType',
      title: 'Property Type',
      type: 'string',
      group: 'basic',
      options: {
        list: [
          { title: 'Condo', value: 'condo' },
          { title: 'House', value: 'house' },
          { title: 'Penthouse', value: 'penthouse' },
          { title: 'Land', value: 'land' },
          { title: 'Commercial', value: 'commercial' },
        ],
      },
    }),

    defineField({
      name: 'price',
      title: 'Price',
      type: 'number',
      description: 'Price in USD. Leave empty for "Contact for Price"',
      group: 'basic',
      validation: (Rule) => Rule.positive().error('Price must be positive'),
    }),

    defineField({
      name: 'priceType',
      title: 'Price Type',
      type: 'string',
      group: 'basic',
      options: {
        list: [
          { title: 'Sale Price', value: 'sale' },
          { title: 'Monthly Rent', value: 'rent' },
        ],
        layout: 'radio',
      },
      hidden: ({ document }) => !document?.price,
    }),

    // === DETAILS ===
    defineField({
      name: 'bedrooms',
      title: 'Bedrooms',
      type: 'number',
      group: 'details',
      validation: (Rule) => Rule.min(0).max(20),
    }),

    defineField({
      name: 'bathrooms',
      title: 'Bathrooms',
      type: 'number',
      group: 'details',
      validation: (Rule) => Rule.min(0).max(20),
    }),

    defineField({
      name: 'sqft',
      title: 'Square Feet',
      type: 'number',
      group: 'details',
      validation: (Rule) => Rule.positive(),
    }),

    defineField({
      name: 'yearTransacted',
      title: 'Year Sold/Rented',
      type: 'number',
      description: 'For past transactions only',
      group: 'details',
      hidden: ({ document }) => 
        document?.status === 'active-sale' || document?.status === 'active-rental',
      validation: (Rule) => Rule.min(2000).max(2030),
    }),

    defineField({
      name: 'description',
      title: 'Description',
      type: 'array',
      of: [{ type: 'block' }],
      group: 'details',
    }),

    // === LOCATION ===
    defineField({
      name: 'location',
      title: 'Location',
      type: 'object',
      group: 'location',
      fields: [
        {
          name: 'address',
          title: 'Street Address',
          type: 'string',
        },
        {
          name: 'city',
          title: 'City',
          type: 'string',
          validation: (Rule) => Rule.required().error('City is required'),
        },
        {
          name: 'state',
          title: 'State',
          type: 'string',
          options: {
            list: [
              { title: 'Puerto Rico', value: 'PR' },
              { title: 'Florida', value: 'FL' },
            ],
            layout: 'radio',
          },
          validation: (Rule) => Rule.required().error('State is required'),
        },
        {
          name: 'neighborhood',
          title: 'Neighborhood',
          type: 'string',
          description: 'e.g., Condado, Dorado, Coral Gables',
        },
      ],
    }),

    // === MEDIA ===
    defineField({
      name: 'featuredImage',
      title: 'Featured Image',
      type: 'image',
      description: 'Main property photo (required)',
      group: 'media',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
          description: 'Describe the image for accessibility',
          validation: (Rule) => Rule.required().error('Alt text is required for accessibility'),
        },
      ],
      validation: (Rule) => Rule.required().error('Featured image is required'),
    }),

    defineField({
      name: 'gallery',
      title: 'Gallery',
      type: 'array',
      group: 'media',
      of: [
        {
          type: 'image',
          options: {
            hotspot: true,
          },
          fields: [
            {
              name: 'alt',
              title: 'Alt Text',
              type: 'string',
              validation: (Rule) => Rule.required().error('Alt text is required'),
            },
          ],
        },
      ],
    }),

    // === SETTINGS ===
    defineField({
      name: 'externalUrl',
      title: 'External Listing URL',
      type: 'url',
      description: 'Zillow, Realtor.com, or Clasificados link',
      group: 'settings',
    }),

    defineField({
      name: 'featured',
      title: 'Featured on Homepage',
      type: 'boolean',
      description: 'Show this property on the homepage',
      group: 'settings',
      initialValue: false,
    }),

    defineField({
      name: 'featuredOrder',
      title: 'Featured Order',
      type: 'number',
      description: '1 = first position, 2 = second, etc.',
      group: 'settings',
      hidden: ({ document }) => !document?.featured,
      validation: (Rule) => Rule.min(1).max(10),
    }),
  ],

  preview: {
    select: {
      title: 'title',
      status: 'status',
      city: 'location.city',
      media: 'featuredImage',
    },
    prepare({ title, status, city, media }) {
      const statusLabels = {
        'active-sale': '🟢 For Sale',
        'active-rental': '🟡 For Rent',
        'sold': '⚪ Sold',
        'rented': '⚪ Rented',
      }
      return {
        title: title,
        subtitle: `${statusLabels[status] || status} • ${city || 'No location'}`,
        media: media,
      }
    },
  },

  orderings: [
    {
      title: 'Title A-Z',
      name: 'titleAsc',
      by: [{ field: 'title', direction: 'asc' }],
    },
    {
      title: 'Newest First',
      name: 'createdDesc',
      by: [{ field: '_createdAt', direction: 'desc' }],
    },
    {
      title: 'Featured First',
      name: 'featuredDesc',
      by: [
        { field: 'featured', direction: 'desc' },
        { field: 'featuredOrder', direction: 'asc' },
      ],
    },
  ],
})
```

### 2.2 Blog Post Schema

**File:** `sanity/schemas/blogPost.ts`

```typescript
import { defineField, defineType } from 'sanity'

export const blogPost = defineType({
  name: 'blogPost',
  title: 'Blog Post',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required().error('Title is required'),
    }),

    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required().error('Slug is required'),
    }),

    defineField({
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: [{ type: 'author' }],
      validation: (Rule) => Rule.required().error('Author is required'),
    }),

    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
      validation: (Rule) => Rule.required().error('Publication date is required'),
    }),

    defineField({
      name: 'featuredImage',
      title: 'Featured Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
        },
      ],
    }),

    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      description: 'Short summary for listing pages (max 200 characters)',
      validation: (Rule) => Rule.max(200),
    }),

    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [
        { type: 'block' },
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            {
              name: 'alt',
              title: 'Alt Text',
              type: 'string',
            },
            {
              name: 'caption',
              title: 'Caption',
              type: 'string',
            },
          ],
        },
      ],
      validation: (Rule) => Rule.required().error('Body content is required'),
    }),

    defineField({
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags',
      },
    }),
  ],

  preview: {
    select: {
      title: 'title',
      author: 'author.name',
      date: 'publishedAt',
      media: 'featuredImage',
    },
    prepare({ title, author, date, media }) {
      return {
        title: title,
        subtitle: `${author || 'No author'} • ${date ? new Date(date).toLocaleDateString() : 'No date'}`,
        media: media,
      }
    },
  },

  orderings: [
    {
      title: 'Newest First',
      name: 'publishedDesc',
      by: [{ field: 'publishedAt', direction: 'desc' }],
    },
  ],
})
```

### 2.3 Author Schema

**File:** `sanity/schemas/author.ts`

```typescript
import { defineField, defineType } from 'sanity'

export const author = defineType({
  name: 'author',
  title: 'Author',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required().error('Name is required'),
    }),

    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required().error('Slug is required'),
    }),

    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
        },
      ],
    }),

    defineField({
      name: 'bio',
      title: 'Bio',
      type: 'text',
      description: 'Short biography',
    }),
  ],

  preview: {
    select: {
      title: 'name',
      media: 'image',
    },
  },
})
```

### 2.4 Site Settings Schema

**File:** `sanity/schemas/siteSettings.ts`

```typescript
import { defineField, defineType } from 'sanity'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'siteName',
      title: 'Site Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
    }),

    defineField({
      name: 'email',
      title: 'Contact Email',
      type: 'string',
      validation: (Rule) => Rule.required().email(),
    }),

    defineField({
      name: 'phone',
      title: 'Contact Phone',
      type: 'string',
    }),

    defineField({
      name: 'address',
      title: 'Office Address',
      type: 'text',
    }),

    defineField({
      name: 'socialLinks',
      title: 'Social Links',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'platform',
              title: 'Platform',
              type: 'string',
              options: {
                list: [
                  { title: 'Instagram', value: 'instagram' },
                  { title: 'LinkedIn', value: 'linkedin' },
                  { title: 'Facebook', value: 'facebook' },
                  { title: 'Twitter', value: 'twitter' },
                ],
              },
            },
            {
              name: 'url',
              title: 'URL',
              type: 'url',
            },
          ],
        },
      ],
    }),

    defineField({
      name: 'footerText',
      title: 'Footer Text',
      type: 'string',
      description: 'Copyright or additional footer text',
    }),
  ],

  preview: {
    prepare() {
      return {
        title: 'Site Settings',
      }
    },
  },
})
```

### 2.5 Schema Index

**File:** `sanity/schemas/index.ts`

```typescript
import { property } from './property'
import { blogPost } from './blogPost'
import { author } from './author'
import { siteSettings } from './siteSettings'

export const schemaTypes = [property, blogPost, author, siteSettings]
```

---

## 3. GROQ Queries

### 3.1 Property Queries

**File:** `lib/sanity/queries.ts`

```typescript
import { groq } from 'next-sanity'

// All active properties
export const activePropertiesQuery = groq`
  *[_type == "property" && status in ["active-sale", "active-rental"]] | order(_createdAt desc) {
    _id,
    _createdAt,
    title,
    slug,
    status,
    propertyType,
    price,
    priceType,
    bedrooms,
    bathrooms,
    sqft,
    location,
    "featuredImage": featuredImage {
      asset->,
      alt
    },
    externalUrl
  }
`

// All properties (including sold/rented)
export const allPropertiesQuery = groq`
  *[_type == "property"] | order(
    status == "active-sale" desc,
    status == "active-rental" desc,
    _createdAt desc
  ) {
    _id,
    _createdAt,
    title,
    slug,
    status,
    propertyType,
    price,
    priceType,
    bedrooms,
    bathrooms,
    sqft,
    yearTransacted,
    location,
    "featuredImage": featuredImage {
      asset->,
      alt
    },
    externalUrl
  }
`

// Featured properties for homepage
export const featuredPropertiesQuery = groq`
  *[_type == "property" && featured == true] | order(featuredOrder asc) [0...6] {
    _id,
    title,
    slug,
    status,
    price,
    priceType,
    location,
    "featuredImage": featuredImage {
      asset->,
      alt
    }
  }
`

// Single property by slug
export const propertyBySlugQuery = groq`
  *[_type == "property" && slug.current == $slug][0] {
    _id,
    _createdAt,
    title,
    slug,
    status,
    propertyType,
    price,
    priceType,
    bedrooms,
    bathrooms,
    sqft,
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
    externalUrl
  }
`

// Property slugs for static generation
export const propertyPathsQuery = groq`
  *[_type == "property" && defined(slug.current)][].slug.current
`
```

### 3.2 Blog Queries

```typescript
// All blog posts
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
    "author": author-> {
      name,
      slug,
      image
    },
    categories
  }
`

// Single blog post by slug
export const blogPostBySlugQuery = groq`
  *[_type == "blogPost" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    publishedAt,
    body,
    "featuredImage": featuredImage {
      asset->,
      alt
    },
    "author": author-> {
      name,
      slug,
      image,
      bio
    },
    categories
  }
`

// Blog post slugs for static generation
export const blogPostPathsQuery = groq`
  *[_type == "blogPost" && defined(slug.current)][].slug.current
`
```

### 3.3 Site Settings Query

```typescript
// Site settings (singleton)
export const siteSettingsQuery = groq`
  *[_type == "siteSettings"][0] {
    siteName,
    tagline,
    email,
    phone,
    address,
    socialLinks,
    footerText
  }
`
```

---

## 4. TypeScript Types

**File:** `types/index.ts`

```typescript
// Status types
export type PropertyStatus = 'active-sale' | 'active-rental' | 'sold' | 'rented'
export type PropertyType = 'condo' | 'house' | 'penthouse' | 'land' | 'commercial'
export type State = 'PR' | 'FL'
export type PriceType = 'sale' | 'rent'

// Sanity image type
export interface SanityImage {
  asset: {
    _id: string
    url: string
  }
  alt: string
  hotspot?: {
    x: number
    y: number
    width: number
    height: number
  }
}

// Location type
export interface PropertyLocation {
  address?: string
  city: string
  state: State
  neighborhood?: string
}

// Property type
export interface Property {
  _id: string
  _createdAt: string
  title: string
  slug: { current: string }
  status: PropertyStatus
  propertyType?: PropertyType
  price?: number
  priceType?: PriceType
  bedrooms?: number
  bathrooms?: number
  sqft?: number
  yearTransacted?: number
  description?: any[] // Portable Text
  location: PropertyLocation
  featuredImage: SanityImage
  gallery?: SanityImage[]
  externalUrl?: string
  featured?: boolean
  featuredOrder?: number
}

// Blog post type
export interface BlogPost {
  _id: string
  title: string
  slug: { current: string }
  publishedAt: string
  excerpt?: string
  body: any[] // Portable Text
  featuredImage?: SanityImage
  author: Author
  categories?: string[]
}

// Author type
export interface Author {
  name: string
  slug: { current: string }
  image?: SanityImage
  bio?: string
}

// Site settings type
export interface SiteSettings {
  siteName: string
  tagline?: string
  email: string
  phone?: string
  address?: string
  socialLinks?: Array<{
    platform: 'instagram' | 'linkedin' | 'facebook' | 'twitter'
    url: string
  }>
  footerText?: string
}
```

---

## 5. Query Functions

**File:** `lib/sanity/queries.ts` (continued)

```typescript
import { client } from './client'
import type { Property, BlogPost, SiteSettings } from '@/types'

// Properties
export async function getActiveProperties(): Promise<Property[]> {
  return client.fetch(activePropertiesQuery, {}, { next: { revalidate: 60 } })
}

export async function getAllProperties(): Promise<Property[]> {
  return client.fetch(allPropertiesQuery, {}, { next: { revalidate: 60 } })
}

export async function getFeaturedProperties(): Promise<Property[]> {
  return client.fetch(featuredPropertiesQuery, {}, { next: { revalidate: 60 } })
}

export async function getPropertyBySlug(slug: string): Promise<Property | null> {
  return client.fetch(propertyBySlugQuery, { slug }, { next: { revalidate: 60 } })
}

export async function getPropertyPaths(): Promise<string[]> {
  return client.fetch(propertyPathsQuery)
}

// Blog
export async function getAllBlogPosts(): Promise<BlogPost[]> {
  return client.fetch(allBlogPostsQuery, {}, { next: { revalidate: 60 } })
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  return client.fetch(blogPostBySlugQuery, { slug }, { next: { revalidate: 60 } })
}

export async function getBlogPostPaths(): Promise<string[]> {
  return client.fetch(blogPostPathsQuery)
}

// Site Settings
export async function getSiteSettings(): Promise<SiteSettings> {
  return client.fetch(siteSettingsQuery, {}, { next: { revalidate: 3600 } })
}
```

---

## 6. Studio Configuration

**File:** `sanity/sanity.config.ts`

```typescript
import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './schemas'

export default defineConfig({
  name: 'elite-realty',
  title: 'Elite Realty',

  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            // Properties section
            S.listItem()
              .title('Properties')
              .child(
                S.documentTypeList('property')
                  .title('Properties')
              ),
            
            // Blog section
            S.listItem()
              .title('Blog')
              .child(
                S.list()
                  .title('Blog')
                  .items([
                    S.listItem()
                      .title('Posts')
                      .child(S.documentTypeList('blogPost').title('Posts')),
                    S.listItem()
                      .title('Authors')
                      .child(S.documentTypeList('author').title('Authors')),
                  ])
              ),

            S.divider(),

            // Site Settings (singleton)
            S.listItem()
              .title('Site Settings')
              .child(
                S.document()
                  .schemaType('siteSettings')
                  .documentId('siteSettings')
              ),
          ]),
    }),
    visionTool(), // GROQ playground
  ],

  schema: {
    types: schemaTypes,
  },
})
```

---

## 7. Validation Rules Summary

| Schema | Field | Validation |
|--------|-------|------------|
| Property | title | Required |
| Property | slug | Required, unique |
| Property | status | Required |
| Property | location.city | Required |
| Property | location.state | Required |
| Property | featuredImage | Required |
| Property | featuredImage.alt | Required |
| BlogPost | title | Required |
| BlogPost | slug | Required, unique |
| BlogPost | author | Required |
| BlogPost | publishedAt | Required |
| BlogPost | body | Required |
| Author | name | Required |
| Author | slug | Required |
| SiteSettings | siteName | Required |
| SiteSettings | email | Required, email format |

---

## 8. Content Workflow

### 8.1 For Alexandra

1. **Login:** Go to `eliterealty.vercel.app/studio` → Sign in with Google
2. **Add Property:**
   - Click "Properties" → "Create new"
   - Fill required fields (title, status, location, featured image)
   - Upload photos with alt text
   - Click "Publish"
3. **Edit Property:**
   - Find property in list
   - Make changes
   - Click "Publish"
4. **Feature on Homepage:**
   - Edit property → Settings tab
   - Check "Featured on Homepage"
   - Set order number (1 = first)

### 8.2 Content Goes Live

After publishing:
1. Sanity webhook fires
2. Next.js revalidates affected pages
3. Changes appear on site within seconds

---

*This document defines the CMS structure for Elite Realty. For design, see DESIGN-SYSTEM.md. For architecture, see ARCHITECTURE.md.*
