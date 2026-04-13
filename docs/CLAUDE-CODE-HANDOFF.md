# Claude Code Handoff Guide — Elite Realty Project

**Created:** December 25, 2024  
**Purpose:** Best practices and prompts for building this project with Claude Code

---

## 🎯 Key Principles (December 2025 Best Practices)

### 1. CLAUDE.md is Your Constitution
The contents of your claude.md are prepended to your prompts, consuming part of your token budget with every interaction. A bloated, verbose file will not only cost more but can also introduce noise.

**Your CLAUDE.md is already optimized** — concise, bullet points, no redundancy.

### 2. No Special Prompting Required
No special prompting is required! Simply ask questions, and Claude will explore the code to find answers.

### 3. Plan → Small Diff → Test → Review
Keep context tight. Use CLAUDE.md and subfolder overrides; /clear often. Plan → small diff → tests → review.

### 4. Avoid Over-Engineering
Keep solutions simple and focused. Don't add features, refactor code, or make "improvements" beyond what was asked. A bug fix doesn't need surrounding code cleaned up. A simple feature doesn't need extra configurability.

### 5. Be Specific, Not Vague
Vague instructions lead to unexpected results. Communicate what you want specifically. ❌ "Make it better" ✅ "Sort the list by update time in descending order"

---

## 🚀 Recommended Startup Sequence

### Step 1: Open Project in Claude Code

```bash
cd C:\Users\sergi\Desktop\ALEX
claude
```

Or if using Cursor with Claude Code extension, just open the ALEX folder.

### Step 2: Let Claude Read the Specs First

**Your first prompt should be:**

```
Read the documentation in docs/ folder. I have:
- docs/PRD.md (product requirements)
- docs/ARCHITECTURE.md (technical architecture)
- docs/DESIGN-SYSTEM.md (visual design system)
- docs/SANITY-SPEC.md (CMS schemas)

Confirm you understand the project scope and tech stack.
```

### Step 3: Initialize in Phases

Don't ask Claude to build everything at once. Use phased prompts.

---

## 📝 Specific Prompts for Each Phase

### Phase 1: Project Initialization

**Prompt 1.1 — Initialize Next.js:**
```
Initialize a Next.js 15 project in this directory with:
- TypeScript (strict mode)
- Tailwind CSS
- App Router
- No src directory
- Import alias @/*

Use bun as package manager.
Command: bunx create-next-app@latest . --typescript --tailwind --app --src-dir=false --import-alias="@/*"
```

**Prompt 1.2 — Install Dependencies:**
```
Install these production dependencies using bun:
sanity next-sanity @sanity/image-url @portabletext/react framer-motion lucide-react zod resend

Then show me the updated package.json dependencies section.
```

**Prompt 1.3 — Configure Tailwind:**
```
Update tailwind.config.ts with the brand tokens from docs/DESIGN-SYSTEM.md:
- Dark theme colors: black (#0a0a0a), dark (#1a1a1a), white, gray-light (#a0a0a0), gold (#d4af37)
- Fonts: font-display (Playfair Display), font-sans (Inter)
- Container settings for centered layout

Reference docs/DESIGN-SYSTEM.md section 2 and 3.
```

**Prompt 1.4 — Set Up Fonts:**
```
Update app/layout.tsx to use next/font with:
- Playfair Display (weights 400, 700) as font-display
- Inter (weights 400, 500, 600) as font-sans

Apply the fonts to the HTML element.
```

**Prompt 1.5 — Create globals.css:**
```
Create app/globals.css with:
- Tailwind directives
- CSS custom properties for dark theme colors
- Base styles for body (bg-black, text-white)
- Heading styles (font-display, text-white)
- btn-primary (white bg, black text, gold hover) and btn-secondary (transparent, white border) component classes

Reference docs/DESIGN-SYSTEM.md section 12.
```

---

### Phase 2: TypeScript Types

**Prompt 2.1 — Create Types:**
```
Create types/index.ts with all TypeScript types from docs/SANITY-SPEC.md section 4.

Include:
- PropertyStatus, PropertyType, State, PriceType union types
- SanityImage, PropertyLocation interfaces
- Property, BlogPost, Author, SiteSettings interfaces

Use strict typing, no 'any' types.
```

**Prompt 2.2 — Create Utils:**
```
Create lib/utils.ts with:
- cn() function using clsx and tailwind-merge for className merging
- formatPrice() function for currency formatting
- formatDate() function for date formatting

Keep it minimal.
```

---

### Phase 3: Sanity Setup

**Prompt 3.1 — Sanity Configuration:**
```
Create the Sanity configuration files:
- sanity/sanity.config.ts
- sanity/sanity.cli.ts
- sanity/env.ts (typed environment variable access)

Use project ID: 6ostes35
Dataset: production
API Version: 2024-01-01

Reference docs/SANITY-SPEC.md section 6 for Studio configuration.
```

**Prompt 3.2 — Create Schemas:**
```
Create all Sanity schemas from docs/SANITY-SPEC.md section 2:
- sanity/schemas/property.ts
- sanity/schemas/blogPost.ts
- sanity/schemas/author.ts
- sanity/schemas/siteSettings.ts
- sanity/schemas/index.ts

Include all validation rules. Make sure featuredImage and its alt text are required.
```

**Prompt 3.3 — Sanity Client:**
```
Create Sanity client utilities:
- lib/sanity/client.ts (Sanity client with CDN)
- lib/sanity/image.ts (image URL builder with urlFor helper)
- lib/sanity/queries.ts (all GROQ queries from docs/SANITY-SPEC.md section 3)

Include typed query functions with ISR revalidation (60 seconds default).
```

**Prompt 3.4 — Embed Studio:**
```
Create the Sanity Studio route at app/studio/[[...index]]/page.tsx

Include:
- 'use client' directive
- NextStudio component from next-sanity
- noindex metadata to prevent crawling
- Reference the sanity.config.ts

Also update next.config.ts to allow Sanity CDN images.
```

---

### Phase 4: Components

**Prompt 4.1 — Button Component:**
```
Create components/ui/Button.tsx following docs/DESIGN-SYSTEM.md section 6.1:
- TypeScript props interface with variant, size, className, children
- Variants: primary (navy bg, gold hover), secondary (transparent, navy border)
- Sizes: sm, default, lg
- Use cn() for class merging
- Include focus states for accessibility
```

**Prompt 4.2 — Badge Component:**
```
Create components/ui/Badge.tsx for property status badges:
- Props: status (PropertyStatus type), className
- Colors: navy for sale, gold for rent, gray for sold/rented
- Uppercase text, tracking-wider
- Reference docs/DESIGN-SYSTEM.md section 6.3
```

**Prompt 4.3 — PropertyCard Component:**
```
Create components/property/PropertyCard.tsx:
- Props: property (Property type from types/index.ts)
- 4:3 aspect ratio image with hover zoom effect
- Status badge overlay
- Title, price, location below image
- Use urlFor() for Sanity images
- Mobile-first responsive
- Reference docs/DESIGN-SYSTEM.md section 6.2
```

**Continue with similar specific prompts for each component...**

---

### Phase 5: Pages

**Prompt 5.1 — Site Layout:**
```
Create app/(site)/layout.tsx:
- Import and render Header and Footer components
- Pass children between them
- This wraps all public pages
```

**Prompt 5.2 — Homepage:**
```
Create app/(site)/page.tsx as the homepage:
- Server component (no 'use client')
- Fetch featured properties and site settings from Sanity
- Render sections: Hero, FeaturedProperties, AboutPreview, ContactCTA
- Add metadata for SEO
- Reference docs/PRD.md section 6.1 for requirements
```

---

## ⚡ Pro Tips for This Project

### Use Tab for Autocomplete
Tab to autocomplete filenames. When typing filenames or paths in the Claude Code prompt, you can use the Tab key for autocompletion. Being specific with file paths helps Claude.

### Hit Escape Early
If you see Claude Code going down the wrong path or taking too long, don't hesitate to press the Escape key to interrupt it.

### Commit Often
Ask Claude Code to commit changes after every significant modification. This makes it easier to roll back if needed.

**Example:**
```
Commit these changes with message "feat: add PropertyCard component"
```

### Use /clear Between Phases
After completing a major phase, clear context to stay efficient:
```
/clear
```

Then re-orient Claude:
```
We just completed Phase 3 (Sanity setup). Now starting Phase 4 (Components).
Read CLAUDE.md for context.
```

### Give Visual Feedback
To iterate on a design or fix a UI bug: Ask Claude Code to build something. Open what it built in a browser. Take a screenshot. Paste the screenshot into Claude Code. Provide feedback.

### Use Git for Safety
```
Create a new branch called 'feature/sanity-setup' and switch to it
```

Then after completing:
```
Commit all changes and create a PR description
```

---

## 🛑 What NOT to Do

1. **Don't ask for everything at once**
   - ❌ "Build the entire website"
   - ✅ "Create the PropertyCard component following the design system"

2. **Don't be vague**
   - ❌ "Make it look better"
   - ✅ "Add 8px padding and change the border color to navy"

3. **Don't skip the docs**
   - Always reference `docs/` when asking for new files
   - Claude will follow the specs if you point to them

4. **Don't let context get stale**
   - Use `/clear` between major phases
   - Re-read CLAUDE.md after clearing

---

## 📋 Session Checklist

Before each Claude Code session:

- [ ] Is `bun dev` running? (for live preview)
- [ ] Is the project in a clean git state?
- [ ] Do you know which phase you're on?
- [ ] Have you reviewed the relevant `docs/` file?

After each session:

- [ ] Commit your changes
- [ ] Note what was completed
- [ ] Note any issues to fix next session

---

## 🎯 First Session Prompt (Copy This)

Start your first Claude Code session with this exact prompt:

```
I'm building a luxury real estate portfolio website for Alexandra Lugo.

Please read these files to understand the project:
1. CLAUDE.md (quick reference)
2. docs/PRD.md (full requirements)
3. docs/ARCHITECTURE.md (technical decisions)

This is a fresh directory. We'll build in phases:
- Phase 1: Initialize Next.js + Tailwind + fonts
- Phase 2: TypeScript types
- Phase 3: Sanity CMS setup
- Phase 4: Components
- Phase 5: Pages
- Phase 6: Polish

Let's start with Phase 1. Initialize a Next.js 15 project with TypeScript, Tailwind CSS, App Router, bun package manager.

Command to run: bunx create-next-app@latest . --typescript --tailwind --app --src-dir=false --import-alias="@/*"
```

---

## 📚 Reference

- [Claude Code Best Practices (Anthropic)](https://www.anthropic.com/engineering/claude-code-best-practices)
- [Claude 4.x Prompting Best Practices](https://docs.claude.com/en/docs/build-with-claude/prompt-engineering/claude-4-best-practices)

---

*Good luck! The specs are solid. Trust the process: Plan → Small Diff → Test → Review.*
