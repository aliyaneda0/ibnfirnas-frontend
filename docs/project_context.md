# Project Context — ibnfirnas-frontend

Living reference for what this app is, how it's built, and what state it's in. Update this file as the project evolves — it should always reflect current reality, not history (see `changelog.md` for history).

## What this is

Mobile client for **IBN Firnas**, a Qatar-based industrial automation company (manufacturing, installation, and repair of automatic doors, rolling shutters, boom barriers, and related industrial systems — see [ibnfirnas.online](https://ibnfirnas.online/index.php)). This repo is only the mobile frontend piece of a larger system.

## Full-stack architecture

- **Frontend (this repo)**: React Native + Expo + NativeWind
- **Backend**: Spring Boot + PostgreSQL (separate repo, not in this codebase) — API contracts are known and documented (see `architecture.md`), but the app is **not wired to live calls yet** (Phase 1 — see below).
- **Firebase**: FCM push notifications only (not auth, not storage)
- **Cloudinary**: gallery/image storage (backend-side; frontend just consumes `mediaUrl`/`primaryImageUrl` strings)
- **Admin**: separate web admin panel manages app content (products, services, gallery, etc.)

## Stack (this repo)

- Expo SDK 57, `expo-router` (file-based routing)
- React 19 / React Native 0.86
- NativeWind (Tailwind for RN) — see gotchas below
- `expo-secure-store` for token persistence (native only — see gotchas)
- `@expo-google-fonts/poppins` (body text) + `@expo-google-fonts/ibm-plex-sans` (headings) — Arabic uses the platform default font, not a custom Arabic font (see gotchas)
- Custom i18n (`src/i18n/`) — English/Arabic, RTL via `I18nManager`
- Brand colors: navy `#0B1F3A` / primary blue `#2E6FE0` / accent orange `#F5A623`, see `src/config/design-tokens.js`
- `expo-linear-gradient` + `expo-blur` — gradients and glassmorphism (hero carousel, floating header, floating tab bar)
- `expo-image` — used for all remote content images (product/service/gallery/company), for caching
- `react-native-gesture-handler` + `react-native-reanimated` — pinch/pan zoom in the Gallery viewer only

## Phase 1: mock data layer

There is no live backend integration yet. Every list/detail screen reads through a hook in `src/hooks/` (`useProducts`, `useProduct`, `useFeaturedProducts`, `useCategories`, `useServices`, `useService`, `useFeaturedServices`, `useGallery`, `useCompany`, `useSubmitInquiry`) which returns `{ data, isLoading, error, refetch }` — the same shape a React Query `useQuery` call returns — backed by static fixtures in `src/mocks/`. Types in `src/types/api.ts` mirror the real backend DTOs exactly (verified live 2026-07-10, see `architecture.md`), so swapping a hook's body for a real `fetch` later is a one-file change, not a rewrite. `@tanstack/react-query` is intentionally **not** a dependency yet — there's no caching/retry to manage against static fixtures; add it when real network calls land.

## Current state

- **Auth**: fully mocked, matches the real backend contract shape. `src/features/auth/auth-provider.tsx`: `login(email, password)` and `register({fullName, email, password, phone?})` both resolve immediately (register auto-logs-in, no OTP step — matches `POST /api/auth/register` returning a token directly). `forgotPassword`/`resetPassword`/`changePassword` are mocked no-ops with the real endpoints' validation rules. `AuthUser` matches `GET /api/profile`'s shape (`id, email, fullName, phone, avatarUrl, role, isActive, createdAt`).
- **Browsing is public**: `app/index.tsx` always redirects to `/(tabs)/Home` regardless of auth state; the tabs layout no longer gates on a token. Only Profile shows a logged-out prompt (login/register) — actions that need auth check `user`/`token` from `useAuth()` individually.
- **Screens implemented**: animated splash → Home (tabs, default) / Login → Signup → Forgot password → Reset password, all five tabs (Home, Products, Services, Gallery, Profile) fully built against mock data, Product/Service detail routes, Gallery full-screen pinch-zoom viewer, and a standalone Inquiry form with a dedicated confirmation state.
- **Home** (`app/(tabs)/Home.tsx`): floating glass `AppHeader` + auto-sliding hero banner carousel (`HeroCarousel`, still icon+gradient placeholders — real photography still pending) + quick-access links + featured products/services horizontal carousels + company banner + contact CTA row (guarded per-field for `null`) + `WhatsAppFab`.
- **`AppHeader`** (`src/components/ui/app-header.tsx`): floating glass card with the `BrandLogo` + "IBN FIRNAS" / tagline wordmark on the left, and a **single** avatar button on the right (not two icons) that opens a bottom-sheet menu: profile/login row, My Profile, Language (toggles EN/AR in place), My Inquiries, Contact Support (`tel:` link), About Us (info alert with the company description), and a separated Logout pill when signed in.
- **Bottom tab bar**: floating pill-shaped bar with 5 tabs (Home, Products, Services, Gallery, Profile) — `app/(tabs)/_layout.tsx`.
- **Profile** (`app/(tabs)/Profile.tsx`, moved from the old top-level `app/profile.tsx`): now a tab, not a pushed route. Logged-out shows a login/register prompt; logged-in shows read-only email/role, editable fullName/phone/avatarUrl, and a password-change sub-flow. The old `location` field is gone — it doesn't exist in the real API contract.
- **WhatsApp FAB** (`src/components/ui/whatsapp-fab.tsx`): visible on Home, Product Detail, Service Detail; hidden on auth screens, Inquiry, and the Gallery viewer (each screen renders it explicitly rather than a global allowlist).
- **Design system**: `src/components/ui/` — `AppText`, `PrimaryButton`, `TextField`, `Screen`, `LanguageToggle`, `BrandWordmark`, `BrandLogo`, `AnimatedSplash`, `AppHeader`, `HeroCarousel`, `WhatsAppFab`, `Skeleton`/`SkeletonCard`, `ErrorState`/`EmptyState`, `Badge`. Tokens in `src/config/design-tokens.js` (colors + font families), consumed by both `tailwind.config.js` (build-time) and app code (`@/config/design-tokens`).

## Known gotchas (read before touching related code)

- **`design-tokens` must stay a `.js` file**, not `.ts`. `tailwind.config.js` loads it via a plain Node `require()` at build time, which cannot resolve `.ts` without a transpiler. A `design-tokens.d.ts` sits alongside it purely for TypeScript types on the `.js` file — don't delete it, and don't convert the `.js` back to `.ts`.
- **`themeColors` has both a "spec" key set and a "legacy" key set pointing at the same palette.** `navy`/`primary`/`primaryLight`/`sky`/`accent`/`error`/`surface`/`surfaceMuted`/`textPrimary`/`textMuted`/`whatsapp` are the descriptive names from the v1 integration spec; `secondary`/`background`/`card`/`text`/`textSecondary`/`border`/`success` are kept so every screen written before the 2026-07-10 palette migration didn't need a rename. Use whichever set reads more clearly for new code — they resolve to the same colors. **`accent` changed meaning**: it used to mean "danger/destructive" (crimson), now it means "badge/CTA" (orange) — destructive actions use `error` instead.
- **`GalleryItem` (`src/types/api.ts`) deliberately has no `uploadedBy` field.** The real `GET /api/gallery` is a public, unauthenticated endpoint that embeds the full uploader account — including a bcrypt password hash — in every item. This is a confirmed backend security issue (see `docs/tasks.md`), not a hypothetical. Never widen the type to add `uploadedBy` back; only read `title`/`mediaUrl`/`thumbnailUrl`/`mediaType`/`altText`/`displayOrder`.
- **`global.css` must be imported in `app/_layout.tsx`** (`import "../global.css"`) or NativeWind generates no actual CSS on web — class names show up in the DOM but do nothing.
- **`tailwind.config.js` needs `darkMode: "class"`** — `expo-router` calls `setColorScheme` on web at boot, which throws if darkMode is left at the default `"media"`.
- **Don't add `medium`/`bold` keys to Tailwind's `fontFamily` theme extension.** They collide with Tailwind's built-in font-*weight* utilities of the same name. `themeFontFamily.medium`/`.bold` exist in `design-tokens.js` for direct inline-style use (e.g. tab bar labels) — only `sans` is safely exposed as a Tailwind class.
- **Headings need a real `fontFamily`, not just a `font-bold` weight class.** Named static Google Font files don't reliably fake-bold on native the way browsers do on web. `AppText` (`src/components/ui/app-text.tsx`) applies `themeFontFamily.bold`/`.medium` directly via `style` for `title`/`subtitle` variants — follow that pattern for any new bold/heading text instead of relying on `font-bold`.
- **Color-override `className`s on `AppText` can silently lose to its default tone class** due to Tailwind's alphabetical CSS output order for extended color keys. Use an explicit `style={{ color: ... }}` for one-off color overrides instead of a `text-*` className.
- **`expo-secure-store` does not work on web** (`ExpoSecureStore.default.getValueWithKeyAsync is not a function`). `auth-provider.tsx` catches this and continues without persistence — expected in the browser preview, works normally on native. Don't "fix" this by making SecureStore calls silently no-op more broadly than they already do.
- **`SafeAreaProvider` and `GestureHandlerRootView` wrap the app root** in `app/_layout.tsx` — the former for `SafeAreaView` insets, the latter is required for the Gallery viewer's pinch/pan gestures (`react-native-gesture-handler`) to work at all.
- **`I18nManager.forceRTL` requires an app restart** to visually mirror layout on native — switching language mid-session updates text immediately but RTL layout only fully applies after reload. This is a React Native platform limitation, not a bug.
- **Poppins and IBM Plex Sans are Latin-only — they have no Arabic glyphs, and this is intentionally not "fixed" with a custom Arabic font.** `AppText` (`src/components/ui/app-text.tsx`) only applies the custom font families when `language !== "ar"`; Arabic text falls back to the platform default font, which has full Arabic coverage. Don't force `themeFontFamily`/`font-sans` onto text that might be Arabic, and don't add a Cairo/Arabic web font without discussing it first — the platform-default fallback was a deliberate choice, not a placeholder.
- **Absolutely-positioned overlay elements inside a `SafeAreaView` should use `useSafeAreaInsets()` directly**, not just a `top-4`-style class relying on the parent's padding.
- **`AppHeader` floats with margin below the safe-area inset — it is not edge-to-edge.** Any screen using it should have a plain `bg-background` `SafeAreaView` (not a special card-colored one) since there's no longer a flush seam to hide.
- **The logo's 3D shadow+gloss treatment lives in one place: `BrandLogo` (`src/components/ui/brand-logo.tsx`).** Splash, `AppHeader`, and the login screen all render `<BrandLogo size={...} />` instead of their own `Image`/card markup — if the logo needs to change anywhere, change it there, not per-screen, or the treatment will drift out of sync again.
- **`@react-native-masked-view/masked-view` does not render its mask on Expo web — it silently falls back to flat, unstyled foreground text.** It was tried for a gradient-fill header title and produced plain black text with no error. Don't reach for it for cross-platform gradient text without re-verifying web support first; the gloss-overlay technique in `BrandLogo`/`AppHeader` (a semi-transparent white-to-transparent `LinearGradient` over the top half of solid-colored text/an icon) works everywhere and is the established pattern here instead.
- **A floating (`position: "absolute"`) tab bar doesn't reserve layout space**, so scrollable screen content needs extra `paddingBottom` to avoid the last row of content being hidden behind it.
- **Adding a new native module (e.g. `expo-blur`, `expo-linear-gradient`, `react-native-gesture-handler`) mid-session can put an already-running `expo start` into a reload loop.** A plain hot-reload isn't enough — stop and restart the dev server after `npx expo install <package>`.
- **Expo Router's typed routes (`typedRoutes: true` in `app.json`) don't always accept a template-literal path to a dynamic route** (e.g. `` router.push(`/services/${id}`) `` can fail to type-check even though the route exists). Use the object form instead: `router.push({ pathname: "/services/[id]", params: { id: String(id) } })`.
- Dev workflow: this project uses an Expo **dev client**, not Expo Go (see `expo-dev-client` in `package.json`). Use `npx expo run:android` for a first native build, `npx expo start --dev-client` for subsequent JS-only iteration, or `npx expo start --web` for fast UI iteration in a browser (note the SecureStore limitation above applies there).

## Key file map

```
app/_layout.tsx                  root: GestureHandlerRootView, SafeAreaProvider, AuthProvider, LanguageProvider, font loading, splash
app/index.tsx                    always redirects to Home — browsing is public
app/(auth)/_layout.tsx           auth stack, redirects to Home if already logged in
app/(auth)/login.tsx             dark theme, email+password
app/(auth)/signup.tsx            light theme, fullName/email/phone/password, auto-login on submit
app/(auth)/forgot-password.tsx   email → generic confirmation
app/(auth)/reset-password.tsx    reset token + new password
app/(auth)/language.tsx          standalone language picker
app/(tabs)/_layout.tsx           floating pill tab bar: Home, Product, Services, Gallery, Profile
app/(tabs)/Home.tsx              app bar + hero carousel + quick-access + featured carousels + contact CTA
app/(tabs)/Product.tsx           product list, category filter chips
app/(tabs)/Services.tsx          service list
app/(tabs)/Gallery.tsx           gallery grid
app/(tabs)/Profile.tsx           account tab: logged-out prompt or profile edit + password change
app/products/[id].tsx            product detail
app/services/[id].tsx            service detail
app/gallery/[id].tsx             full-screen pinch-zoom gallery viewer
app/inquiry.tsx                  standalone inquiry form + confirmation state
src/types/api.ts                 TS contracts mirroring the real backend DTOs
src/mocks/                       static fixtures typed against src/types/api.ts
src/hooks/                       one hook per read endpoint, React-Query-shaped, mock-backed
src/features/auth/auth-provider.tsx         mock auth matching the real API contract
src/i18n/                        i18n-provider.tsx (context) + translations.ts (en/ar strings)
src/config/design-tokens.js      single source of truth for colors + font families
src/components/ui/               shared design-system components
src/components/ui/brand-logo.tsx shared 3D logo treatment — used by splash, header, login
```
