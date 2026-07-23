# @hornet_security-test/ui

## Context

The design system and UI component library for HornetSecurityTest. Built as a **Nuxt layer** that extends `@hornet_security-test/nuxt-essentials`. It provides all reusable UI components, styling infrastructure, and form utilities.

## Architecture

- **Type:** Nuxt 4 layer (consumed via `extends` in nuxt.config)
- **Headless primitives:** Ark UI (`@ark-ui/vue`) — provides accessible, unstyled component logic
- **Styling:** Tailwind CSS v4 + CVA (class-variance-authority) + tailwind-merge
- **Forms:** TanStack Form (`@tanstack/vue-form`) + Zod v4 validation
- **Icons:** `@nuxt/icon` with Tabler icon set (`tabler:*`)
- **Images:** `@nuxt/image` with AVIF/WebP auto-format, responsive breakpoints
- **Docs/Playground:** Compodium (`@compodium/nuxt`)

### Component Pattern

Every component follows this structure:

```text
<script setup lang="ts">
// 1. Ark UI headless import (Root + RootProvider + UseXxxReturn)
// 2. CVA variant definitions (inline, not external file unless shared)
// 3. UI slots interface (for class customization)
// 4. Props interface (extends Ark RootBaseProps + RootProviderBaseProps)
//    - includes optional `value?: UseXxxReturn` for RootProvider mode
// 5. defineModel for two-way bindings
// 6. withDefaults(defineProps<...>())
// 7. isProvider + rootComponent computed
// 8. rootProps computed (switches between Root and RootProvider props)
// 9. extendCompodiumMeta (playground defaults)
</script>

<template>
  <!-- <component :is="rootComponent"> switches between Root and RootProvider -->
  <!-- Ark primitives with cn() for class merging -->
</template>
```

### Root vs RootProvider

Every Ark-based component accepts an optional `:value` prop (the return of `useXxx()`). When present, the component uses `Ark.RootProvider`; otherwise it uses `Ark.Root`.

| Mode           | When to use                                                                                            |
| -------------- | ------------------------------------------------------------------------------------------------------ |
| Root (default) | Component owns its state; use `v-model`                                                                |
| RootProvider   | You need imperative control (`api.open()`, `api.setValue()`), cross-component sync, or full API access |

```vue
<!-- Root mode — simple and self-contained -->
<UIAccordion v-model="expanded" collapsible />

<!-- RootProvider mode — external control -->
<script setup lang="ts">
const accordion = useAccordion({ multiple: true })
</script>
<UIButton @click="accordion.setValue(['panel-1', 'panel-2'])">Expand All</UIButton>
<UIAccordion :value="accordion" />
```

Components supporting RootProvider: `UIAccordion`, `UICollapsible`, `UIPopover`, `UISwitch`, `UITooltip`, `UIMenu`, `UIToggleGroup`, `UIProgress`, `UIProgressCircular`, `UIQRCode`, `UIFormSelect`.
Not supported (no Ark hook): `UIToggle`, `UIToast`.

### Key Directories

```
app/
├── assets/css/main.css    -- Tailwind theme, tokens, typography
├── components/            -- All UI components (auto-imported with 'UI' prefix)
│   ├── Button.vue         -- Flat file for simple components
│   ├── Form/              -- Feature folder with index.vue entry
│   │   ├── index.vue      -- Main form component
│   │   ├── schema.ts      -- Type definitions for form schema
│   │   ├── Field.vue      -- Field wrapper
│   │   └── BoundControl.vue
│   ├── Menu/              -- Complex component with sub-parts
│   └── Toggle/
├── composables/           -- Shared hooks
│   ├── useComponentIcons.ts  -- Icon state machine (loading/success/error)
│   ├── useSchemaForm.ts      -- TanStack Form + Zod preset
│   └── useToast.ts           -- Toast notification system
├── plugins/               -- Nuxt plugins
├── utils/                 -- Pure utility functions
│   ├── ark.ts             -- splitArkAttrs: strips ui/custom keys before forwarding to Ark
│   ├── assert-never.ts    -- Exhaustive switch guard for discriminated unions
│   ├── cn.ts              -- tailwind-merge + Vue normalizeClass
│   ├── button-variants.ts -- Shared CVA variants for Button/Toggle/Menu trigger
│   ├── object.ts          -- pick/omit helpers
│   ├── zod-locale.ts      -- Zod error messages synced with i18n locale
│   └── form-field-errors.ts
└── compodium/examples/    -- Playground examples (excluded from tests/coverage)

test/
├── composables/           -- Unit + component tests for hooks
├── utils/                 -- Unit tests for pure functions
├── components/            -- Component render tests
└── visual/                -- Visual regression tests (Playwright browser)
```

## Design System Rules

### Color System

Use semantic tokens — NEVER raw color values:

- `primary-fill`, `primary-on-fill`
- `neutral-fill-subtle`, `neutral-text`, `neutral-border-subtle`
- `secondary-*`, `accent-*` for alternative intents

### Intent System

All interactive components support `intent` variants:

- `neutral` (default) — standard UI elements
- `primary` — call-to-action, emphasis
- `secondary` — alternative actions
- `accent` — special highlights

### Typography

Use typography utilities defined in CSS: `txt-h1`, `txt-h2`, `txt-h3`, `txt-base`, `txt-label`, `txt-caption`

### Spacing & Sizing

Follow Tailwind's spacing scale. Components use consistent sizes:

- `sm` — compact UI (menus, tags)
- `md` — default (buttons, inputs)
- `lg` — emphasis (hero actions)

## Conventions

### Component Naming

- All components auto-registered with `UI` prefix: `UIButton`, `UIMenu`, `UIFormInput`
- Feature folders use `index.vue` as entry point
- Sub-components are internal (consumed by parent, not directly by apps)

### Styling

- **Tokens:** Semantic color tokens in `main.css` (`primary-fill`, `neutral-text-muted`, etc.). Regenerate role tokens from Figma export via `pnpm generate:tokens`.
- **CVA:** Define variants inline in the component unless shared (like `buttonVariants`)
- **`cn()` helper:** Always use for class merging — handles Vue reactive classes + tailwind-merge
- **`ui` prop:** Every component accepts an optional `ui` prop for slot-level class overrides
- **Full strings only:** Tailwind needs complete class names (no dynamic interpolation)

### Props Pattern

- Extend Ark UI base props: `interface XxxProps extends ArkXxxRootBaseProps, Omit<ArkXxxRootProviderBaseProps, 'value'> { ... }`
- Include `value?: UseXxxReturn` for RootProvider mode (default `undefined`)
- Use `defineModel` for open/pressed/checked/value state
- Use `withDefaults` for all optional props (always include `value: undefined`)
- Type class overrides as `ClassValue` (from Vue)

### Transparent Emit Forwarding

Wrappers do NOT declare Ark emits. Events flow through `$attrs` to the inner root:

```vue
<UIAccordion
  @value-change="(d) => console.log('valueChange', d)"
  @focus-change="(d) => console.log('focusChange', d)"
/>
```

This requires `defineOptions({ inheritAttrs: false })` + `v-bind="arkAttrs"` on the Ark root.
Use `splitArkAttrs(useAttrs())` from `@/utils/ark` to strip `ui` before forwarding.

### Context Hooks

Three ways to read component state, in increasing "reach":

| Mechanism                | How                                                           | When                                                               |
| ------------------------ | ------------------------------------------------------------- | ------------------------------------------------------------------ |
| Slot props               | `#content="{ popover }"`                                      | Inline inside a named slot of `UIPopover` / `UITooltip` / `UIMenu` |
| `UIXxxContext` component | `<UIAccordionContext v-slot="ctx">`                           | Inline inside `UIAccordion` default slot                           |
| `useXxxContext()`        | `import { useAccordionContext } from '@ark-ui/vue/accordion'` | Descendant _component_ that can't use slot props                   |

### Type Safety

- Use discriminated unions for all entry/variant types (see `MenuListEntry`)
- Add `assertNever` in switch default branches for compile-time exhaustive checks
- Export `*Strict` versions of unions when all members must have an explicit `type` field

### Icons

- Icon set: Tabler (`tabler:*`)
- State icons: `useComponentIcons` composable handles loading/success/warning/error states
- Default size: `1rem` (configured in `nuxt.config`)

### Images

- Use `<NuxtImg>` instead of raw `<img>` for automatic optimization
- Formats: AVIF → WebP → original (auto-negotiated)
- Quality: 80% default
- Responsive: Breakpoints at 320/640/768/1024/1280/1536px

### Forms

- Schema-first: Define Zod schema → pass to `useSchemaForm` or `<UIForm>`
- Layout-driven: `layout` prop defines field arrangement (single key or array for rows)
- Field configs map component + validators per field name
- Server errors: Use `applyServerFieldErrors` after HTTP 422

## Dos

- Use Ark UI primitives for interactive components (accessibility built-in)
- Export component interfaces from `<script setup>` for type reuse
- Add `extendCompodiumMeta` with representative defaults for the playground
- Write unit tests for utils/composables, component tests for interactive behavior
- Use `<Teleport :disabled>` for conditional portal rendering (not createReusableTemplate)
- Run `pnpm mutation` to validate test quality for new utils/composables
- Use `<NuxtImg>` with explicit width/height for CLS prevention
- Check [VueUse](https://vueuse.org/functions.html) before implementing DOM/reactivity utilities in composables or helpers

## Don'ts

- Don't create components without Ark UI if an equivalent primitive exists (plain Vue + TanStack is fine for tables/datagrids)
- Don't use inline styles — always Tailwind utilities or CVA
- Don't use `!important` in Tailwind (use specificity or `cn()` override)
- Under `app/`, prefer `@/` (Nuxt aliases it to the `app/` directory). Use `~ui/` when you need the package root (e.g. `~ui/app/...` from configs, or paths outside `app/`)
- Don't test compodium examples — they're documentation, not production code
- Don't use raw hex/rgb colors — use semantic tokens
- Don't create new intent colors without updating ALL components
- Don't reimplement debounce, `addEventListener` cleanup, or scroll observers when a VueUse composable exists

## Testing Strategy

- **Unit tests** (`test/**/*.test.ts`): Pure functions and composable logic in Node env
- **Component tests** (`test/**/*.component.test.ts`): Mount with `@nuxt/test-utils`, happy-dom
- **Visual regression** (`test/**/*.visual.test.ts`): Playwright browser screenshots with tolerance
- **Mutation testing** (Stryker): Validates utils/composables test quality, incremental mode
- **Coverage thresholds:** 75% lines, 65% branches, enforced per directory
- **Setup:** `extendCompodiumMeta` is stubbed, `requestAnimationFrame` polyfilled for happy-dom

## Common Pitfalls

- `extendCompodiumMeta` is a Nuxt-provided global — tests must stub it via Vitest overrides
- Ark UI components use `data-[state=...]` attributes for styling hooks (not classes)
- `buttonVariants` is shared across Button, Toggle, and Menu trigger — changes affect all three
- The `cn()` function uses Vue's `normalizeClass` to handle array/object class values before tailwind-merge
- Compodium is excluded in Vitest mode (`VITEST=true`) to avoid module conflicts
- `<Teleport>` in happy-dom causes `subTree` null errors — avoid testing portalled content directly
- Visual tests need `pnpm test:visual` (separate from `pnpm test` which only runs unit+component)
