<script setup lang="ts" generic="TData extends RowData">
import { resolveMetaClassValue, resolveMetaStyleValue } from '~/utils/Components/Table/meta'
import { getRowPinningStyles } from '~/utils/Components/Table/pinning-styles'
import { tableRowCVA } from '~/utils/Components/Table/variants'

import type { Row, RowData } from '@tanstack/vue-table'

defineOptions({ inheritAttrs: false })

const props = defineProps<{
  row: Row<TData>
  selectable?: boolean
}>()

const emit = defineEmits<{
  select: [event: Event, row: Row<TData>]
  hover: [event: Event, row: Row<TData> | null]
  contextmenu: [event: Event, row: Row<TData>]
}>()

const { table, intent, ui } = useTableContext<TData>()

const tableMeta = computed(() => table.value.options.meta)
const isSelected = computed(() => props.row.getIsSelected())
const isPinned = computed(() => props.row.getIsPinned())

const rowClass = computed(() =>
  cn(
    tableRowCVA({
      intent: intent.value,
      pinned: Boolean(isPinned.value),
      selected: isSelected.value,
    }),
    resolveMetaClassValue<TData>(tableMeta.value?.class?.tr, props.row),
    ui.value?.tr,
  ),
)

const rowStyle = computed(() => ({
  ...getRowPinningStyles(props.row),
  ...resolveMetaStyleValue<TData>(tableMeta.value?.style?.tr, props.row),
}))
</script>

<template>
  <tr
    :class="rowClass"
    :style="rowStyle"
    :data-selected="isSelected || undefined"
    :data-selectable="selectable || undefined"
    :data-pinned="isPinned || undefined"
    :data-expanded="row.getIsExpanded() || undefined"
    @click="emit('select', $event, row)"
    @mouseenter="emit('hover', $event, row)"
    @mouseleave="emit('hover', $event, null)"
    @contextmenu="emit('contextmenu', $event, row)"
  >
    <UITableCell v-for="cell in row.getVisibleCells()" :key="cell.id" :cell="cell" />
  </tr>
</template>
