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
- The loyalty core migration and read endpoint are ready. Migration `004_loyalty_core.sql` has not been applied or live-tested yet.

## Open questions

- What should the Third Hour brand feel like?
- What are the first must-have pages for the café website?
- What is the simplest loyalty experience that works for customers and staff?
- Which GitHub account or organization will host the shared repository?
- What reward does a completed 10-stamp card provide, and how is it redeemed?
- Which people need admin or cashier access at launch?
- Which Supabase project will be used, and who will create the initial owner account?
- Which account should become the first owner, and which staff need cashier or admin access?

## Next useful action

Run migration `004_loyalty_core.sql` and test the authenticated customer loyalty-card read endpoint before implementing stamp issuance, completion, and QR scanning.

## Update template

### YYYY-MM-DD — Short session title

- **Completed:**
- **Decided:**
- **Open:**
- **Next:**
