# Working patterns registry

Statuses: `proposed` | `signed-off` | `deprecated`

| Pattern | Status | Problem (short) |
|---------|--------|-----------------|
| `lean-tool-sessions` | signed-off | Optional tools left always-on burn context every turn |
| `trash-instead-of-hard-delete` | signed-off | Hard delete (rm) makes wrong-path mistakes unrecoverable |
| `fail-closed-outbound` | proposed | Agents send/publish without a visible referent |
| `proof-class-over-vibes` | proposed | Confidence outruns tests/logs/hardware |

## Lifecycle

1. Propose with a real failure story.
2. Human signs off (or amends / drops).
3. Encode into a skill/rule where agents will load it.
4. Apply on matching work.
5. Review periodically; deprecate without guilt.

## Signed-off notes

### lean-tool-sessions

Enable specialty tools only for the job. When the job ends, unload. Reloading
the window is cheaper than carrying last week’s server forever.

### trash-instead-of-hard-delete

When removing project files, move them to the OS trash or a project trash
folder first. Recover if wrong; empty trash only as a separate, deliberate
step. Prefer this over `rm` for workspace data.
