# UltraPlanForOfficialAI-PRD

Workspace for collaboratively drafting a product PRD using `/ultraplan`, then handing the finalized PRD off to an executor agent (Codex + gstack + browser-use harness) for one-shot implementation.

## Workflow

1. Draft PRD here in `PRD.md` via `/ultraplan` (cloud planning session, inline-comment review).
2. Iterate in browser until the PRD is exhaustive.
3. Hand finalized `PRD.md` to the executor agent with:
   - Repo loaded for context
   - [gstack](https://github.com/garrytan/gstack) skill files installed
   - [browser-harness](https://github.com/browser-use/browser-harness) for end-to-end QA
4. Executor produces a one-shot implementation; QA loop validates against PRD.

## Status

- [ ] Product idea defined
- [ ] PRD drafted via ultraplan
- [ ] PRD finalized
- [ ] Handed off to executor
