# Contributing to eslint-plugin-switch-allman

Thank you for your interest in contributing!

## Getting Started

1. Fork the repository and clone your fork
2. Install Node.js 20.19+, 22.13+, or 24+
3. Install dependencies: `npm ci`
4. Run the tests: `npm test`

## Development

### Running checks

Before submitting a PR, run the full check suite:

```bash
npm run check
```

This runs: format check, linter, vulnerability scan, and tests with coverage.

### Individual commands

```bash
npm run format        # Format code
npm run format-check  # Fail if any file needs formatting
npm test              # Run the test suite
npm run coverage      # Run tests and enforce 100% coverage
npm run lint          # Run ESLint over this repository
npm run vulncheck     # Run npm audit
```

### Running a single test file

```bash
npx mocha tests/switch-allman.js
```

## Rule Changes

The rule lives in `lib/rules/switch-allman.js` and is registered in `lib/index.js`.

- Every change to the rule needs matching `RuleTester` cases in `tests/switch-allman.js`
- Coverage is enforced at 100% on statements, branches, functions, and lines
- The plugin supports ESLint 7 and later, so avoid APIs that do not exist across that
  range. `tests/compat.js` exercises the older `context.getSourceCode()` path

## Pull Requests

- One concern per PR
- Write tests for new functionality
- Run `npm run check` before submitting
- Follow existing code style (run `npm run format`)
- Fill out the PR template

## Issues

- Use the bug report template for bugs
- Use the feature request template for suggestions
- Look for issues labeled `good first issue` or `help wanted`

## Bug Reports

Please include:
- A minimal code sample that reproduces the problem
- Expected vs actual behaviour
- Plugin version and ESLint version
- Your ESLint configuration
