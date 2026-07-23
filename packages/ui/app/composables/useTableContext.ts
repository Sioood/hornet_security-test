import { inject, type Ref } from 'vue'

import { tableChromeKey } from '~/utils/Components/Table/context'

import type { RowData, Table } from '@tanstack/vue-table'

export function useTableContext<TData extends RowData = RowData>() {
  const context = inject(tableChromeKey, null)
  if (!context) {
    throw new Error('useTableContext must be used within a UITableRoot component.')
  }

  return {
    emptyText: context.emptyText,
    intent: context.intent,
    loading: context.loading,
    size: context.size,
    sticky: context.sticky,
    table: context.table as Ref<Table<TData>>,
    ui: context.ui,
  }
}
