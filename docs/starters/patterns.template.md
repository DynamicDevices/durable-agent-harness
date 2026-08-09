# Working patterns registry

Statuses: `proposed` | `signed-off` | `deprecated`

| Pattern | Status | Problem (short) |
|---------|--------|-----------------|
| `lean-tool-sessions` | proposed | Optional tools loaded every turn burn context |
| `fail-closed-outbound` | proposed | Agents send/publish without a visible referent |
| `proof-class-over-vibes` | proposed | Confidence outruns tests/logs/hardware |

## Lifecycle

1. Propose with a real failure story.
2. Human signs off (or amends / drops).
3. Encode into a skill/rule where agents will load it.
4. Apply on matching work.
5. Review periodically; deprecate without guilt.
