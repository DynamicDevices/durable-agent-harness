# Durable Agent Harness

Public lab note from **Dynamic Devices** on building a durable operating layer around AI coding agents.

**Live site:** <https://dynamicdevices.github.io/durable-agent-harness/>

## Why this exists

Frontier models are powerful and unreliable in the same breath. A *harness* — skills, rules, curated memory, signed patterns, and human gates — is how engineering work stays fast without becoming careless.

This repository is a **privacy-safe** map of one team’s journey since serious hands-on AI work began (2025-06-06): tenure clocks, the stack, a capability view, patterns worth stealing, and honesty about measurement.

## Explore

| Path | What |
|---|---|
| [`docs/`](docs/) | GitHub Pages site |
| [`content/`](content/) | Source JSON for the site (synced into `docs/content/`) |
| [`PRIVACY.md`](PRIVACY.md) | Publication bar — what must never ship |
| [`tests/`](tests/) | Playwright UX + rendered-text privacy checks |

## Develop

```bash
npm install
npx playwright install chromium
npm test          # privacy gate + Playwright (desktop + mobile)
npm run serve     # http://127.0.0.1:4173
```

Edit files under `content/`, then `npm run sync` (also run automatically by `npm run privacy`).

## What you will not find here

Private chats, family details, credentials, lab network data, client identities, or competitive product plans. See [`PRIVACY.md`](PRIVACY.md).

## License

Source and site content: [MIT](LICENSE).  
Dynamic Devices mark: retained by Dynamic Devices Ltd; used here for attribution on an official public lab note.
