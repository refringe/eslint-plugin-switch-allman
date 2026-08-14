# Copilot Instructions for eslint-plugin-switch-allman

## Project Summary

`eslint-plugin-switch-allman` is a single-rule ESLint plugin that enforces Allman-style braces for `switch` clauses: the opening brace of a `case` or `default` block must sit on its own line. The package is CommonJS, has no build step, no transpilation, and no runtime dependencies. ESLint is a peer dependency (`>=7.0.0`). The entire implementation is roughly 60 lines across two files.

## Build, Test, and Validate

**Runtime:** Node.js `^20.19.0 || ^22.13.0 || >=24` (see `engines` in `package.json`). **Linter:** ESLint 10 via `eslint.config.js`, which dogfoods this plugin's own rule.

Always run these commands from the repository root. `package.json` scripts are the single source of truth for all commands.

| Task | Command | Notes |
|---|---|---|
| Install deps | `npm ci` | Run first after cloning |
| Run tests | `npm test` | Runs `mocha tests/**/*.js` |
| Coverage | `npm run coverage` | Fails below 100% on any metric |
| Lint | `npm run lint` | Runs `eslint .` |
| Format check | `npm run format-check` | Fails if any JS/JSON/YAML file needs formatting |
| Format fix | `npm run format` | Runs `prettier --write` |
| Vulnerability scan | `npm run vulncheck` | Runs `npm audit --audit-level=moderate` |
| Full check | `npm run check` | Runs: format-check, lint, vulncheck, coverage |
| Single test file | `npx mocha tests/switch-allman.js` | |

**Always run `npm run format` before committing.** Always run `npm run check` to validate changes. If you add or remove dependencies, commit `package-lock.json` alongside `package.json` — CI rejects a lockfile that `npm ci` leaves dirty.

## CI Pipelines (GitHub Actions)

Five workflows run on every push/PR to `develop` and `main` (in `.github/workflows/`):

1. **Format** (`format.yml`): job `Prettier` (`npm run format-check`)
2. **Quality** (`quality.yml`): job `Lint` — lockfile-sync check, no-`file:`/`link:`-dependency check, `npm pack --dry-run`, `npm run lint`
3. **Tests** (`tests.yml`): jobs `Test` (matrix over Node 20, 22, 24) and `Coverage` (`npm run coverage`, uploads `coverage/` as an artifact)
4. **Vulnerability** (`vulnerability.yml`): job `Vulnerability Check` (`npm run vulncheck`)
5. **CodeQL** (`codeql.yml`): job `Analyse`, matrix over `actions` and `javascript-typescript`

A sixth workflow (`release.yml`) runs only on `v*.*.*` tags. It verifies the tag matches `package.json`, runs the tests, publishes to npm, and cuts a GitHub release with a changelog generated from `git log`.

Publishing uses npm trusted publishing (OIDC), not an `NPM_TOKEN` secret. The trust is registered on npmjs.com against this repository and the workflow filename `release.yml` — renaming that file breaks publishing until npm is updated to match, and the job must keep `id-token: write`. npm is upgraded before publishing because OIDC requires npm 11.5.1+ and `setup-node` ships npm 10.x. Provenance is attested automatically, so `--provenance` is not passed.

## Code Style Requirements

**UK English everywhere** in prose, comments, and workflow step names ("Initialise", "Analyse", "behaviour"). The exception is anything an external API fixes in American English — notably ESLint's own `meta.docs.category` values and existing rule message text.

**Formatting:** Prettier with `singleQuote: true`, `tabWidth: 4`, `printWidth: 80`, `trailingComma: "all"` (2-space for YAML). `.prettierignore` deliberately excludes `tests/`, `README.md`, and `package-lock.json`; do not format those.

**Conventions:**
- The rule uses `context.sourceCode || context.getSourceCode()`. Do not drop the fallback — the peer range includes ESLint 7–9, and ESLint 10 removed `getSourceCode()` entirely, so both halves are load-bearing.
- Match on `node.consequent[0].type === "BlockStatement"`. Never scan forward for the next `{` token; that historically matched object literals and later clauses' braces.
- Derive fix indentation from the clause line's leading whitespace, never from `indexOf("case")` — that returns `-1` on `default:`.

## Project Layout

```
lib/index.js                 Plugin entry; maps rule names to modules
lib/rules/switch-allman.js   The rule implementation
tests/switch-allman.js       RuleTester cases for the rule
tests/index.js               Plugin export shape and end-to-end Linter run
tests/compat.js              ESLint 7 context shim, covers the getSourceCode path
eslint.config.js             Self-lint config; enables this plugin's own rule
```

## Rule Naming

The plugin and the rule share the name `switch-allman`, so the user-facing rule id is the stuttering `switch-allman/switch-allman`. This is deliberate. The name appears in `lib/rules/switch-allman.js`, the key in `lib/index.js`, `tests/switch-allman.js`, `tests/index.js`, `eslint.config.js`, and `README.md`. Renaming means all six, and it breaks every consumer's config.

## Testing Requirements

Coverage is enforced at 100% on statements, branches, functions, and lines. If a branch is unreachable under the installed ESLint but required by the peer range, cover it with a context shim as `tests/compat.js` does — do not add a `c8 ignore` comment.

## Key Dependencies

The published package has **no runtime dependencies**. Development only:

- `eslint` — peer dependency and test harness (`RuleTester`, `Linter`)
- `mocha` — test runner
- `c8` — coverage with threshold enforcement
- `prettier` — formatting
- `@eslint/js`, `globals` — self-lint config

`package.json` carries `overrides` for `serialize-javascript` and `diff`. Both are transitive mocha dependencies with advisories that no mocha release resolves; drop the overrides once mocha's own ranges move past them.

## Trust These Instructions

These instructions are validated and accurate. Only perform additional codebase searches if the information here is incomplete or found to be incorrect during your work.
