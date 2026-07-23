<script setup lang="ts">
import { TreeView as ArkTreeView, type TreeViewItemIndicatorBaseProps } from '@ark-ui/vue/tree-view'

import type { ClassValue } from 'vue'

defineOptions({ inheritAttrs: false })

export interface UITreeViewItemIndicatorSlots {
  root?: ClassValue
}

export interface TreeViewItemIndicatorProps extends TreeViewItemIndicatorBaseProps {
  ui?: Partial<UITreeViewItemIndicatorSlots>
}

const props = withDefaults(defineProps<TreeViewItemIndicatorProps>(), {
  ui: undefined,
})

const attrs = useAttrs()
const indicatorProps = computed(() => pick(props, ['asChild']))
</script>

<template>
  <ArkTreeView.ItemIndicator
    v-bind="{ ...indicatorProps, ...attrs }"
    :class="cn('inline-flex shrink-0 items-center justify-center', ui?.root)"
  >
    <slot />
  </ArkTreeView.ItemIndicator>
</template>
