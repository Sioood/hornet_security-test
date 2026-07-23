<script setup lang="ts">
import { TreeView as ArkTreeView } from '@ark-ui/vue/tree-view'

defineOptions({ inheritAttrs: true })
</script>

<template>
  <ArkTreeView.NodeContext v-slot="ctx">
    <slot v-bind="ctx" />
  </ArkTreeView.NodeContext>
</template>
