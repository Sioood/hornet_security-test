import { describe, expect, it } from 'vitest'

import {
  applyFilters,
  hasActiveFilters,
  isFilterFieldActive,
} from '~ui/app/utils/Components/Filter/apply-filters'

import type { FilterSchema } from '~ui/app/utils/Components/Filter/schema'

interface Item {
  id: number
  name: string
  status: string
  premium: boolean
  category: string
}

const items: Item[] = [
  { category: 'web', id: 1, name: 'Alpha', premium: true, status: 'active' },
  { category: 'mobile', id: 2, name: 'Beta', premium: false, status: 'archived' },
  { category: 'web', id: 3, name: 'Gamma', premium: false, status: 'active' },
]

const schema = {
  category: {
    defaultValue: [] as string[],
    getValue: (item: Item) => item.category,
    type: 'toggle-group',
  },
  premium: {
    defaultValue: false,
    getValue: (item: Item) => item.premium,
    type: 'toggle',
  },
  search: {
    defaultValue: '',
    fuse: {
      fuseOptions: { keys: ['name'] },
      matchAllWhenSearchEmpty: true,
    },
    type: 'search',
  },
  status: {
    defaultValue: [] as string[],
    getValue: (item: Item) => item.status,
    type: 'select',
  },
} satisfies FilterSchema<Item>

describe('applyFilters', () => {
  it('returns all items when no filters are active', () => {
    const values = {
      category: [],
      premium: false,
      search: '',
      status: [],
    }
    expect(applyFilters({ items, schema, values })).toEqual(items)
  })

  it('filters by select values', () => {
    const values = {
      category: [],
      premium: false,
      search: '',
      status: ['active'],
    }
    expect(applyFilters({ items, schema, values }).map((item) => item.id)).toEqual([1, 3])
  })

  it('filters by toggle when active', () => {
    const values = {
      category: [],
      premium: true,
      search: '',
      status: [],
    }
    expect(applyFilters({ items, schema, values }).map((item) => item.id)).toEqual([1])
  })

  it('filters by toggle-group selection', () => {
    const values = {
      category: ['mobile'],
      premium: false,
      search: '',
      status: [],
    }
    expect(applyFilters({ items, schema, values }).map((item) => item.id)).toEqual([2])
  })

  it('combines filters with AND logic', () => {
    const values = {
      category: ['web'],
      premium: true,
      search: '',
      status: ['active'],
    }
    expect(applyFilters({ items, schema, values }).map((item) => item.id)).toEqual([1])
  })

  it('uses custom filterFunction when provided', () => {
    const customSchema = {
      status: {
        defaultValue: [] as string[],
        filterFunction: (item: Item) => item.id > 1,
        getValue: (item: Item) => item.status,
        type: 'select',
      },
    } satisfies FilterSchema<Item>

    expect(
      applyFilters({ items, schema: customSchema, values: { status: ['active'] } }).map(
        (item) => item.id,
      ),
    ).toEqual([2, 3])
  })
})

describe('hasActiveFilters', () => {
  it('detects active select and toggle filters', () => {
    expect(
      hasActiveFilters(schema, {
        category: [],
        premium: false,
        search: '',
        status: ['active'],
      }),
    ).toBe(true)
    expect(
      hasActiveFilters(schema, {
        category: [],
        premium: true,
        search: '',
        status: [],
      }),
    ).toBe(true)
    expect(
      hasActiveFilters(schema, {
        category: [],
        premium: false,
        search: '  ',
        status: [],
      }),
    ).toBe(false)
  })

  it('respects custom isActive', () => {
    const customSchema = {
      status: {
        defaultValue: [] as string[],
        isActive: (value: string[]) => value.includes('archived'),
        type: 'select',
      },
    } satisfies FilterSchema<Item>

    expect(isFilterFieldActive(customSchema.status, ['active'])).toBe(false)
    expect(isFilterFieldActive(customSchema.status, ['archived'])).toBe(true)
  })
})
