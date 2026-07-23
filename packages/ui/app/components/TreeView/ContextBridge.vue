<script setup lang="ts">
import type { UseTreeViewContext } from '@ark-ui/vue/tree-view'
import type { TreeViewItem } from '~/utils/Components/TreeView/context'

const props = defineProps<{
  context: UseTreeViewContext<TreeViewItem>
}>()

const emit = defineEmits<{
  ready: [context: UseTreeViewContext<TreeViewItem>]
}>()

watch(
  () => props.context,
  (context) => {
    emit('ready', context)
  },
  { immediate: true },
)
</script>

<template>
  <span class="sr-only" aria-hidden="true" />
</template>
