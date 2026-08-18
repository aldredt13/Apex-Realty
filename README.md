# Team APEX — Real Estate Website

Marketing website for **Team APEX powered by Real Estate Services**
— _"We make Real Estate a Breeze."_

Built with **React + TypeScript + Vite**. Navy & gold brand, fully responsive,
with a sticky nav, mobile menu, floating WhatsApp button and animated sections.

## Pages

| Route                | Page            | Purpose                                                   |
| -------------------- | --------------- | --------------------------------------------------------- |
| `/`                  | Home            | Hero, what we do, who we are, areas, agent teaser, CTA    |
| `/properties`        | Properties      | All listings, filterable, with pagination                 |
| `/properties/:slug`  | Listing detail  | Photo gallery, specs, description + enquiry form           |
| `/about`             | About Us        | Story, values, stats                                      |
| `/for-sellers`       | For Sellers     | List your property — process, benefits, enquiry form      |
| `/for-agents`        | For Agents      | Recruitment — benefits, why-us, testimonials, join form   |
| `/areas`             | Areas We Serve  | The six cities served + enquiry links                     |
| `/contact`           | Contact         | Contact details, enquiry form, FAQ                        |
| `/dashboard`         | Admin dashboard | Manage listings, submissions & site settings (login req.) |

> **The site works with or without a backend.** Until you add Supabase keys,
> the public site runs normally (forms fall back to WhatsApp, listings show a
> "coming soon" state). Add the keys to unlock listings, stored submissions and
> the admin dashboard — see **Backend & Dashboard** below.

## Run it

```bash
npm install      # first time only
npm run dev      # local dev server → http://localhost:5173
npm run build    # production build → dist/
npm run preview  # preview the production build
```

## Editing the content

Almost everything the client will want to change lives in two small files:

- **`src/data/site.ts`** — business name, tagline, **WhatsApp number, phone,
  email**, social links, the list of areas, and the agent testimonials.
  > The WhatsApp number is stored twice: `display` (what people see, e.g.
  > `063 482 8664`) and `link` (international format for the click-to-chat link,
  > e.g. `https://wa.me/27634828664` — drop the leading `0` and add `27`).
- **`src/data/images.ts`** — the photography. See below.

## Replacing the photos

The site currently uses free **Unsplash** stock photos so it looks complete out
of the box. **Before going live, swap these for Team APEX's own property and team
photos.** Either:

1. Drop your images in `src/assets/` and import them in `src/data/images.ts`, or
2. Replace the URLs in `src/data/images.ts` with your own hosted image URLs.

The city cards on the Home/Areas pages use a built-in SVG skyline
(`src/components/CityImage.tsx`) so they always render — no photos needed there.

### Logo

The real APEX Real Estate logo is used with a transparent background:

- `src/assets/logo.png` — full-colour, for **light** backgrounds (the header).
- `src/assets/logo-light.png` — the "REAL ESTATE" / tagline text turned **white**,
  for **dark** backgrounds (the footer and mobile menu).
- `public/favicon.png` — the APEX mark, used as the browser-tab icon.

To update the logo, replace `logo.png` / `logo-light.png` and keep the same
filenames. `src/components/Logo.tsx` picks the light version automatically via
its `light` prop.

## Backend & Dashboard (Supabase)

The listings, stored form submissions and admin dashboard are powered by
[Supabase](https://supabase.com) (Postgres + Auth + Storage). Setup is three
steps.

### 1. Create the database

In your Supabase project open **SQL Editor**, paste the contents of
[`supabase/schema.sql`](supabase/schema.sql) and **Run**. It creates every
table, security policy and the image storage bucket, and is safe to re-run.

> **Before running:** near the top of the file, change the admin email in the
> `insert into public.admins` line to the email you'll sign in to the dashboard
> with (it defaults to `aldredt13@gmail.com`).

### 2. Connect the app

Copy `.env.example` to `.env` and fill in your project's values from
**Supabase → Project Settings → API**:

```bash
VITE_SUPABASE_URL=https://YOUR-ref.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR-publishable-or-anon-key
```

Restart `npm run dev` after creating `.env`. (The anon key is safe in the
browser — Row Level Security protects your data.)

### 3. Create your admin login

Go to **`/dashboard/login`**, click *"Create one"*, and sign up with the email
you added to the `admins` table. For instant sign-in, either click the
confirmation link Supabase emails you, or turn off **Authentication → Providers
→ Email → Confirm email** in the Supabase dashboard.

### What the dashboard does (`/dashboard`)

- **Listings** — create / edit / delete properties. Photos are **compressed in
  the browser** (resized to 2000px, re-encoded to WebP at high quality — usually
  25–40% smaller) before upload, and it shows how much space was saved. Drag to
  reorder; the first photo is the cover.
- **Submissions** — every enquiry, contact message, seller lead and agent
  application, filterable, with unread badges.
- **Site Settings** — edit the WhatsApp number, phone, email, social links,
  domain, tagline and about text. Changes appear across the public site.

### How security works (Row Level Security)

- The public (anon key) can **read** listings + settings and **insert** form
  submissions — nothing else.
- Only a signed-in user whose email is in the `admins` table can create/edit
  listings, read submissions, or change settings. This is enforced in the
  database, not just the UI, via an `is_admin()` check on every write policy.
- The `listing-images` storage bucket is public-read, admin-write.

### Forms without a backend

Until Supabase is configured, the **Contact**, **Sell**, **Join** and
**Enquiry** forms fall back to opening a pre-filled **WhatsApp** message, so the
site is fully usable from day one.

## Deploying

Run `npm run build` and host the generated `dist/` folder on any static host —
**Netlify, Vercel, Cloudflare Pages, GitHub Pages**, etc.

> This is a single-page app. Configure your host to **redirect all routes to
> `index.html`** so deep links like `/for-agents` work (Netlify: add a
> `_redirects` file with `/*  /index.html  200`; Vercel handles this
> automatically).

## Tech notes

- `src/components/` — Header (mobile drawer), Footer, Logo, Icon set, forms,
  listing card, pagination, image uploader, scroll-reveal, floating WhatsApp.
- `src/pages/` — public pages; `src/pages/dashboard/` — the admin area.
- `src/context/` — `SettingsContext` (live site settings with static fallback)
  and `AuthContext` (Supabase auth + admin check).
- `src/lib/` — `supabase.ts` (client), `types.ts`, `imaging.ts` (compress +
  upload), `submissions.ts`, `format.ts`.
- `src/data/site.ts` — static **fallback** contact info / areas / testimonials
  used before Supabase is configured (settings from the dashboard override it).
- `src/index.css` — the full design system (brand colours, buttons, all
  component + dashboard styles, responsive breakpoints).
- Icons are inline SVG (`src/components/Icon.tsx`) — no icon library dependency.
- Fonts (Montserrat, Inter, Dancing Script) load from Google Fonts in
  `index.html`.
- Packages added for the backend: `@supabase/supabase-js`,
  `browser-image-compression`.
