# Inspirit OS

The AI crew that runs Inspirit Clothing Co while Chris drives.

## Phase 2 — Foundation + Sage + Nova

**Live crew:**
- Sage — Chief of Staff (chat with her on The Bridge)
- Nova — Creative Director (drafts queued for review)

**Coming next:**
- Grace (CX), Riley (Social), Marcus (CFO), Atlas (Growth), Pax (Ops), Echo (Night Shift)

## Stack

- Cloudflare Workers — API
- Cloudflare KV — memory + queue + analytics
- Workers AI (Llama 3.1 8B) — free tier
- Static HTML dashboard — GitHub Pages

**Cost: $0/month** until serious volume.

## Files

- `src/worker.js` — Cloudflare Worker (Sage + Nova + analytics)
- `index.html` — The Bridge dashboard
- `wrangler.toml` — Cloudflare config
- `package.json` — Wrangler dep
