<script setup lang="ts" generic="TData extends Record<string, unknown>">
import { useVirtualizer } from '@tanstack/vue-virtual'

import type { Row } from '@tanstack/vue-table'
import type { TableVirtualizeOptions } from '~/utils/Components/Table/types'

defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    estimateSize?: number
    overscan?: number
    options?: TableVirtualizeOptions
    selectable?: boolean
  }>(),
  {
    estimateSize: 52,
    options: undefined,
    overscan: 8,
    selectable: false,
  },
)

const emit = defineEmits<{
  select: [event: Event, row: Row<TData>]
  hover: [event: Event, row: Row<TData> | null]
  contextmenu: [event: Event, row: Row<TData>]
}>()

const { table } = useTableContext<TData>()
const rootRef = useTemplateRef<HTMLElement>('rootRef')

const rows = computed(() => table.value.getRowModel().rows)

function resolveEstimateSize(
  estimateSize: TableVirtualizeOptions['estimateSize'] | undefined,
  fallback: number,
): (index: number) => number {
  if (typeof estimateSize === 'function') return estimateSize
  return () => estimateSize ?? fallback
}

const virtualizerOptions = computed(() => {
  const {
    estimateSize: optionsEstimateSize,
    overscan: optionsOverscan,
    ...restOptions
  } = props.options ?? {}

  return {
    count: rows.value.length,
    estimateSize: resolveEstimateSize(optionsEstimateSize, props.estimateSize),
    getScrollElement: () => rootRef.value?.parentElement ?? null,
    overscan: optionsOverscan ?? props.overscan,
    ...restOptions,
  }
})

const virtualizer = useVirtualizer(virtualizerOptions)

const virtualRows = computed(() => virtualizer.value.getVirtualItems())
const totalSize = computed(() => virtualizer.value.getTotalSize())

function onSelect(event: Event, row: Row<TData>) {
  emit('select', event, row)
}

function onHover(event: Event, row: Row<TData> | null) {
  emit('hover', event, row)
}

function onContextmenu(event: Event, row: Row<TData>) {
  emit('contextmenu', event, row)
}
</script>

<template>
  <tbody ref="rootRef">
    <tr :style="{ height: `${totalSize}px` }">
      <td :colspan="table.getAllLeafColumns().length" class="p-0">
        <div class="relative w-full" :style="{ height: `${totalSize}px` }">
          <div
            v-for="virtualRow in virtualRows"
            :key="String(virtualRow.key)"
            class="absolute top-0 left-0 w-full"
            :style="{ transform: `translateY(${virtualRow.start}px)` }"
          >
            <UITableRow
              v-if="rows[virtualRow.index]"
              :row="rows[virtualRow.index]!"
              :selectable
              @select="onSelect"
              @hover="onHover"
              @contextmenu="onContextmenu"
            />
          </div>
        </div>
      </td>
    </tr>
  </tbody>
</template>
