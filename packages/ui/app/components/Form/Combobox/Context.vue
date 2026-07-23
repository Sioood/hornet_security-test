<script setup lang="ts">
import { Combobox as ArkCombobox } from '@ark-ui/vue/combobox'

defineOptions({ inheritAttrs: true })
</script>

<template>
  <ArkCombobox.Context v-slot="ctx">
    <slot v-bind="ctx" />
  </ArkCombobox.Context>
</template>
