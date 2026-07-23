# Ark UI Component Implementation Guide

Guide for implementing interactive components in `@hornet_security-test/ui` using Ark UI primitives.

**Reference implementation:** `Dialog/index.vue` — study it before creating any new Ark component.

---

## Root vs RootProvider Pattern

Every Ark UI component operates in one of two modes.

### Root mode (default)

The Ark machine is created internally. The component owns its state; use `v-model` to read/write it.

**Use Root when:**

- The component is self-contained and `v-model` is sufficient
- You don't need imperative methods (`open()`, `setValue()`, etc.)
- No cross-component coordination is needed

```vue
<!-- Uncontrolled (Ark manages state internally) -->
<UIAccordion collapsible default-value="panel-1">…</UIAccordion>

<!-- Controlled (Vue owns the state via v-model) -->
<UIAccordion v-model="expanded" collapsible>…</UIAccordion>
```

### RootProvider mode

You call `useXxx()` outside the component and pass the returned API via `:value`. The component is purely presentational.

**Use RootProvider when:**

- You need imperative methods (`accordion.setValue(…)`, `popover.open()`)
- Two or more components must share a single Ark machine
- You need access to the full Ark API object from outside the component tree

```vue
<script setup lang="ts">
import { useAccordion } from '@ark-ui/vue/accordion'

const accordion = useAccordion({ multiple: true, collapsible: true })
</script>

<template>
  <UIButton @click="accordion.setValue(['panel-1', 'panel-2'])">Expand All</UIButton>
  <UIAccordion :value="accordion">
    <UIAccordionItem value="panel-1">…</UIAccordionItem>
    <UIAccordionItem value="panel-2">…</UIAccordionItem>
  </UIAccordion>
</template>
```

**Anti-pattern:** never use RootProvider just to bind a value — use `v-model` instead.

### Components that support RootProvider

| Component                           | Hook                                                 |
| ----------------------------------- | ---------------------------------------------------- |
| `UIAccordion`                       | `useAccordion()` from `@ark-ui/vue/accordion`        |
| `UICollapsible`                     | `useCollapsible()` from `@ark-ui/vue/collapsible`    |
| `UIDialog`                          | `useDialog()` from `@ark-ui/vue/dialog`              |
| `UIMenu`                            | `useMenu()` from `@ark-ui/vue/menu`                  |
| `UIPopover`                         | `usePopover()` from `@ark-ui/vue/popover`            |
| `UIPagination` / `UIPaginationRoot` | `usePagination()` from `@ark-ui/vue/pagination`      |
| `UIProgress` / `UIProgressCircular` | `useProgress()` from `@ark-ui/vue/progress`          |
| `UIQRCode`                          | `useQrCode()` from `@ark-ui/vue/qr-code`             |
| `UISegmentGroup`                    | `useSegmentGroup()` from `@ark-ui/vue/segment-group` |
| `UIFormSelect`                      | `useSelect()` from `@ark-ui/vue/select`              |
| `UIFormDatePicker`                  | `useDatePicker()` from `@ark-ui/vue/date-picker`     |
| `UISteps` / `UIStepsRoot`           | `useSteps()` from `@ark-ui/vue/steps`                |
| `UISwitch`                          | `useSwitch()` from `@ark-ui/vue/switch`              |
| `UITabs`                            | `useTabs()` from `@ark-ui/vue/tabs`                  |
| `UITooltip`                         | `useTooltip()` from `@ark-ui/vue/tooltip`            |
| `UIToggleGroup`                     | `useToggleGroup()` from `@ark-ui/vue/toggle-group`   |

`UIToggle` and `UIToast` do NOT have RootProvider mode (Ark provides no `useToggle` or `useToaster`).

---

## Canonical Implementation Pattern

Every Ark UI wrapper follows this exact structure. Deviating from it causes subtle reactivity bugs.

```vue
<script setup lang="ts">
import {
  MyComponent as ArkMyComponent,
  type MyComponentRootBaseProps as ArkMyComponentRootBaseProps,
  type MyComponentRootProviderBaseProps as ArkMyComponentRootProviderBaseProps,
  type UseMyComponentReturn,
} from '@ark-ui/vue/my-component'

import type { ClassValue } from 'vue'

// 1. Disable automatic attr inheritance — we forward attrs manually.
defineOptions({ inheritAttrs: false })

export interface UIMyComponentSlots {
  root?: ClassValue
}

// 2. Props extend BOTH Root and RootProvider base props (minus 'value').
//    Add value?: UseMyComponentReturn for the RootProvider mode toggle.
export interface MyComponentProps
  extends ArkMyComponentRootBaseProps, Omit<ArkMyComponentRootProviderBaseProps, 'value'> {
  value?: UseMyComponentReturn['value']
  intent?: MyComponentIntent
  size?: MyComponentSize
  ui?: Partial<UIMyComponentSlots>
}

// 3. Always default value to undefined.
const props = withDefaults(defineProps<MyComponentProps>(), {
  intent: 'neutral',
  size: 'md',
  value: undefined,
  ui: undefined,
})

// 4. Declare models for controlled state.
const modelValue = defineModel<string>()
// or: const open = defineModel<boolean>('open', { default: false })

const attrs = useAttrs()

// 5. Provide chrome context for sub-components.
provide(myComponentChromeKey, {
  intent: computed(() => props.intent),
  size: computed(() => props.size),
})

// 6. Mode detection — purely from the value prop.
const isProvider = computed(() => props.value !== undefined)
const rootComponent = computed(() =>
  isProvider.value ? ArkMyComponent.RootProvider : ArkMyComponent.Root,
)

// 7. Ark-safe attrs — strips 'ui' and other wrapper-only keys.
const arkAttrs = computed(() => splitArkAttrs(attrs))

// 8. rootProps — pick ONLY the props valid for each mode.
//    Verify the full prop list against the Ark MCP: get_component_props
const rootProps = computed(() => {
  if (isProvider.value) {
    // RootProvider accepts: value + lazyMount + unmountOnExit (if supported by this component)
    return pick(props, ['asChild', 'lazyMount', 'unmountOnExit', 'value'] as const)
  }
  // Root mode: pick every Ark Root prop EXCEPT modelValue/value (handled in rootBindings).
  return pick(props, [
    'asChild',
    'defaultValue', // uncontrolled initial value — keep in pick even when using modelValue
    'disabled',
    'id',
    'ids',
    'orientation',
    'translations',
    // …all other Ark Root props for this component
  ] as const)
})

// 9. rootBindings merges everything into one object for v-bind.
const rootBindings = computed(() => {
  const base: Record<string, unknown> = {
    ...rootProps.value,
    ...arkAttrs.value,
    // class: always merge CVA + user's class attr + ui override
    class: cn(
      myComponentCVA({ intent: props.intent, size: props.size }),
      arkAttrs.value.class as ClassValue,
      props.ui?.root,
    ),
  }

  // 10. Controlled binding — ONLY when a model value is actually provided.
  //     Passing modelValue: undefined would lock Ark in "controlled-undefined" mode,
  //     causing clicks/interactions to visually freeze.
  if (!isProvider.value && modelValue.value !== undefined) {
    base.modelValue = modelValue.value
    base['onUpdate:modelValue'] = (next: string) => {
      modelValue.value = next
    }
  }

  return base
})
</script>

<template>
  <!-- v-bind="rootBindings" — single source of truth for all Ark props -->
  <component :is="rootComponent" v-bind="rootBindings">
    <slot />
  </component>
</template>
```

---

## Critical Rules

### Rule 1 — Never use `defaultValue` for controlled state

`defaultValue` is only read once by the Ark machine at mount. Using it to bind a `v-model` means external model changes are silently ignored.

```ts
// ❌ WRONG — controlled state breaks: changing modelValue externally has no effect
if (!isProvider.value) {
  base.defaultValue = modelValue.value
  base.onValueChange = (d) => {
    modelValue.value = d.value
  }
}

// ✅ CORRECT — use modelValue + onUpdate:modelValue
if (!isProvider.value && modelValue.value !== undefined) {
  base.modelValue = modelValue.value
  base['onUpdate:modelValue'] = (next: string) => {
    modelValue.value = next
  }
}
```

`defaultValue` **stays** in the `rootProps` pick for Root mode — it is valid for uncontrolled initialization when no `v-model` is bound.

### Rule 2 — Guard with `!== undefined` before binding the model

When `defineModel<string>()` has no parent `v-model` binding, its value is `undefined`.
Passing `modelValue: undefined` explicitly puts Ark into **controlled mode with no value** — every click fires an update but the undefined is written back immediately, freezing the component.

```ts
// ❌ WRONG — unconditional binding freezes uncontrolled usage
if (!isProvider.value) {
  base.modelValue = modelValue.value // could be undefined!
  base['onUpdate:modelValue'] = (next: string) => {
    modelValue.value = next
  }
}

// ✅ CORRECT — guard prevents controlled-undefined lock
if (!isProvider.value && modelValue.value !== undefined) {
  base.modelValue = modelValue.value
  base['onUpdate:modelValue'] = (next: string) => {
    modelValue.value = next
  }
}
```

This means:

- **No `v-model` bound** → `modelValue.value` is `undefined` → guard fails → Ark is in uncontrolled mode → clicking works normally
- **`v-model` bound with a value** → guard passes → controlled mode → two-way sync works

### Rule 3 — Always merge `arkAttrs.value.class` in `cn()`

When a consumer passes a `class` attribute to your component, it lands in `arkAttrs`. If you spread `...arkAttrs.value` into `base` but then set `class:` explicitly at the end, the arkAttrs `class` is overridden without being merged.

```
// ❌ WRONG — consumer's class is silently dropped
class: cn(myRootCVA({ intent, size }), props.ui?.root)

// ✅ CORRECT — consumer's class is merged in the middle position
class: cn(myRootCVA({ intent, size }), arkAttrs.value.class as ClassValue, props.ui?.root)
```

### Rule 4 — `rootProps` pick must be exhaustive and mode-specific

Check the full prop list via the Ark UI MCP (`get_component_props`) before writing a pick.

- **Root mode** — include every Ark `Root` prop except controlled-state ones (handled in `rootBindings`). Never include `value: UseXxxReturn` here.
- **Provider mode** — include `value` plus `lazyMount` / `unmountOnExit` if the `RootProvider` type accepts them (verify with MCP — not all do).

```ts
// ❌ WRONG — leaks value: undefined into Root mode
return pick(props, ['asChild', 'defaultValue', 'id', 'ids', 'value'] as const)
//                                                                    ↑ this is UseTabsReturn, not a Root prop

// ✅ CORRECT — Root mode never picks 'value'
return pick(props, ['asChild', 'defaultValue', 'id', 'ids', 'translations'] as const)
```

### Rule 5 — Never use raw `$attrs` — always use `splitArkAttrs`

`$attrs` contains wrapper-specific keys like `ui` that must not reach the Ark element. `splitArkAttrs` strips them.

```ts
// ❌ WRONG
const attrs = useAttrs()
// v-bind="{ ...rootProps, ...$attrs }"  or  v-bind="{ ...rootProps, ...attrs }"

// ✅ CORRECT
const attrs = useAttrs()
const arkAttrs = computed(() => splitArkAttrs(attrs))
// v-bind="rootBindings" where rootBindings contains ...arkAttrs.value
```

Also add `defineOptions({ inheritAttrs: false })` — without it, Vue double-applies attrs automatically AND via your explicit spread.

### Rule 6 — `rootAttrs`/`arkAttrs` come BEFORE `rootProps` in the merge order

Explicit `rootProps` values must win over user attrs for the same key. User attrs like `class`, `data-*`, and event listeners that have no overlap with rootProps will pass through correctly.

```ts
const base = {
  ...rootProps.value, // explicit Ark props (authoritative)
  ...arkAttrs.value, // user attrs — adds data-*, aria-*, event listeners
  class: cn(), // class always last — overwrites both (but merges via cn())
}
```

---

## Accessing Component State (Context Hooks)

### 1. Slot props — single-file components

`UIPopover`, `UITooltip`, `UIMenu`, and `UIDialog` expose the full Ark API through named slot props.

```vue
<UIPopover>
  <template #triggers="{ trigger: Trigger, popover }">
    <component :is="Trigger">{{ popover.open ? 'Close' : 'Open' }}</component>
  </template>
  <template #content="{ popover }">
    <UIButton @click="popover.close()">Close</UIButton>
  </template>
</UIPopover>
```

### 2. Context wrapper — compound components

For compound components (`UIAccordion`, `UISteps`, etc.), use the auto-imported Context component.

```vue
<UIAccordion v-model="expanded" multiple>
  <UIAccordionContext v-slot="ctx">
    <p>Open panels: {{ ctx.value }}</p>
  </UIAccordionContext>
  <UIAccordionItem value="a">
    <UIAccordionItemContext v-slot="item">
      <span>{{ item.expanded ? '▲' : '▼' }}</span>
    </UIAccordionItemContext>
  </UIAccordionItem>
</UIAccordion>
```

### 3. `useXxxContext()` — descendant components

Import context hooks directly from `@ark-ui/vue/{component}` in any descendant component.

```vue
<!-- app/components/MyCustomItem.vue -->
<script setup lang="ts">
import { useAccordionContext } from '@ark-ui/vue/accordion'
const ctx = useAccordionContext()
const isAnyOpen = computed(() => ctx.value.value.length > 0)
</script>
```

### Decision guide

| Scenario                                                           | Mechanism                                  |
| ------------------------------------------------------------------ | ------------------------------------------ |
| Inline inside a named slot of `UIPopover` / `UIMenu` / `UITooltip` | Slot props (`#content="{ popover }"`)      |
| Inline inside a compound component's default slot                  | `<UIAccordionContext v-slot="ctx">`        |
| Descendant component needs parent state                            | `useAccordionContext()` from `@ark-ui/vue` |
| Programmatic control from outside                                  | RootProvider + `useXxx()`                  |

---

## Transparent Emit Forwarding

Ark wrapper components do **not** redeclare Ark's emits. Event listeners are forwarded through `arkAttrs` automatically.

```vue
<!-- Consumer — bind any Ark event directly on the wrapper -->
<UIAccordion @value-change="(d) => console.log(d)" @focus-change="(d) => console.log(d)" />
<UIMenu @select="(d) => console.log(d)" @open-change="(d) => console.log(d)" />
```

This works because:

1. `defineOptions({ inheritAttrs: false })` is set — Vue does not auto-apply attrs
2. `const arkAttrs = computed(() => splitArkAttrs(attrs))` captures undeclared attrs
3. `...arkAttrs.value` is spread in `rootBindings` — Ark receives event listeners

---

## Ark-Specific Component Gotchas

### SegmentGroup / RadioGroup — always render `ItemHiddenInput`

Ark's `SegmentGroup` (and radio-group style components) require `<SegmentGroup.ItemHiddenInput />` inside every item for native radio semantics, form submission, and keyboard behavior. Omitting it silently breaks click selection.

```vue
<!-- ✅ Correct item structure -->
<UISegmentGroupItem value="react">
  <UISegmentGroupItemText>React</UISegmentGroupItemText>
  <UISegmentGroupItemControl />
  <UISegmentGroupItemHiddenInput />   <!-- ← required -->
</UISegmentGroupItem>
```

When building the high-level `UISegmentGroup` wrapper with `options` prop, include it in the auto-rendered template:

```vue
<UISegmentGroupItem v-for="option in resolvedOptions" :key="option.value" :value="option.value">
  <UISegmentGroupItemText>{{ option.label ?? option.value }}</UISegmentGroupItemText>
  <UISegmentGroupItemControl />
  <UISegmentGroupItemHiddenInput />   <!-- ← always include -->
</UISegmentGroupItem>
```

### Switch — `checked` vs `modelValue`

`ArkSwitch.Root` uses `checked` (not `modelValue`) as its controlled prop and emits `update:checked`.

```ts
// In rootBindings for Switch Root mode:
if (!isProvider.value && modelValue.value !== undefined) {
  base.checked = modelValue.value
  base['onUpdate:checked'] = (next: boolean) => {
    modelValue.value = next
  }
}
```

### Collapsible — `open` vs `modelValue`

`ArkCollapsible.Root` uses `open` (not `modelValue`) and emits `update:open`.

```ts
// In rootBindings for Collapsible Root mode:
if (!isProvider.value && modelValue.value !== undefined) {
  base.open = modelValue.value
  base['onUpdate:open'] = (next: boolean) => {
    modelValue.value = next
  }
}
```

The same pattern applies to `Popover`, `Tooltip`, `Menu`, `Dialog`, and `Select` — all use `open`/`update:open`.

### Steps — `step` vs `modelValue`

`ArkSteps.Root` uses `step` (not `modelValue`) and has no native Vue v-model emit. Use `onStepChange`-style if needed, or `v-model:step` which Ark Steps supports via its own binding.

```ts
// In rootBindings for Steps Root mode:
if (!isProvider.value && step.value !== undefined) {
  base.step = step.value
  base['onUpdate:step'] = (next: number) => {
    step.value = next
  }
}
```

### ToggleGroup — `modelValue` is `string[]`, can be `null` on clear

`update:modelValue` for ToggleGroup emits `string[] | null`. Guard null:

```ts
base['onUpdate:modelValue'] = (next: string[] | null) => {
  modelValue.value = next ?? []
}
```

---

## Z-index / Positioner stacking

Zag/Ark **positioners set `z-index: auto` inline** during floating-ui updates. Tailwind classes such as `z-9999` are ignored because inline styles win.

Use [`useLayerZIndexRef`](../../packages/ui/app/composables/useLayerZIndexRef.ts) (or the `useFloatingLayerPositionerRef` alias) on every Ark `Positioner`, modal backdrop, and toaster root:

```vue
<script setup lang="ts">
const positionerRef = useFloatingLayerPositionerRef()
</script>

<template>
  <ArkSelect.Positioner :ref="positionerRef" :class="cn(selectPositionerCVA(), ui)">
    <slot />
  </ArkSelect.Positioner>
</template>
```

The composable applies `style.setProperty('z-index', …, 'important')` and re-applies it via `MutationObserver` when Zag mutates `style`.

Layer constants live in [`layer-z-index.ts`](../../packages/ui/app/utils/layer-z-index.ts):

| Layer    | Value   | Usage                                                |
| -------- | ------- | ---------------------------------------------------- |
| floating | `10000` | Select, menu, popover, tooltip, combobox, datepicker |
| modal    | `11000` | Dialog, drawer, tour overlays                        |
| toast    | `12000` | `ArkToaster`                                         |

**Call `useLayerZIndexRef()` once per DOM node** — sharing a single ref callback across backdrop + positioner disconnects the observer from the first element.

**Inside an open dialog/drawer:** floating layers teleported to `body` render below modals (`10000` < `11000`). Use `portalled: false` on selects/menus inside modal content, or teleport to a container inside the modal.

---

## Common Pitfalls Checklist

Before shipping any new Ark UI component, verify:

- [ ] `defineOptions({ inheritAttrs: false })` is set
- [ ] `const arkAttrs = computed(() => splitArkAttrs(attrs))` — NOT raw `$attrs`
- [ ] `rootBindings` spreads `...arkAttrs.value` for attr forwarding
- [ ] `class: cn(cva(…), arkAttrs.value.class as ClassValue, props.ui?.root)` — three args
- [ ] Controlled state uses `modelValue` (or the correct Ark prop), **not** `defaultValue`
- [ ] Model binding is guarded: `modelValue.value !== undefined` before adding to `base`
- [ ] Provider mode `rootProps` includes `lazyMount`/`unmountOnExit` only if the Ark `RootProvider` type accepts them (verify with MCP `get_component_props`)
- [ ] Root mode `rootProps` does NOT include `value: UseXxxReturn` (that's provider-only)
- [ ] `rootProps` pick is complete — compare against Ark MCP `get_component_props` output
- [ ] SegmentGroup/RadioGroup items include `ItemHiddenInput`
- [ ] Ark `Positioner` / modal backdrop uses `useLayerZIndexRef` (Tailwind `z-*` alone is not enough)
- [ ] `extendCompodiumMeta` has representative `defaultProps`
