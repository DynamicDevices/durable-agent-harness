# Cursor hour starter pack

Drop-in files for a **thin durable harness** in about an hour.

Site: <https://chopwoodcarrywater.uk/#hour>  
Repo: <https://github.com/DynamicDevices/durable-agent-harness>

## Install (project-local)

1. Copy the `.cursor/` directory from this pack into your **project root**.
2. Copy `clocks.json` and `patterns/WORKING-PATTERNS.md` beside it (or into a `docs/harness/` folder you prefer — just keep them versioned).
3. Open the project in Cursor → **Developer: Reload Window** if rules/skills don’t appear.
4. Follow the timed checklist on the site (`#hour`), or `CHECKLIST.md` here offline.

## What’s inside

| Path | Role |
|---|---|
| `.cursor/rules/p0-no-secrets-in-chat.mdc` | Always-on: secrets never in chat — capture into Bitwarden (Password Manager / Secrets Manager) |
| `.cursor/rules/p0-human-gate-irreversible.mdc` | Always-on: human gate before irreversible send/publish |
| `.cursor/skills/example-domain-task/SKILL.md` | On-demand skill — **rename to your job** |
| `patterns/WORKING-PATTERNS.md` | Pattern registry with one signed-off starter row |
| `clocks.json` | Tenure clock stub — set `harness.start` today |
| `CHECKLIST.md` | Offline copy of the 60-minute path |

## Do not

- Paste API keys or passwords into chat “just this once”
- Add five always-on rules on day one
- Declare victory because the agent wrote a plan

Steal, rename, measure your own results.
