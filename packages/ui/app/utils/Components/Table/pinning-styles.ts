import type { Column, Row } from '@tanstack/vue-table'
import type { CSSProperties } from 'vue'

export function getColumnPinningStyles<TData>(column: Column<TData, unknown>): CSSProperties {
  const pinned = column.getIsPinned()
  if (!pinned) return {}

  const isLastLeft = pinned === 'left' && column.getIsLastColumn('left')
  const isFirstRight = pinned === 'right' && column.getIsFirstColumn('right')

  return {
    boxShadow: isLastLeft
      ? '2px 0 4px -2px rgb(0 0 0 / 0.08)'
      : isFirstRight
        ? '-2px 0 4px -2px rgb(0 0 0 / 0.08)'
        : undefined,
    left: pinned === 'left' ? `${column.getStart('left')}px` : undefined,
    position: 'sticky',
    right: pinned === 'right' ? `${column.getAfter('right')}px` : undefined,
    zIndex: pinned ? 1 : undefined,
  }
}

export function getRowPinningStyles<TData>(row: Row<TData>): CSSProperties {
  const pinned = row.getIsPinned()
  if (!pinned) return {}

  return {
    bottom: pinned === 'bottom' ? `${row.getPinnedIndex()}px` : undefined,
    position: 'sticky',
    top: pinned === 'top' ? `${row.getPinnedIndex()}px` : undefined,
    zIndex: 5,
  }
}
