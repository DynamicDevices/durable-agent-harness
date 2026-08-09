# Agents — get going

This notebook is for humans **and** coding agents. Do not invent policy from the blog.

**Disclaimer:** AI-assisted. Use at your own risk. Content [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/); code MIT — see [LICENSE](LICENSE).

## Start here (≈60 minutes)

1. Open the public path: <https://chopwoodcarrywater.uk/#hour>
2. Download the Cursor pack: <https://chopwoodcarrywater.uk/packs/cursor-hour-starter.zip>
   (or browse <https://chopwoodcarrywater.uk/packs/cursor-hour/>)
3. Copy the pack’s `.cursor/` into the **project** root. Reload the window.
4. Rename the example skill to the human’s real recurring job.
5. Keep both **Priority 0 (P0)** always-on rules — fail-closed, not optional:
   `no secrets in chat`, `human gate for irreversible`.
6. Sign off **one** pattern in `patterns/WORKING-PATTERNS.md` with a real failure line.
7. Set `harness.start` in `clocks.json` to today (ISO).
8. Run one real task with the skill’s proof checklist — not a plan alone.

Done when those eight are true. Then stop for the day.

## While you work

- Prefer skills/rules/patterns on disk over chat folklore.
- Fail closed on secrets and irreversible send/publish. Capture secrets via desktop dialog into **Bitwarden** (Password Manager for humans; **Bitwarden Secrets Manager** for machine tokens) — never into chat.
- Prefer **trash over hard delete**: move files to the OS/project trash so mistakes stay recoverable (not a third always-on P0 — still do it).
- Capture sparks for the public blog in [`blog-inbox.md`](blog-inbox.md) — do **not** publish the inbox. Promote at EOW or skip.
- Public site shape is locked at **v1.0** — see [`BASELINE.md`](BASELINE.md). Improve pack/notes at EOW; don’t casually rewrite the IA mid-week.

## Canonical URLs

| What | URL |
|---|---|
| Notebook | https://chopwoodcarrywater.uk/ |
| This page (HTML) | https://chopwoodcarrywater.uk/agents.html |
| 60-minute path | https://chopwoodcarrywater.uk/#hour |
| Pack zip | https://chopwoodcarrywater.uk/packs/cursor-hour-starter.zip |
| Repo | https://github.com/DynamicDevices/durable-agent-harness |
| Release | https://github.com/DynamicDevices/durable-agent-harness/releases/tag/v1.0.0 |
