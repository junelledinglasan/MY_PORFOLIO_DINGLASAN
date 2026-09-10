# Junelle Dinglasan — Portfolio

Personal portfolio site. React + Vite, PWA-ready (installable, works offline
after first visit). This is a separate project from the LEAF MPC capstone.

## Running it locally

You need [Node.js](https://nodejs.org) installed (LTS version is fine).

```bash
npm install
npm run dev
```

Then open the link it prints (usually `http://localhost:5173`).

## Building for deployment

```bash
npm run build
```

This creates a `dist/` folder with the finished site (HTML, CSS, JS, PWA
service worker, and manifest). Upload the contents of `dist/` to any static
host — Vercel, Netlify, GitHub Pages, or Cloudflare Pages all work for free.

## Project structure

```
src/
  App.jsx           — page shell: nav, dark/light toggle, cursor, scroll bar
  palette.js         — shared colors for dark and light mode
  components/
    Hero.jsx         — Home section
    About.jsx        — About Me section
  assets/
    profile.png       — profile photo
public/
  icon-192.png, icon-512.png — app icons used by the PWA manifest
```

## Adding more pages/sections

Each section (Home, About, and later Work and Contact) is its own file in
`src/components/`. To add a new one:

1. Create `src/components/YourSection.jsx` following the same pattern as
   `About.jsx` (it receives `colors`, `mode`, and `loaded` as props).
2. Give its outer `<section>` an `id` (e.g. `id="work"`).
3. Import it in `App.jsx` and add it inside `<main>`.
4. Add it to the `NAV_ITEMS` list in `App.jsx` so it shows up in the nav
   and gets highlighted when scrolled into view.
