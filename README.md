# Ibn Firnas — Trading & Contracting

Mobile app (Expo / React Native) for Ibn Firnas Trading & Contracting: product and service catalog, gallery, company info, and customer inquiries, backed by a real Spring Boot API.

## Stack

- Expo SDK 54, React Native, TypeScript, expo-router (file-based routing)
- Auth: email/password + Google Sign-In (`@react-native-google-signin/google-signin`)
- Data: real backend API (see below) — a handful of endpoints not yet wired by the backend fall back to mock data in `src/mocks/`
- Build/release: EAS Build for Android

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Point the app at a backend. Create a `.env.local` (gitignored) in the project root:

   ```bash
   EXPO_PUBLIC_API_BASE_URL=https://your-backend-url
   ```

   Without this, the app falls back to `http://10.0.2.2:8080` — the Android **emulator's** loopback alias to the host machine. That address means nothing on a real device or in a browser, so requests will hang/fail without a real `.env.local` value.

3. Run it:

   ```bash
   npx expo run:android      # native build and install on device/emulator
   npx expo start            # start Metro only for an already-installed dev-client build
   ```

## Project structure

- `app/` — screens and file-based routing using `expo-router`
- `src/api/endpoints/` — typed backend calls for each resource
- `src/hooks/` — data hooks used by screens (`useProducts`, `useCompany`, etc.)
- `src/mocks/` — fallback/mock data for incomplete backend wiring
- `src/types/api.ts` — backend DTO type definitions
- `src/i18n/` — localization provider and translations
- `src/components/` — shared UI components
- `src/config/` — design tokens, environment helpers, and theme settings
- `keystores/`, `credentials.json` — Android signing artifacts, gitignored




## Recent team notes

- `src/types/api.ts` was updated to match live `/api/products` response nullability for `slug` and `categoryId`
- `app/products/[id].tsx` now renders SKU, quantity, and dynamic product specifications
- `src/i18n/translations.ts` has English and Arabic labels for products
- If product labels are missing in the UI, check `app/products/[id].tsx` and the current build output

## Team workflow

### Local environment

- Create `.env.local` with the backend URL
- Use `npm install` after switching branches or pulling new dependencies
- Restart Metro after editing native config or `tailwind.config.js`

### Build and test

- Run the app on Android with `npx expo run:android`
- Use `npx expo start` for JavaScript-only changes if the native build is already installed
- For native resource updates (icon/splash), run:

  ```bash
  npx expo prebuild --clean --platform android
  ```

### Production readiness checks

Before shipping, verify:

- Android production build completes successfully
- critical screens render in both `en` and `ar`
- product details show SKU, quantity, and specs correctly
- nullable API fields like `slug` and `categoryId` are handled safely
- any mock-data fallback has been removed or replaced with real API wiring

## Building for Android (EAS)

```bash
npx eas-cli build --platform android --profile production
```

Signing uses a local keystore (`keystores/release.keystore`, gitignored) referenced via `credentials.json` (also gitignored). If you don't have those files, ask the owner of the repo for access.

**Important:** icon/name/splash changes require a clean prebuild to regenerate native resources:

```bash
npx expo prebuild --clean --platform android
```
