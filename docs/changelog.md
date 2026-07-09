# Changelog

Notable changes to the ibnfirnas-frontend app. Newest entries first.

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
