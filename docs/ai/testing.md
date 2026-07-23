# Testing Guide

Guide for writing tests in the HornetSecurityTest monorepo: unit, component, visual regression, and mutation testing.

## Test Types

| Type      | File pattern                  | Environment        | Command               |
| --------- | ----------------------------- | ------------------ | --------------------- |
| Unit      | `test/**/*.test.ts`           | Node               | `pnpm test:unit`      |
| Component | `test/**/*.component.test.ts` | Nuxt (happy-dom)   | `pnpm test:component` |
| Visual    | `test/**/*.visual.test.ts`    | Playwright browser | `pnpm test:visual`    |
| E2E       | `e2e/**/*.spec.ts`            | Playwright         | `pnpm test:e2e`       |

## Unit Test Template

For pure functions (utils, composables logic). Runs in Node — no DOM, no auto-imports.

```ts
import { describe, expect, it } from 'vitest'

import { cn } from '~ui/app/utils/cn'

describe('cn', () => {
  it('merges class strings', () => {
    expect(cn('a', false && 'b', 'c')).toBe('a c')
  })

  it('drops falsy entries', () => {
    expect(cn('px-2', undefined, 'py-1')).toBe('px-2 py-1')
  })
})
```

**Key rules:**

- Import explicitly (no auto-imports in test files)
- In `packages/ui` tests, prefer relative imports from `test/` to `app/`; in docs and repo-wide snippets, `~ui/...` matches how ESLint resolves imports from the monorepo root
- Test edge cases: empty strings, undefined, null, boundary values
- No DOM APIs available

## Component Test Template

For Vue component rendering + interaction. Runs in Nuxt environment with auto-imports.

```ts
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'

import MyComponent from '~ui/app/components/MyComponent.vue'

describe('MyComponent', () => {
  it('renders with default props', async () => {
    const wrapper = await mountSuspended(MyComponent, {
      props: { intent: 'primary', size: 'md' },
    })
    expect(wrapper.text()).toContain('expected text')
  })

  it('emits events on interaction', async () => {
    const wrapper = await mountSuspended(MyComponent, {
      props: {
        /* ... */
      },
    })
    await wrapper.find('button').trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
  })

  it('applies ui slot classes', async () => {
    const wrapper = await mountSuspended(MyComponent, {
      props: { ui: { root: 'custom-class' } },
    })
    expect(wrapper.find('[data-part="root"]').classes()).toContain('custom-class')
  })
})
```

**Key rules:**

- Use `mountSuspended` (not `mount`) — supports async Nuxt components
- Import components via `~ui/app/components/...`
- Query Ark UI elements via `[data-part="..."]` selectors
- Use `document.body.querySelector(...)` for teleported content
- `extendCompodiumMeta` is auto-stubbed (via vitest config)
- Add `await nextTick()` + `await flushPromises()` for async state changes

**Known limitations (happy-dom):**

- `<Teleport :disabled>` causes `subTree` null errors — don't test portalled content directly
- Ark UI async state (open/close) may need extra tick cycles

## Visual Regression Test Template

For screenshot comparisons in a real browser. Runs with Playwright via `@vitest/browser`.

Use `expectPngSnapshot` from `packages/ui/test/visual/png-snapshot.ts`: it writes **binary PNGs** on `vitest -u` and compares base64 to the file on disk otherwise. Do **not** pass screenshot base64 to `toMatchFileSnapshot` — Vitest stores that as plain text, so `.png` files look “corrupted” in image viewers.

```ts
import { test } from 'vitest'

import { expectPngSnapshot } from '~ui/test/visual/png-snapshot'

test('component renders correctly', async () => {
  const el = document.querySelector('[data-testid="target"]')!
  await expectPngSnapshot({
    element: el,
    filename: 'component-name.png',
    screenshotPathFromTestFile: './__screenshots__/my-component.visual.test.ts/component-name.png',
    specFolder: 'my-component.visual.test.ts',
  })
})
```

**Key rules:**

- Prefer mounting real components (see `packages/ui/test/visual/`) with Tailwind
- Apply the same classes the production component uses when using raw HTML smoke tests
- One test per visual state (default, hover, disabled, each intent)
- Run `pnpm test:visual -- --update` to regenerate baselines
- Screenshots stored in `test/visual/__screenshots__/<spec-file>/` (match the `*.visual.test.ts` basename)

## Mutation Testing (Stryker)

Validates test quality by introducing mutations and verifying tests catch them.

**What gets mutated (logic only):**

- `app/utils/**/*.ts` (except `button-variants.ts`)
- `app/composables/**/*.ts`
- `i18n/utils/**/*.ts`

**What does NOT get mutated:**

- Vue components (`.vue` files)
- Test files
- Type declaration files (`.d.ts`)
- CVA variant definitions (no logic to mutate)

**Commands:**

```bash
pnpm mutation        # Incremental (uses cache, fast)
pnpm mutation:open   # Same + opens HTML report
```

**When to run:**

- After adding/modifying logic in utils or composables
- Before PR merge for critical business logic
- NOT needed for template/styling changes

**Interpreting results:**

- Survived mutants = your tests don't catch that change = weak test
- Killed mutants = tests properly detect the bug = good
- Timeout = mutation caused infinite loop = acceptable
- Target: 80%+ kill rate on critical logic

## Test File Location

Mirror source structure:

```
app/utils/cn.ts           → test/utils/cn.test.ts
app/composables/useX.ts   → test/composables/useX.test.ts
app/components/Button.vue → test/components/Button.component.test.ts
test/visual/              → visual regression tests (flat)
```

## Common Patterns

### Testing discriminated unions with assertNever

```ts
it('handles all union members', () => {
  type Action = { type: 'add' } | { type: 'remove' }

  function handle(a: Action) {
    switch (a.type) {
      case 'add':
        return 'added'
      case 'remove':
        return 'removed'
      default:
        assertNever(a)
    }
  }

  expect(handle({ type: 'add' })).toBe('added')
  expect(handle({ type: 'remove' })).toBe('removed')
  expect(() => handle({ type: 'unknown' } as never)).toThrow()
})
```

### Testing composables

```ts
import { describe, expect, it } from 'vitest'

import { pick } from '~ui/app/utils/object'

describe('pick', () => {
  it('selects listed keys', () => {
    expect(pick({ a: 1, b: 2, c: 3 }, ['a', 'c'])).toEqual({ a: 1, c: 3 })
  })
})
```
