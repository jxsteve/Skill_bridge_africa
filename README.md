# SkillBridge Africa

**Your Skills. Our Bridge.**

A mobile marketplace connecting skilled African talent with trusted clients. Freelancers showcase their skills, work with verified clients, and get paid securely — funds are held until the job is done.

Built with React Native (Expo) and TypeScript. Authentication and embedded wallets are powered by [Privy](https://privy.io): users sign in with a one-time email code, and every account gets an Ethereum wallet created automatically on first login.

## Getting started

```bash
npm install
npm start
```

Then press `i` for iOS, `a` for Android, or `w` for web.

Note: the Privy SDK runs on iOS/Android only. The web build uses a
preview stand-in that accepts any 6-digit code, so the full flow can be
demoed in a browser without real authentication.

## Project structure

```
App.tsx            # Entry point: fonts, auth provider, screen flow
src/
  auth/            # Privy auth (native) + web preview stand-in
  components/      # Phone frame + design-system UI components
  screens/         # Splash, onboarding, account type, registration, verify
  theme/           # Brand colors, tokens and typography
  hooks/           # Screen inset helpers
assets/
  images/          # Logo and onboarding illustrations
  fonts/           # Manrope font family (bundled)
```
