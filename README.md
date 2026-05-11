# Reneonix · React (Vite)

The original static `index.html` site converted into a React + Vite project.

## Run it

```bash
cd reneonix-react
npm install
npm run dev      # http://localhost:5173
npm run build    # production bundle in dist/
npm run preview  # preview the production build
```

## Project structure

```
reneonix-react/
├─ index.html               # Vite entry HTML, loads /src/main.jsx
├─ public/                  # Static assets served at the root URL
│  ├─ hero-bg.mp4           # Extracted from the inline base64 in the original
│  ├─ reneonix-logo.svg
│  └─ *.png  *.jpg          # All brand / partner / hero imagery
├─ src/
│  ├─ main.jsx              # React entry, mounts <App />
│  ├─ App.jsx               # Composes the page from section components
│  ├─ styles/global.css     # All shared styles (ported verbatim from the original)
│  ├─ hooks/useInView.js    # IntersectionObserver hook
│  └─ components/
│     ├─ Header.jsx
│     ├─ Hero.jsx
│     ├─ Brands.jsx
│     ├─ Solutions.jsx
│     ├─ About.jsx
│     ├─ Investors.jsx
│     ├─ Testimonials.jsx
│     ├─ Highlights.jsx
│     ├─ CtaBanner.jsx
│     ├─ Footer.jsx
│     └─ SiteEffects.jsx    # Wires up dropdowns, mobile nav, parallax, reveals
└─ vite.config.js
```

## CSS modules (next step)

The visual design is preserved by importing one big `src/styles/global.css`.
To migrate to per-component CSS Modules:

1. For a component (e.g. `Header.jsx`), create `Header.module.css` next to it.
2. Cut the relevant `.nav`, `.brand`, `.has-dropdown`, `.dropdown` rules out of
   `global.css` and paste them into `Header.module.css`.
3. Import them in the component and use bracket notation to keep kebab-case:
   ```jsx
   import styles from './Header.module.css';
   <header className={styles.nav}>
     <div className={`${styles.container} ${styles['nav__inner']}`}>
   ```
4. Repeat per section. Anything globally cross-cutting (CSS variables,
   `.container`, `.section`, `.btn*`) should stay in `global.css`.

`vite.config.js` is already set up with `localsConvention: 'dashes'` so kebab
class names work in module CSS without renaming.

## What changed vs. the static site

- The inline base64 hero video is now `public/hero-bg.mp4`.
- The base64 brand image in the header is replaced with `reneonix-logo.svg`.
- `data-lucide` icon stubs are replaced with `lucide-react` components.
- The bottom-of-page `<script>` block is split between:
  - `SiteEffects.jsx` (dropdowns, mobile nav, parallax, generic reveals)
  - `useInView` hook + per-component IntersectionObserver effects
    (`Brands`, `Solutions` zigzag rows)
