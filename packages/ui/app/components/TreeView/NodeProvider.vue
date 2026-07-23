<script setup lang="ts">
import { TreeView as ArkTreeView, type TreeViewNodeProviderBaseProps } from '@ark-ui/vue/tree-view'

import type { TreeViewItem } from '~/utils/Components/TreeView/context'

defineOptions({ inheritAttrs: false })

export type TreeViewNodeProviderProps = TreeViewNodeProviderBaseProps<TreeViewItem>

const props = defineProps<TreeViewNodeProviderProps>()
const attrs = useAttrs()

const providerProps = computed(() => pick(props, ['indexPath', 'node']))
</script>

<template>
  <ArkTreeView.NodeProvider v-bind="{ ...providerProps, ...attrs }">
    <slot />
  </ArkTreeView.NodeProvider>
</template>
