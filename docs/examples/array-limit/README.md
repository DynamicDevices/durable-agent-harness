# When zero is a valid limit

Evergreen exercise. Reviewed 15th October 2026 (Node 24.21.0).

This deliberately small exercise was run for the guide. It is not a historical
project incident or a measurement of an assistant's performance.

## Reproduce it

You need Node.js 24; there are no npm dependencies, accounts or network calls.
After unzipping worked-example.zip, open a terminal in worked-example/.
For a repository clone use examples/array-limit/ instead.

```sh
node --version
node --test-reporter=tap test.cjs buggy
node --test-reporter=tap test.cjs attempt
node --test-reporter=tap test.cjs fixed
```

Run the three stage commands separately. The first two intentionally return exit 1;
this is expected, so do not join them with &&. The fixed stage returns exit 0.

## The problem

`take(items, limit)` returns a new array. Omitted or null limits default to three.
Zero means no items; a positive integer caps the result. In buggy.cjs, `limit || 3`
replaces zero with three. The zero test expects [] but receives oak, ash and elm.

The attempted correction in attempt.cjs moves the default to a variable using
`limit ? limit : 3`. That still treats zero as false. The same test still fails.
In fixed.cjs, `limit ?? 3` defaults only for null or undefined, preserving zero.
All three implementations and the identical six tests are in this folder.

Actual guide run on Node 24.21.0, 15th October 2026:

| Stage | Tests | Pass | Fail | Exit |
| --- | ---: | ---: | ---: | ---: |
| buggy | 6 | 5 | 1 | 1 |
| attempt | 6 | 5 | 1 | 1 |
| fixed | 6 | 6 | 0 | 0 |

The other checks cover omitted/null defaults, positive/large limits, empty input,
and preserving the input. Invalid limits such as strings, negative numbers and
fractions are outside this contract; real APIs need an explicit validation policy.
This does not test model behaviour, host permissions, production integration,
performance or security.

## Try it with an assistant

Ask: "Read test.cjs and buggy.cjs. Explain why zero fails, cite the relevant
lines and suggest a focused check. Do not edit files." Check the answer yourself.
Then, if you want to practise editing, explicitly ask for a local correction and
rerun the tests. A plausible explanation or rewrite is not passing evidence.
You can complete the exercise by hand; an assistant is optional.

## Continue (online)

- Readable guide: https://chopwoodcarrywater.uk/worked-example.html
- Setup: https://chopwoodcarrywater.uk/#hour
- Download checksums and manifests: https://chopwoodcarrywater.uk/downloads.html
- Feedback: https://chopwoodcarrywater.uk/feedback.html

If a step fails, include host/version, exact step, expected/actual result and a
link or file reference. Remove secrets and private project details first.

Content CC BY-SA 4.0; code MIT (see LICENSE.txt). (Briar helped draft this)
