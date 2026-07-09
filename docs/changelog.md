# Changelog

Notable changes to the ibnfirnas-frontend app. Newest entries first.

## 2026-07-10 — v1 integration spec: mock data layer, real-shaped auth, full content screens

Implemented the consolidated frontend integration spec (API contracts verified live against the backend on `developer-2`, 2026-07-10). Phase 1 as specified: every screen is built against typed mock data, no live network calls yet, but every type/hook is shaped exactly like the real API so wiring it later is a drop-in swap per hook.

### Added
- **`src/types/api.ts`**: TS interfaces for every backend entity (`Product`, `Category`, `Service`, `GalleryItem`, `Company`, `Inquiry`, `Profile`, auth request/response shapes). `GalleryItem` deliberately has no `uploadedBy` field — the real `GET /api/gallery` is a public, unauthenticated endpoint that leaks the uploader's password hash on every item; this is a confirmed backend security issue, tracked in `tasks.md`, not fixable from the frontend.
- **`src/mocks/`**: static fixtures for products, categories, services, gallery, and company, typed against `src/types/api.ts`.
- **`src/hooks/`**: `useProducts`/`useProduct`/`useFeaturedProducts`, `useCategories`, `useServices`/`useService`/`useFeaturedServices`, `useGallery`, `useCompany`, `useSubmitInquiry` — each returns `{ data, isLoading, error, refetch }` (the same shape `useQuery` returns) via a shared `useMockQuery` helper. `@tanstack/react-query` is intentionally not a dependency yet.
- **Products tab**: category filter chips, product cards with discount/stock-status/featured badge, pull-to-refresh; detail route with single hero image (the API has no multi-image gallery, despite an earlier assumption to the contrary), "Inquire" CTA, WhatsApp FAB.
- **Services tab**: list + detail, same inquire/WhatsApp pattern as Products, no category filter (services aren't categorized).
- **Gallery tab**: grid using `thumbnailUrl`; new full-screen viewer (`app/gallery/[id].tsx`) with swipe-between-items and pinch/double-tap zoom (`react-native-gesture-handler` + `react-native-reanimated`, both already installed). Added `GestureHandlerRootView` at the app root for this.
- **Home**: featured-products and featured-services horizontal carousels, a company banner + description card, and a contact CTA row (phone/email/address, each guarded to skip entirely when null) — extends the hero carousel + quick-access layout from the previous session.
- **Standalone Inquiry form** (`app/inquiry.tsx`): accepts a prefill `subject` param from Product/Service Detail CTAs, validates required fields client-side, shows a dedicated confirmation state (not a toast) on submit.
- **`WhatsAppFab`**: reads `Company.phone`, builds a `wa.me` link with a context-aware message; visible on Home/Product Detail/Service Detail, hidden on auth screens, Inquiry, and the Gallery viewer.
- **`Skeleton`/`SkeletonCard`, `ErrorState`/`EmptyState`, `Badge`**: shared loading/error/empty/badge primitives used by every list and detail screen.
- **Forgot/reset password screens** (`app/(auth)/forgot-password.tsx`, `reset-password.tsx`).

### Changed
- **Auth rebuilt to match the real backend contract**: `login`/`register` now take `email`/`fullName+email+password+phone?` instead of phone+password; register auto-logs-in (matches the real endpoint returning a token directly) — the OTP step is gone (`app/(auth)/verify-otp.tsx` deleted, along with its translation keys). `AuthUser` now matches `GET /api/profile`'s shape.
- **Browsing is public**: `app/index.tsx` always redirects to Home; the tabs layout no longer redirects to Login when logged out. Only Profile enforces auth, via a logged-out prompt state rather than a route redirect.
- **Profile moved from a pushed route (`app/profile.tsx`) to a tab** (`app/(tabs)/Profile.tsx`), and rebuilt: logged-out prompt, editable `fullName`/`phone`/`avatarUrl`, a password-change sub-flow mirroring the real `PUT /api/profile` validation messages. The old `location` field is gone — it never existed in the real API.
- **`AppHeader` and the bottom tab bar redesigned as floating glass cards** per the spec: rounded, blurred, translucent-bordered, with margin below the safe-area inset instead of edge-to-edge. Added a second header icon (grid/menu) opening a quick-nav sheet, and added Profile as the tab bar's 5th tab.
- **`design-tokens.js` palette migrated** to the spec's navy/blue/orange system (`navy`, `primary` #2E6FE0, `primaryLight`, `sky`, `accent` #F5A623, `error`, `surface(Muted)`, `textPrimary`/`textMuted`, `whatsapp`) alongside the pre-existing key names (`secondary`, `background`, `card`, `text`, `textSecondary`, `border`, `success`), which now resolve to the new palette so no call site needed a rename. `accent`'s meaning changed from "destructive" (crimson) to "badge/CTA" (orange) — the three call sites that meant "destructive" (`profile.tsx` logout, the login/signup cross-links) moved to `error`/`primary`/`sky`.

### Fixed
- `StyleSheet.absoluteFillObject` (doesn't exist in this RN version) → `StyleSheet.absoluteFill` in `animated-splash.tsx`.
- Expo Router's typed routes don't reliably accept a template-literal path to a dynamic route (`` `/services/${id}` ``) — switched those `router.push` calls to the object form (`{ pathname: "/services/[id]", params: { id } }`).

### Known limitations
- Still no live backend — every screen reads mock fixtures behind hooks shaped for a drop-in swap later.
- Hero carousel slides are still icon+gradient placeholders (unchanged from the previous session).
- Gallery pinch/pan and full RTL mirroring are implemented but only exercised in the web preview during this session — need a real native build to confirm gesture feel and behavior.
- Two backend security issues (password hash leaks on `GET /api/gallery` and `GET /api/auth/me`) are documented in `tasks.md` as blocked-on-backend; the frontend mitigation (never typing/reading the leaked field) is in place but isn't a substitute for the backend fix.

## 2026-07-09 — Home screen redesign: app bar, hero carousel, floating nav

Home was a plain scroll of text and cards with no real visual identity. Rebuilt it around a branded app bar, an auto-sliding hero carousel, and a floating bottom nav bar, iterated over several rounds of feedback.

### Added
- **`AppHeader`** (`src/components/ui/app-header.tsx`): edge-to-edge bar with the company logo, bold blue "IBN FIRNAS" wordmark + tight-tracked uppercase "TRADING & CONTRACTING" tagline beneath it, and a circular avatar button (routes to `/profile`). Sits outside the scrollable content so it can span full width and stay flush against the top safe area; uses a soft bottom-only shadow (no hard border) for separation from the content below.
- **`HeroCarousel`** (`src/components/ui/hero-carousel.tsx`): full-width, auto-advancing (4s) banner carousel sized to ~46% of viewport height. Currently renders 4 gradient slides themed to the company's actual product lines (Automatic Doors, Rolling Shutters, Boom Barriers, Industrial Systems) with `MaterialCommunityIcons`, since there's no product photography wired up yet — see Known limitations. Has a diagonal glass-sheen overlay, pagination dots, and semi-transparent blurred circular prev/next arrow buttons.
- **Floating bottom tab bar** (`app/(tabs)/_layout.tsx`): the tab bar is now a pill-shaped, absolutely-positioned floating bar (rounded corners, drop shadow, blurred/tinted translucent background) instead of a flush-bottom bar. Labels are hidden; the active tab's icon gets a primary-tinted rounded pill background instead.
- New dependencies: `expo-linear-gradient` and `expo-blur`, used for the carousel gradients/glass sheen and the floating tab bar / carousel arrow blur effects.

### Changed
- **Logout moved from Home to Profile** (`app/profile.tsx`): Home's logout button was removed; Profile now has it at the bottom, calling `logout()` then redirecting to `/(auth)/login`.
- Removed the "Welcome back / IBN Firnas / Explore..." greeting block from Home entirely (feedback: redundant with the app bar wordmark, and cluttered the top of the screen).
- Finished the `design-tokens.js` `subText` → `textSecondary` rename that had been left half-done in an earlier uncommitted edit — all consuming files (`Home.tsx`, tabs `_layout.tsx`, `app-text.tsx`, `text-field.tsx`, `design-tokens.d.ts`) now agree on the new key.
- Quick-access entries (Products/Services/Gallery) restyled with distinct icon colors per entry (primary/secondary/success) instead of a single repeated color.

### Fixed
- Floating tab bar was overlapping the last quick-access card because Home's scroll content didn't reserve enough bottom clearance — bumped `paddingBottom` on Home's `ScrollView`.
- App bar had a visible seam/border at the very top edge — caused by the surrounding `SafeAreaView`'s background color (light grey) showing through the safe-area inset above the (white) app bar. Fixed by making the `SafeAreaView` background match the app bar (`bg-card`) and moving the grey page background onto the `ScrollView` instead, so only the header and the safe-area strip above it are white.
- Bottom tab bar and carousel prev/next arrows read as too transparent against busy backgrounds — added a semi-opaque tint layer behind both `BlurView`s to reduce see-through-ness.

### Known limitations
- Hero carousel slides are icon+gradient placeholders, not real photos — real banner images are pending (user will add files to `assets/images/`; carousel isn't wired to consume them yet).
- Adding `expo-blur`/`expo-linear-gradient` (native modules) mid-session put the running Metro/Expo dev server into a reload loop until it was restarted cleanly — not a code issue, but worth knowing if you pull these changes into an already-running `expo start`.

## 2026-07-09 — User profile screen

Added a profile screen so users can see their account details (name, phone, email) and set a location — still fully mocked/local since there's no backend yet.

### Added
- **Profile screen** (`app/profile.tsx`): top-level route (pushed, not a tab) showing name/phone/email as read-only fields sourced from the mock auth user, plus an editable Location field (not collected at signup, so it starts blank) with inline edit/save.
- **Entry point**: new user-icon button in the top-left of `Home.tsx`, navigates to `/profile`.
- **`updateProfile`** on `AuthContext` (`src/features/auth/auth-provider.tsx`): merges partial updates into the mock user and persists them the same way login does (`expo-secure-store` on native, in-memory only on web). Used by the profile screen to save the location field.
- `location?: string` added to the `AuthUser` type.
- `profile.*` translation keys (English + Arabic).

### Known limitations
- Location is not collected at signup — it only exists once a user sets it from the Profile screen, and (like the rest of auth) isn't backed by a real database yet.

## 2026-07-08 — Arabic text rendering + language toggle safe-area fix

On native (not reproducible in the web preview), the language toggle pill on Login/Signup appeared as a bare icon with no visible "العربية" label, and looked like it was overlapping the status bar/camera cutout.

### Fixed
- **Arabic text rendering app-wide**: `AppText` was forcing Poppins/IBM Plex Sans onto all text, including Arabic. Both fonts are Latin-only; on native, an unsupported glyph in an explicitly-set font can render blank instead of falling back to a system font the way browsers do. `AppText` now only applies the custom fonts when `language !== "ar"` — Arabic text uses the platform default font instead, which has full Arabic glyph coverage. This is the most likely explanation for the invisible label (the pill/icon container still rendered, just not the text inside it).
- **`LanguageToggle` positioning**: switched from a `top-4` class (relying on the parent `SafeAreaView`'s padding) to explicitly reading `useSafeAreaInsets()` and positioning at `insets.top + 12` — more robust against inset-measurement differences across devices/cutouts.
- Pushed Login screen content down further (`pt-16` → `pt-24`, later adjusted to `pt-36`) per feedback that the icon/form sat too close to the top even after the safe-area fix.

## 2026-07-08 — Auth flow rebuild: splash, login, signup, OTP, Home

The `(auth)` flow and its supporting config were in a broken, half-migrated state (design-tokens mid-conversion from `.js` to `.ts`, `login.tsx`/`signup.tsx` importing modules that didn't exist, a dead duplicate splash-gate file). This release fixes the underlying configuration and rebuilds the flow end-to-end: **animated splash → Login → Signup → OTP verification → Home**, fully local/mocked since there is no backend yet, styled from the shared design tokens, with English/Arabic support throughout.

### Fixed (configuration)
- `tailwind.config.js` could not load at all — it `require()`s `src/config/design-tokens`, which only existed as a `.ts` file (unresolvable by plain Node), silently breaking all NativeWind styling app-wide. Restored `design-tokens.js` as the source of truth (kept `design-tokens.d.ts` for types); deleted the broken `.ts` duplicate.
- `global.css` existed but nothing imported it, so NativeWind classes rendered as inert class names with no actual styles. Added `import "../global.css"` to `app/_layout.tsx`.
- `tailwind.config.js` was missing `darkMode: "class"` — `expo-router` calls `setColorScheme` on web boot, which throws under the default `"media"` mode.
- `themeFontFamily`'s `medium`/`bold` keys collided with Tailwind's built-in font-*weight* utility classes of the same name, causing headings to silently fall back to serif on web. Stopped exposing them as Tailwind classes; `AppText` now applies them directly via `style.fontFamily` instead of relying on a `font-bold`/`font-medium` weight class (which doesn't reliably fake-bold a named static font on native either).
- Fixed a related bug where `AppText`/`PrimaryButton` color overrides via `className` (e.g. `text-white`, `text-accent`) were silently losing to the component's default tone class, due to Tailwind's alphabetical CSS output order. Switched those call sites to explicit `style={{ color }}`.
- Deleted dead `app/(auth)/index.tsx` — broken import (`~/src/config/designTokens`, wrong alias and filename), and a duplicate of the splash/redirect logic already owned by `app/_layout.tsx` + `app/index.tsx`.
- Added `SafeAreaProvider` at the app root (`app/_layout.tsx`) — was missing entirely, likely cause of inset-measurement issues (e.g. UI elements crowding the status bar) on some devices.

### Added
- **Mock authentication** (`src/features/auth/auth-provider.tsx`): local `login`/`register`/`logout`, no backend calls, token persisted via `expo-secure-store` (native only). `register` no longer auto-logs the user in — it simulates account creation and the caller routes to Login.
- **OTP verification screen** (`app/(auth)/verify-otp.tsx`): shown after signup, before the account is "created." Accepts a 4-digit code (mock — no real verification), then routes to Login rather than Home.
- **Real Home screen** (`app/(tabs)/Home.tsx`): themed welcome header, entry links to Products/Services/Gallery, logout — was previously an empty stub.
- **Language toggle** (`src/components/ui/language-toggle.tsx`): pill in the corner of Login/Signup/OTP to switch English ⇄ Arabic without leaving the screen, in addition to the existing standalone language picker.
- **`BrandWordmark` component**: reusable "Ibn Firnas" wordmark styling (bold, `tracking-wide`, theme-aware).
- Poppins (body) and IBM Plex Sans (headings) font loading via `@expo-google-fonts/*`, gated in the splash sequence.
- Missing `auth.*` and OTP translation keys (English + Arabic).

### Changed
- **Splash screen**: logo now animates in first, then the "Ibn Firnas" wordmark fades in after (previously both appeared simultaneously/out of order); background shifts from white to brand blue after the logo settles, holding briefly before handing off to the (already-blue) Login screen; minimum visible duration added so fast app-ready resolution can't cut the entrance animation short.
- **Login/Signup layout**: replaced full-height `justify-between` spacing (excessive gaps on tall screens) with content grouped near the top with fixed gaps — closer to standard mobile form layout.
- **Heading font**: switched from Poppins Bold to IBM Plex Sans (Bold/SemiBold) for a more corporate/technical feel matching the company's industrial-automation branding; body text stays Poppins Regular.
- Logo presentation iterated several times based on feedback — settled on a plain white rounded-square card (no shadow, no circular crop, tight padding around the icon) on both the splash screen and Login.

### Known limitations
- No real backend — all auth is mocked client-side.
- `expo-secure-store` doesn't work on web preview (native-only API); confirmed working as expected, this is a platform limitation, not a bug.
- Gallery, Product, and Services tabs remain empty stubs.
- Language preference is not persisted across app restarts (resets to English on cold start).
