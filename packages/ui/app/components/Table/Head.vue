<script setup lang="ts" generic="TData">
import { FlexRender, type Header } from '@tanstack/vue-table'

import { tableSlotRenderersKey } from '~/utils/Components/Table/context'
import { getColumnPinningStyles } from '~/utils/Components/Table/pinning-styles'
import { tableHeaderSlotName } from '~/utils/Components/Table/types'
import { tableHeadCVA } from '~/utils/Components/Table/variants'

defineOptions({ inheritAttrs: false })

const props = defineProps<{
  header: Header<TData, unknown>
}>()

defineSlots<{
  default?: () => unknown
}>()

const { size, intent, ui } = useTableContext<TData>()
const slotRenderers = inject(
  tableSlotRenderersKey,
  computed(() => ({})),
)

const meta = computed(() => props.header.column.columnDef.meta)
const isPinned = computed(() => props.header.column.getIsPinned())
const headerSlotName = computed(() => tableHeaderSlotName(props.header.column.id))
const headerRenderer = computed(() => slotRenderers.value[headerSlotName.value])
</script>

<template>
  <th
    :colspan="header.colSpan"
    :rowspan="header.rowSpan"
    :class="cn(tableHeadCVA({ intent, size, pinned: Boolean(isPinned) }), meta?.class?.th, ui?.th)"
    :style="{ ...getColumnPinningStyles(header.column), ...meta?.style?.th }"
    :data-pinned="isPinned || undefined"
  >
    <UITableRenderSlot
      v-if="headerRenderer"
      :render="headerRenderer"
      :slot-props="header.getContext()"
    />
    <FlexRender v-else :render="header.column.columnDef.header" :props="header.getContext()" />
  </th>
</template>
