<div align="center">
  <h1><b>Ställning</b></h1>
  <span><i>[ˈstɛlː.nɪŋ]</i>: meaning "scaffold" in swedish</span>

  <img alt="image" src="https://github.com/user-attachments/assets/8331cc84-2fcc-48f4-93ce-a35b7dead2ea" style="width: 100%" />
</div>

## About the Project

A production-ready Nuxt 4 monorepo boilerplate with best-in-class DX, testing, security, and code quality tooling. Use it as a foundation for building scalable applications.

## Tech Stack

| Layer         | Technology                                                           |
| ------------- | -------------------------------------------------------------------- |
| Framework     | Nuxt 4 (Vue 3, Nitro)                                                |
| Styling       | Tailwind CSS v4, CVA, tailwind-merge                                 |
| UI Primitives | Ark UI (`@ark-ui/vue`)                                               |
| Forms         | TanStack Form + Zod v4                                               |
| State         | Pinia + VueUse                                                       |
| i18n          | `@nuxtjs/i18n` (fr-FR default)                                       |
| Testing       | Vitest (unit/component/visual), Playwright (E2E), Stryker (mutation) |
| Code Quality  | ESLint, Oxlint, oxfmt, TypeScript strict, Knip                       |
| CI/CD         | GitHub Actions, Turborepo, Changesets                                |
| Security      | nuxt-security (CSP, CORS, rate limiting, SRI)                        |

## Monorepo Structure

```
.
├── apps/
│   └── web/                    # Main Nuxt application
├── packages/
│   ├── ui/                     # UI component library (Ark UI + CVA)
│   ├── nuxt-essentials/        # Shared Nuxt layer (i18n, security, PWA, SEO)
│   └── config/                 # Shared configs (eslint, oxlint, typescript)
├── .github/
│   ├── workflows/ci.yml        # CI pipeline
│   ├── workflows/release.yaml  # Changesets release
│   └── pull_request_template.md
├── turbo.json                  # Turborepo task config
├── pnpm-workspace.yaml         # Workspace + dependency catalog
└── .npmrc                      # Targeted hoisting (no shamefully-hoist)
```

## Prerequisites

| Tool    | Version   |
| ------- | --------- |
| Node.js | >= 25.8.0 |
| pnpm    | 10.33.0   |
| Git     | Latest    |

```bash
# Install pnpm
npm install -g pnpm

# Clone and install
git clone <repo-url>
cd hornet_security-test
pnpm install
```

## Available Scripts

### Root (Turborepo orchestrated)

| Script               | Description                    |
| -------------------- | ------------------------------ |
| `pnpm dev`           | Start all dev servers          |
| `pnpm build`         | Build all packages             |
| `pnpm test`          | Run all unit + component tests |
| `pnpm test:coverage` | Run tests with coverage report |
| `pnpm mutation`      | Run mutation testing (Stryker) |
| `pnpm lint`          | ESLint + Oxlint all packages   |
| `pnpm format`        | Format with oxfmt              |
| `pnpm format:check`  | Check formatting               |
| `pnpm check-types`   | TypeScript type checking       |
| `pnpm knip`          | Detect dead code/unused deps   |
| `pnpm changeset`     | Create a changeset             |

### Per-package (UI)

| Script                | Description                            |
| --------------------- | -------------------------------------- |
| `pnpm test:unit`      | Unit tests only                        |
| `pnpm test:component` | Component tests (Nuxt env)             |
| `pnpm test:visual`    | Visual regression (Playwright browser) |
| `pnpm mutation`       | Mutation testing on utils/composables  |
| `pnpm mutation:open`  | Mutation testing + open HTML report    |

### Per-package (Web)

| Script             | Description            |
| ------------------ | ---------------------- |
| `pnpm test:e2e`    | Playwright E2E tests   |
| `pnpm test:e2e:ui` | E2E with Playwright UI |

---

## Testing Strategy

### Unit Tests (Vitest)

Located in `test/**/*.test.ts`. Run in Node environment, fast and isolated.

```bash
pnpm test:unit
```

### Component Tests (Vitest + Nuxt)

Located in `test/**/*.component.test.ts`. Run with full Nuxt environment (auto-imports, plugins).

```bash
pnpm test:component
```

### Visual Regression Tests (Vitest Browser)

Located in `test/**/*.visual.test.ts`. Uses Playwright to render components in a real browser and compare screenshots.

```bash
pnpm test:visual
# Update baselines after intentional changes:
pnpm test:visual -- --update
```

**Example:**

```ts
import { test, afterEach } from 'vitest'

import Button from '~ui/app/components/Button.vue'
import { mountForVisual } from '~ui/test/visual/mount'
import { expectPngSnapshot } from '~ui/test/visual/png-snapshot'

let cleanup: (() => void) | undefined
afterEach(() => {
  cleanup?.()
  cleanup = undefined
})

test('Button default renders correctly', async () => {
  const { el, unmount } = mountForVisual(Button, {
    text: 'Click me',
    variant: 'default',
    intent: 'neutral',
    size: 'md',
  })
  cleanup = unmount

  await expectPngSnapshot({
    element: el.querySelector('button')!,
    filename: 'button-default-neutral.png',
    screenshotPathFromTestFile:
      './__screenshots__/button.visual.test.ts/button-default-neutral.png',
    specFolder: 'button.visual.test.ts',
  })
})
```

Screenshots live under `test/**/__screenshots__/<spec-file>/` (one folder per `*.visual.test.ts`) so baselines stay grouped and match `toMatchFileSnapshot` paths — commit them for CI regression.

### E2E Tests (Playwright)

Located in `apps/web/e2e/`. Full browser tests against a running app.

```bash
cd apps/web
pnpm test:e2e
```

### Mutation Testing (Stryker)

Validates test quality by introducing mutations into source code and verifying tests catch them. Uses **incremental mode** to only re-test changed code.

```bash
# Run mutation testing
pnpm mutation

# Run and open HTML report
pnpm mutation:open
```

**What gets mutated:**

- `app/utils/**/*.ts` (except `button-variants.ts`)
- `app/composables/**/*.ts`
- `i18n/utils/**/*.ts`

**What does NOT get mutated:**

- Vue components (template logic)
- Test files
- Type-only files

**Configuration (`stryker.config.mjs`):**

```js
export default {
  testRunner: 'vitest',
  incremental: true,
  incrementalFile: 'reports/stryker-incremental.json',
  mutate: ['app/utils/**/*.ts', 'app/composables/**/*.ts', '!app/utils/button-variants.ts'],
  thresholds: { high: 80, low: 60, break: null },
}
```

---

## Type Safety Patterns

### Discriminated Unions

All component entry types use discriminated unions with a `type` literal field:

```ts
interface MenuItem {
  type: 'item'
  label: string
  value: string
}
interface MenuSeparator {
  type: 'separator'
}
interface MenuCheckbox {
  type: 'checkbox'
  label: string
  checked: boolean
}

type MenuEntry = MenuItem | MenuSeparator | MenuCheckbox
```

### `assertNever` — Exhaustive Switch Guard

Located at `packages/ui/app/utils/assert-never.ts`. Guarantees all union members are handled at compile time:

```ts
import { assertNever } from '~ui/app/utils/assert-never'

function handleEntry(entry: MenuEntry) {
  switch (entry.type) {
    case 'item':
      return renderItem(entry)
    case 'separator':
      return renderSeparator(entry)
    case 'checkbox':
      return renderCheckbox(entry)
    default:
      // TS error if a new type is added but not handled
      assertNever(entry)
  }
}
```

If you add a new type to the union without handling it, TypeScript will produce a compile error at `assertNever(entry)`.

---

## Security

### CSP, CORS & Headers (nuxt-security)

Configured in `packages/nuxt-essentials/nuxt.config.ts`. In **production**:

- **CSP**: Strict nonce-based `script-src`, no `unsafe-eval`
- **SRI**: Subresource Integrity for all scripts/styles
- **HSTS**: 1 year + preload + includeSubdomains
- **CORS**: Origin from `NUXT_PUBLIC_SITE_URL` env var
- **Rate Limiting**: 100 requests / 5 min per IP
- **X-Frame-Options**: DENY (clickjacking protection)
- **Permissions-Policy**: Camera/mic/geolocation blocked

In **development**, CSP/CORS/rate-limiting are disabled to allow Nuxt DevTools and HMR to work without friction.

### Supply Chain Protection

- **`minimumReleaseAge: 1440`** in `pnpm-workspace.yaml` — blocks packages published less than 24h ago
- **`pnpm audit --audit-level=high`** runs on every `git push` (husky pre-push hook)
- **Targeted hoisting** (`.npmrc`) instead of `shamefully-hoist` — strict dependency resolution

### Overriding Security in Consuming Apps

```ts
// apps/web/nuxt.config.ts
export default defineNuxtConfig({
  security: {
    headers: {
      contentSecurityPolicy: {
        'img-src': ["'self'", 'https://cdn.example.com'],
        'connect-src': ["'self'", 'https://api.example.com'],
      },
    },
    corsHandler: {
      origin: 'https://myapp.com',
    },
  },
})
```

---

## Code Quality

### Git Hooks (Husky)

| Hook       | Action                                        |
| ---------- | --------------------------------------------- |
| pre-commit | lint-staged (oxlint + eslint + oxfmt)         |
| pre-push   | `git fetch` + `pnpm audit --audit-level=high` |
| commit-msg | commitlint (conventional commits)             |

### Commit Convention

```
<type>(<scope>): <description>

# Types: build, chore, ci, docs, feat, fix, perf, refactor, revert, style, test
# Scopes: global, config, docs, nuxt-essentials, ui, web
```

### Dead Code Detection (Knip)

```bash
pnpm knip        # Report unused exports, files, deps
pnpm knip:fix    # Auto-remove fixable dead code
```

---

## Dependency Management

### pnpm Catalog

All shared dependency versions are centralized in `pnpm-workspace.yaml`:

```yaml
catalog:
  vue: ^3.5.32
  nuxt: ^4.4.2
  vitest: ^3.2.4
  zod: ^4.3.6
  # ... etc
```

Use `catalog:` in individual `package.json` files:

```json
{
  "dependencies": {
    "vue": "catalog:",
    "zod": "catalog:"
  }
}
```

### Updating Dependencies

```bash
pnpm deps:check:minor   # Check for minor updates
pnpm deps:check:major   # Check for major updates
```

---

## Internationalization (i18n)

### Adding Translations

Translation files live in `i18n/locales/<locale>/`. Use the coverage CLI to find missing keys:

```bash
pnpm i18n:coverage              # Show coverage per locale
pnpm i18n:coverage:namespace    # Show coverage per namespace
```

### Zod Locale Sync

Zod error messages are automatically synced with the active i18n locale via `applyZodLocaleFromI18n()` in `packages/ui/app/utils/zod-locale.ts`.

---

## Component Development (UI Package)

### Creating a New Component

1. Create `packages/ui/app/components/MyComponent.vue`
2. Add an example in `packages/ui/app/compodium/examples/UI/MyComponentExample.vue`
3. Add a test in `packages/ui/test/components/MyComponent.component.test.ts`
4. Use CVA for variant styling:

```ts
import { cva } from 'class-variance-authority'

const myComponentCVA = cva('base-classes', {
  variants: {
    intent: {
      neutral: 'text-neutral-text-default',
      primary: 'text-primary-text-default',
    },
    size: {
      sm: 'px-2 py-1 txt-caption',
      md: 'px-3 py-1.5 txt-label',
    },
  },
})
```

### Styling Rules

- Tailwind classes must be **full strings** (no string interpolation/concatenation)
- Use `cn()` for conditional class merging
- Use CVA `variants` for component variants, not template conditionals

---

## CI/CD Pipeline

### GitHub Actions (ci.yml)

```
check job:
  ├── pnpm install --frozen-lockfile
  ├── check-types
  ├── lint (eslint + oxlint)
  ├── format:check
  ├── build
  ├── knip (dead code)
  └── test (unit + component)

e2e job (after check):
  ├── pnpm install --frozen-lockfile
  ├── install Playwright browsers
  └── test:e2e
```

### Releases (Changesets)

```bash
pnpm changeset                  # Create a changeset
# Merge PR to main → release workflow auto-tags
```

---

## PR Workflow

Every PR uses the template at `.github/pull_request_template.md` with:

- Summary section
- Type of change checkboxes
- Breaking changes section
- Testing checklist (unit/component/E2E/mutation/visual)
- Review checklist (types/a11y/perf/security/i18n)

---

## Recommended Extensions

Install from `.vscode/.code-workspace` — search `@recommended` in the Extensions tab.

---

## Evolution

This boilerplate evolves continuously. Open an issue for feedback or suggestions.
# hornet_security-test
# hornet_security-test
