# Privacy & publication bar

This repository is **public on purpose**. Everything here must remain safe if
a stranger, a journalist, or a competitor opens it.

## Never publish here

- Personal contact details (phone, messaging IDs, home addresses, family names)
- Private chat exports, transcripts, or quoted private messages
- Credentials, tokens, API keys, SSH details, lab or home network addresses
- Client identities, deal terms, dispute material, or competitive product plans
- Internal assistant policy that exists to stop harm (send gates, allowlists, abuse-response playbooks)
- Photos or media of identifiable private individuals

## What we *do* publish

- Conceptual description of a durable agent **harness** (skills, rules, memory, patterns)
- Calendar milestones that are already appropriate for a public engineering narrative
- Aggregates (e.g. “dozens of skills”) without dumping private skill trees
- Links to **public** research and **public** open-source demos
- Lessons about measurement integrity (felt speed ≠ measured speed)

## Controllers & contact

Published by **Dynamic Devices Ltd** (England & Wales) as an engineering lab note.  
Questions: use the GitHub issue tracker on this repository.

## Redaction check

Before every push that changes `docs/` or `content/`:

```bash
npm run privacy
```

The check fails closed on denylisted patterns (see `content/denylist.txt`).
