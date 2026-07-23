import type { RowData, Table } from '@tanstack/vue-table'
import type { InjectionKey, Ref, ClassValue } from 'vue'

export type TableIntent = 'neutral' | 'primary' | 'secondary' | 'accent'
export type TableSize = 'sm' | 'md' | 'lg'
export type TableSticky = boolean | 'header' | 'footer'

export interface UITableSlotClasses {
  root?: ClassValue
  base?: ClassValue
  caption?: ClassValue
  thead?: ClassValue
  tbody?: ClassValue
  tfoot?: ClassValue
  tr?: ClassValue
  th?: ClassValue
  td?: ClassValue
  separator?: ClassValue
  empty?: ClassValue
  loading?: ClassValue
}

export interface TableChromeContext<TData = unknown> {
  intent: Ref<TableIntent>
  size: Ref<TableSize>
  sticky: Ref<TableSticky | undefined>
  loading: Ref<boolean>
  ui: Ref<Partial<UITableSlotClasses> | undefined>
  table: Ref<Table<TData>>
  emptyText: Ref<string | undefined>
}

export const tableChromeKey: InjectionKey<TableChromeContext<RowData>> = Symbol.for(
  'hornet_security-test.ui.table.chrome',
)

export type TableSlotRenderers = Record<string, (...args: unknown[]) => unknown>

export const tableSlotRenderersKey: InjectionKey<Ref<TableSlotRenderers>> = Symbol.for(
  'hornet_security-test.ui.table.slots',
)
