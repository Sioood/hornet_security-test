# @hornet_security-test/eslint

Shared **ESLint flat config** for the monorepo (`eslint()` factory).

Parent context, conventions, and how the three config packages fit together: [../AGENTS.md](../AGENTS.md).

## This package only

- **Entry:** `index.ts` (consumed as `@hornet_security-test/eslint`)
- **Local config:** `eslint.config.ts` — used when linting this package’s own sources
- **Changes:** Prefer mirroring new rules in `@hornet_security-test/oxlint` first; use `eslint-plugin-oxlint` to avoid duplicate reports
- **Formatting:** oxfmt is the sole formatter. `eslint-config-prettier` (via `configs/prettier.ts`) disables ESLint stylistic rules that would conflict with oxfmt — it does not add the Prettier package
