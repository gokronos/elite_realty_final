# Sanity CMS Organization Strategy

## Overview

This document explains how to organize and manage content in Sanity Studio for Elite Realty.

---

## Content Structure

### 1. Properties

**Location:** Properties section in Studio sidebar

**Organization Strategy - By Year:**
Properties are automatically organized by `yearTransacted` in the portfolio. To keep things organized:

1. **Active Listings** - Properties with status `active-sale` or `active-rental`
   - These appear first in the portfolio
   - Mark as "Featured" to show on homepage

2. **Sold/Rented Properties** - Organized by year
   - Set `yearTransacted` to the year the deal closed
   - Portfolio sorts by year (newest first)

**Required Fields for Each Property:**
- `title` - Property name (e.g., "Metro Plaza Unit 502")
- `slug` - URL-friendly name (auto-generated)
- `status` - One of: `active-sale`, `active-rental`, `sold`, `rented`
- `propertyType` - One of: `condo`, `house`, `penthouse`, `land`, `commercial`
- `price` - Sale or rental price
- `priceType` - `sale` or `rent`
- `location` - City, State, Neighborhood
- `featuredImage` - Main property photo
- `yearTransacted` - Year sold/rented (for closed deals)

**Optional Fields:**
- `bedrooms`, `bathrooms`, `sqft` - Property details
- `gallery` - Additional photos
- `description` - Rich text description
- `externalUrl` - Link to MLS or external listing
- `featured` - Check to show on homepage
- `featuredOrder` - Order in homepage grid (1-6)

---

### 2. Blog Posts (Journal)

**Location:** Blog section in Studio sidebar

**Organization:**
- Posts display by `publishedAt` date (newest first)
- Each post should have an author assigned

**Required Fields:**
- `title` - Post headline
- `slug` - URL path
- `publishedAt` - Publication date
- `author` - Reference to Author document
- `body` - Rich text content (Portable Text)

**Optional Fields:**
- `excerpt` - Short summary for listings
- `featuredImage` - Header image
- `categories` - Topic tags

---

### 3. Authors

**Location:** Blog > Authors in Studio sidebar

**Current Setup:**
- Primary author: Alexandra Lugo
- Author info displays on About page and blog posts

**Required Fields:**
- `name` - Full name
- `slug` - URL slug
- `image` - Profile photo
- `bio` - Short biography

---

### 4. Site Settings

**Location:** Site Settings in Studio sidebar

**Purpose:** Global site configuration

**Fields:**
- `siteName` - "Elite Realty"
- `tagline` - Site slogan
- `email` - Contact email
- `phone` - Contact phone
- `address` - Office address
- `socialLinks` - Instagram, LinkedIn, Facebook URLs
- `footerText` - Copyright text

---

## Best Practices

### Adding New Properties

1. **Create the property document**
   - Fill in all required fields
   - Upload high-quality featured image (min 1200px wide)
   - Add gallery images if available

2. **Set correct status**
   - Use `active-sale` or `active-rental` for current listings
   - Change to `sold` or `rented` when closed

3. **Organize by year**
   - Set `yearTransacted` when marking as sold/rented
   - This groups properties by year in the portfolio

4. **Feature homepage properties**
   - Check `featured` for up to 6 properties
   - Set `featuredOrder` (1 = first position)

### Property Images

**Recommended Sizes:**
- Featured Image: 1600x1200px (4:3 ratio)
- Gallery Images: 1600x1200px (4:3 ratio)
- File Format: JPEG or WebP
- File Size: Under 500KB per image

**Sanity automatically:**
- Converts to WebP for browsers that support it
- Creates responsive sizes
- Optimizes for performance

### Writing Blog Posts

1. **Create engaging titles**
   - Use keywords like "Puerto Rico", "Miami", "luxury"
   - Keep under 60 characters for SEO

2. **Write an excerpt**
   - 1-2 sentences summarizing the post
   - Shows in listing cards

3. **Add featured image**
   - 1600x900px (16:9 ratio) recommended
   - Include alt text for accessibility

4. **Use rich text formatting**
   - Headers for sections
   - Bold for emphasis
   - Links to relevant properties or pages

---

## Workflow Recommendations

### Daily/Weekly Tasks
- Update property statuses as deals close
- Add new listings promptly
- Review and publish drafted blog posts

### Monthly Tasks
- Archive old inactive listings
- Review featured properties rotation
- Update site settings if contact info changes

### Content Calendar
- Plan 2-4 blog posts per month
- Topics: market updates, neighborhood guides, investment tips
- Coordinate with social media

---

## Data Organization Schema

```
Elite Realty CMS
├── Properties (96 documents)
│   ├── Active Sales
│   ├── Active Rentals
│   └── Closed Deals (by year)
│       ├── 2025
│       ├── 2024
│       ├── 2023
│       └── ...
├── Blog
│   ├── Posts
│   └── Authors
└── Site Settings (singleton)
```

---

## Studio URL

Access Sanity Studio at: `http://localhost:3000/studio`

Or deployed at: `https://your-domain.com/studio`

---

## Troubleshooting

### Images not showing?
1. Check image is uploaded (not just referenced)
2. Verify alt text is filled in
3. Clear browser cache

### Properties not appearing?
1. Check status is set correctly
2. Ensure document is published (not draft)
3. Wait 60 seconds for cache revalidation

### Changes not live?
1. Sanity uses 60-second revalidation
2. For immediate updates, trigger revalidation via webhook
3. Check Next.js dev server is running

---

## Support

- Sanity Docs: https://www.sanity.io/docs
- Project ID: 6ostes35
- Dataset: production
