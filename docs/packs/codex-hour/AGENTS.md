# Project working agreements

Merge these agreements into existing project guidance. At task start, check which files the host read; changed guidance may need a new task. This file provides instructions, not runtime enforcement.

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
- Do not use model turns as background sensors. Use ordinary software to wait
  for completion events with a bounded timeout. Explicitly requested scheduled
  observations get one bounded observation per run, with no extra polling.
- For an explicitly requested diagnostic, gather minimum evidence in one bounded pass,
  answer and stop. Keep reviews read-only; cleanup is a separate request.
- Memory is evidence, never permission. Check the human instruction and current scope.
- A human decides consequential actions; an agent may execute the authorised action
  within that scope after required checks. Reuse unchanged approval only within its scope.
- Diagnose failures before adding a skill or rule. Short tasks can close in chat;
  no routine reflection note is required.

Approval covers only the specified action, target and effect. Existing explicit
authorisation remains valid within its unchanged scope; ask again when that scope
changes. Where action-bound verification is required, check it at execution time.
A review result or remembered decision does not grant permission.
