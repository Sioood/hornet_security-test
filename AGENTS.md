# HornetSecurityTest Monorepo

## Context

HornetSecurityTest is a **pnpm workspace monorepo** orchestrated with **Turborepo**. It contains a Nuxt 4 web application built on top of a layered architecture where each package extends the previous one.

## Architecture

```
apps/web          -> extends packages/ui
packages/ui       -> extends packages/nuxt-essentials
packages/nuxt-essentials  -> base Nuxt layer (modules, i18n, PWA, security)
packages/config/* -> shared eslint, oxlint, typescript configs
```

### Dependency Graph

- `@hornet_security-test/web` depends on `@hornet_security-test/ui` (runtime) + `@hornet_security-test/nuxt-essentials` (dev, for i18n CLI)
- `@hornet_security-test/ui` depends on `@hornet_security-test/nuxt-essentials` (runtime)
- All packages use `@hornet_security-test/eslint`, `@hornet_security-test/oxlint`, `@hornet_security-test/typescript` for tooling

### Key Technologies

- **Runtime:** Nuxt 4, Vue 3, Pinia, VueUse, Ark UI, TanStack Form, Zod v4
- **Styling:** Tailwind CSS v4 (Vite plugin), CVA (class-variance-authority), tailwind-merge
- **Tooling:** pnpm 10.33+, Turborepo, ESLint (flat config), oxlint, oxfmt, Vitest, Playwright
- **Testing:** Vitest (unit/component/visual), Playwright (E2E), Stryker (mutation)
- **CI/CD:** GitHub Actions, Changesets for versioning
- **Security:** nuxt-security (CSP, CORS, rate limiting, SRI) — disabled in dev
- **Node:** >= 25.8.0

## Conventions

### Package Management

- All shared dependency versions live in `pnpm-workspace.yaml` catalog — use `"catalog:"` in package.json
- Use `workspace:*` for internal runtime deps, `workspace:^` for internal dev deps
- Never add a dependency without checking if it already exists in the catalog
- `.npmrc` uses **targeted hoisting** (`public-hoist-pattern`) — NOT `shamefully-hoist`
- `minimumReleaseAge: 1440` blocks packages published less than 24h ago (supply chain protection)

### Code Style

- **Formatter:** oxfmt (NOT the Prettier npm package) — configured in `.oxfmtrc.json`. ESLint uses `eslint-config-prettier` only to turn off stylistic rules that overlap with oxfmt
- **Linting:** oxlint + ESLint (flat config via `@hornet_security-test/eslint`)
- **TypeScript:** Strict mode, no `any` (use `unknown`), no unused vars (prefix with `_`)
- **Vue:** `<script setup lang="ts">` always, props via `defineProps` + `withDefaults`
- **Imports:** Nuxt auto-imports are available in `app/` directories; explicit imports in utility files

### Type Safety Patterns

- **Discriminated unions:** All variant types use a literal `type` field for exhaustive matching
- **`assertNever`:** Use in switch `default` branch to guarantee compile-time exhaustiveness
- **No `any`:** Use `unknown` for untyped boundaries, then narrow with Zod `.parse()`

### Commit Messages

Conventional commits enforced by commitlint:

- Types: `feat`, `fix`, `refactor`, `perf`, `test`, `docs`, `chore`, `ci`, `build`, `style`, `revert`
- Scopes: `global`, `config`, `docs`, `nuxt-essentials`, `ui`, `web`
- Max header: 100 chars

### File Structure

- Apps live in `apps/`
- Packages live in `packages/` (or `packages/config/` for tooling)
- Each Nuxt package uses the `app/` directory convention (Nuxt 4)
- Components: `app/components/`, Composables: `app/composables/`, Utils: `app/utils/`
- Tests: `test/` at package root, mirroring source structure
- i18n: `i18n/locales/{locale}/` with YAML/JSON translation files

## Dos

- Run `pnpm install` at root after adding dependencies
- Use `turbo` for running tasks across packages (`pnpm lint`, `pnpm build`, `pnpm test`)
- Keep component types exported from the component SFC `<script setup>` block
- Use `defineModel` for two-way bindings
- Use iterative approaches (explicit stack) instead of recursion
- Use optional chaining (`?.`) instead of redundant null checks
- Use `assertNever` in switch statements over discriminated unions
- Run `pnpm mutation` after adding critical logic to validate test quality

## Don'ts

- Don't use `any` — prefer `unknown` if type is unclear
- Don't leave commented-out code or unused variables
- Don't create abstractions unless they reduce duplication
- Don't use Prettier (use oxfmt)
- Don't add deps without catalog entry
- Don't bypass lint-staged/husky hooks without justification
- Don't use `npm` or `yarn` — this is a pnpm-only repo
- Don't dynamically generate Tailwind classes (full strings only)

## Testing Strategy

- **Unit tests:** Vitest in Node environment for pure logic (utils, composables)
- **Component tests:** Vitest + `@nuxt/test-utils` + happy-dom for Vue components
- **Visual regression:** Vitest Browser + Playwright for screenshot comparisons
- **Mutation testing:** Stryker (incremental) on utils/composables only
- **E2E:** Playwright against built app (`pnpm build && pnpm preview`)
- Coverage thresholds: 75% lines/statements, 65% branches

## Security

- `nuxt-security` is **disabled in dev** (`enabled: !isDev`) to allow DevTools
- In production: strict CSP (nonce-based), CORS, HSTS, rate limiting, SRI
- `pnpm audit --audit-level=high` runs on every `git push` (husky pre-push)
- Override security config per-route in consuming apps via `routeRules`

## Guides

Detailed implementation guides for common workflows:

- [Component Development](docs/ai/component-development.md) — plain Vue + CVA components (no Ark UI)
- [Ark UI Components](docs/ai/ark-ui-components.md) — interactive components built on Ark UI (Root/RootProvider pattern, controlled state, attr forwarding, pitfalls)
- [Testing](docs/ai/testing.md) — unit, component, visual regression, and mutation testing

## Common Pitfalls

- Nuxt auto-imports only work inside `app/` directories — utility files outside need explicit imports
- The `~ui` and `~nuxt-essentials` aliases resolve to package roots
- `.npmrc` uses targeted `public-hoist-pattern` — add new patterns if a dep can't be resolved
- Tailwind needs full class strings (no dynamic interpolation like `bg-${color}-500`)
- `extendCompodiumMeta` is a global provided by Nuxt plugin — stub it in tests
- Security headers only apply in production (`NODE_ENV=production`)
