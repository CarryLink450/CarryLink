# CarryLink MVP

CarryLink is a Next.js MVP for a trusted peer-to-peer travel delivery matching platform. It helps people living outside their home countries find travelers who are already flying the same route and coordinate small lawful deliveries.

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Mock data and mock matching logic
- Component-based frontend structure prepared for Supabase later

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Useful checks:

```bash
npm run typecheck
npm run build
```

## Google AdSense Spaces

Ad placements are built with a reusable `AdSlot` component. By default they render clean placeholder boxes so the page layout reserves space before an AdSense account is connected.

Create `.env.local` and add your AdSense publisher ID:

```bash
NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT=ca-pub-your-publisher-id
```

Then replace the demo `slot` values passed to `AdSlot` components with the real ad unit IDs from Google AdSense. Current placements include homepage horizontal banners, browse-page top and sidebar ads, matches/FAQ/safety banners, and request/trip detail sidebar ads.

## Pages

- `/` Home page
- `/login` Login
- `/signup` Signup
- `/dashboard` Dashboard
- `/requests/new` Create delivery request
- `/trips/new` Post trip
- `/travelers` Browse travelers
- `/browse-requests` Browse delivery requests
- `/matches` Ranked matches
- `/chat` Mock chat
- `/profile` Profile
- `/safety` Safety guidelines
- `/faq` FAQ
- `/trips/[id]` Trip details
- `/requests/[id]` Request details

## Folder Structure

```text
app/                 Next.js App Router pages and global layout
components/          Reusable UI components such as cards, headers, notices, buttons
data/mockData.ts     Sample users, trips, delivery requests, conversations, and messages
lib/matching.ts      Mock matching score and match strength logic
lib/utils.ts         Shared helpers and brand name placeholder
types/index.ts       TypeScript interfaces for core domain models
```

## Supabase-Ready Notes

The app now supports Supabase. If the Supabase environment variables are missing, it falls back to local mock data so development still works.

1. Create a Supabase project.
2. Open the Supabase SQL editor.
3. Run `supabase/schema.sql`.
4. Run `supabase/seed.sql` for demo data.
5. Copy `.env.example` to `.env.local`.
6. Fill in:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
SUPABASE_SERVICE_ROLE_KEY=your-server-only-service-role-key
```

The public browse pages, dashboard, details, profile, matches, and chat now read from Supabase when configured. The create delivery request and post trip forms insert into Supabase when `SUPABASE_SERVICE_ROLE_KEY` is set.

Current Supabase tables: `profiles`, `trips`, `delivery_requests`, `matches`, `conversations`, `conversation_participants`, and `messages`.

Recommended future tables: `reports` and `prohibited_item_categories`.

Important: keep `SUPABASE_SERVICE_ROLE_KEY` server-only. Never expose it with a `NEXT_PUBLIC_` prefix.

## Safety Disclaimer

Users are responsible for following airline, airport, customs, and destination-country laws. CarryLink does not inspect items and does not guarantee delivery. The MVP includes explicit warnings against prohibited, illegal, dangerous, restricted, or undeclared items.
