# CLAUDE.md — Elite Realty Project Instructions

This file provides instructions for Claude Code when working on this project.

---

## Project Overview

**What:** Portfolio website for Alexandra Lugo, luxury real estate broker
**Stack:** Next.js 16 + TypeScript + Tailwind CSS v4 + Sanity CMS + Vercel
**Theme:** Dark, sophisticated aesthetic (black background, white text, gold accents)
**Budget:** 35 hours | **Deadline:** December 31, 2025

---

## Current Status

### Completed
- [x] Project foundation (Next.js, TypeScript, Tailwind)
- [x] Sanity CMS integration with schemas
- [x] All page routes (Home, About, Properties, Locations, Journal, Contact)
- [x] Header with logo, navigation, mobile menu
- [x] Footer with contact info and social links
- [x] Property cards and grid layout
- [x] Location cards with image fallbacks
- [x] Hero section with rotating video backgrounds
- [x] 96 properties uploaded to Sanity (sold/rented)
- [x] SEO metadata and JSON-LD schemas

### Pending
- [ ] Add "active-sale" properties in Sanity Studio
- [ ] Configure Resend API for contact form
- [ ] Final mobile testing
- [ ] Lighthouse performance audit
- [ ] Deploy to production

---

## Documentation

All specifications are in the `docs/` folder:

| Document | Purpose |
|----------|---------|
| `docs/PRD.md` | Requirements and features |
| `docs/ARCHITECTURE.md` | Stack and data flow |
| `docs/DESIGN-SYSTEM.md` | Colors, typography, components |
| `docs/SANITY-SPEC.md` | CMS schemas and queries |
| `docs/brandbook.md` | Brand guidelines reference |

---

## Key Decisions (Locked)

| Decision | Choice |
|----------|--------|
| Sanity Plan | Free (Alexandra = Admin) |
| Contact Form | Resend API |
| Property Detail | Modal overlay |
| Fonts | Cormorant Garamond (headings) + Inter (body) |
| Domain | Temp Vercel subdomain during dev |

---

## Code Standards

### TypeScript
- Strict mode enabled
- No `any` types
- All props interfaces defined
- Export types from `types/index.ts`

### Components
- Functional components only
- Props interface above component
- Use `cn()` utility for className merging
- Mobile-first responsive

### Styling
- Tailwind CSS v4 with `@theme inline` for custom properties
- **Dark theme:** Black background (#0a0a0a), white text
- Colors: `black`, `dark`, `white`, `gray-light`, `gold`
- Fonts: `font-serif` (Cormorant Garamond), `font-sans` (Inter)

### Data Fetching
- Server components by default
- ISR with `revalidate: 60` for Sanity queries
- Use typed query functions from `lib/sanity/queries.ts`

### File Organization
```
components/
├── ui/          # Generic reusable (Button, Badge, LocationCard)
├── layout/      # Header, Footer, MobileMenu
├── property/    # PropertyCard, PropertyFilter, PropertyGrid
├── hero/        # HeroBackground (video/image rotation)
├── blog/        # Blog-specific components
└── seo/         # JsonLd schema component
```

---

## Common Commands

```bash
# Development
npm run dev          # Start dev server (localhost:3000)
npm run build        # Production build
npm run lint         # Run ESLint
npm run type-check   # TypeScript check

# Sanity
# Studio is at /studio (no separate command needed)
npx sanity schema deploy  # Deploy schema to Sanity cloud
```

---

## Environment Variables

Required in `.env.local`:

```bash
NEXT_PUBLIC_SANITY_PROJECT_ID=6ostes35
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01
SANITY_WEBHOOK_SECRET=<generate-secret>
NEXT_PUBLIC_SITE_URL=https://elite-realty.vercel.app
RESEND_API_KEY=<from-resend-dashboard>
```

---

## Quick Reference

### Colors (Dark Theme)
```
Black: #0a0a0a (background)
Dark: #1a1a1a (cards, sections)
Dark Elevated: #252525 (hover states)
White: #ffffff (text, headings)
Gray Light: #a0a0a0 (secondary text)
Gold: #d4af37 (accents, CTAs, phone number)
```

### Navigation Links
```
Home → /
About → /about
Properties → /property
Locations → /locations
Journal → /journal
Contact → /contact
```

### Status Values
```
active-sale | active-rental | sold | rented
```

### States
```
PR (Puerto Rico) | FL (Florida)
```

### Property Types
```
condo | residential | commercial | land
```

### Locations (Puerto Rico)
```
Condado, Dorado, Guaynabo, Miramar, Hato Rey, Santurce, Ocean Park
```

### Locations (Florida)
```
Coral Gables, Brickell, Miami Beach
```

---

## Important Files

| File | Purpose |
|------|---------|
| `app/globals.css` | Tailwind config, CSS variables, font-serif class |
| `app/layout.tsx` | Root layout with font loading |
| `components/layout/Header.tsx` | Main navigation with logo |
| `components/hero/HeroBackground.tsx` | Rotating video/image hero |
| `components/ui/LocationCard.tsx` | Location cards with fallback |
| `lib/sanity/queries.ts` | All GROQ queries |
| `types/index.ts` | TypeScript type definitions |

---

## Notes

- Sanity Project ID: `6ostes35`
- **Dark theme** with ER logo in white
- Client (Alexandra) is non-technical, uses iPhone
- 96 properties uploaded (all sold/rented status)
- Hero videos: `hero-1.mp4`, `hero-2.mp4`, `hero-3.mp4`
- Phone number displays in gold (#d4af37)
- Hamburger menu visible on all screen sizes
- Social: Instagram, Facebook, LinkedIn

---

*When in doubt, check the docs/ folder.*
