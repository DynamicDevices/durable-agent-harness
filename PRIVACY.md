# Privacy & disclosure boundary

This repository is **public on purpose**. It describes *methods* for working with AI coding agents. It must not become a dump of private life, customer work, or lab credentials.

## Never publish here

- Personal contact details, family information, or private messaging content
- Customer names, deal terms, invoices, or confidential bid material
- Internal hostnames, IP addresses, SSH details, tokens, or secret store layout
- Screenshots or exports that contain the above
- Private repository contents from `cursor-config` or similar allowlisted trees
- Anything you would not put on a conference slide

## Safe to publish

- High-level timelines (when serious AI / Cursor / harness practice started)
- Abstract architecture (skills, rules, memory, signed patterns)
- Public product/method names for channels (e.g. WhatsApp, Briar) without JIDs, allowlists, or transcripts
- Token-lean and lightweight-skill methods (no private paths or keys)
- Public research citations (e.g. METR productivity RCT)
- Sanitized capability classes (“remote board debug with an agent”) without site specifics
- Lessons about measurement honesty and harness tax

## Before every push

```bash
npm test
```

`npm test` syncs content, runs the privacy gate, then Playwright UX checks.

The full denylist is **not stored in this public repo** (that would publish the
sensitive strings). Maintainers keep it in a private local path and can point
`DENYLIST_FILE` at it. CI still applies generic token/IP/phone gates.

## Controllers / contact

Published by **Alex Lennon** under the **Chop Wood Carry Water** brand.  
Questions: `ajlennon@dynamicdevices.co.uk` (work mailbox).
