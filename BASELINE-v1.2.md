# v1.2 baseline (locked 2026-09-12)

This is the **token-disciplined Codex-first** baseline of the Chop Wood Carry
Water durable-agent notebook.

## What changed since v1.1

- The Codex starter pack says explicitly: do not use model turns as background
  sensors; an explicitly requested diagnostic gets one bounded evidence pass.
- Reviews and audits are read-only. Cleanup, archive, unload, or rewrite actions
  require a separate request.
- Token guidance separates current quota-window usage, cumulative task tokens,
  and cached-input volume instead of presenting them as one ledger.
- The signed `one-bounded-diagnostic-pass` pattern records the real failure that
  earned the rule.
- Harness Gauntlet includes token-discipline traces: an unrequested check fails;
  one requested bounded check passes.
- The Hansei note records the observed cost and the mechanism change without
  turning private transcripts or account data into public content.

## What stays locked

- First-person engineering notebook, not a SaaS or company brochure.
- Chop Wood Carry Water brand, Alex Lennon authorship and honest clocks.
- Human decisions at consequential boundaries; secrets never enter chat.
- Public claims are evidence-led and privacy-scrubbed.
- Content is CC BY-SA 4.0; code is MIT.
- Updates arrive through EOW Hansei when the week earned them; no filler.

## Proof

```bash
npm test
```

The Codex-first v1.1 baseline remains in [`BASELINE-v1.1.md`](BASELINE-v1.1.md).
