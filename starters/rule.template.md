---
description: >-
  Requestable — short fail-closed constraint. Promote to always-on only if
  breaking it causes real harm every session.
alwaysApply: false
---

# Cursor rule template

Save this as `.cursor/rules/<name>.mdc`. `alwaysApply: false` makes this
requestable Cursor guidance, not runtime enforcement. Codex readers should use
concise project `AGENTS.md` instructions and configure native permissions
separately; copying Cursor metadata does not configure Codex.

Agents must <HARD CONSTRAINT>.

## Why

<One sentence: the incident or waste this prevents.>

## Check

Before <ACTION>, verify <CONDITION>. If unclear, ask the human.
