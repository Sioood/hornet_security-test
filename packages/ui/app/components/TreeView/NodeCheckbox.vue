<script setup lang="ts">
import { TreeView as ArkTreeView, type TreeViewNodeCheckboxBaseProps } from '@ark-ui/vue/tree-view'

import {
  checkboxDisabledFlag,
  checkboxInvalidFlag,
  treeNodeCheckboxCVA,
} from '~/utils/Components/Form/checkbox-variants'
import {
  treeViewChromeKey,
  type TreeViewIntent,
  type TreeViewSize,
} from '~/utils/Components/TreeView/context'

import type { ClassValue } from 'vue'

defineOptions({ inheritAttrs: false })

export interface UITreeViewNodeCheckboxSlots {
  root?: ClassValue
}

export interface TreeViewNodeCheckboxProps extends TreeViewNodeCheckboxBaseProps {
  intent?: TreeViewIntent
  size?: TreeViewSize
  ui?: Partial<UITreeViewNodeCheckboxSlots>
}

const props = withDefaults(defineProps<TreeViewNodeCheckboxProps>(), {
  intent: undefined,
  size: undefined,
  ui: undefined,
})

const attrs = useAttrs()
const chrome = inject(treeViewChromeKey, null)

const intent = computed<TreeViewIntent>(() => props.intent ?? chrome?.intent.value ?? 'primary')
const size = computed<TreeViewSize>(() => props.size ?? chrome?.size.value ?? 'md')
const invalid = computed(() => Boolean(checkboxInvalidFlag(chrome?.invalid.value ?? false)))
const disabled = computed(() => Boolean(checkboxDisabledFlag(false)))

const checkboxProps = computed(() => pick(props, ['asChild']))
</script>

<template>
  <ArkTreeView.NodeCheckbox
    v-bind="{ ...checkboxProps, ...attrs }"
    :class="cn(treeNodeCheckboxCVA({ intent, size, disabled, invalid }), ui?.root)"
  >
    <slot />
  </ArkTreeView.NodeCheckbox>
</template>
