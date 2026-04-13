# Elite Realty — Product Requirements Document

**Version:** 1.0  
**Last Updated:** December 25, 2024  
**Author:** Serge (BIM Consultant)  
**Client:** Alexandra Lugo, Elite Realty  

---

## 1. Executive Summary

### 1.1 Project Mission

Build a portfolio website for Alexandra Lugo, an independent luxury real estate broker serving Puerto Rico and Miami. The site will showcase her property listings, establish her professional brand, and allow her to manage content independently via a CMS.

### 1.2 Success Metrics

| Metric | Target |
|--------|--------|
| Lighthouse Performance | >90 |
| Mobile Responsiveness | 100% of pages |
| Content Independence | Alexandra can add/edit properties without developer |
| Time to First Property | <3 seconds on mobile |
| Launch Date | December 31, 2025 |

### 1.3 Constraints

| Constraint | Value |
|------------|-------|
| Budget | $2,000 |
| Hours | 35 maximum |
| Properties | Up to 50 |
| Images | ~220 (from 22 emails) |

---

## 2. Stakeholders & Users

### 2.1 Primary Stakeholder: Alexandra Lugo

**Role:** Client, Content Editor, Business Owner

**Background:**
- Independent luxury real estate broker
- Markets: Puerto Rico (Condado, Dorado, Guaynabo, Miramar) + Miami (Coral Gables, Brickell, Miami Beach)
- Non-technical user
- Manages content from iPhone

**Needs:**
- Professional online presence that reflects her brand
- Easy content management (add/edit properties, blog posts)
- Showcase both active listings and portfolio of past transactions
- Contact form for client inquiries

**Content Sources:**
- 22 emails containing property photos and listing data
- Active listings on Zillow, Realtor.com, Clasificados
- Photos spanning 2019-2025 transactions

### 2.2 End Users: Property Seekers

**Primary Persona:** Luxury property buyer/renter

**Characteristics:**
- High-net-worth individuals
- Looking for properties in Puerto Rico or Miami
- Expect sophisticated, professional presentation
- Browse on both mobile and desktop
- May be relocating (Act 60 tax incentives relevant)

**Goals:**
- Browse available properties
- Filter by location, status, type
- View property details and photos
- Contact Alexandra directly

---

## 3. Design Philosophy

### 3.1 Inspiration

**Reference:** Rita Pellens website (ritapellens.com)
- Clean, minimal aesthetic
- One hero photo per property
- White space as design element
- Typography-forward

### 3.2 Brand Personality

- **Sophisticated:** European-inspired elegance
- **Warm:** Caribbean hospitality
- **Professional:** Trust and competence
- **Approachable:** Not intimidating despite luxury focus

### 3.3 Visual Language

#### Colors (Dark Theme — Alexandra's Approved Direction)

| Name | Hex | CSS Variable | Usage |
|------|-----|--------------|-------|
| Black | #0a0a0a | --color-black | Primary page background |
| Dark | #1a1a1a | --color-dark | Card backgrounds, sections |
| White | #ffffff | --color-white | Primary text, headings, logo |
| Gray Light | #a0a0a0 | --color-gray-light | Secondary text, captions |
| Gold | #d4af37 | --color-gold | Accents, CTAs, highlights |

#### Typography

| Role | Font | Weight | Usage |
|------|------|--------|-------|
| Display | Playfair Display | 400, 700 | Headings, hero text |
| Body | Inter | 400, 500, 600 | Body copy, UI elements |

#### Spacing

Use Tailwind defaults with emphasis on generous whitespace:
- Section padding: 64px (mobile) / 96px (desktop)
- Component gaps: 24px / 32px
- Text margins: 16px / 24px

---

## 4. Site Structure

### 4.1 Pages

| Page | URL | Priority | Purpose |
|------|-----|----------|---------|
| Homepage | `/` | P0 | First impression, featured properties, about preview |
| Portfolio | `/portfolio` | P0 | All properties with filtering |
| Neighborhoods | `/neighborhoods` | P1 | Location showcase (Condado, Dorado, etc.) |
| Journal | `/journal` | P1 | Articles, market insights (renamed from Blog) |
| Journal Post | `/journal/[slug]` | P1 | Individual article |
| About | `/about` | P1 | Alexandra's bio, credentials, photo |
| Contact | `/contact` | P0 | Contact form, info |
| Studio | `/studio` | P0 | Sanity CMS (hidden from nav) |

### 4.2 Navigation

**Header:**
- Logo (left) — ER monogram, white on dark background
- Nav links (desktop): About, Portfolio, Neighborhoods, Journal, Contact
- Mobile: hamburger menu (3 lines → X when open)

**Mobile Menu (from Alexandra's approved reference):**
- Slide-in from right, dark background
- Right-aligned menu items
- Menu order: About, Portfolio, Neighborhoods, Journal, Contact
- "Follow" section at bottom with social icon buttons
- Social: Instagram, Facebook, LinkedIn

**Footer:**
- Contact info (phone, email)
- Social links (icon buttons)
- Copyright

---

## 5. Content Model

### 5.1 Property

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| title | string | Yes | Property name (e.g., "Atlantis #308") |
| slug | slug | Yes | URL-friendly identifier |
| status | enum | Yes | active-sale, active-rental, sold, rented |
| propertyType | enum | No | condo, house, penthouse, land, commercial |
| price | number | No | Price in USD (null = "Contact for price") |
| priceType | enum | No | sale, rent |
| featuredImage | image | Yes | Hero photo with alt text required |
| gallery | image[] | No | Additional photos |
| description | richText | No | Property description |
| bedrooms | number | No | Number of bedrooms |
| bathrooms | number | No | Number of bathrooms |
| sqft | number | No | Square footage |
| location.address | string | No | Street address |
| location.city | string | Yes | City name |
| location.state | enum | Yes | PR or FL |
| location.neighborhood | string | No | Neighborhood name |
| yearTransacted | number | No | Year sold/rented (for past transactions) |
| externalUrl | url | No | Zillow/Realtor link |
| featured | boolean | No | Show on homepage |
| featuredOrder | number | No | Order on homepage (1, 2, 3...) |

### 5.2 Blog Post

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| title | string | Yes | Article title |
| slug | slug | Yes | URL-friendly identifier |
| author | reference | Yes | Reference to Author |
| publishedAt | datetime | Yes | Publication date |
| featuredImage | image | No | Hero image |
| excerpt | text | No | Short summary for cards |
| body | richText | Yes | Article content |
| categories | string[] | No | Tags/categories |

### 5.3 Author

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| name | string | Yes | Full name |
| slug | slug | Yes | URL-friendly identifier |
| image | image | No | Headshot |
| bio | text | No | Short biography |

### 5.4 Site Settings

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| siteName | string | Yes | "Elite Realty" |
| tagline | string | No | Site tagline |
| email | string | Yes | Contact email |
| phone | string | No | Contact phone |
| address | text | No | Office address |
| socialLinks | object[] | No | Instagram, LinkedIn, etc. |
| footerText | string | No | Copyright/footer text |

---

## 6. Functional Requirements

### 6.1 Homepage

**Sections (in order):**

1. **Hero**
   - Full-width background image or video
   - Headline + subheadline
   - CTA button to Portfolio

2. **Featured Properties**
   - 3-6 properties marked as featured
   - Property cards with image, title, price, status
   - "View All" link to Portfolio

3. **About Preview**
   - Alexandra's photo
   - Brief intro paragraph
   - "Learn More" link to About page

4. **Contact CTA**
   - Simple call-to-action section
   - "Get in Touch" button to Contact page

**Acceptance Criteria:**
- [ ] Hero loads with optimized image (<500KB)
- [ ] Featured properties pull from Sanity (ISR: 60s)
- [ ] Page scores >90 on Lighthouse
- [ ] Fully responsive (mobile-first)

### 6.2 Portfolio Page

**Features:**
- Property grid (responsive: 1/2/3 columns)
- Filter bar: Status, Location, Property Type
- Filters work client-side (no page reload)
- URL state for shareable filter links

**Property Card:**
- Featured image
- Status badge (For Sale, For Rent, Sold, Rented)
- Title
- Price (or "Contact for Price")
- Location

**Property Detail:**
- [DECISION NEEDED: Modal overlay vs dedicated page]
- Full gallery
- All property details
- Description
- Contact CTA

**Acceptance Criteria:**
- [ ] All properties load from Sanity
- [ ] Filters work without page reload
- [ ] Filter state reflected in URL
- [ ] Images lazy-loaded
- [ ] Mobile: 1 column grid
- [ ] Desktop: 2-3 column grid

### 6.3 Blog

**Listing Page:**
- Grid of blog post cards
- Card: featured image, title, date, excerpt
- Pagination or "Load More"

**Post Page:**
- Title, author, date
- Featured image
- Rich text body (Portable Text)
- Author bio at bottom

**Acceptance Criteria:**
- [ ] Posts load from Sanity
- [ ] Portable Text renders correctly
- [ ] SEO metadata from post data
- [ ] Share functionality (optional)

### 6.4 About Page

**Content:**
- Alexandra's professional photo
- Biography
- Credentials/certifications
- Markets served
- Personal touch (optional)

**Acceptance Criteria:**
- [ ] Content editable via Sanity
- [ ] Photo optimized
- [ ] Mobile-friendly layout

### 6.5 Contact Page

**Features:**
- Contact form: Name, Email, Phone, Message
- Form validation (Zod)
- Contact info sidebar: email, phone, address
- Map (optional)

**Form Handling:**
- [DECISION NEEDED: mailto vs Resend API vs Formspree]

**Acceptance Criteria:**
- [ ] Form validates before submission
- [ ] Success/error states displayed
- [ ] Spam protection (honeypot field)
- [ ] Contact info from Sanity Site Settings

### 6.6 Sanity Studio

**Access:** `/studio`

**Features:**
- Embedded in Next.js app
- Alexandra logs in via Google/GitHub
- Full CRUD for all content types
- Image upload with hotspot/cropping
- Draft/Publish workflow

**Security:**
- Not indexed by search engines (robots.txt, noindex)
- Sanity handles authentication

---

## 7. Non-Functional Requirements

### 7.1 Performance

| Metric | Target |
|--------|--------|
| Lighthouse Performance | >90 |
| Lighthouse Accessibility | >90 |
| Lighthouse Best Practices | >90 |
| Lighthouse SEO | >90 |
| First Contentful Paint | <1.5s |
| Largest Contentful Paint | <2.5s |
| Cumulative Layout Shift | <0.1 |

### 7.2 Browser Support

| Browser | Version |
|---------|---------|
| Chrome | Last 2 versions |
| Firefox | Last 2 versions |
| Safari | Last 2 versions |
| Edge | Last 2 versions |
| Mobile Safari | iOS 14+ |
| Mobile Chrome | Android 10+ |

### 7.3 Accessibility

- WCAG 2.1 Level AA compliance
- Semantic HTML
- Alt text required on all images
- Keyboard navigable
- Sufficient color contrast

### 7.4 SEO

- Unique title and description per page
- Open Graph and Twitter Card meta tags
- Sitemap.xml (auto-generated from Sanity)
- robots.txt
- Canonical URLs

---

## 8. Technical Architecture

### 8.1 Tech Stack

| Layer | Technology | Version |
|-------|------------|---------|
| Framework | Next.js | 15 (App Router) |
| Language | TypeScript | Strict mode |
| Styling | Tailwind CSS | 3.x |
| CMS | Sanity.io | v3 |
| Deployment | Vercel | - |
| Package Manager | bun | - |

### 8.2 Key Dependencies

| Package | Purpose |
|---------|---------|
| next-sanity | Sanity integration |
| @sanity/image-url | Image URL builder |
| @portabletext/react | Rich text rendering |
| framer-motion | Animations |
| lucide-react | Icons |
| zod | Form validation |

### 8.3 Data Fetching Strategy

| Content | Strategy | Revalidation |
|---------|----------|--------------|
| Properties | SSG + ISR | 60 seconds |
| Blog Posts | SSG + ISR | 60 seconds |
| Site Settings | SSG + ISR | 3600 seconds |

**On-Demand Revalidation:**
- Sanity webhook triggers `/api/revalidate`
- Immediate update when Alexandra publishes

### 8.4 Environment Variables

| Variable | Description | Public |
|----------|-------------|--------|
| NEXT_PUBLIC_SANITY_PROJECT_ID | Sanity project ID | Yes |
| NEXT_PUBLIC_SANITY_DATASET | Dataset name (production) | Yes |
| NEXT_PUBLIC_SANITY_API_VERSION | API version (2024-01-01) | Yes |
| SANITY_WEBHOOK_SECRET | Webhook signature secret | No |
| NEXT_PUBLIC_SITE_URL | Production URL | Yes |

---

## 9. Decisions Log

All architectural decisions with rationale:

| # | Decision | Choice | Rationale |
|---|----------|--------|-----------|
| 1 | Sanity Plan | **Free (Alexandra=Admin)** | Solo operator, no team permissions needed. Upgrade to Growth later if team expands. |
| 2 | Contact Form Backend | **Resend API** | Professional UX (stays on page), free tier (3k emails/mo), simple Vercel integration. |
| 3 | Property Detail View | **Modal overlay** | Matches Rita Pellens inspiration, faster to build, keeps user in browse flow. Can add dedicated pages later if SEO requires. |
| 4 | Domain | **Temporary Vercel subdomain** | Build and test first, add custom domain before launch. Avoids DNS delays during development. |

---

## 10. Content Inventory

### 10.1 Property Content (from Alexandra's Emails)

| Category | Count | Source Email |
|----------|-------|--------------|
| Leased 2019 | TBD | "2019" |
| Leased 2020 | TBD | "2020" |
| Leased 2021 | TBD | "2021" |
| Leased 2022 | TBD | "2022" |
| Leased 2023 | TBD | "2023" |
| Leased 2024 | TBD | "2024" |
| Leased 2025 | TBD | "2025", "Leased Property – 2025" |
| Active Rentals | TBD | "Active - Rental Listings" |
| Active Sales | TBD | Links in "Active Sale Listings – Links" |

### 10.2 Image Notes

- Some photos in HEIC format (iPhone) — convert to JPEG
- Estimated ~220 total images
- Creative reference photos separate from property photos

### 10.3 Staging Workflow

1. Download attachments from 22 emails
2. Organize by property or year/status
3. Convert HEIC to JPEG
4. Create property spreadsheet
5. Upload to Sanity via Studio

---

## 11. Out of Scope

The following are explicitly **not** included in this project:

- Property search with advanced filters (Algolia, etc.)
- User accounts / authentication for visitors
- Saved properties / favorites functionality
- Mortgage calculator
- Virtual tours / 3D walkthroughs
- Multi-language support
- Email marketing integration
- CRM integration
- MLS/IDX feed integration
- Custom analytics dashboard

These can be added in future phases if needed.

---

## 12. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Content not ready by deadline | Medium | High | Start with test data, Alexandra uploads post-launch |
| Scope creep | Medium | Medium | Refer to this PRD, defer to Phase 2 |
| HEIC image issues | Low | Low | Convert all to JPEG before upload |
| Sanity learning curve for Alexandra | Medium | Medium | Training session + documentation |
| Mobile performance issues | Low | Medium | Mobile-first development, regular Lighthouse audits |

---

## 13. Timeline

| Phase | Duration | Deliverable |
|-------|----------|-------------|
| Documentation | 2-3 hours | PRD, Architecture docs |
| Foundation | 2-3 hours | Next.js project, Tailwind, fonts |
| Sanity Setup | 3-4 hours | Schemas, Studio, test data |
| Components | 4-5 hours | UI component library |
| Pages | 8-10 hours | All 5 pages functional |
| Polish | 4-5 hours | SEO, performance, mobile |
| Content | TBD (Alexandra) | Real properties uploaded |
| Launch | 2-3 hours | Domain, final testing, handoff |

**Total Development:** ~28-31 hours (within 35-hour cap)

---

## 14. Acceptance Criteria Summary

The project is complete when:

- [ ] All 5 pages functional and responsive
- [ ] Sanity Studio accessible at /studio
- [ ] Alexandra can add/edit properties independently
- [ ] Contact form works correctly
- [ ] Lighthouse scores >90 across all categories
- [ ] Site deployed on Vercel with production domain
- [ ] Alexandra trained on CMS usage

---

## Appendix A: Reference Links

- **Design Inspiration:** ritapellens.com
- **Sanity Documentation:** sanity.io/docs
- **Next.js Documentation:** nextjs.org/docs
- **Tailwind Documentation:** tailwindcss.com/docs

---

## Appendix B: Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2024-12-25 | Initial PRD created |

---

*This document is the single source of truth for the Elite Realty project. All development decisions should reference this PRD.*
