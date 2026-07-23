<script setup lang="ts" generic="TData extends RowData">
import { tableChromeKey } from '~/utils/Components/Table/context'
import { resolveStickyVariant, tableBaseCVA, tableRootCVA } from '~/utils/Components/Table/variants'

import type { RowData, Table } from '@tanstack/vue-table'
import type { ClassValue, Ref } from 'vue'
import type { TableRootProps } from '~/utils/Components/Table/types'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<TableRootProps<TData>>(), {
  empty: undefined,
  intent: 'neutral',
  loading: false,
  size: 'md',
  sticky: undefined,
  ui: undefined,
})

const attrs = useAttrs()
const tableRef = useTemplateRef<HTMLTableElement>('tableRef')
const scrollRef = useTemplateRef<HTMLDivElement>('scrollRef')

const intent = toRef(props, 'intent')
const size = toRef(props, 'size')
const sticky = toRef(props, 'sticky')
const loading = toRef(props, 'loading')
const ui = toRef(props, 'ui')
const emptyText = toRef(props, 'empty')
const table = toRef(props, 'table')

provide(tableChromeKey, {
  emptyText,
  intent,
  loading,
  size,
  sticky,
  table: table as Ref<Table<RowData>>,
  ui,
})

const stickyVariant = computed(() => resolveStickyVariant(sticky.value))

defineExpose({
  scrollRef,
  tableApi: table,
  tableRef,
})

extendCompodiumMeta({
  defaultProps: {
    intent: 'neutral',
    loading: false,
    size: 'md',
  },
})
</script>

<template>
  <div
    ref="scrollRef"
    :class="
      cn(tableRootCVA({ sticky: stickyVariant }), ui?.root, attrs.class as ClassValue | undefined)
    "
    v-bind="omit(attrs, ['class'] as const)"
  >
    <slot name="toolbar" />
    <div class="relative">
      <table ref="tableRef" :class="cn(tableBaseCVA({ size }), ui?.base)">
        <slot />
      </table>
      <slot name="state" />
    </div>
    <slot name="footer" />
  </div>
</template>
