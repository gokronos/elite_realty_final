# Elite Realty Website - Alexandra's Feedback Implementation

## FIRST: Create a new git branch
```bash
git checkout -b feature/alexandra-feedback-v2
```

## Context
Alexandra reviewed the site and Rita Pellens (ritapellens.com). She wants:
1. "Property" instead of "Portfolio" everywhere
2. Hamburger menu top-right like Rita Pellens (see reference)
3. **Cleaner, more sophisticated typography** - Rita's looks "un poco casero"
4. Homepage sections in order: HERO → MEET ALEXANDRA → FOR SALE → SOLD → NEIGHBORHOODS
5. Keep the BLACK theme (#0a0a0a background, white text, gold #d4af37 accents)

## Rita Pellens Structure to Follow (with Alexandra's dark theme)

### NAVIGATION (Rita's pattern)
- Logo "ER" or "Elite Realty" on LEFT
- Right side: "PROPERTY" link | Phone: (787) 308-3982 | Hamburger icon ☰
- Hamburger opens slide-out menu from RIGHT with links:
  - Home
  - About Alexandra
  - Property (not Portfolio!)
  - Neighborhoods
  - Journal
  - Contact
- Dark background header, white text

### TYPOGRAPHY (upgrade from Rita)
Install Google Fonts and update tailwind.config.js:
- **Headings**: "Cormorant Garamond" (elegant serif) - weight 500/600
- **Body/Nav**: "Inter" (clean sans-serif) - weight 400/500
- Letter-spacing: wide on nav items (tracking-wider or tracking-widest)
- This is CLEANER and more SOPHISTICATED than Rita's traditional look

### HOMEPAGE SECTIONS (scroll order)

1. **HERO** (100vh)
   - Full-screen background image with dark overlay (60%)
   - "ALEXANDRA LUGO" centered, huge (80px mobile, 120px desktop)
   - Subtitle: "LUXURY REAL ESTATE" or similar
   - NO search bar (Alexandra's clients call directly)

2. **MEET ALEXANDRA** 
   - Two-column layout (image left, text right on desktop)
   - "MEET ALEXANDRA" heading with gold underline
   - Bio paragraph
   - "LEARN MORE" and "RECENT SALES" links
   - Dark background

3. **FOR SALE** section
   - Section title "FOR SALE" centered, uppercase, large (48px)
   - 3-column grid of property cards
   - Property card structure (match Rita):
     - Image with "FOR SALE" badge top-right (gold background, black text)
     - Property name (uppercase, centered)
     - Full address below
     - Beds | Baths | Sq.Ft.
     - Price (bold, larger)
   - "VIEW ALL" button at bottom
   - Background: #0a0a0a (black)

4. **SOLD** section
   - Same structure as FOR SALE
   - "SOLD" badges instead
   - Background: #1a1a1a (slightly lighter for contrast)
   - "VIEW ALL" button

5. **NEIGHBORHOODS** section
   - Section title "NEIGHBORHOODS" centered
   - Full-bleed aerial/drone photos in 3-column grid (2 rows = 6 neighborhoods)
   - Dark overlay on each image
   - Neighborhood name centered in white, uppercase
   - Alexandra's locations:
     - Row 1: CONDADO, DORADO, GUAYNABO
     - Row 2: MIRAMAR, OCEAN PARK, HATO REY
   - Hover: reveal "EXPLORE HOMES" button
   - NO borders between images (edge-to-edge like Rita)

6. **CONTACT CTA**
   - "LET'S CONNECT" heading
   - Phone and email
   - Contact button

### PROPERTY CARD COMPONENT (new design)
Create/update components/property/PropertyCard.tsx to match Rita's structure:
```
┌─────────────────────────┐
│ [IMAGE]      [FOR SALE] │  ← badge top-right
│                         │
├─────────────────────────┤
│     PROPERTY NAME       │  ← uppercase, centered
│  123 Address, City, PR  │  ← smaller, gray
│   3 BD | 2 BA | 1,500   │  ← specs
│      $1,250,000         │  ← price, bold
└─────────────────────────┘
```

### FILES TO UPDATE

1. `tailwind.config.js` - Add Cormorant Garamond + Inter fonts
2. `app/layout.tsx` - Import Google Fonts
3. `components/layout/Header.tsx` - New nav with hamburger menu
4. `components/layout/MobileMenu.tsx` - Slide-out menu component (new)
5. `app/(site)/page.tsx` - Homepage with all sections
6. `components/property/PropertyCard.tsx` - Rita-style cards
7. `app/(site)/portfolio/page.tsx` → Rename to `app/(site)/property/page.tsx`
8. Update all "Portfolio" text to "Property"

### IMPORTANT CONSTRAINTS
- Keep dark theme: #0a0a0a (black), #1a1a1a (dark gray), white text, #d4af37 (gold)
- NO WhatsApp button
- NO email popup
- NO search bar in hero
- Phone number MUST be visible: (787) 308-3982
- Credentials in footer: PR Lic. C-19793 | FL 3507350

## Execution Plan
1. Create git branch first
2. Update typography (fonts)
3. Create new Header with hamburger menu
4. Update homepage sections in correct order
5. Update PropertyCard component
6. Rename Portfolio → Property
7. Test and verify

Start with step 1 (git branch), then show me the plan for step 2 before implementing.
Output code directly - don't use bash heredocs (they fail on Windows).
