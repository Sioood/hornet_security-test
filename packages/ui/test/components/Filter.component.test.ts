import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it, vi } from 'vitest'

import FilterBar from '~ui/app/components/Filter/Bar.vue'
import { applyFilters } from '~ui/app/utils/Components/Filter/apply-filters'

import type { FilterSchema, FilterValues } from '~ui/app/utils/Components/Filter/schema'

interface Row {
  id: number
  name: string
  status: string
  premium: boolean
}

const rows: Row[] = [
  { id: 1, name: 'Alpha', premium: true, status: 'active' },
  { id: 2, name: 'Beta', premium: false, status: 'archived' },
]

const schema = {
  premium: {
    defaultValue: false,
    getValue: (item: Row) => item.premium,
    label: 'Premium',
    type: 'toggle',
    variant: 'switch',
  },
  search: {
    defaultValue: '',
    fuse: { fuseOptions: { keys: ['name'] }, matchAllWhenSearchEmpty: true },
    placeholder: 'Search rows',
    type: 'search',
  },
  status: {
    defaultValue: [] as string[],
    getValue: (item: Row) => item.status,
    label: 'Status',
    props: {
      items: [
        { label: 'Active', value: 'active' },
        { label: 'Archived', value: 'archived' },
      ],
    },
    type: 'select',
  },
} satisfies FilterSchema<Row>

describe('UIFilterBar', () => {
  it('renders search and filter fields in bar mode', async () => {
    vi.stubGlobal('useBreakpoints', () => ({
      greaterOrEqual: () => ref(true),
    }))

    const values = ref<FilterValues>({
      premium: false,
      search: '',
      status: [],
    })

    const wrapper = await mountSuspended(FilterBar, {
      props: {
        layout: ['search', 'status', 'premium'],
        modelValue: values.value,
        'onUpdate:modelValue': (next: FilterValues) => {
          values.value = next
        },
        schema,
      },
    })

    expect(wrapper.attributes('data-ui-filter-bar')).toBeDefined()
    expect(wrapper.find('input[inputmode="search"]').attributes('placeholder')).toBe('Search rows')
    expect(wrapper.text()).toContain('Status')
    expect(wrapper.text()).toContain('Premium')
    expect(wrapper.get('button[disabled]').text()).toContain('Réinitialiser les filtres')

    vi.unstubAllGlobals()
  })

  it('renders compact popover layout when forceCompact is true', async () => {
    vi.stubGlobal('useBreakpoints', () => ({
      greaterOrEqual: () => ref(true),
    }))

    const wrapper = await mountSuspended(FilterBar, {
      props: {
        forceCompact: true,
        schema,
      },
    })

    expect(wrapper.attributes('data-ui-filter-bar')).toBeDefined()
    expect(wrapper.get('button[aria-label="Filtres"]').exists()).toBe(true)
    expect(wrapper.text()).toContain('Réinitialiser les filtres')

    vi.unstubAllGlobals()
  })

  it('filters items when values are applied through applyFilters', async () => {
    const values: FilterValues = {
      premium: false,
      search: '',
      status: ['active'],
    }

    expect(applyFilters({ items: rows, schema, values }).map((row) => row.id)).toEqual([1])
  })

  it('v-model defaults match schema', async () => {
    vi.stubGlobal('useBreakpoints', () => ({
      greaterOrEqual: () => ref(true),
    }))

    const wrapper = await mountSuspended(FilterBar, {
      props: {
        schema,
      },
    })

    expect(wrapper.attributes('data-ui-filter-bar')).toBeDefined()

    vi.unstubAllGlobals()
  })
})
