<script setup lang="ts">
import { Select as ArkSelect } from '@ark-ui/vue/select'

defineOptions({ inheritAttrs: true })
</script>

<template>
  <ArkSelect.Context v-slot="ctx">
    <slot v-bind="ctx" />
  </ArkSelect.Context>
</template>
