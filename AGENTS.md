# Repository Guidelines

## Project Structure & Module Organization
The genetic engine lives in `src/`, with the public surface gathered in `src/index.js`. Primary implementations follow the `*.class.js` suffix, while shared bases reside in `src/bases/`, data pools in `src/pools/`, and low-level helpers in `src/structures/`, `src/utils/`, and `src/devtools/`. Reinforcement-learning helpers sit in `src/rl/`. Build artifacts go to `dist/`, Jest output to `coverage/`, and long-form references stay in `docs/`. Keep tests inside `test/`, mirroring the `src/` layout so maintainers can jump between behavior and verification quickly.

## Build, Test, and Development Commands
Use the npm scripts to keep tooling consistent:
```bash
npm run build
npm test
npm run benchmark:quick
npm run benchmark:full
```
`npm run build` bundles the library with Rollup into `dist/`. `npm test` runs Jest with ESM support and writes coverage reports. Benchmark scripts execute the performance harness; reach for `benchmark:quick` before pushing and reserve `benchmark:full` for pre-release validation.

## Coding Style & Naming Conventions
Code is ESM-first, two-space indented, and intentionally semicolon-free. Prefer single quotes except when importing NPM packages, and stick to descriptive class names (`Brain`, `Genome`) that match their filenames (`brain.class.js`, `genome.class.js`). Group exports through `src/index.js` so downstream bundlers benefit from tree-shaking. If introducing tooling, align configurations with the existing Rollup setup and lodash-es usage.

## Testing Guidelines
Author new specs under `test/` using `*.test.js` filenames aligned with their subject modules. Keep assertions deterministic and document any randomized behavior through seeded utilities. Run `npm test` locally before submitting changes and inspect `coverage/lcov-report/index.html` to ensure new code paths are exercised. Bug fixes should ship with regression tests covering the scenario.

## Commit & Pull Request Guidelines
History follows a lightweight Conventional Commit style (`feat:`, `fix:`) interleaved with release tags (for example, `2.3.0`). Write concise messages describing observable outcomes. Pull requests should summarize intent, call out breaking changes, and list validation steps (tests, benchmarks). Link relevant issues, note new configuration inputs, and attach screenshots or coverage snippets when updating docs or performance-critical flows.

## Benchmarks & Performance
Performance is a core KPI. When altering evolutionary loops, matrix operations, or pooling strategies, capture benchmark data. Record the command (`npm run benchmark:quick` or `npm run benchmark:full`), Node version, and hardware summary in the PR description so reviewers can reproduce regressions or wins.
