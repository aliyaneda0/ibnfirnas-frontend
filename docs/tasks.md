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
- [x] Add OTP verification screen between signup and login
- [x] Build real `Home.tsx` (was an empty stub)
- [x] Add language toggle to Login/Signup/OTP screens
- [x] Add `SafeAreaProvider` at app root
- [x] Animated splash: fix entrance sequencing, add brand-blue background transition

## Open / next up

- [ ] Connect real Spring Boot backend — replace mock `login`/`register`/`logout` in `src/features/auth/auth-provider.tsx` with real API calls (`src/api/endpoints/auth.ts` already scaffolded)
- [ ] Wire real OTP delivery + verification once backend supports it (currently accepts any 4-digit code)
- [ ] Build out `Gallery.tsx`, `Product.tsx`, `Services.tsx` tab screens (currently empty stubs)
- [ ] Persist selected language across app restarts (currently resets to English on cold start)
- [ ] Verify SecureStore token persistence and full RTL layout mirroring on a real native build (`npx expo run:android`) — both are native-only behaviors that can't be checked in the web preview
- [ ] Wire Cloudinary for gallery/product images once those screens are built
- [ ] Add FCM push notification handling
- [ ] Add forgot-password flow (not yet in scope)
- [ ] Revisit product detail route (`app/products/[id].tsx`) once the Product tab has real data to link from
