import Fuse from 'fuse.js'

import type { SearchFilterField } from './schema'

export interface RunFuseSearchOptions<TItem> {
  field: SearchFilterField<TItem>
  query: string
}

export function runFuseSearch<TItem>(
  items: readonly TItem[],
  options: RunFuseSearchOptions<TItem>,
): TItem[] {
  const { field, query } = options
  const trimmed = query.trim()
  const fuseConfig = field.fuse ?? {}
  const matchAllWhenSearchEmpty = fuseConfig.matchAllWhenSearchEmpty ?? true

  if (!trimmed) {
    return matchAllWhenSearchEmpty ? [...items] : []
  }

  const fuse = new Fuse([...items], fuseConfig.fuseOptions)
  const customSearch = field.search

  if (customSearch) {
    return [...customSearch(items, trimmed, fuse)]
  }

  const limit = fuseConfig.resultLimit
  const results = fuse.search(trimmed, limit === undefined ? undefined : { limit })
  return results.map((result) => result.item)
}
