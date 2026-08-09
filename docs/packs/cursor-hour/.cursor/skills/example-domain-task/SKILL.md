---
name: example-domain-task
description: >
  Load when the user asks to run the weekly status rollup for the project
  README (or rename triggers to your real recurring job).
---

# Example domain task

**Rename this skill** to match a job you actually do. Trigger nouns in the
description must match how you speak.

## When

Load this skill when the user asks to update the weekly status rollup. Do not
load for unrelated refactors or one-off bugs.

## Do

1. Confirm the target file (e.g. `README.md` or `STATUS.md`) before editing.
2. Gather only what changed since the last rollup (git log / open PRs).
3. Write a short bullet list: shipped · in flight · blocked.
4. Stop and ask before posting the rollup anywhere outside the repo.

## Proof of done

- [ ] File updated with today’s date
- [ ] Bullets match git history (no invented wins)
- [ ] Diff shown to the human before any external send

## Do not

- Declare victory on a plan alone
- Paste secrets into chat
- Expand into a different project without a handoff
