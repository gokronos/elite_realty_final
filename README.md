# Elite Realty

Luxury real estate website for Puerto Rico and Miami, built with Next.js App Router and Sanity Studio.

## Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- Sanity 5 / next-sanity 12

## Local Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open:

- Site: http://localhost:3000
- Sanity Studio: http://localhost:3000/studio

## Environment

Required public values:

- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET`
- `NEXT_PUBLIC_SANITY_API_VERSION`
- `NEXT_PUBLIC_SITE_URL`

Server-only values:

- `SANITY_WEBHOOK_SECRET`
- `RESEND_API_KEY`
- `CONTACT_EMAIL_TO`
- `CONTACT_EMAIL_FROM`

The contact form only sends email when `RESEND_API_KEY` is configured. In local development without that key, submissions validate successfully but email delivery is skipped.

## Commands

```bash
npm run dev
npm run build
npm run start
npm run lint
npx tsc --noEmit
```
