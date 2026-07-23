<script setup lang="ts">
import { Accordion as ArkAccordion } from '@ark-ui/vue/accordion'

/** Exposes Ark `Accordion.Context` slot props (`value`, `focusedValue`) for inline state access. */
defineOptions({ inheritAttrs: true })
</script>

<template>
  <ArkAccordion.Context v-slot="ctx">
    <slot v-bind="ctx" />
  </ArkAccordion.Context>
</template>
