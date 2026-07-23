# @hornet_security-test/ui

Design system and UI component library for HornetSecurityTest. A Nuxt 4 layer built on [Ark UI](https://ark-ui.com), [Tailwind CSS v4](https://tailwindcss.com), and [CVA](https://cva.style).

## Usage

Add the layer to your Nuxt app:

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  extends: ['@hornet_security-test/ui'],
})
```

All `UI*` components are auto-imported:

```vue
<UIButton intent="primary">Click me</UIButton>
<UIAccordion collapsible :default-value="['one']">
  <UIAccordionItem value="one">
    <UIAccordionItemTrigger>Title <UIAccordionItemIndicator /></UIAccordionItemTrigger>
    <UIAccordionItemContent>Content</UIAccordionItemContent>
  </UIAccordionItem>
</UIAccordion>
```

When building composables or helpers, check [VueUse](https://vueuse.org/functions.html) before rolling your own DOM/reactivity utilities. See [Component Development — VueUse](../../docs/ai/component-development.md#vueuse).

---

## Root vs RootProvider

All Ark UI components support two modes. Choose based on how much external control you need.

### Root mode (default)

The component owns its state. Use `v-model` to sync a value.

```vue
<!-- Uncontrolled -->
<UIPopover title="Info" :default-open="false" />

<!-- Controlled with v-model -->
<UIAccordion v-model="expanded" collapsible />
<UITooltip v-model:open="tooltipVisible" content="Hello" />
```

**Use Root when:** The component is self-contained, `v-model` is all you need, and there is no cross-component coordination.

### RootProvider mode

You create the Ark state machine externally via `useXxx()` and pass it via `:value`. The component becomes purely presentational — you hold the API.

```vue
<script setup lang="ts">
import { useAccordion } from '@ark-ui/vue/accordion'
import { usePopover } from '@ark-ui/vue/popover'

const accordion = useAccordion({ multiple: true, collapsible: true })
const popover = usePopover()
</script>

<template>
  <!-- Imperative control from outside -->
  <UIButton @click="accordion.setValue(['panel-1', 'panel-2'])">Expand All</UIButton>
  <UIButton @click="accordion.setValue([])">Collapse All</UIButton>

  <UIAccordion :value="accordion">
    <UIAccordionItem value="panel-1">
      <UIAccordionItemTrigger>Panel 1 <UIAccordionItemIndicator /></UIAccordionItemTrigger>
      <UIAccordionItemContent>Content 1</UIAccordionItemContent>
    </UIAccordionItem>
    <UIAccordionItem value="panel-2">
      <UIAccordionItemTrigger>Panel 2 <UIAccordionItemIndicator /></UIAccordionItemTrigger>
      <UIAccordionItemContent>Content 2</UIAccordionItemContent>
    </UIAccordionItem>
  </UIAccordion>

  <!-- Open/close a popover from a sibling component -->
  <UIButton @click="popover.open()">Open from outside</UIButton>
  <UIPopover :value="popover" title="Externally controlled" content="Opened programmatically." />
</template>
```

**Use RootProvider when:**

- You need `api.setValue(...)`, `api.open()`, `api.close()`, `api.getItemState()`, etc.
- Multiple components need to share one state machine
- You need to react to state changes beyond a single `v-model`

### Supported components

| Component                           | Hook                                               |
| ----------------------------------- | -------------------------------------------------- |
| `UIAccordion`                       | `useAccordion()` from `@ark-ui/vue/accordion`      |
| `UICollapsible`                     | `useCollapsible()` from `@ark-ui/vue/collapsible`  |
| `UIPopover`                         | `usePopover()` from `@ark-ui/vue/popover`          |
| `UISwitch`                          | `useSwitch()` from `@ark-ui/vue/switch`            |
| `UITooltip`                         | `useTooltip()` from `@ark-ui/vue/tooltip`          |
| `UIMenu`                            | `useMenu()` from `@ark-ui/vue/menu`                |
| `UIToggleGroup`                     | `useToggleGroup()` from `@ark-ui/vue/toggle-group` |
| `UIProgress` / `UIProgressCircular` | `useProgress()` from `@ark-ui/vue/progress`        |
| `UIQRCode`                          | `useQrCode()` from `@ark-ui/vue/qr-code`           |
| `UIFormSelect`                      | `useSelect()` from `@ark-ui/vue/select`            |

---

## Accessing Component State

### Slot props (Popover, Tooltip, Menu)

Single-file components expose the full Ark API through named slot props:

```vue
<UIPopover>
  <template #triggers="{ trigger: Trigger, popover }">
    <!-- popover.open, popover.close(), etc. -->
    <component :is="Trigger">
      {{ popover.open ? 'Close' : 'Open' }}
    </component>
  </template>
  <template #content="{ popover }">
    <UIButton @click="popover.close()">Dismiss</UIButton>
  </template>
</UIPopover>
```

### UIXxxContext (Accordion)

Access root or item state inline inside the compound component's slot:

```vue
<UIAccordion v-model="expanded">
  <UIAccordionContext v-slot="ctx">
    <p>Open: {{ ctx.value }}</p>
  </UIAccordionContext>

  <UIAccordionItem value="one">
    <UIAccordionItemContext v-slot="item">
      <span>{{ item.expanded ? '▲' : '▼' }}</span>
    </UIAccordionItemContext>
    ...
  </UIAccordionItem>
</UIAccordion>
```

### useXxxContext() (descendant components)

Import context hooks directly from `@ark-ui/vue` inside descendant components:

```vue
<!-- MyCustomItem.vue -->
<script setup lang="ts">
import { useAccordionItemContext } from '@ark-ui/vue/accordion'
const item = useAccordionItemContext()
</script>
```

---

## Listening to Events

All Ark events are forwarded transparently via `$attrs`. Bind any Ark event directly on the wrapper:

```vue
<UIAccordion
  @value-change="(d) => console.log('valueChange', d)"
  @focus-change="(d) => console.log('focusChange', d)"
/>

<UIPopover
  @open-change="(d) => console.log('openChange', d)"
  @escape-key-down="(d) => console.log('escapeKeyDown', d)"
/>

<UIMenu
  @select="(d) => console.log('select', d)"
  @open-change="(d) => console.log('openChange', d)"
/>

<UISwitch @checked-change="(d) => console.log('checkedChange', d)" />
```

---

## Design System

### Intents

Every interactive component supports these intent variants:

| Intent      | Use case                      |
| ----------- | ----------------------------- |
| `neutral`   | Default UI, secondary actions |
| `primary`   | Call-to-action, primary flows |
| `secondary` | Alternative actions           |
| `accent`    | Highlights, special callouts  |

### Color tokens

Use semantic tokens, never raw values:

```
primary-fill-default       primary-text-default       primary-border-subtle
neutral-fill-subtle        neutral-text-subtle         neutral-border-default
secondary-fill-default-hover
accent-text-default
error-text-default         success-icon-default        warning-border-subtle
```

---

## Further Reading

- [Component Development Guide](../../docs/ai/component-development.md) — implementation patterns, Root/RootProvider, context hooks, emit forwarding
- [AGENTS.md](./AGENTS.md) — conventions for AI-assisted development
