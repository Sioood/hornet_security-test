<script setup lang="ts">
import { TreeView as ArkTreeView } from '@ark-ui/vue/tree-view'

defineOptions({ inheritAttrs: true })
</script>

<template>
  <ArkTreeView.Context v-slot="ctx">
    <slot v-bind="ctx" />
  </ArkTreeView.Context>
</template>
