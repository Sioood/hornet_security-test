<script setup lang="ts">
import { Steps as ArkSteps } from '@ark-ui/vue/steps'

/**
 * Exposes Ark `Steps.Context` slot props for inline state access.
 *
 * Available slot props include:
 * - `step` — current step index
 * - `count` — total number of steps
 * - `hasNextStep` — whether there is a next step
 * - `hasPrevStep` — whether there is a previous step
 * - `goToNextStep` / `goToPrevStep` / `goToStep` — navigation functions
 * - `resetStep` — reset to first step
 */
defineOptions({ inheritAttrs: true })
</script>

<template>
  <ArkSteps.Context v-slot="ctx">
    <slot v-bind="ctx" />
  </ArkSteps.Context>
</template>
