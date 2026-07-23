<script setup lang="ts" generic="TData">
import { FlexRender, type Cell } from '@tanstack/vue-table'

import { tableSlotRenderersKey } from '~/utils/Components/Table/context'
import { getColumnPinningStyles } from '~/utils/Components/Table/pinning-styles'
import { tableCellSlotName } from '~/utils/Components/Table/types'
import { tableCellCVA } from '~/utils/Components/Table/variants'

defineOptions({ inheritAttrs: false })

const props = defineProps<{
  cell: Cell<TData, unknown>
}>()

const { size, intent, ui } = useTableContext<TData>()
const slotRenderers = inject(
  tableSlotRenderersKey,
  computed(() => ({})),
)

const meta = computed(() => props.cell.column.columnDef.meta)
const isPinned = computed(() => props.cell.column.getIsPinned())
const cellSlotName = computed(() => tableCellSlotName(props.cell.column.id))
const cellRenderer = computed(() => slotRenderers.value[cellSlotName.value])
const cellContext = computed(() => ({
  ...props.cell.getContext(),
  getValue: props.cell.getValue,
  renderValue: props.cell.renderValue,
}))
</script>

<template>
  <td
    :colspan="meta?.colspan?.td"
    :rowspan="meta?.rowspan?.td"
    :class="cn(tableCellCVA({ intent, size, pinned: Boolean(isPinned) }), meta?.class?.td, ui?.td)"
    :style="{ ...getColumnPinningStyles(cell.column), ...meta?.style?.td }"
    :data-pinned="isPinned || undefined"
  >
    <UITableRenderSlot v-if="cellRenderer" :render="cellRenderer" :slot-props="cellContext" />
    <FlexRender v-else :render="cell.column.columnDef.cell" :props="cell.getContext()" />
  </td>
</template>
