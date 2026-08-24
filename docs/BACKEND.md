# Loyalty-Card Backend Blueprint

This document is the implementation contract for the Third Hour virtual loyalty-card backend. Read it before changing `loyalty-card/backend/` or `loyalty-card/src/app/api/`.

## Technology and ownership

- **Application:** Next.js with TypeScript.
- **Authentication and database:** Supabase Auth and Postgres.
- **Backend owner:** The repository owner exclusively controls `loyalty-card/backend/` and `loyalty-card/src/app/api/`.
- **Secrets:** Supabase credentials belong only in `loyalty-card/backend/.local.env` locally and in the deployment provider's environment settings in production. Never expose `SUPABASE_SERVICE_ROLE_KEY` to browser code.

## Roles

| Role | Allowed actions |
|---|---|
| Customer | Read their own profile, active card, completed-card collection, transactions, and QR token. |
| Cashier | Authenticate as staff, scan a customer QR token, and submit an approved stamp or redemption action. |
| Admin | View customers and transaction history; manage staff and approved manual adjustments. |
| Owner | Full operational control. |

Pages alone do not grant access. Every database query and server endpoint must enforce the authenticated user's role.

### Account roles and status

- Every new account starts as an `active` `customer`.
- A `cashier` may perform approved scan and redemption actions; it cannot browse the full customer list or modify roles.
- An `admin` may read the account list. An `owner` has that access plus account-management authority.
- An account can be `active` or `suspended`. Suspended accounts cannot use protected application endpoints.
- An owner cannot change their own access, cannot assign the `owner` role through the API, and cannot alter an existing owner account through the API. These protections prevent accidental lockout or privilege escalation.

## Customer identity

- Customers register and sign in through Supabase Auth with an email address and password.
- SMS verification and OTP login are not part of the first release.
- Email authentication is enabled by default in Supabase. The sign-up endpoint reports whether the current Supabase settings require email confirmation before the user can sign in.
- Passwords are never stored in an application table or logged.
- Password recovery and phone-number-change handling remain open product decisions.

## Authentication endpoints

| Endpoint | Method | Purpose |
|---|---|---|
| `/api/auth/sign-up` | `POST` | Creates an email-and-password customer account and stores the display name in Supabase user metadata. |
| `/api/auth/sign-in` | `POST` | Validates email-and-password credentials and establishes the Supabase cookie session. |
| `/api/auth/sign-out` | `POST` | Ends the current Supabase session. |
| `/api/auth/me` | `GET` | Returns the authenticated user's safe profile fields and role. |

Sign-up accepts `email`, `password`, and `displayName`. Sign-in accepts `email` and `password`; passwords must contain 8–72 characters.

## First-time Supabase setup

1. Create the Supabase project; email authentication is enabled by default.
2. Run `loyalty-card/backend/database/migrations/001_authentication.sql` through `004_loyalty_core.sql` in the Supabase SQL Editor, in numeric order.
4. Copy `loyalty-card/.env.example` to `loyalty-card/.env.local` and supply the project URL and publishable key. Add the service-role key only for later server-only administrative actions.
5. Do not commit `.env.local`; the project ignores it.

The older `backend/.local.env` file is not loaded by Next.js. Use `.env.local` for local Next.js development.

## Account-management endpoints

| Endpoint | Method | Access | Purpose |
|---|---|---|---|
| `/api/admin/accounts` | `GET` | Admin or owner | Returns up to 100 accounts, including role and status. |
| `/api/admin/accounts/:accountId` | `PATCH` | Owner only | Changes a non-owner account's role and/or status. |

The `PATCH` endpoint requires `SUPABASE_SERVICE_ROLE_KEY` in the server environment because it performs a controlled server-side update. Do not expose that key in a browser variable.

### Bootstrap the first owner

After running migration `003_accounts_and_roles.sql`, promote the intended owner once in Supabase SQL Editor:

```sql
update public.profiles
set role = 'owner'
where email = 'your-owner-email@example.com';
```

Replace the placeholder with the owner account's actual email. Do not add it to this repository.

## Local authentication testing

Store test-account credentials only in the ignored `.env.local` file using `TEST_AUTH_EMAIL` and `TEST_AUTH_PASSWORD`. Do not place real credentials in tracked documentation, source code, commits, screenshots, or chat logs. A valid test verifies sign-in, `GET /api/auth/me`, sign-out, and that `GET /api/auth/me` then returns `401`.

## Core records

| Record | Responsibility |
|---|---|
| `profiles` | Links a Supabase user to their display information, role, and account status. |
| `loyalty_cards` | One current active card plus the customer's completed-card history. |
| `stamp_transactions` | Permanent ledger of every stamp addition, redemption, reversal, or manual adjustment. |
| `rewards` | Defines the reward attached to a completed card. |
| `redemptions` | Records when an earned reward was used. |

### Implemented core tables

Migration `004_loyalty_core.sql` creates the first two loyalty tables:

- `loyalty_cards` holds the current active card and every completed collectible card. Every profile receives card #1 automatically; only one card can be active for a customer.
- `stamp_transactions` is an append-only ledger. It stores the card, stamp change, transaction type, reason, issuing staff member, and timestamp. Transactions cannot be edited or deleted; corrections must be new reversal or manual-adjustment rows.

`GET /api/loyalty-card` returns the signed-in customer's active card and completed-card collection. It does not modify stamps.

Reward definitions and redemptions remain a later migration because the completed-card reward has not been chosen.

## Card lifecycle

1. A customer has one active card with 0–9 stamps.
2. A cashier-approved action adds a stamp transaction to that active card.
3. On the 10th stamp, the same database operation must mark the card `completed`, set its completion time, and create a new active card at 0 stamps.
4. The completed card remains permanently visible in the customer's collection.
5. Redeeming its reward changes its redemption status; it never deletes the completed card or its history.

Never let a card exceed 10 stamps. Never use a mutable balance as the only record of a customer's stamps; the transaction ledger is the source of truth.

## QR scan flow

```text
Customer opens virtual card
→ backend issues a signed, short-lived QR token
→ authenticated cashier scans it
→ protected backend endpoint validates token and staff role
→ one controlled stamp or redemption transaction is recorded
→ customer card balance and collection update
```

- QR data must not expose a raw customer ID, phone number, or other personal data.
- A scanned token must be short-lived and protected against replay or duplicate processing.
- The backend must record the customer, card, cashier, action, timestamp, and reason when applicable.
- A cashier must never be able to give themselves stamps or change account roles.

## Database access rules

- Enable Supabase Row Level Security on every app table exposed to clients.
- Customers can select only their own profile, cards, transactions, and redemptions.
- Customers cannot create stamp transactions, choose a role, or alter card status.
- Cashier/admin actions that change stamps or rewards go through protected server-side endpoints.
- The service-role key bypasses Row Level Security and is backend-only.

## Required safeguards

- Validate all input on the server.
- Use database transactions for the 10th-stamp completion flow and reward redemption.
- Make scan requests idempotent so refreshes or duplicate scans cannot issue extra stamps.
- Keep an audit trail for reversals and manual adjustments, including staff member and reason.
- Rate-limit sign-in and QR-scan endpoints.
- Do not log credentials, tokens, or complete phone numbers.

## Open decisions

- What reward is earned by a completed 10-stamp card?
- Can cashiers issue more than one stamp per scan or transaction?
- Who receives cashier versus admin access at launch?
- How long should a QR token remain valid?
- Will email confirmation remain enabled for customer sign-up, and what is the password-recovery process?
