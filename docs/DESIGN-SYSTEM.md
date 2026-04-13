# Elite Realty — Design System

**Version:** 1.0  
**Last Updated:** December 25, 2024  
**References:** PRD.md  

---

## 1. Design Philosophy

### 1.1 Core Principles

| Principle | Description |
|-----------|-------------|
| **Sophisticated Simplicity** | Clean layouts, generous whitespace, minimal clutter |
| **Content First** | Properties and photos are the hero, UI supports them |
| **Mobile Excellence** | Designed for iPhone, scales up to desktop |
| **Trust Through Quality** | Every pixel conveys professionalism |

### 1.2 Inspiration

**Primary Reference:** Rita Pellens (ritapellens.com)
- Single hero image per property
- Typography-forward design
- Whitespace as intentional element
- Minimal navigation

**Secondary Influences:**
- Luxury hospitality websites (Four Seasons, Aman)
- High-end fashion e-commerce
- Editorial magazine layouts

---

## 2. Color Palette

**Theme:** Dark, sophisticated aesthetic matching Alexandra's approved brand direction.

### 2.1 Primary Colors

| Name | Hex | RGB | Tailwind Class | Usage |
|------|-----|-----|----------------|-------|
| **Black** | `#0a0a0a` | 10, 10, 10 | `black` | Primary page background |
| **Dark** | `#1a1a1a` | 26, 26, 26 | `dark` | Card backgrounds, sections |
| **Gray Dark** | `#2d2d2d` | 45, 45, 45 | `gray-dark` | Borders, dividers |
| **White** | `#ffffff` | 255, 255, 255 | `white` | Primary text, logo, headings |
| **Gray Light** | `#a0a0a0` | 160, 160, 160 | `gray-light` | Secondary text, captions |
| **Gold** | `#d4af37` | 212, 175, 55 | `gold` | Accents, CTAs, luxury cues |

### 2.2 Extended Palette

| Name | Hex | Usage |
|------|-----|-------|
| Black Deep | `#000000` | True black for maximum contrast |
| Dark Elevated | `#252525` | Elevated cards, modals |
| Gold Light | `#ecc94b` | Hover states on gold elements |
| Gold Muted | `#b7791f` | Gold text on dark backgrounds |
| Gray 500 | `#6b6b6b` | Disabled states |
| Gray 400 | `#8a8a8a` | Placeholder text |
| Gray 300 | `#b0b0b0` | Borders on dark |
| White Muted | `#e0e0e0` | Secondary headings |
| Success | `#38a169` | Success states |
| Error | `#e53e3e` | Error states |

### 2.3 Tailwind Configuration

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        black: '#0a0a0a',
        dark: {
          DEFAULT: '#1a1a1a',
          elevated: '#252525',
        },
        gold: {
          DEFAULT: '#d4af37',
          light: '#ecc94b',
          muted: '#b7791f',
        },
        gray: {
          light: '#a0a0a0',
          dark: '#2d2d2d',
          300: '#b0b0b0',
          400: '#8a8a8a',
          500: '#6b6b6b',
        },
      },
    },
  },
}

export default config
```

### 2.4 Color Usage Rules

| Context | Color | Notes |
|---------|-------|-------|
| Page background | Black (#0a0a0a) | Default for all pages |
| Card background | Dark (#1a1a1a) | Subtle elevation on black |
| Primary text | White | High contrast on dark |
| Secondary text | Gray Light (#a0a0a0) | Captions, metadata |
| Headings | White | All h1, h2, h3 |
| Links | White | Gold on hover |
| Primary buttons | White bg, Black text | Gold bg on hover |
| Secondary buttons | Transparent, White border | White bg on hover |
| Status: For Sale | White badge, dark text | |
| Status: For Rent | Gold badge, dark text | |
| Status: Sold | Gray badge | |
| Status: Rented | Gray badge | |

---

## 3. Typography

### 3.1 Font Stack

| Role | Font Family | Fallback | Tailwind Class |
|------|-------------|----------|----------------|
| Display | Playfair Display | Georgia, serif | `font-display` |
| Body | Inter | system-ui, sans-serif | `font-sans` |

### 3.2 Type Scale

| Name | Size (px) | Size (rem) | Line Height | Weight | Usage |
|------|-----------|------------|-------------|--------|-------|
| Display | 48-72 | 3-4.5 | 1.1 | 700 | Hero headlines |
| H1 | 36-48 | 2.25-3 | 1.2 | 700 | Page titles |
| H2 | 30-36 | 1.875-2.25 | 1.25 | 700 | Section headers |
| H3 | 24 | 1.5 | 1.3 | 600 | Subsection headers |
| H4 | 20 | 1.25 | 1.4 | 600 | Card titles |
| Body Large | 18 | 1.125 | 1.6 | 400 | Lead paragraphs |
| Body | 16 | 1 | 1.6 | 400 | Default text |
| Body Small | 14 | 0.875 | 1.5 | 400 | Captions, meta |
| Caption | 12 | 0.75 | 1.4 | 500 | Labels, badges |

### 3.3 Tailwind Configuration

```typescript
// tailwind.config.ts (continued)
theme: {
  extend: {
    fontFamily: {
      display: ['Playfair Display', 'Georgia', 'serif'],
      sans: ['Inter', 'system-ui', 'sans-serif'],
    },
    fontSize: {
      'display': ['4.5rem', { lineHeight: '1.1', fontWeight: '700' }],
      'h1': ['3rem', { lineHeight: '1.2', fontWeight: '700' }],
      'h2': ['2.25rem', { lineHeight: '1.25', fontWeight: '700' }],
      'h3': ['1.5rem', { lineHeight: '1.3', fontWeight: '600' }],
      'h4': ['1.25rem', { lineHeight: '1.4', fontWeight: '600' }],
      'body-lg': ['1.125rem', { lineHeight: '1.6', fontWeight: '400' }],
      'body': ['1rem', { lineHeight: '1.6', fontWeight: '400' }],
      'body-sm': ['0.875rem', { lineHeight: '1.5', fontWeight: '400' }],
      'caption': ['0.75rem', { lineHeight: '1.4', fontWeight: '500' }],
    },
  },
},
```

### 3.4 Typography Rules

| Rule | Implementation |
|------|----------------|
| Headings always use Playfair Display | `font-display` class |
| Body text always uses Inter | `font-sans` class (default) |
| Max line length: 65-75 characters | `max-w-prose` or `max-w-2xl` |
| Paragraph spacing | `space-y-4` between paragraphs |
| Never use font weights below 400 | Maintains readability |
| Headings: Navy color | `text-navy` |
| Body: Charcoal color | `text-charcoal` |

---

## 4. Spacing System

### 4.1 Base Scale

Using Tailwind's default 4px base unit:

| Token | Value | Tailwind | Common Usage |
|-------|-------|----------|--------------|
| 1 | 4px | `p-1`, `m-1` | Tight spacing |
| 2 | 8px | `p-2`, `m-2` | Icon gaps |
| 3 | 12px | `p-3`, `m-3` | Small padding |
| 4 | 16px | `p-4`, `m-4` | Default padding |
| 6 | 24px | `p-6`, `m-6` | Card padding |
| 8 | 32px | `p-8`, `m-8` | Section gaps |
| 12 | 48px | `p-12`, `m-12` | Large gaps |
| 16 | 64px | `p-16`, `m-16` | Section padding (mobile) |
| 24 | 96px | `p-24`, `m-24` | Section padding (desktop) |

### 4.2 Section Spacing

| Element | Mobile | Desktop |
|---------|--------|---------|
| Page top padding | 64px (`pt-16`) | 96px (`pt-24`) |
| Section vertical padding | 64px (`py-16`) | 96px (`py-24`) |
| Section horizontal padding | 16px (`px-4`) | 0 (container handles) |
| Component gaps | 24px (`gap-6`) | 32px (`gap-8`) |
| Card internal padding | 24px (`p-6`) | 32px (`p-8`) |

### 4.3 Container

```typescript
// tailwind.config.ts (continued)
theme: {
  extend: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '2rem',
        lg: '4rem',
        xl: '5rem',
      },
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
      },
    },
  },
},
```

---

## 5. Breakpoints

### 5.1 Responsive Breakpoints

| Name | Min Width | Tailwind Prefix | Target Devices |
|------|-----------|-----------------|----------------|
| Default | 0px | (none) | Mobile phones |
| sm | 640px | `sm:` | Large phones, small tablets |
| md | 768px | `md:` | Tablets |
| lg | 1024px | `lg:` | Laptops, small desktops |
| xl | 1280px | `xl:` | Desktops |
| 2xl | 1536px | `2xl:` | Large desktops |

### 5.2 Mobile-First Approach

Always start with mobile styles, then add breakpoint overrides:

```tsx
// ✅ Correct: Mobile-first
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">

// ❌ Wrong: Desktop-first
<div className="grid grid-cols-3 md:grid-cols-2 sm:grid-cols-1">
```

---

## 6. Component Patterns

### 6.1 Buttons

#### Primary Button

```tsx
<button className="
  bg-white text-black 
  px-6 py-3 
  font-sans font-medium
  rounded-none
  hover:bg-gold hover:text-black
  transition-colors duration-200
  focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-black
">
  View Properties
</button>
```

#### Secondary Button

```tsx
<button className="
  bg-transparent text-white 
  border border-white
  px-6 py-3 
  font-sans font-medium
  rounded-none
  hover:bg-white hover:text-black
  transition-colors duration-200
  focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black
">
  Learn More
</button>
```

#### Button Sizes

| Size | Padding | Font Size |
|------|---------|-----------|
| Small | `px-4 py-2` | `text-sm` |
| Default | `px-6 py-3` | `text-base` |
| Large | `px-8 py-4` | `text-lg` |

### 6.2 Cards

#### Property Card

```tsx
<article className="
  bg-dark 
  border border-gray-dark
  hover:border-gray-400
  transition-colors duration-200
  group
">
  {/* Image */}
  <div className="aspect-[4/3] overflow-hidden">
    <img 
      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
    />
  </div>
  
  {/* Content */}
  <div className="p-6">
    <span className="text-caption uppercase tracking-wider text-gray-light">
      For Sale
    </span>
    <h3 className="font-display text-h4 text-white mt-2">
      Property Name
    </h3>
    <p className="text-body-lg text-white mt-1">
      $1,200,000
    </p>
    <p className="text-body-sm text-gray-light mt-2">
      Condado, Puerto Rico
    </p>
  </div>
</article>
```

### 6.3 Badges

```tsx
// Status badges
<span className="px-3 py-1 text-caption uppercase tracking-wider bg-white text-black">
  For Sale
</span>

<span className="px-3 py-1 text-caption uppercase tracking-wider bg-gold text-black">
  For Rent
</span>

<span className="px-3 py-1 text-caption uppercase tracking-wider bg-gray-500 text-white">
  Sold
</span>
```

### 6.4 Form Inputs

```tsx
<input 
  type="text"
  className="
    w-full
    px-4 py-3
    border border-gray-dark
    bg-dark
    text-white
    placeholder:text-gray-400
    focus:outline-none focus:border-white focus:ring-1 focus:ring-white
    transition-colors duration-200
  "
  placeholder="Your name"
/>
```

---

## 7. Layout Patterns

### 7.1 Page Layout

```tsx
// Standard page structure
<main className="min-h-screen bg-black">
  {/* Hero or page header */}
  <section className="py-16 lg:py-24">
    <div className="container">
      {/* Content */}
    </div>
  </section>
  
  {/* Alternate section with subtle background change */}
  <section className="py-16 lg:py-24 bg-dark">
    <div className="container">
      {/* Content */}
    </div>
  </section>
</main>
```

### 7.2 Grid Patterns

```tsx
// Property grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
  {properties.map(property => (
    <PropertyCard key={property._id} property={property} />
  ))}
</div>

// Two-column layout
<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
  <div>{/* Left column */}</div>
  <div>{/* Right column */}</div>
</div>

// Sidebar layout
<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
  <div className="lg:col-span-2">{/* Main content */}</div>
  <aside>{/* Sidebar */}</aside>
</div>
```

### 7.3 Section Patterns

```tsx
// Centered section
<section className="py-16 lg:py-24">
  <div className="container">
    <div className="max-w-3xl mx-auto text-center">
      <h2 className="font-display text-h2 text-white">
        Section Title
      </h2>
      <p className="text-body-lg text-gray-light mt-4">
        Section description text goes here.
      </p>
    </div>
  </div>
</section>

// Full-width hero
<section className="relative h-[70vh] min-h-[500px]">
  <img className="absolute inset-0 w-full h-full object-cover" />
  <div className="absolute inset-0 bg-black/50" />
  <div className="relative h-full container flex items-center">
    <div className="max-w-2xl">
      <h1 className="font-display text-display text-white">
        Hero Title
      </h1>
    </div>
  </div>
</section>
```

---

## 8. Animation Guidelines

### 8.1 Principles

| Principle | Implementation |
|-----------|----------------|
| Subtle is better | Avoid dramatic animations |
| Purpose over decoration | Animations guide attention |
| Performance first | Use transform/opacity only |
| Consistent timing | Use standard durations |

### 8.2 Standard Durations

| Name | Duration | Usage |
|------|----------|-------|
| Fast | 150ms | Micro-interactions (hover states) |
| Normal | 200ms | Standard transitions |
| Slow | 300ms | Larger elements, modals |
| Slower | 500ms | Page transitions, image reveals |

### 8.3 Easing

```typescript
// tailwind.config.ts (continued)
theme: {
  extend: {
    transitionTimingFunction: {
      'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
    },
  },
},
```

### 8.4 Common Animations

```tsx
// Hover scale (images)
<img className="transition-transform duration-500 hover:scale-105" />

// Fade in on scroll (Framer Motion)
<motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
  viewport={{ once: true }}
>

// Button hover
<button className="transition-colors duration-200 hover:bg-gold" />
```

---

## 9. Iconography

### 9.1 Icon Library

Using **Lucide React** for consistent, lightweight icons.

```tsx
import { Menu, X, Phone, Mail, MapPin, ChevronRight } from 'lucide-react'
```

### 9.2 Icon Sizes

| Context | Size | Tailwind Class |
|---------|------|----------------|
| Inline with text | 16px | `w-4 h-4` |
| Buttons | 20px | `w-5 h-5` |
| Navigation | 24px | `w-6 h-6` |
| Feature icons | 32px | `w-8 h-8` |
| Hero icons | 48px | `w-12 h-12` |

### 9.3 Icon Style

| Rule | Implementation |
|------|----------------|
| Stroke width | 1.5-2 (default) |
| Color | Inherit from parent (`currentColor`) |
| Alignment | Center vertically with text |

---

## 10. Images

### 10.1 Aspect Ratios

| Context | Ratio | Tailwind Class |
|---------|-------|----------------|
| Property card | 4:3 | `aspect-[4/3]` |
| Hero | 16:9 | `aspect-video` |
| Gallery thumbnail | 1:1 | `aspect-square` |
| Blog card | 3:2 | `aspect-[3/2]` |
| Portrait | 2:3 | `aspect-[2/3]` |

### 10.2 Image Treatment

```tsx
// Standard property image
<div className="aspect-[4/3] overflow-hidden bg-gray-100">
  <img 
    src={imageUrl}
    alt={altText}
    className="w-full h-full object-cover"
    loading="lazy"
  />
</div>

// Image with hover zoom
<div className="aspect-[4/3] overflow-hidden group">
  <img 
    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
  />
</div>
```

### 10.3 Placeholder/Loading

```tsx
// Skeleton placeholder
<div className="aspect-[4/3] bg-gray-200 animate-pulse" />

// Blur placeholder (with next/image)
<Image
  src={imageUrl}
  placeholder="blur"
  blurDataURL={blurHash}
/>
```

---

## 11. Accessibility

### 11.1 Color Contrast

All text must meet WCAG 2.1 AA standards:
- Regular text: 4.5:1 minimum
- Large text (18px+): 3:1 minimum

| Combination | Ratio | Pass? |
|-------------|-------|-------|
| White on Black (#0a0a0a) | 19.5:1 | ✅ |
| White on Dark (#1a1a1a) | 16.1:1 | ✅ |
| Gray Light on Black | 7.2:1 | ✅ |
| Gray Light on Dark | 5.9:1 | ✅ |
| Gold on Black | 8.1:1 | ✅ |
| Gold on Dark | 6.7:1 | ✅ |
| Black on White | 19.5:1 | ✅ |
| Black on Gold | 8.1:1 | ✅ |

### 11.2 Focus States

All interactive elements must have visible focus states:

```tsx
className="focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black"
```

### 11.3 Screen Reader

```tsx
// Skip link
<a href="#main" className="sr-only focus:not-sr-only focus:absolute ...">
  Skip to main content
</a>

// Icon-only buttons
<button aria-label="Open menu">
  <Menu className="w-6 h-6" />
</button>

// Decorative images
<img alt="" aria-hidden="true" />
```

---

## 12. CSS Custom Properties

### 12.1 globals.css

```css
/* app/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --color-black: 10 10 10;
    --color-dark: 26 26 26;
    --color-dark-elevated: 37 37 37;
    --color-gold: 212 175 55;
    --color-gold-light: 236 201 75;
    --color-gray-light: 160 160 160;
    --color-gray-dark: 45 45 45;
  }

  html {
    @apply antialiased;
  }

  body {
    @apply bg-black text-white font-sans;
  }

  h1, h2, h3, h4, h5, h6 {
    @apply font-display text-white;
  }
}

@layer components {
  .btn-primary {
    @apply bg-white text-black px-6 py-3 font-medium
           hover:bg-gold hover:text-black
           transition-colors duration-200
           focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-black;
  }

  .btn-secondary {
    @apply bg-transparent text-white border border-white px-6 py-3 font-medium
           hover:bg-white hover:text-black
           transition-colors duration-200
           focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black;
  }
}
```

---

## Appendix: Component Checklist

When creating any component, verify:

- [ ] Uses design system colors (no hardcoded hex)
- [ ] Uses design system typography (font-display or font-sans)
- [ ] Uses design system spacing (Tailwind scale)
- [ ] Mobile-first responsive
- [ ] Has focus states for interactive elements
- [ ] Images have alt text
- [ ] Proper semantic HTML
- [ ] Smooth transitions (200ms default)

---

*This document defines how Elite Realty looks. For what we're building, see PRD.md. For how it's built, see ARCHITECTURE.md.*
