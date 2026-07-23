<script setup lang="ts">
import { Steps as ArkSteps } from '@ark-ui/vue/steps'

/**
 * Exposes Ark `Steps.ItemContext` slot props for inline item state access.
 *
 * Available slot props include:
 * - `index` — the step index
 * - `current` — whether this step is the current step
 * - `complete` — whether this step has been completed
 */
defineOptions({ inheritAttrs: true })
</script>

<template>
  <ArkSteps.ItemContext v-slot="ctx">
    <slot v-bind="ctx" />
  </ArkSteps.ItemContext>
</template>
