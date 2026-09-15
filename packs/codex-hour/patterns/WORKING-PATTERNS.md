# Working patterns registry

Statuses: `proposed` | `signed-off` | `deprecated`

| Pattern | Status | Problem (short) |
|---|---|---|
| `skills-portable-host-specific-policy` | signed-off | Host migration duplicated procedures and let copies drift |
| `one-writer-per-tree` | signed-off | Parallel agents editing one tree caused races and lost work |
| `one-bounded-diagnostic-pass` | signed-off | Repeated quick checks rented the growing model context after the human asked them to stop |
| `proof-class-over-vibes` | proposed | Confidence outruns tests, logs, and hardware |

## Lifecycle

1. Observe a real failure.
2. Propose a small change.
3. Human signs off, amends, or drops it.
4. Encode it in the skill, guidance, or sensor that will load next time.
5. Apply it, then review: keep, amend, retire.

## Signed-off notes

### skills-portable-host-specific-policy

Keep job procedures in portable Agent Skills where possible. Keep host-specific
instruction and permission mechanics in their native files. Project and verify
shared skills; never maintain two hand-edited canonical copies.

### one-writer-per-tree

Parallel tasks need separate worktrees or explicit file ownership. Isolation
reduces collisions; it does not remove the need to name who owns each tree.

### one-bounded-diagnostic-pass

When a human explicitly requests a diagnostic, batch the minimum evidence into
one bounded pass, answer from it, and stop. Do not use model turns as background
sensors. A second pass needs a real unresolved blocker; cleanup remains a
separate request from review.
