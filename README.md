# SkillBridge Africa

**Your Skills. Our Bridge.**

SkillBridge Africa is a mobile marketplace that connects skilled African talent with trusted clients for real-world tasks, with payments held securely until work is completed.

## Features (so far)

- **Splash screen** — brand identity with the SkillBridge Africa logo
- **Onboarding flow** — three-step introduction:
  1. Showcase Your Skills — build a profile and get paid for real-world tasks
  2. Connect with Trusted Clients — verified clients who pay fairly
  3. Secure Payments — funds are held until successful completion

## Tech stack

- [React Native](https://reactnative.dev) via [Expo](https://expo.dev)
- TypeScript
- Custom Manrope typography, bundled offline
- Targets iOS, Android, and web

## Getting started

```bash
npm install
npm start        # Expo dev server (press i for iOS, a for Android, w for web)
```

## Project structure

```
App.tsx                      # App entry: font loading and phase switching
src/
  theme/
    colors.ts                # Brand palette
    fonts.ts                 # Manrope font registration
  screens/
    SplashScreen.tsx         # Splash / brand screen
    OnboardingScreen.tsx     # 3-page onboarding pager
    WelcomeScreen.tsx        # Post-onboarding landing stub
assets/
  images/                    # Logo and onboarding illustrations
  fonts/                     # Manrope font family
```
