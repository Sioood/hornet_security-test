<script setup lang="ts" generic="TData extends Record<string, unknown>">
import { tableSlotRenderersKey, type TableSlotRenderers } from '~/utils/Components/Table/context'
import {
  createColumnsFromData,
  type ColumnFiltersState,
  type ColumnOrderState,
  type ColumnPinningState,
  type ColumnSizingState,
  type ExpandedState,
  type GroupingState,
  type PaginationState,
  type RowPinningState,
  type RowSelectionState,
  type SortingState,
  type TableProps,
  type TableVirtualizeOptions,
  type VisibilityState,
} from '~/utils/Components/Table/types'

import type { Row, Table } from '@tanstack/vue-table'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<TableProps<TData>>(), {
  autoResetPageIndex: false,
  caption: undefined,
  columns: undefined,
  data: undefined,
  empty: undefined,
  getRowId: undefined,
  getSubRows: undefined,
  intent: 'neutral',
  loading: false,
  meta: undefined,
  onContextmenu: undefined,
  onHover: undefined,
  onSelect: undefined,
  renderFallbackValue: undefined,
  selectable: false,
  size: 'md',
  sticky: undefined,
  ui: undefined,
  value: undefined,
  virtualize: false,
})

const sorting = defineModel<SortingState>('sorting')
const columnFilters = defineModel<ColumnFiltersState>('columnFilters')
const globalFilter = defineModel<string>('globalFilter')
const columnVisibility = defineModel<VisibilityState>('columnVisibility')
const columnOrder = defineModel<ColumnOrderState>('columnOrder')
const columnPinning = defineModel<ColumnPinningState>('columnPinning')
const columnSizing = defineModel<ColumnSizingState>('columnSizing')
const rowSelection = defineModel<RowSelectionState>('rowSelection')
const rowPinning = defineModel<RowPinningState>('rowPinning')
const expanded = defineModel<ExpandedState>('expanded')
const grouping = defineModel<GroupingState>('grouping')
const pagination = defineModel<PaginationState>('pagination')

const emit = defineEmits<{
  contextmenu: [event: Event, row: Row<TData>]
}>()

const attrs = useAttrs()
const slots = useSlots()
const rootRef = useTemplateRef<{
  tableRef: HTMLTableElement | null
  scrollRef: HTMLDivElement | null
  tableApi: Table<TData>
}>('rootRef')

const slotRenderers = computed<TableSlotRenderers>(() => {
  const renderers: TableSlotRenderers = {}
  for (const name of Object.keys(slots)) {
    if (name.endsWith('-header') || name.endsWith('-cell') || name.endsWith('-footer')) {
      const slot = slots[name]
      if (slot) renderers[name] = slot as (props: unknown) => unknown
    }
  }
  return renderers
})

provide(tableSlotRenderersKey, slotRenderers)

const dataRef = computed(() => props.data ?? [])
const columnsRef = computed(() => props.columns ?? createColumnsFromData(dataRef.value))

const virtualizeOptions = computed<TableVirtualizeOptions | false>(() => {
  if (!props.virtualize) return false
  if (props.virtualize === true) return {}
  return props.virtualize
})

if (import.meta.dev && virtualizeOptions.value && rowPinning.value) {
  // console.warn('[UITable] Row pinning is not supported when virtualization is enabled.')
}

const virtualizeEstimateSize = computed(() => {
  if (!virtualizeOptions.value) return 52
  const { estimateSize } = virtualizeOptions.value
  return typeof estimateSize === 'number' ? estimateSize : 52
})

const internalTable = useUITable<TData>({
  ...omit(props, [
    'value',
    'data',
    'columns',
    'meta',
    'caption',
    'intent',
    'size',
    'sticky',
    'loading',
    'empty',
    'virtualize',
    'selectable',
    'enableRowSelection',
    'ui',
    'onSelect',
    'onHover',
    'onContextmenu',
  ] as const),
  columns: columnsRef,
  data: dataRef,
  enableRowSelection: props.enableRowSelection ?? (props.selectable ? true : undefined),
  meta: props.meta,
  stateModels: {
    columnFilters,
    columnOrder,
    columnPinning,
    columnSizing,
    columnVisibility,
    expanded,
    globalFilter,
    grouping,
    pagination,
    rowPinning,
    rowSelection,
    sorting,
  },
})

const table = computed(() => props.value ?? internalTable)

function handleSelect(event: Event, row: Row<TData>) {
  props.onSelect?.(event, row)
}

function handleHover(event: Event, row: Row<TData> | null) {
  props.onHover?.(event, row)
}

function handleContextmenu(event: Event, row: Row<TData>) {
  props.onContextmenu?.(event, row)
  emit('contextmenu', event, row)
}

function handleVirtualSelect(event: Event, row: Row<Record<string, unknown>>) {
  props.onSelect?.(event, row as Row<TData>)
}

function handleVirtualHover(event: Event, row: Row<Record<string, unknown>> | null) {
  props.onHover?.(event, row as Row<TData> | null)
}

function handleVirtualContextmenu(event: Event, row: Row<Record<string, unknown>>) {
  props.onContextmenu?.(event, row as Row<TData>)
}

defineExpose({
  get scrollRef() {
    return rootRef.value?.scrollRef ?? null
  },
  get tableApi() {
    return table.value
  },
  get tableRef() {
    return rootRef.value?.tableRef ?? null
  },
})

extendCompodiumMeta({
  defaultProps: {
    intent: 'neutral',
    loading: false,
    selectable: false,
    size: 'md',
  },
})
</script>

<template>
  <UITableRoot ref="rootRef" :table :intent :size :sticky :loading :empty :ui v-bind="attrs">
    <template v-if="$slots.toolbar" #toolbar>
      <slot name="toolbar" />
    </template>

    <UITableCaption v-if="caption || $slots.caption">
      <slot name="caption">{{ caption }}</slot>
    </UITableCaption>

    <UITableHeader />

    <UITableVirtualBody
      v-if="virtualizeOptions"
      :estimate-size="virtualizeEstimateSize"
      :overscan="typeof virtualizeOptions === 'object' ? (virtualizeOptions.overscan ?? 8) : 8"
      :options="typeof virtualizeOptions === 'object' ? virtualizeOptions : undefined"
      :selectable
      @select="handleVirtualSelect"
      @hover="handleVirtualHover"
      @contextmenu="handleVirtualContextmenu"
    />

    <UITableBody v-else>
      <template #body-top>
        <slot name="body-top" />
      </template>

      <template v-for="row in table.getRowModel().rows" :key="row.id">
        <UITableRow
          :row="row"
          :selectable
          @select="handleSelect"
          @hover="handleHover"
          @contextmenu="handleContextmenu"
        />

        <UITableExpandedRow
          v-if="$slots.expanded && row.getIsExpanded()"
          :row="row"
          :colspan="table.getVisibleLeafColumns().length"
        >
          <slot name="expanded" :row="row" />
        </UITableExpandedRow>
      </template>

      <template #body-bottom>
        <slot name="body-bottom" />
      </template>
    </UITableBody>

    <UITableFooter />

    <template #state>
      <UITableEmpty>
        <slot name="empty" />
      </UITableEmpty>

      <UITableLoading>
        <slot name="loading" />
      </UITableLoading>
    </template>

    <template v-if="$slots.footer" #footer>
      <div class="flex flex-wrap items-center gap-2 border-t border-neutral-border-subtle p-2">
        <slot name="footer" />
      </div>
    </template>
  </UITableRoot>
</template>
