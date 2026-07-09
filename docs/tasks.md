# Tasks

Working task list for ibnfirnas-frontend. Check items off as they land; move finished work details to `changelog.md` rather than leaving long descriptions here.

## Done

- [x] Fix `design-tokens`/Tailwind build crash (`.js`/`.ts` split)
- [x] Fix `global.css` not being imported (NativeWind classes had no effect)
- [x] Fix `darkMode` config crash on web (`expo-router` + `setColorScheme`)
- [x] Fix heading font-family collision with Tailwind weight utilities
- [x] Add Poppins (body) + IBM Plex Sans (headings) font loading
- [x] Rewrite `auth-provider.tsx` as local mock auth (no backend)
- [x] Delete dead `app/(auth)/index.tsx`
- [x] Rebuild `login.tsx` / `signup.tsx` (previously didn't compile)
- [x] Add language toggle to Login/Signup screens
- [x] Add `SafeAreaProvider` at app root
- [x] Animated splash: fix entrance sequencing, add brand-blue background transition
- [x] Build real `Home.tsx` (was an empty stub), then extend with featured carousels + contact CTA
- [x] Adopt v1 integration spec palette in `design-tokens.js` (navy/primary/accent/error/whatsapp etc.)
- [x] Define TS contracts (`src/types/api.ts`) matching the real backend DTOs, verified live 2026-07-10
- [x] Build mock fixtures (`src/mocks/`) + React-Query-shaped hooks (`src/hooks/`) for Products/Categories/Services/Gallery/Company/Inquiry
- [x] Rebuild auth to match the real contract: email+password, auto-login on register, no OTP; add forgot/reset password screens
- [x] Make browsing public — remove the login gate from the tabs layout and `app/index.tsx`
- [x] Redesign `AppHeader` + bottom tab bar as floating glass cards; add Profile as a 5th tab (moved from a pushed route)
- [x] Build out `Gallery.tsx`, `Product.tsx`, `Services.tsx` tab screens + Product/Service detail routes + Gallery pinch-zoom viewer
- [x] Add `WhatsAppFab`, `Skeleton`/`SkeletonCard`, `ErrorState`/`EmptyState`, `Badge` shared components
- [x] Add standalone Inquiry form (`app/inquiry.tsx`) with prefill support + confirmation state
- [x] Rebuild Profile tab to match the real `/api/profile` contract (logged-out prompt, editable fullName/phone/avatarUrl, password-change sub-flow); drop the old `location` field

## Open / next up

- [ ] Connect real Spring Boot backend — swap each hook in `src/hooks/` for a real `fetch`/React Query call (types already match; `src/api/endpoints/*.ts` scaffolded but empty)
- [ ] Add `@tanstack/react-query` when real network calls land (skipped in the mock phase — no caching/retry needed against static fixtures)
- [ ] Persist selected language across app restarts (currently resets to English on cold start)
- [ ] Verify SecureStore token persistence, full RTL layout mirroring, and the Gallery pinch/pan gestures on a real native build (`npx expo run:android`) — all are native-only or gesture-handler behaviors not fully exercised in the web preview
- [ ] Wire Cloudinary for gallery/product/avatar image uploads (currently URL-only, no upload UI)
- [ ] Add FCM push notification handling
- [ ] Real Product/Service pagination once the backend adds it (currently fetches the whole list — matches the spec's "no pagination anywhere yet")
- [ ] **Backend security fix needed, not frontend-actionable**: `GET /api/gallery` is a public, unauthenticated endpoint that returns the full uploader account — including the bcrypt password hash — on every gallery item with an uploader. Flag to backend team: add `@JsonIgnore` to `Gallery.uploadedBy` or drop it via a DTO. Frontend mitigation already in place (`GalleryItem` type has no `uploadedBy` field at all).
- [ ] **Backend security fix needed, not frontend-actionable**: `GET /api/auth/me` also leaks the password hash — same fix pattern as `GET /api/profile`'s clean DTO, just not applied to `/auth/me` yet.
