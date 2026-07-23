<script setup lang="ts">
import { Accordion as ArkAccordion } from '@ark-ui/vue/accordion'

/** Exposes Ark `Accordion.ItemContext` slot props (`expanded`, `focused`, `disabled`) for custom layouts. */
defineOptions({ inheritAttrs: true })
</script>

<template>
  <ArkAccordion.ItemContext v-slot="item">
    <slot v-bind="item" />
  </ArkAccordion.ItemContext>
</template>
