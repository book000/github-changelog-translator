# Copilot code review instructions

Read `AGENTS.md` at the repository root first; it is the source of truth for structure, commands and conventions.

## Language

Write review comments in Japanese, and expect all deliverables (code comments, JSDoc, docs, commit descriptions, PR text) in Japanese.
Runtime log and error messages are English.

## Review checklist

- No `any`, swallowed errors, or `skipLibCheck` workarounds.
- Feed fetch failures must throw; translation failures (non-200, network error, invalid or empty result) must keep the original text and warn, not abort the run.
- New environment variables need defaults or a required check; `GAS_URL` stays required and is never logged or committed.
- XML parser and builder must keep `ignoreAttributes: false`.
- Do not add an HTTP client dependency where native `fetch` is enough.
- Functions and interfaces keep accurate Japanese JSDoc.

## Do not flag

- No test framework, the single-file layout (`src/main.ts`), and Renovate dependency PRs are intentional.
- Formatting that Prettier or ESLint auto-fixes.
