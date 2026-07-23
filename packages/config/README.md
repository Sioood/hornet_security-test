# @hornet_security-test/config

Shared tooling configurations for the monorepo: TypeScript, ESLint, and Oxlint.

## Packages

### `@hornet_security-test/typescript`

Base TypeScript configuration preset.

```jsonc
// tsconfig.json
{ "extends": ["@hornet_security-test/typescript/base.json"] }
```

Key settings: strict mode, ESNext target, DOM lib, JSON modules, skip lib check.

### `@hornet_security-test/eslint`

Composable ESLint flat config factory.

```ts
// eslint.config.ts
import eslint from '@hornet_security-test/eslint'

export default eslint({
  typescript: true,
  vue: true,
  oxlint: resolve(__dirname, '.oxlintrc.json'),
  tsconfigRootDir: __dirname,
})
```

Includes: TypeScript rules, import-x, JSONC, Markdown, YAML, Vue, oxlint bridge.

### `@hornet_security-test/oxlint`

Shared Oxlint configuration.

```jsonc
// .oxlintrc.json
{ "extends": ["../../packages/config/oxlint/.oxlintrc.json"] }
```

Plugins: typescript, unicorn, oxc.
Key rules: `no-unused-vars` (with `_` ignore), `eqeqeq`, `no-explicit-any`, `no-array-for-each`.

## Adding Rules

1. Check if oxlint supports it (faster, native) → add to `@hornet_security-test/oxlint/.oxlintrc.json`
2. If ESLint-only, add to `@hornet_security-test/eslint/src/configs/<category>.ts`
3. Always ensure `eslint-plugin-oxlint` bridge prevents duplicate reports
