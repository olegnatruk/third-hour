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

## Customer identity

- Customers register and sign in through Supabase Auth with an internationally formatted mobile number and password.
- The first release intentionally has no SMS verification or OTP login.
- Passwords are never stored in an application table or logged.
- Password recovery and phone-number-change handling remain open product decisions.

## Core records

| Record | Responsibility |
|---|---|
| `profiles` | Links a Supabase user to their display information, role, and account status. |
| `loyalty_cards` | One current active card plus the customer's completed-card history. |
| `stamp_transactions` | Permanent ledger of every stamp addition, redemption, reversal, or manual adjustment. |
| `rewards` | Defines the reward attached to a completed card. |
| `redemptions` | Records when an earned reward was used. |

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
- What is the customer account-recovery process without SMS verification or OTPs?
