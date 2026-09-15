# Codex hour starter pack

Drop-in files for a **thin durable working relationship** with Codex in about
an hour.

Site: <https://chopwoodcarrywater.uk/#hour>  
Repo: <https://github.com/DynamicDevices/durable-agent-harness>

## Install (project-local)

1. Copy `AGENTS.md` and the `.agents/` directory into your **project root**.
2. Copy `clocks.json` and `patterns/WORKING-PATTERNS.md` beside them (or into a
   versioned `docs/harness/` folder).
3. Start a new Codex task in the project. Codex reads `AGENTS.md` at task start
   and discovers project skills under `.agents/skills/`.
4. Follow `CHECKLIST.md` here or the timed path on the site.

## What’s inside

| Path | Role |
|---|---|
| `AGENTS.md` | Two fail-closed boundaries plus proof-first and bounded-diagnostic working agreements |
| `.agents/skills/example-domain-task/SKILL.md` | On-demand Agent Skill — **rename to your job** |
| `patterns/WORKING-PATTERNS.md` | Pattern registry with signed-off examples |
| `clocks.json` | Tenure clock stub — set `harness.start` today |
| `CHECKLIST.md` | Offline copy of the 60-minute path |

The skill format follows the open Agent Skills standard and is portable across
supporting hosts. `AGENTS.md` is Codex project guidance, not a substitute for
Codex sandboxing, permission settings, or a human decision at the point of an
irreversible action.

## Do not

- Paste API keys or passwords into chat “just this once”
- Turn `AGENTS.md` into an essay paid on every task
- Use model turns for unrequested polling or repeated quick checks
- Let a read-only audit perform cleanup
- Treat worktree isolation as permission for two agents to edit the same tree
- Declare victory because the agent wrote a plan

Steal, rename, run one real task, and measure your own results.
