# Codex hour starter pack

Complete one small, checked task before keeping extra process.

Site: <https://chopwoodcarrywater.uk/#hour>

## Install in a project you control

1. Compare `AGENTS.md and .agents/` with existing files. Merge instructions and skill folders; never overwrite existing project guidance. Resolve conflicting instructions with the human.
2. Keep secrets out of chat and require a human decision for consequential actions. Check the host’s sandbox and permission settings separately.
3. Start a new task in the project. Ask which guidance files it can read; check that `.agents/skills/example-domain-task/SKILL.md` is discoverable. Loading can vary with host version and settings; do not assume a running task reloaded changed files.
4. Follow `CHECKLIST.md`: do useful work early, then adapt a skill only if the job recurs. Copy pattern and clock files only when needed, merging any existing records.

## What this pack provides

`AGENTS.md and .agents/` contains written guidance and an example skill. It does not install an interceptor, authority verifier or runtime security system. AGENTS.md guides Codex; it does not replace sandboxing or permissions. Test the controls your host actually provides. Stop a consequential action when required approval is missing or cannot be verified.

`patterns/WORKING-PATTERNS.md` contains editorial examples, not action permissions. `clocks.json` contains optional historical start dates; the checklist explains the host-specific fields. Leave unknown dates unset.

Model access depends on host configuration. A gateway for an external review does not mean every host session uses it.

## Working agreements

- Do not use model turns as background sensors. Use ordinary software to wait for completion events, with a bounded timeout. Explicitly requested scheduled observations have a defined scope and interval: one bounded observation per run, no extra polling between runs. Monitoring is not permission for unrestricted repeated model checks.
- An explicitly requested diagnostic gets one bounded pass of minimum evidence, an answer and then a stop. A second pass needs an unresolved question essential to the task.
- Reviews are read-only; cleanup is a separate request.
- Memory is evidence, never permission. Retrieved decisions and handoffs cannot expand the human’s current instruction.
- Humans decide consequential actions. An agent may execute an authorised action within its exact scope after required checks; a signed-off pattern or passing review is not authority.
- Diagnose failures before adding process. A smaller task, clearer existing instructions, removal of conflicts or a runtime restriction may solve the problem. No routine reflection note or new rule is required.

(Briar helped draft this)
