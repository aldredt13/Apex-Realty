# Team APEX — Real Estate Website

Marketing website for **Team APEX powered by Real Estate Services**
— _"We make Real Estate a Breeze."_

Built with **React + TypeScript + Vite**. Navy & gold brand, fully responsive,
with a sticky nav, mobile menu, floating WhatsApp button and animated sections.

## Pages

| Route          | Page            | Purpose                                                   |
| -------------- | --------------- | --------------------------------------------------------- |
| `/`            | Home            | Hero, what we do, who we are, areas, agent teaser, CTA    |
| `/about`       | About Us        | Story, values, stats                                      |
| `/for-sellers` | For Sellers     | List your property — process, benefits, enquiry form      |
| `/for-agents`  | For Agents      | Recruitment — benefits, why-us, testimonials, join form   |
| `/areas`       | Areas We Serve  | The six cities served + enquiry links                     |
| `/contact`     | Contact         | Contact details, enquiry form, FAQ                        |

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

## Making the forms send real emails

The enquiry forms (**Join** and **Contact**) currently open a pre-filled
**WhatsApp** message as a no-backend fallback — they work immediately with no
setup. To also receive submissions by email, wire them to a form service such as
[Formspree](https://formspree.io) or [Web3Forms](https://web3forms.com):

- Edit `src/components/JoinForm.tsx` and `src/components/ContactForm.tsx`.
- In `handleSubmit`, `POST` the form state to your endpoint (e.g. Formspree URL)
  before/instead of opening WhatsApp.

## Deploying

Run `npm run build` and host the generated `dist/` folder on any static host —
**Netlify, Vercel, Cloudflare Pages, GitHub Pages**, etc.

> This is a single-page app. Configure your host to **redirect all routes to
> `index.html`** so deep links like `/for-agents` work (Netlify: add a
> `_redirects` file with `/*  /index.html  200`; Vercel handles this
> automatically).

## Tech notes

- `src/components/` — Header (with mobile drawer), Footer, Logo, Icon set,
  forms, scroll-reveal wrapper, floating WhatsApp, layout.
- `src/index.css` — the full design system (brand colours, buttons, all
  component styles, responsive breakpoints).
- Icons are inline SVG (`src/components/Icon.tsx`) — no icon library dependency.
- Fonts (Montserrat, Inter, Dancing Script) load from Google Fonts in
  `index.html`.
