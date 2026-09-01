# Canvas API scripts

Small standalone, **read-only** utilities for exploring a Canvas LMS account.
No dependencies, no build step — Node 24 runs the `.ts` files directly.

## Setup

```bash
cp canvas/.local.env.example canvas/.local.env
# then edit canvas/.local.env and paste your Canvas access token
```

`canvas/.local.env` is gitignored. Never commit it.

Create a token in Canvas: **Account → Settings → New Access Token**.

## Usage

List your favourite (starred) courses so you can pick one:

```bash
node canvas/list-favorites.ts
```

Scan modules 1–3 of a course (use an id from the list above):

```bash
node canvas/scan-modules.ts <courseId>
```

## Notes

- Both scripts only issue `GET` requests. Nothing is created or modified in Canvas.
- If a token was ever pasted into a chat or shared, rotate it: delete it in
  **Account → Settings** and generate a new one.
