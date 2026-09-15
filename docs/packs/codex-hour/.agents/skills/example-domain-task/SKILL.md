---
name: example-domain-task
description: >
  Load when the user asks to run the weekly status rollup for the project
  README (or rename these triggers to your real recurring job).
---

# Example domain task

**Rename this skill** to match a job you actually do. Trigger nouns in the
description must match how you speak.

## When

Load this skill when the user asks to update the weekly status rollup. Do not
load it for unrelated refactors or one-off bugs.

## Do

1. Confirm the target file, such as `README.md` or `STATUS.md`.
2. Gather only what changed since the last rollup from evidence such as git
   history and open pull requests.
3. Write a short list: shipped · in flight · blocked.
4. Stop and ask before posting the rollup outside the repository.

## Proof of done

- [ ] File updated with today’s date
- [ ] Claims match the evidence; no invented wins
- [ ] Diff shown before any external send or publish

## Do not

- Declare victory on a plan alone
- Paste secrets into chat
- Expand into a different project without a handoff
