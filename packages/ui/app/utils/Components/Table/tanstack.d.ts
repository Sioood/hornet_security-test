import type { Row, RowData } from '@tanstack/table-core'
import type { ClassValue } from 'vue'

declare module '@tanstack/table-core' {
  interface ColumnMeta<TData extends RowData, _TValue> {
    class?: {
      th?: ClassValue
      td?: ClassValue
    }
    style?: {
      th?: Record<string, string>
      td?: Record<string, string>
    }
    colspan?: {
      td?: number
    }
    rowspan?: {
      td?: number
    }
  }

  interface TableMeta<TData extends RowData> {
    class?: {
      tr?: ClassValue | ((row: Row<TData>) => ClassValue)
    }
    style?: {
      tr?: Record<string, string> | ((row: Row<TData>) => Record<string, string>)
    }
  }
}
