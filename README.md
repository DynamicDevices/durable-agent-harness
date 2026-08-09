# Durable Agent Harness

**Public engineering notebook** from [Dynamic Devices](https://www.dynamicdevices.co.uk/) on building a *durable working relationship* with AI coding agents — skills, rules, curated memory, signed patterns, and honest measurement.

🌐 **Site:** <https://dynamicdevices.github.io/durable-agent-harness/>  
📦 **Repo:** <https://github.com/DynamicDevices/durable-agent-harness>

## Why this exists

Most AI productivity stories are either hype or a single lab metric. This project shares the **method**: treat the harness like product, fail closed on irreversible actions, and measure **scope** (what became possible) instead of inventing multipliers.

It is intentionally **not** a dump of private chats, customer work, or lab credentials. See [PRIVACY.md](PRIVACY.md).

## Explore locally

```bash
npm install
npx playwright install chromium
npm test          # sync + privacy denylist + Playwright (desktop + mobile)
npm run serve     # http://127.0.0.1:4173
```

| Path | What |
|---|---|
| [`docs/`](docs/) | Static site (GitHub Pages) |
| [`content/`](content/) | Sanitized JSON source of truth |
| [`PRIVACY.md`](PRIVACY.md) | Publish boundary |
| [`scripts/privacy-check.sh`](scripts/privacy-check.sh) | Denylist gate |

## Three clocks (frozen starts)

| Clock | Start |
|---|---|
| Serious hands-on AI | 2025-06-06 |
| Cursor as cockpit | 2025-07-23 |
| Versioned harness | 2026-05-31 |

## Licence

MIT — see [LICENSE](LICENSE).

---

*Site and materials were AI-assisted (Cursor) under human direction at Dynamic Devices.*
