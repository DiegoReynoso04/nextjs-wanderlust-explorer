English | [Español](README.es.md)

# Wanderlust Explorer

MVP of the experience explorer for **Wanderlust Labs**: a catalog of 100 travel experiences you can browse, search and filter without reloading the page, with the filter state stored in the URL so any view can be shared.

Built with Next.js (App Router), TypeScript and Tailwind CSS. No backend, no database and **no external state-management library**.

---

## Routes

| Route | Description |
|---|---|
| `/` | Home with a full-screen hero and a CTA to the explorer |
| `/experiences` | Explorer: search bar, category and destination filters, grid of 100 cards |
| `/experiences/[id]` | Detail page with a full-bleed hero, description and booking summary sidebar |
| `/favorites` | Experiences saved during the session |
| `/profile` | Mock profile with a live favorites counter |

---

## Run it

```bash
npm install
npm run dev
```

Open **http://localhost:3000**.

> **Watch out for the network IP.** In development, Next 16 blocks cross-origin requests to its internal resources. If you open the app from your local network IP (`http://192.168.x.x:3000`) instead of `localhost`, the HTML renders fine but **the client never hydrates**: the page looks perfect and ignores every click. The HMR WebSocket returns a 403 and `allowedDevOrigins` doesn't fix it.
>
> To test from a phone or another device on the network, use a production build, which has no HMR and works over the IP:
>
> ```bash
> npm run build
> npm start
> ```

Other commands:

```bash
npm run build   # production build
npm start       # serve the build
npm run lint    # ESLint
```

---

## What it does

**Text search.** Matches the term against the title and the destination with a regular expression, ignoring case and accents: `japon` finds the experiences in "Kioto, Japón". Special characters are escaped before building the expression, so typing `(` doesn't break the page. The URL is rewritten with a 280 ms debounce instead of on every keystroke.

**Combinable filters.** Category (a horizontal strip with an underline on desktop, a dropdown on mobile) and destination (grouped by country and city). They combine with each other and with the search using AND logic. The options come from the dataset itself, not from hand-written lists.

**The URL is the source of truth.** Filters live in the query params and the sync works both ways: loading `/experiences?search=velero&category=adventure&destination=Croacia` pre-fills the three controls and shows the filtered grid; changing a control rewrites the URL without reloading or jumping the scroll. Empty params are removed and unknown values are ignored instead of breaking the page.

**In-memory favorites.** A `useState<string[]>` in a client component mounted once in the root layout. From each page's container down, the state and the toggle function travel as explicit props to the heart button. The menu counter, the favorites page and the profile update instantly. No persistence: refreshing empties the list.

**Empty states** for both "no results" and "no favorites", with an action to get out of the dead end.

---

## Technical decisions

**No state libraries.** Everything is built with React primitives. `Context` is used only as a transport channel to cross the server layout boundary, which can't pass functions as props to `children`.

**Server Components by default.** Only the pieces that need it are client components: the explorer, the card, the menu, the favorite button and the profile counter. Home, detail and profile render on the server.

**Fully static detail pages.** `generateStaticParams` prerenders all 100 `/experiences/[id]` routes at build time.

**Script-generated and validated dataset.** The 100 experiences follow automatically checked rules: unique ASCII slug ids without accents, 20 experiences per category, 22 destinations in 19 countries, prices between 15 and 600 EUR and ratings with one decimal.

---

## Design references

Before writing a single component, three real discovery interfaces with cards, search and filters were analyzed. Concrete decisions from each one were applied to the MVP.

### 1. Airbnb — Experiences (`airbnb.com/experiences`)

The main reference for the "clean discovery UI" look.

- Card grid with rounded photos, save heart, price and rating, with no border or shadow: depth comes from the photography, not from elevation. That is exactly the model for our `ExperienceCard`.
- The filter bar is discreet and scannable and never competes with the photos below → our `FilterPanel` sits in a light sticky strip with neutral controls.
- The horizontal category strip marks the active tab with a thin underline and a font-weight change, not a fill color → pattern adopted for the category filter on wide viewports.
- A single accent color reserved for the primary action and the "saved" state; the rest of the interface in grays and white with plenty of space.

### 2. GetYourGuide — Results page (`getyourguide.com`)

Functional reference for the search and filter system of an activities marketplace.

- Persistent search in the header, still visible on the results page, with the term always in view.
- Result count above the grid → our `ResultsCount`.
- Active filter chips with individual dismiss and a global "clear all" → our `ActiveFilters`.
- Filters reflected in the URL, which makes any filtered view shareable.

### 3. Klook — Explore by destination (`klook.com`)

Reference for density and hierarchy when there are many results per destination.

- Compact cards with a category badge over the image and an aligned price and rating block at the bottom, which handles 100 items without tiring the eye.
- Combinable filters by destination and activity type, with an explicit empty state.
- Detail page with a full-bleed hero, side summary and long description below → the structure of our `/experiences/[id]`.

### Design tokens

Defined as CSS variables in `src/app/globals.css` and exposed to Tailwind with `@theme inline`.

| Token | Value |
|---|---|
| Primary accent | `#FF5A5F` coral, **only** for CTAs and the favorite state |
| Text | `#222222` primary, `#767676` secondary |
| Background | `#FFFFFF` canvas, `#F7F7F7` soft surfaces |
| Border | `#E6E6E6` |
| Radii | 12 px inputs, 16 px cards, 20 px panels |
| Typography | Inter via `next/font` |
| Grid | 1 / 2 / 3 / 4 columns depending on the breakpoint |

---

## Project structure

```
nextjs-wanderlust-explorer/
├── src/
│   ├── app/
│   │   ├── layout.tsx                  # Root layout: font, Navbar and favorites provider
│   │   ├── page.tsx                    # Home (/)
│   │   ├── globals.css                 # Tailwind + design tokens
│   │   ├── experiences/
│   │   │   ├── page.tsx                # Explorer — Suspense around the client component
│   │   │   └── [id]/
│   │   │       ├── page.tsx            # Detail, prerendered with generateStaticParams
│   │   │       └── not-found.tsx       # Handled 404 for an unknown id
│   │   ├── favorites/
│   │   │   ├── page.tsx                # Favorites (client component)
│   │   │   └── layout.tsx              # Metadata only: a client component can't export it
│   │   └── profile/
│   │       └── page.tsx                # Mock profile
│   ├── components/
│   │   ├── Navbar.tsx                  # Navigation with favorites counter
│   │   ├── ExperienceExplorer.tsx      # Orchestrates search, filters and URL sync
│   │   ├── SearchBar.tsx               # Controlled search input
│   │   ├── FilterPanel.tsx             # Category (strip + select) and destination (countries and cities)
│   │   ├── ActiveFilters.tsx           # Active filter chips
│   │   ├── ResultsCount.tsx            # "Showing X of 100 experiences"
│   │   ├── ExperienceGrid.tsx          # Responsive grid
│   │   ├── ExperienceCard.tsx          # Card with favorite heart
│   │   ├── FavoriteButton.tsx          # Save button on the detail page
│   │   ├── FavoritesSummary.tsx        # Reactive profile counter
│   │   └── EmptyState.tsx              # No results / no favorites
│   ├── hooks/
│   │   └── useFavorites.tsx            # Provider and hook, React primitives only
│   ├── data/
│   │   └── experiences.ts              # The 100 experiences
│   ├── lib/
│   │   └── filters.ts                  # Filtering, regex escaping and accent folding
│   └── types/
│       └── experience.ts               # Experience, Category and labels
├── CONTEXT.md                          # MVP specification and source of truth
├── README.md
├── next.config.ts
├── tsconfig.json
└── package.json
```

---

## Out of scope

Backend, API or database; real authentication; persistent favorites; bookings, payments, maps, i18n and automated tests; pagination or infinite scroll. The booking button on the detail page is disabled on purpose, with a note explaining why.

## Author

**Diego Reynoso Flores** · [GitHub](https://github.com/DiegoReynoso04)
