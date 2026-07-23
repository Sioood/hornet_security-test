import { describe, expect, it } from 'vitest'

import { applyDefaultRowModels } from '~ui/app/utils/Components/Table/row-models'
import { createColumnsFromData } from '~ui/app/utils/Components/Table/types'

describe('Table row-models', () => {
  it('enables filtering row model when column filters state is present', () => {
    const options = applyDefaultRowModels({
      state: { columnFilters: [] },
    })

    expect(options.getFilteredRowModel).toBeDefined()
  })

  it('applies filtered and sorted row models when features are enabled', () => {
    const options = applyDefaultRowModels({
      state: { columnFilters: [], sorting: [] },
    })

    expect(options.getCoreRowModel).toBeDefined()
    expect(options.getFilteredRowModel).toBeDefined()
    expect(options.getSortedRowModel).toBeDefined()
  })

  it('skips client pagination row model in manual pagination mode', () => {
    const options = applyDefaultRowModels({
      manualPagination: true,
      state: { pagination: { pageIndex: 0, pageSize: 10 } },
    })

    expect(options.getPaginationRowModel).toBeUndefined()
  })
})

describe('createColumnsFromData', () => {
  it('derives accessor columns from first row keys', () => {
    const columns = createColumnsFromData([
      { id: '1', name: 'Alice' },
      { id: '2', name: 'Bob' },
    ])

    expect(columns).toEqual([
      { accessorKey: 'id', header: 'id' },
      { accessorKey: 'name', header: 'name' },
    ])
  })
})
