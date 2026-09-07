# DOGEBOT PACK shared deployment

This folder is the Vercel version of the DOGEBOT PACK website. It serves the read-only project guide with shared forum posts and moderated Meme Pool uploads through Supabase.

## Files

```text
.
├── index.html
├── styles.css
├── app.js
├── config.js
├── shared-backend.js
├── images/
├── api/
├── supabase.sql
├── vercel.json
└── .env.example
```

## Supabase setup

1. Create a Supabase project.
2. Open **SQL Editor** and run `supabase.sql`.
3. Keep the service-role key server-side only. Never put it in `config.js` or browser code.
4. Confirm the `dogebot-memes` storage bucket is public for approved image URLs.

## Vercel setup

1. Import this folder as a new Vercel project.
2. Add the variables from `.env.example` in the Vercel project settings for Production and Preview.
3. Deploy.
4. Open the site and verify that the forum count loads from the shared feed. If Supabase is unavailable, the page reports the feature as unavailable rather than displaying local or seeded content.

## Moderator API

Use the `MODERATOR_TOKEN` as a Bearer token. `GET /api/moderation` lists pending items. `POST /api/moderation` accepts JSON like:

```json
{"type":"meme","id":"uuid","action":"approve"}
```

Valid actions are `approve` and `reject`; valid types are `meme`, `post`, and `agent`.

## Behavior

- Forum posts are shared through `/api/forum` and still identify the author only with a random browser client id.
- Forum links, seed-phrase prompts, drainer language, and similar scam prompts are blocked server-side.
- Meme uploads accept PNG, JPG, GIF, and WEBP up to 1.5 MB, store files in Supabase Storage, and remain pending until moderation.
- Watchtower updates use `GET /api/agent-updates` for approved public entries and accept moderator-authenticated `POST` drafts for human review.
- The Trust Center states the read-only market policy, Bankr approval gate, safety rules, and live configuration state in the public UI.
- Pack Passport is currently an optional local browser profile for identity and notification preferences; cross-device magic-link login activates after Supabase Auth is connected.
- The local AI is project-knowledge-only. It does not call OpenAI, trade, buy, sell, deploy tokens, or distribute fees.
- The market panel remains read-only and uses the configured GeckoTerminal source.
