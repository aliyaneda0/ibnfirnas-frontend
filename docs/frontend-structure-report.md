# Frontend Structure Change Report

## Summary

The project was reorganized from a minimal Expo Router starter into a scalable mobile frontend structure for the IBN Firnas app requirements: authentication, bilingual English/Arabic support, public customer screens, product detail routing, API integration, and reusable UI foundations.

## Changes Made

| Change | Why | How |
| --- | --- | --- |
| Added `src/` application source folder | Keeps route files clean and separates navigation from reusable code | Created `src/api`, `src/components`, `src/config`, `src/features`, `src/i18n`, `src/providers`, and `src/theme` |
| Updated TypeScript path alias | Industry-standard imports are easier to maintain than long relative paths | Changed `@/*` to resolve to `src/*` in `tsconfig.json` |
| Reworked root navigation | The app needs separate route areas for auth, tabs, and detail pages | Updated `app/_layout.tsx` with Expo Router `Stack` screens |
| Added auth route group | Login and language selection should be separate from customer tabs | Created `app/auth/_layout.tsx`, `app/auth/login.tsx`, and `app/auth/language.tsx` |
| Added customer tab route group | Public app features map naturally to bottom tabs | Created `app/(tabs)/_layout.tsx` with Home, Services, Products, Gallery, and Contact tabs |
| Added product detail route | Product catalog needs detail pages later | Created `app/products/[id].tsx` |
| Added reusable UI components | Prevents duplicate styling and makes future screens faster to build | Created `Screen`, `AppText`, `PrimaryButton`, and `TextField` components |
| Added API client foundation | Frontend should be ready for local or hosted Spring Boot APIs | Created `src/api/http-client.ts`, `src/api/endpoints/auth.ts`, and `src/config/env.ts` |
| Added authentication provider | JWT state needs one shared place before secure storage is connected | Created `src/features/auth/auth-provider.tsx` |
| Added Qatar and India phone validation helper | Login requirements include Qatar and Indian phone numbers | Created `src/features/auth/phone-validation.ts` |
| Added bilingual translation structure | English and Arabic should not be hardcoded into screens | Created `src/i18n/i18n-provider.tsx` and `src/i18n/translations.ts` |
| Added root provider wrapper | App-wide providers should be composed in one predictable place | Created `src/providers/root-providers.tsx` |
| Added shared theme colors | Keeps the visual system consistent across screens | Created `src/theme/colors.ts` |

## New Folder Structure

```txt
app/
  _layout.tsx
  index.tsx
  (tabs)/
    _layout.tsx
    index.tsx
    services.tsx
    products.tsx
    gallery.tsx
    contact.tsx
  auth/
    _layout.tsx
    language.tsx
    login.tsx
  products/
    [id].tsx

src/
  api/
    http-client.ts
    endpoints/
      auth.ts
  components/
    ui/
      app-text.tsx
      primary-button.tsx
      screen.tsx
      text-field.tsx
  config/
    env.ts
  features/
    auth/
      auth-provider.tsx
      phone-validation.ts
  i18n/
    i18n-provider.tsx
    translations.ts
  providers/
    root-providers.tsx
  theme/
    colors.ts

docs/
  frontend-structure-report.md
```

## Notes

- JWT persistence is currently in memory. The next production step is to add secure token storage with `expo-secure-store`.
- The login screen currently performs a demo login so navigation can be developed before the backend is ready.
- `EXPO_PUBLIC_API_BASE_URL` can point to a local Spring Boot backend during development and a hosted backend later.
- Arabic RTL is enabled through `I18nManager`; a full app reload may be required on-device after changing RTL direction.
