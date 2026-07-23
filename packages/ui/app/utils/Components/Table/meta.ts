import type { TableRowClassMeta, TableRowStyleMeta } from './types'
import type { Row } from '@tanstack/vue-table'
import type { ClassValue } from 'vue'

export function resolveMetaClassValue<TData>(
  value: TableRowClassMeta<TData> | null | undefined,
  row: Row<TData>,
): ClassValue | undefined {
  if (value === null) return undefined
  if (typeof value === 'function') return value(row)
  return value
}

export function resolveMetaStyleValue<TData>(
  value: TableRowStyleMeta<TData> | null | undefined,
  row: Row<TData>,
): Record<string, string> | undefined {
  if (value === null) return undefined
  if (typeof value === 'function') return value(row)
  return value
}
