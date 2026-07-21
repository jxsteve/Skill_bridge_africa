# SkillBridge Africa

**Your Skills. Our Bridge.**

A marketplace connecting skilled African university students with trusted clients. Students showcase their skills, bid on tasks, and get paid securely, with an embedded wallet created automatically on sign-up.

Built with **React + TypeScript** (Vite), React Router, and [Privy](https://privy.io) for passwordless email login and embedded wallets.

## Getting started

```bash
npm install
npm run dev      # start the dev server (http://localhost:8090)
```

Other scripts:

```bash
npm run build      # type-check and build for production (outputs to dist/)
npm run preview    # preview the production build
npm run typecheck  # type-check only
```

## Project structure

```
index.html               # Vite entry
src/
  main.tsx               # React entry: Privy provider + router
  App.tsx                # Routes and top-level flow state
  index.css              # Design tokens (CSS variables), fonts, reset
  auth/                  # Privy web auth + config
  lib/                   # localStorage-backed preferences
  data/                  # Mock marketplace data (tasks, bids, projects)
  types/                 # Shared TypeScript types
  components/
    PhoneFrame.tsx       # Phone frame for desktop preview
    ui/                  # Reusable UI (buttons, inputs, cards, nav…)
  screens/               # One folder-free file per screen (.tsx + .module.css)
  assets/                # Images and Manrope fonts
public/
  _redirects             # SPA fallback for client-side routing on Netlify
```

## Styling

Plain CSS via **CSS Modules** (`ScreenName.module.css`), with design tokens as
CSS variables in `src/index.css`. No CSS framework to learn — any web dev can
contribute with standard HTML and CSS.

## Notes

- Auth uses Privy: users log in with a one-time email code and get an embedded
  Ethereum wallet on first sign-up. Privy requires a secure context (https or
  localhost); over plain HTTP the app falls back to a preview mode that accepts
  any 6-digit code.
- Marketplace data is currently mocked (`src/data/marketplace.ts`) pending a
  backend.
