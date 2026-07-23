<script setup lang="ts">
import { DatePicker as ArkDatePicker } from '@ark-ui/vue/date-picker'

defineOptions({ inheritAttrs: true })
</script>

<template>
  <ArkDatePicker.Context v-slot="ctx">
    <slot v-bind="ctx" />
  </ArkDatePicker.Context>
</template>
