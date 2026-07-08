# Project Context — ibnfirnas-frontend

Living reference for what this app is, how it's built, and what state it's in. Update this file as the project evolves — it should always reflect current reality, not history (see `changelog.md` for history).

## What this is

Mobile client for **IBN Firnas**, a Qatar-based industrial automation company (manufacturing, installation, and repair of automatic doors, rolling shutters, boom barriers, and related industrial systems — see [ibnfirnas.online](https://ibnfirnas.online/index.php)). This repo is only the mobile frontend piece of a larger system.

## Full-stack architecture

- **Frontend (this repo)**: React Native + Expo + NativeWind
- **Backend**: Spring Boot + PostgreSQL (separate repo, not in this codebase) — not connected yet
- **Firebase**: FCM push notifications only (not auth, not storage)
- **Cloudinary**: gallery/image storage
- **Admin**: separate web admin panel manages app content (products, services, gallery, etc.)

Planned features across the whole system: user login/signup + profile management, products, services, gallery, inquiries, push notifications, payments, WhatsApp integration, admin panel.

## Stack (this repo)

- Expo SDK 57, `expo-router` (file-based routing)
- React 19 / React Native 0.86
- NativeWind (Tailwind for RN) — see gotchas below
- `expo-secure-store` for token persistence (native only — see gotchas)
- `@expo-google-fonts/poppins` (body text) + `@expo-google-fonts/ibm-plex-sans` (headings)
- Custom i18n (`src/i18n/`) — English/Arabic, RTL via `I18nManager`
- Brand colors: navy blue `#0E4D92` (primary) + white, matching the real company website

## Current state

- **Auth**: fully mocked, no backend. `src/features/auth/auth-provider.tsx` accepts any non-empty phone+password for login; signup collects name/email/phone/password, routes through a 4-digit OTP screen (any 4 digits pass), then redirects to Login (does not auto-log-in after signup).
- **Screens implemented**: animated splash → Login → Signup → OTP verification → Home (tabs). Language picker screen exists separately (`app/(auth)/language.tsx`) plus an in-screen language toggle pill on Login/Signup.
- **Screens still stubs**: Gallery, Product, Services tabs (`app/(tabs)/*.tsx`) are empty placeholders.
- **Design system**: `src/components/ui/` — `AppText`, `PrimaryButton`, `TextField`, `Screen`, `LanguageToggle`, `BrandWordmark`, `AnimatedSplash`. Tokens in `src/config/design-tokens.js` (colors + font families), consumed by both `tailwind.config.js` (build-time) and app code (`@/config/design-tokens`).

## Known gotchas (read before touching related code)

- **`design-tokens` must stay a `.js` file**, not `.ts`. `tailwind.config.js` loads it via a plain Node `require()` at build time, which cannot resolve `.ts` without a transpiler. A `design-tokens.d.ts` sits alongside it purely for TypeScript types on the `.js` file — don't delete it, and don't convert the `.js` back to `.ts`.
- **`global.css` must be imported in `app/_layout.tsx`** (`import "../global.css"`) or NativeWind generates no actual CSS on web — class names show up in the DOM but do nothing.
- **`tailwind.config.js` needs `darkMode: "class"`** — `expo-router` calls `setColorScheme` on web at boot, which throws if darkMode is left at the default `"media"`.
- **Don't add `medium`/`bold` keys to Tailwind's `fontFamily` theme extension.** They collide with Tailwind's built-in font-*weight* utilities of the same name. `themeFontFamily.medium`/`.bold` exist in `design-tokens.js` for direct inline-style use (e.g. tab bar labels) — only `sans` is safely exposed as a Tailwind class.
- **Headings need a real `fontFamily`, not just a `font-bold` weight class.** Named static Google Font files don't reliably fake-bold on native the way browsers do on web. `AppText` (`src/components/ui/app-text.tsx`) applies `themeFontFamily.bold`/`.medium` directly via `style` for `title`/`subtitle` variants — follow that pattern for any new bold/heading text instead of relying on `font-bold`.
- **Color-override `className`s on `AppText` can silently lose to its default tone class** due to Tailwind's alphabetical CSS output order for extended color keys (e.g. `text-accent` can lose to `text-text` since "accent" < "text" alphabetically). Use an explicit `style={{ color: ... }}` for one-off color overrides instead of a `text-*` className.
- **`expo-secure-store` does not work on web** (`ExpoSecureStore.default.getValueWithKeyAsync is not a function`). `auth-provider.tsx` catches this and continues without persistence — expected in the browser preview, works normally on native. Don't "fix" this by making SecureStore calls silently no-op more broadly than they already do.
- **`SafeAreaProvider` wraps the app root** in `app/_layout.tsx` — required for `SafeAreaView` insets to measure reliably, especially on Android.
- **`I18nManager.forceRTL` requires an app restart** to visually mirror layout on native — switching language mid-session updates text immediately but RTL layout only fully applies after reload. This is a React Native platform limitation, not a bug.
- Dev workflow: this project uses an Expo **dev client**, not Expo Go (see `expo-dev-client` in `package.json`). Use `npx expo run:android` for a first native build, `npx expo start --dev-client` for subsequent JS-only iteration, or `npx expo start --web` for fast UI iteration in a browser (note the SecureStore limitation above applies there).

## Key file map

```
app/_layout.tsx                  root: SafeAreaProvider, AuthProvider, LanguageProvider, font loading, splash
app/(auth)/_layout.tsx           auth stack, redirects to Home if already logged in
app/(auth)/login.tsx             dark theme, phone+password
app/(auth)/signup.tsx            light theme, name/email/phone/password → routes to OTP
app/(auth)/verify-otp.tsx        4-digit code entry → completes registration → routes to Login
app/(auth)/language.tsx          standalone language picker
app/(tabs)/_layout.tsx           tab bar, redirects to Login if no token
app/(tabs)/Home.tsx              themed home screen with entry links + logout
app/(tabs)/{Gallery,Product,Services}.tsx   stubs
src/features/auth/auth-provider.tsx         mock auth (login/register/logout)
src/i18n/                        i18n-provider.tsx (context) + translations.ts (en/ar strings)
src/config/design-tokens.js      single source of truth for colors + font families
src/components/ui/               shared design-system components
```
