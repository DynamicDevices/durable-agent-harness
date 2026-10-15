# Start in 60 minutes (Cursor)

Start with a small piece of work in a project you control. Use Codex or Cursor; the packs share the same boundaries but use different project paths.

## 5 min - Choose a small task and your host

Download the Codex or Cursor pack. Start with a read-only job: explain one failing test, naming the file, likely cause and one way to check it.

Check: A task with a clear finish, and the selected pack unpacked beside the project.

## 10 min - Merge guidance and check the boundaries

Codex: merge AGENTS.md and .agents/ into the project root. Cursor: merge .cursor/rules/ and .cursor/skills/. Compare conflicts before changing existing files. Keep secrets out of chat; agree the exact scope before consequential actions. Start a new task and ask which guidance and skill paths it can read. Check host permissions separately.

Check: You can distinguish the instructions it read from controls the host actually enforces.

## 20 min - Do useful work

Run the small task now. For example: “Read this failing test and its implementation. Explain the likely cause and suggest a focused check. Do not edit files.” Require file references and the limits of the diagnosis.

Check: A useful answer checked against the source, with no unrequested edits.

## 10 min - Adapt a skill if the job will recur

Codex: edit .agents/skills/example-domain-task/SKILL.md. Cursor: edit .cursor/skills/example-domain-task/SKILL.md. Rename it for your recurring job, with matching triggers and proof of done. Try that job with the skill.

Check: The skill describes your job and its result can be checked. Skip it for a one-off task.

## 5 min - Record a pattern only if there is a lesson

Read patterns/WORKING-PATTERNS.md. Codex examples include one-writer-per-tree and one-bounded-diagnostic-pass; Cursor examples include lean-tool-sessions and trash-instead-of-hard-delete. Keep or adapt one only if it matches an observed problem. A signed-off row records editorial agreement, not permission to execute an action.

Check: Any retained pattern names a real problem; otherwise leave it proposed.

## 5 min - Set dates if you want to track tenure

Both packs have clocks.json: set harness.start to today. The Codex pack also has codex.start: use the first day you used Codex on real project work, or leave it unset if unknown. Do not add a Codex date to the Cursor stub.

Check: Any dates you keep are honest; clocks are optional records.

## 5 min - Finish with the result

Report what you found or changed, how you checked it and anything unresolved. If something failed, diagnose the mechanism before adding a rule: a smaller task, clearer instruction or runtime restriction may help. Review later only when requested or an observed problem warrants it.

Check: One checked result. No routine reflection note or calendar appointment required.

Done when:

- Existing project instructions preserved and selected host paths checked
- Secrets boundary understood; human decisions and host enforcement kept separate
- One useful task completed with evidence and limits
- Any skill, pattern or dates retained serve a real need
