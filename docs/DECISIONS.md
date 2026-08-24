# Decision Log

Record decisions that future work should follow. If a decision changes, add a new entry explaining what supersedes it; do not silently rewrite history.

## 2026-08-24 — Use one repository for both products

**Status:** Accepted

Third Hour will use one repository with separate `website/` and `loyalty-card/` directories. This supports shared collaboration while keeping each product clearly scoped.

## 2026-08-24 — Build the loyalty card with Next.js and Supabase

**Status:** Accepted

**Decision:** The loyalty-card app will use Next.js with TypeScript for its customer and admin experiences. Supabase will provide authentication and the Postgres database. Server-side business logic will live in `loyalty-card/backend/` and protected API routes in `loyalty-card/src/app/api/`.

**Why:** One application keeps customer and admin workflows, deployments, and shared UI simple while still supporting protected server-side endpoints.

**Impact:** Customer pages, admin pages, and API routes remain in the same Next.js application. The repository owner controls backend and API changes.

## 2026-08-24 — Use phone number and password for customer login

**Status:** Superseded by email-and-password login

**Decision:** Customers will use an internationally formatted mobile number and password. The first release will not require SMS verification or one-time passwords.

**Impact:** Account creation and login must use Supabase phone-and-password authentication. The product must clearly handle account recovery as a later decision.

## 2026-08-24 — Use email and password for customer login

**Status:** Accepted

**Decision:** Customers use an email address and password to register and sign in through Supabase Auth.

**Why:** The Supabase Phone provider is disabled, and email authentication is the simpler supported account identifier for the first release.

**Impact:** The application, profile table, and authentication endpoints use email rather than phone. Run migration `002_switch_auth_to_email.sql` after the previously applied authentication migration.

## 2026-08-24 — Complete loyalty cards at 10 stamps and preserve them

**Status:** Accepted

**Decision:** A loyalty card completes after its 10th stamp. The completed card remains visible in the customer's permanent collection, and the system automatically starts a new active card with zero stamps.

**Why:** Completed cards are both a customer achievement history and a reliable record of earned rewards.

**Impact:** Stamp transactions must belong to a specific card. Completing the 10th stamp must atomically close that card and create the next active card. Completed cards must never be deleted when redeemed.

## 2026-08-24 — Use role-based account access

**Status:** Accepted

**Decision:** Third Hour uses four account roles: customer, cashier, admin, and owner. New accounts are active customers by default; owner accounts control role and status changes.

**Why:** Customers need private access to their own loyalty data, while staff access must be limited to the work each person performs.

**Impact:** Account list access requires admin or owner role. Role/status changes require owner role plus a server-only service-role key. Owner assignment is a deliberate Supabase SQL operation, not a public API action.

## 2026-08-24 — Use cards plus an immutable stamp ledger

**Status:** Accepted

**Decision:** A customer has exactly one active loyalty card and a permanent history of completed cards. Stamp changes are recorded as immutable transactions linked to a card.

**Why:** This keeps completed cards collectible, prevents the active balance from being the only source of truth, and makes every correction auditable.

**Impact:** The backend must create a new active card only when the current card completes at 10 stamps. Corrections use reversal or manual-adjustment transactions rather than editing or deleting history.

## 2026-08-24 — Award one stamp per approved staff action

**Status:** Accepted

**Decision:** An active cashier, admin, or owner awards one stamp for each approved purchase. Every award requires a unique idempotency key.

**Why:** Staff control prevents customers from self-awarding stamps, while idempotency prevents duplicate scans or retried requests from issuing extra stamps.

**Impact:** The award flow uses a server-only database function. It records the issuing staff account and atomically completes a 10-stamp card before creating the next active card.

## 2026-08-24 — Use short-lived, one-time QR scan tokens

**Status:** Accepted

**Decision:** Customer QR codes contain a signed opaque token valid for 60 seconds. A staff scan consumes the token once and awards the associated customer a stamp.

**Why:** The QR code does not expose personal data, and a screenshot or retried scan cannot be replayed to award extra stamps.

**Impact:** The backend stores QR-token lifecycle data, signs tokens with a server-only secret, and validates the scan before invoking the stamp-award transaction.

## 2026-08-24 — Attach a configurable reward to every completed card

**Status:** Accepted

**Decision:** Each completed 10-stamp card creates one reward entitlement. A staff member may redeem the customer's oldest available entitlement through a one-time QR scan. The owner controls one active reward definition; the initial migration uses a placeholder until the café chooses the real reward.

**Why:** This preserves the completed-card collection while giving staff a simple, auditable redemption workflow.

**Impact:** Redemptions never delete cards or alter stamp history. The owner must configure the real reward before launch.

## 2026-08-24 — Restrict stamp corrections to one auditable adjustment

**Status:** Accepted

**Decision:** Only active admins and owners can manually add or remove exactly one stamp, and every adjustment requires a reason and idempotency key.

**Why:** It supports legitimate corrections without making the stamp ledger editable or giving cashiers broad adjustment power.

**Impact:** Corrections are immutable `manual_adjustment` transactions. A +1 correction can complete a card using the same lifecycle rules as a normal award.

## Decision template

### YYYY-MM-DD — Decision title

**Status:** Proposed | Accepted | Superseded

**Decision:** What was chosen.

**Why:** The reasoning or trade-off.

**Impact:** What future work should do differently because of this decision.
