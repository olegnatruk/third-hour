# Third Hour — Agent Memory Guide

This repository is the shared workspace for Third Hour, a café project being built by its two founders with AI-agent support.

## Projects

- `website/` — Third Hour's public café website.
- `loyalty-card/` — The customer loyalty-card experience and supporting system.
- `loyalty-card/backend/` — Backend owned by the repository owner; protected from other agents' edits.
- `docs/` — The durable shared memory for people and AI agents.

## How agents should work here

1. Read `docs/README.md`, `docs/PRODUCT.md`, `docs/CONTEXT.md`, and `docs/DECISIONS.md` before proposing substantial work.
2. Treat documented decisions as current unless a founder explicitly changes them.
3. Ask before making a product, branding, pricing, data, or deployment decision that is not documented.
4. Keep the website and loyalty-card code independent unless a documented shared component is intentionally introduced.
5. Do not store passwords, API keys, customer data, or private personal details in this repository.

## Protected ownership boundary

`loyalty-card/backend/` is owned by the repository owner, who is responsible for the loyalty-card backend. Agents working for the other founder must **not create, edit, move, rename, or delete** anything in this directory unless the owner explicitly authorizes the exact change in the current conversation. They may read it only when necessary to understand an agreed integration, and must propose any backend change for approval instead of applying it.

## Keeping memory current

At the end of a meaningful planning or build session, add a concise entry to `docs/CONTEXT.md` covering:

- what was decided or changed;
- open questions and who needs to decide them;
- the next useful action.

Record durable product or technical choices in `docs/DECISIONS.md`. Keep entries factual, dated, and short. Do not write raw chat transcripts; capture only the context that will help the next person or agent continue confidently.

## Current known context

- Café name: **Third Hour**.
- Repository structure: a single monorepo with separate `website/` and `loyalty-card/` projects.
- The founders want this repository to serve as shared long-term context for their AI-assisted work.
