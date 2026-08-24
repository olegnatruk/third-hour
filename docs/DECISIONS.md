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

**Status:** Accepted

**Decision:** Customers will use an internationally formatted mobile number and password. The first release will not require SMS verification or one-time passwords.

**Impact:** Account creation and login must use Supabase phone-and-password authentication. The product must clearly handle account recovery as a later decision.

## 2026-08-24 — Complete loyalty cards at 10 stamps and preserve them

**Status:** Accepted

**Decision:** A loyalty card completes after its 10th stamp. The completed card remains visible in the customer's permanent collection, and the system automatically starts a new active card with zero stamps.

**Why:** Completed cards are both a customer achievement history and a reliable record of earned rewards.

**Impact:** Stamp transactions must belong to a specific card. Completing the 10th stamp must atomically close that card and create the next active card. Completed cards must never be deleted when redeemed.

## Decision template

### YYYY-MM-DD — Decision title

**Status:** Proposed | Accepted | Superseded

**Decision:** What was chosen.

**Why:** The reasoning or trade-off.

**Impact:** What future work should do differently because of this decision.
