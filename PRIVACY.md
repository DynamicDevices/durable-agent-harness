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
- Public research citations (e.g. METR productivity RCT)
- Sanitized capability classes (“remote board debug with an agent”) without site specifics
- Lessons about measurement honesty and harness tax

## Before every push

```bash
npm test
```

`npm test` syncs content, runs the denylist privacy gate, then Playwright UX checks.

## Controllers / contact

Published by **Dynamic Devices Ltd** as engineering education material.  
Questions: `ajlennon@dynamicdevices.co.uk` (work mailbox).
