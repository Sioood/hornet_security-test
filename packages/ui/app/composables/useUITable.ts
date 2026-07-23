import {
  functionalUpdate,
  useVueTable,
  type Table,
  type TableOptions,
  type Updater,
} from '@tanstack/vue-table'

import { applyDefaultRowModels } from '~/utils/Components/Table/row-models'

import type { Ref, WatchOptions } from 'vue'
import type {
  ColumnFiltersState,
  ColumnOrderState,
  ColumnPinningState,
  ColumnSizingState,
  ExpandedState,
  GroupingState,
  PaginationState,
  RowPinningState,
  RowSelectionState,
  SortingState,
  UITableColumn,
  VisibilityState,
} from '~/utils/Components/Table/types'

export interface UseUITableStateModels {
  sorting?: Ref<SortingState | undefined>
  columnFilters?: Ref<ColumnFiltersState | undefined>
  globalFilter?: Ref<string | undefined>
  columnVisibility?: Ref<VisibilityState | undefined>
  columnOrder?: Ref<ColumnOrderState | undefined>
  columnPinning?: Ref<ColumnPinningState | undefined>
  columnSizing?: Ref<ColumnSizingState | undefined>
  rowSelection?: Ref<RowSelectionState | undefined>
  rowPinning?: Ref<RowPinningState | undefined>
  expanded?: Ref<ExpandedState | undefined>
  grouping?: Ref<GroupingState | undefined>
  pagination?: Ref<PaginationState | undefined>
}

export interface UseUITableOptions<TData> extends Omit<
  Partial<TableOptions<TData>>,
  'data' | 'columns' | 'state'
> {
  data: Ref<TData[]> | (() => TData[])
  columns: Ref<UITableColumn<TData>[]> | (() => UITableColumn<TData>[])
  watchOptions?: WatchOptions<boolean>
  stateModels?: UseUITableStateModels
}

function hasModel<T>(model: Ref<T | undefined> | undefined): model is Ref<T | undefined> {
  return model !== undefined
}

function hasActiveModel<T>(model: Ref<T | undefined> | undefined): model is Ref<T | undefined> {
  return model !== undefined && model.value !== undefined
}

function bindControlledState<T>(
  model: Ref<T | undefined>,
  key: string,
  state: Record<string, unknown>,
) {
  Object.defineProperty(state, key, {
    configurable: true,
    enumerable: true,
    get: () => model.value,
  })
}

// oxlint-disable-next-line max-params
function bindControlledHandler<TData, T>(
  model: Ref<T | undefined>,
  handlers: Partial<TableOptions<TData>>,
  handlerKey: keyof TableOptions<TData>,
  fallback: T,
) {
  Object.assign(handlers, {
    [handlerKey]: (updater: Updater<T>) => {
      model.value = functionalUpdate(updater, (model.value ?? fallback) as T)
    },
  })
}

function hasSelectionColumn<TData>(columnDefs: UITableColumn<TData>[]) {
  return columnDefs.some((column) => column.id === 'select')
}

function resolveEnableRowSelection<TData>(
  option: TableOptions<TData>['enableRowSelection'],
  stateModels: UseUITableStateModels | undefined,
  columnDefs: UITableColumn<TData>[],
) {
  if (hasModel(stateModels?.rowSelection) || hasSelectionColumn(columnDefs)) {
    return true
  }

  return option ?? false
}

function hasExpandColumn<TData>(columnDefs: UITableColumn<TData>[]) {
  return columnDefs.some((column) => column.id === 'expand')
}

function resolveGetRowCanExpand<TData>(
  option: TableOptions<TData>['getRowCanExpand'],
  stateModels: UseUITableStateModels | undefined,
  columnDefs: UITableColumn<TData>[],
) {
  if (option !== undefined) return option
  if (hasModel(stateModels?.expanded) || hasExpandColumn(columnDefs)) {
    return () => true
  }
  return undefined
}

export function useUITable<TData>(options: UseUITableOptions<TData>): Table<TData> {
  const data = computed(() =>
    typeof options.data === 'function' ? options.data() : options.data.value,
  )
  const columns = computed(() =>
    typeof options.columns === 'function' ? options.columns() : options.columns.value,
  )

  const {
    stateModels,
    watchOptions: _watchOptions,
    data: _data,
    columns: _columns,
    enableRowSelection: enableRowSelectionOption,
    ...rest
  } = options

  const controlledState: Record<string, unknown> = {}
  const controlledHandlers: Partial<TableOptions<TData>> = {}

  if (hasModel(stateModels?.sorting)) {
    bindControlledState(stateModels.sorting, 'sorting', controlledState)
    bindControlledHandler(stateModels.sorting, controlledHandlers, 'onSortingChange', [])
  }
  if (hasModel(stateModels?.columnFilters)) {
    bindControlledState(stateModels.columnFilters, 'columnFilters', controlledState)
    bindControlledHandler(
      stateModels.columnFilters,
      controlledHandlers,
      'onColumnFiltersChange',
      [],
    )
  }
  if (hasModel(stateModels?.globalFilter)) {
    bindControlledState(stateModels.globalFilter, 'globalFilter', controlledState)
    bindControlledHandler(stateModels.globalFilter, controlledHandlers, 'onGlobalFilterChange', '')
  }
  if (hasModel(stateModels?.columnVisibility)) {
    bindControlledState(stateModels.columnVisibility, 'columnVisibility', controlledState)
    bindControlledHandler(
      stateModels.columnVisibility,
      controlledHandlers,
      'onColumnVisibilityChange',
      {},
    )
  }
  if (hasModel(stateModels?.columnOrder)) {
    bindControlledState(stateModels.columnOrder, 'columnOrder', controlledState)
    bindControlledHandler(stateModels.columnOrder, controlledHandlers, 'onColumnOrderChange', [])
  }
  if (hasModel(stateModels?.columnPinning)) {
    bindControlledState(stateModels.columnPinning, 'columnPinning', controlledState)
    bindControlledHandler(
      stateModels.columnPinning,
      controlledHandlers,
      'onColumnPinningChange',
      {},
    )
  }
  if (hasModel(stateModels?.columnSizing)) {
    bindControlledState(stateModels.columnSizing, 'columnSizing', controlledState)
    bindControlledHandler(stateModels.columnSizing, controlledHandlers, 'onColumnSizingChange', {})
  }
  if (hasModel(stateModels?.rowSelection)) {
    bindControlledState(stateModels.rowSelection, 'rowSelection', controlledState)
    bindControlledHandler(stateModels.rowSelection, controlledHandlers, 'onRowSelectionChange', {})
  }
  if (hasModel(stateModels?.rowPinning)) {
    bindControlledState(stateModels.rowPinning, 'rowPinning', controlledState)
    bindControlledHandler(stateModels.rowPinning, controlledHandlers, 'onRowPinningChange', {})
  }
  if (hasModel(stateModels?.expanded)) {
    bindControlledState(stateModels.expanded, 'expanded', controlledState)
    bindControlledHandler(stateModels.expanded, controlledHandlers, 'onExpandedChange', {})
  }
  if (hasModel(stateModels?.grouping)) {
    bindControlledState(stateModels.grouping, 'grouping', controlledState)
    bindControlledHandler(stateModels.grouping, controlledHandlers, 'onGroupingChange', [])
  }
  if (hasActiveModel(stateModels?.pagination)) {
    bindControlledState(stateModels.pagination, 'pagination', controlledState)
    bindControlledHandler(stateModels.pagination, controlledHandlers, 'onPaginationChange', {
      pageIndex: 0,
      pageSize: 10,
    })
  }

  const enableExpanding =
    rest.enableExpanding ??
    (hasExpandColumn(columns.value) || hasModel(stateModels?.expanded) ? true : undefined)

  const tableOptions = applyDefaultRowModels({
    ...rest,
    ...controlledHandlers,
    get columns() {
      return columns.value
    },
    get data() {
      return data.value
    },
    enableExpanding,
    enableRowSelection: resolveEnableRowSelection(
      enableRowSelectionOption,
      stateModels,
      columns.value,
    ),
    getRowCanExpand: resolveGetRowCanExpand(rest.getRowCanExpand, stateModels, columns.value),
    state: controlledState,
  }) as TableOptions<TData>

  return useVueTable(tableOptions)
}
