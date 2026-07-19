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

- [Flutter](https://flutter.dev) (Dart)
- Custom Manrope typography, bundled offline
- Targets iOS and Android

## Getting started

```bash
flutter pub get
flutter run
```

## Project structure

```
lib/
  main.dart                  # App entry point and theme
  theme/app_colors.dart      # Brand palette
  screens/
    splash_screen.dart       # Splash / brand screen
    onboarding_screen.dart   # 3-page onboarding flow
    welcome_screen.dart      # Post-onboarding landing stub
assets/
  images/                    # Logo and onboarding illustrations
  fonts/                     # Manrope font family
```

## Tests

Golden screenshot tests cover the splash and onboarding screens:

```bash
flutter test
```
