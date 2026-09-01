# Working Context

Use this document to leave the next founder or AI agent with the minimum context needed to continue.

## Current state

**Last updated:** 2026-08-24

- A single Third Hour repository has been initialized locally.
- It contains separate `website/` and `loyalty-card/` folders, plus this documentation folder.
- The loyalty-card project is initialized as a Next.js TypeScript application with Tailwind CSS.
- Supabase is the planned authentication and Postgres platform.
- The repository owner owns `loyalty-card/backend/` and `loyalty-card/src/app/api/`; other agents must not edit either location without explicit approval.
- Loyalty cards complete at 10 stamps. Completed cards are kept permanently in the customer's collection; a new empty card begins after completion.
- Authentication foundation is implemented: Supabase SSR session utilities, email/password validation, sign-up, sign-in, sign-out, and current-user API routes.
- The authentication migrations for profiles, roles, and Row Level Security are applied to the Supabase project.
- Live authentication was verified with the local test account: sign-in returned `200`, authenticated session lookup returned `200`, sign-out returned `204`, and the post-sign-out session lookup returned `401`.
- Role and account-status code is implemented, migration `003_accounts_and_roles.sql` is applied, and the first owner account has been bootstrapped.
- Role boundaries were partially verified with the local customer test account: it is `active` with role `customer`; account listing and account-update endpoints correctly returned `403`.
- Owner access was verified: the owner account is `active`, authenticated successfully, and received `200` from the admin account-list endpoint.
- Owner account-management was verified with the configured server-only key: a no-op customer-role update returned `200`, while an attempted owner self-role change was rejected with `400`.
- The loyalty core migration and read endpoint are applied and live-tested. The customer test account has active card #1 at 0/10 stamps and no completed cards.
- Stamp-award code and migration `005_stamp_awards.sql` are applied and live-tested. An owner issued one stamp to the disposable customer account; repeating the same request was idempotent, and the customer now has 1/10 stamps with no completed card.
- The remaining backend implementation is ready for database setup: QR scan tokens, completed-card reward entitlements/redemptions, manual one-stamp corrections, customer history APIs, reward administration, and authenticated password changes.
- Migrations `006_qr_scan_tokens.sql` through `010_fix_tenth_stamp_completion.sql` are applied and live-tested. QR award completion, one-time replay rejection, automatic next-card creation, reward entitlement creation/redemption, admin correction idempotency, and manual-adjustment completion all passed.
- The disposable customer test account now has two completed 10-stamp cards and a new active card at 0/10. One test reward has been redeemed; the other remains as completed-card test history.
- The configured default reward is deliberately a placeholder (`Completed Card Reward`); the owner must replace it through `POST /api/admin/rewards` before launch.

## Open questions

- What should the Third Hour brand feel like?
- What are the first must-have pages for the café website?
- What is the simplest loyalty experience that works for customers and staff?
- Which GitHub account or organization will host the shared repository?
- Which people need admin or cashier access at launch?
- Which Supabase project will be used, and who will create the initial owner account?
- Which account should become the first owner, and which staff need cashier or admin access?

## Next useful action

Polish the frontend against Figma (parity pass at 402px), then wire real brand
assets and the Profile/Settings designs.

## Session log

### 2026-08-31 — Loyalty-card animation pass (Framer Motion)

- **Completed:**
  - Added `motion` (Framer Motion) via `src/components/motion/MotionProvider.tsx`
    (`LazyMotion` + `domAnimation`, `MotionConfig reducedMotion="user"`), wired in
    `src/app/layout.tsx`. Added a `prefers-reduced-motion` block to `globals.css`.
  - Motion primitives in `src/components/motion/`: `transitions.ts` (shared
    spring/easing/variants), `PageTransition`, `StaggerList`/`StaggerItem`,
    `AnimatedCheck`, `CelebrationBurst`. New `src/components/ui/SheetOverlay.tsx`.
  - Enter transitions per area via `src/app/{(auth),customer,staff,admin,owner}/template.tsx`.
  - Signature moments: newest stamp pops (`StampGrid` → client, adjust-state-on-
    prop-change), scan-result circle/`AnimatedCheck`/progress reveal + a
    `CelebrationBurst` when `cardCompleted`.
  - Polish: `Button` whileTap, `BottomTabBar` tap + active-icon pop, `QRDisplay`
    state crossfade + expiring pulse, `EmptyState` fade-in, list stagger on
    history / completed / admin directory / customer-history tabs, animated
    `ProgressRow` bar. Owner editors now use the animated `SheetOverlay` wrapped
    in `AnimatePresence`.
  - Verified live (dev server, mobile viewport): route transitions, list stagger,
    QR page, owner sheet slide/exit, and the full 9→10 scan → card-complete
    celebration — no console errors. `build`, `lint`, `tsc` clean.
- **Decided:**
  - `motion` over GSAP (per request); enter-only route transitions (no exit
    cross-fade); springs kept to 2 keyframes (multi-keyframe pops use tweens).
- **Open:**
  - Reduced-motion path implemented three ways but not emulated in this session —
    verify via DevTools → Rendering → emulate `prefers-reduced-motion`.
  - Drag-to-dismiss on sheets deferred (needs the heavier `domMax` feature set).
  - Concurrent `next dev` + `npm run build` corrupted the dev server once — stop
    the preview before building.
- **Next:** Figma parity pass; reduced-motion QA; consider `loading.tsx` skeletons.

### 2026-08-27 — Loyalty-card frontend, first build (Figma → code)

- **Completed:**
  - Built the full `loyalty-card/` frontend for all 11 Figma "Screens"
    (file `0iJaVR61JcoElU0u4Q6U0p`) as a faithful design-to-code pass.
  - Foundations: design tokens + dark/cream themes in `src/app/globals.css`
    (`@theme`), Cormorant Garamond + Inter via `next/font`, 19 line icons
    committed under `public/icons/` and mirrored in `src/components/ui/Icon.tsx`.
  - Component library in `src/components/ui/` (Button, Input, TopBar,
    BottomTabBar, LoyaltyCard, StampGrid, ProgressRow, StatusBadge, ListRow,
    QRDisplay, EmptyState, Segmented, Sheet, InfoNote, LogoLockup,
    SectionHeading, Panel).
  - Frontend-only data layer in `src/lib/api/` (typed `apiFetch` for the
    browser, `serverFetch` for RSC that forwards the session cookie) and
    `src/lib/auth/session.ts` page guards. The frontend calls the backend
    **only** through the existing `/api/**` routes — no imports of
    `@/lib/supabase/*` or `@backend/*`, nothing in the protected dirs changed.
  - Routes: `(auth)/sign-in`, `(auth)/sign-up`, `/` role redirect;
    `customer/` (My Card, Completed Cards, History, My QR, Profile, Settings)
    with the bottom tab bar; `staff/` (QR scanner + scan/redeem result,
    `@zxing/browser` camera + manual entry); `admin/` (customer directory,
    customer history with tabs, manual stamp adjustment sheet);
    `owner/` (accounts role/status editor, active-reward editor).
  - New deps: `qrcode` (customer QR render), `@zxing/browser` + `@zxing/library`
    (staff camera scan). `.claude/launch.json` added for the dev server.
  - Verified live against Supabase: sign-in → role redirect; customer screens
    with real card/reward/transaction data; QR issue → `POST /api/qr/scan`
    award → scan-result screen. Admin/owner screens verified by temporarily
    promoting the disposable `TEST_AUTH_EMAIL` account to `owner` (reverted to
    `customer` after). `npm run build`, `lint`, and `tsc` all pass.
- **Decided:**
  - Both token sets (dark + cream) exist; each screen renders a fixed theme
    (cream only on `/sign-up`). No runtime theme switcher.
  - Impeccable's generative workflow was intentionally skipped — Figma is the
    single source of truth. No `DESIGN.md` generated.
- **Open:**
  - Profile, Settings, and "forgot password" have no Figma frames — built
    minimally from the design system; need real designs.
  - The dashboard "how it works" strip is text-only (Figma has small
    illustrations to add).
  - Brand colours/voice/logo still per `PRODUCT.md` "Still to define".
  - The disposable test account's card #3 gained 2 stamps during scan testing.
- **Next:** Figma parity pass (screenshot each route at 402px vs the frame),
  then brand assets + the missing screen designs.

## Update template

### YYYY-MM-DD — Short session title

- **Completed:**
- **Decided:**
- **Open:**
- **Next:**
