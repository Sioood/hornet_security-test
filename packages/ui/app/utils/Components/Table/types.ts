import './tanstack.d.ts'

import type { TableIntent, TableSize, TableSticky, UITableSlotClasses } from './context'
import type {
  ColumnDef,
  ColumnFiltersState,
  ColumnOrderState,
  ColumnPinningState,
  ColumnSizingState,
  ExpandedState,
  GroupingState,
  PaginationState,
  Row,
  RowData,
  RowPinningState,
  RowSelectionState,
  SortingState,
  Table,
  TableMeta,
  TableOptions,
  TableState,
  VisibilityState,
} from '@tanstack/vue-table'
import type { VirtualizerOptions } from '@tanstack/vue-virtual'
import type { ClassValue } from 'vue'

export type {
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
  VisibilityState,
}

/** @lintignore Re-exported TanStack types for table consumers */
export type { ColumnDef, Row, TableMeta, TableOptions, TableState }

export type UITableColumn<TData, TValue = unknown> = ColumnDef<TData, TValue>

export type TableVirtualizeOptions = Partial<
  Omit<
    VirtualizerOptions<HTMLElement, Element>,
    'getScrollElement' | 'count' | 'estimateSize' | 'overscan'
  >
> & {
  overscan?: number
  estimateSize?: number | ((index: number) => number)
}

/** @lintignore Public table slot API */
export type UITableSlots = Partial<UITableSlotClasses>

/** @lintignore Public table root slot API */
export interface UITableRootSlots {
  root?: ClassValue
  base?: ClassValue
}

export interface TableRootProps<TData = unknown> {
  /** Pre-built TanStack table instance from `useUITable()` or `useVueTable()`. */
  table: Table<TData>
  intent?: TableIntent
  size?: TableSize
  sticky?: TableSticky
  loading?: boolean
  empty?: string
  ui?: Partial<UITableSlotClasses>
}

export interface TableProps<TData extends Record<string, unknown> = Record<string, unknown>> {
  /** External TanStack table instance (`useUITable()` / `useVueTable()`). */
  value?: Table<TData>
  data?: TData[]
  columns?: UITableColumn<TData>[]
  meta?: TableMeta<TData>
  caption?: string
  intent?: TableIntent
  size?: TableSize
  sticky?: TableSticky
  loading?: boolean
  empty?: string
  virtualize?: boolean | TableVirtualizeOptions
  selectable?: boolean
  ui?: Partial<UITableSlotClasses>
  getRowId?: TableOptions<TData>['getRowId']
  getSubRows?: TableOptions<TData>['getSubRows']
  renderFallbackValue?: TableOptions<TData>['renderFallbackValue']
  manualPagination?: boolean
  manualSorting?: boolean
  manualFiltering?: boolean
  enableMultiSort?: boolean
  enableRowSelection?: boolean
  enableColumnPinning?: boolean
  enableColumnResizing?: boolean
  autoResetPageIndex?: boolean
  groupedColumnMode?: 'reorder' | 'remove' | false
  onSelect?: (event: Event, row: Row<TData>) => void
  onHover?: (event: Event, row: Row<TData> | null) => void
  onContextmenu?: (event: Event, row: Row<TData>) => void
}

/** @lintignore Public table meta alias */
export type UITableTableMeta<TData extends RowData = RowData> = TableMeta<TData>

export type TableRowClassMeta<TData extends RowData = RowData> =
  | ClassValue
  | ((row: Row<TData>) => ClassValue)

export type TableRowStyleMeta<TData extends RowData = RowData> =
  | Record<string, string>
  | ((row: Row<TData>) => Record<string, string>)

export function tableHeaderSlotName(columnId: string): string {
  return `${columnId}-header`
}

export function tableCellSlotName(columnId: string): string {
  return `${columnId}-cell`
}

export function tableFooterSlotName(columnId: string): string {
  return `${columnId}-footer`
}

export function createColumnsFromData<TData extends Record<string, unknown>>(
  data: TData[],
): UITableColumn<TData>[] {
  const [first] = data
  if (!first) return []

  return Object.keys(first).map((key) => ({
    accessorKey: key,
    header: key,
  }))
}
