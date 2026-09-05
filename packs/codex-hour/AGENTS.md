# Project working agreements

Keep this file short. Codex reads it before project work.

## Fail-closed boundaries

- Never ask for, paste, echo, or commit passwords, API tokens, private keys, or
  similar secrets. Use an approved local secret store or capture flow and
  report only success or failure.
- Before sending, publishing, destroying non-temporary data, spending money,
  or making an equivalent consequential write, show the exact target and
  effect and wait for explicit human approval for that action.

## How to work

- Load a matching project skill from `.agents/skills/` when one exists.
- Define the proof of done before implementation and report the evidence.
- Preserve unrelated user changes and keep one writer per working tree.
- Prefer recoverable changes; move material files to trash instead of hard
  deleting them when practical.
- If the same failure repeats, propose a small skill or working-pattern change.
  Do not silently add cross-cutting policy.
