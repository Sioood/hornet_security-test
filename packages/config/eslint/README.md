# @hornet_security-test/eslint

Shared ESLint flat-config for the monorepo.

## What it enforces

- TypeScript recommended rules via `typescript-eslint`.
- Import, JSONC, Markdown, and YAML linting.
- Oxlint rule parity by reading `.oxlintrc.json`.

## Usage

```ts
import eslint from '@hornet_security-test/eslint'

export default eslint({
  oxlint: true,
  typescript: true,
})
```

## Scripts

- `pnpm lint`: runs `oxlint` then `eslint`.
- `pnpm check-types`: type-checks config source.
- `pnpm format`: formats files with `oxfmt`.
- `pnpm format:check`: validates formatting with `oxfmt`.
