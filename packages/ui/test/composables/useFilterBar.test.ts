import { describe, expect, it, vi } from 'vitest'
import { effectScope, ref } from 'vue'

import { useFilterBar } from '../../app/composables/useFilterBar'

import type { FilterSchema } from '~ui/app/utils/Components/Filter/schema'

interface Row {
  id: number
  name: string
  status: string
}

const rows: Row[] = [
  { id: 1, name: 'Alpha', status: 'active' },
  { id: 2, name: 'Beta', status: 'archived' },
]

const schema = {
  search: {
    defaultValue: '',
    fuse: { fuseOptions: { keys: ['name'] }, matchAllWhenSearchEmpty: true },
    type: 'search',
  },
  status: {
    defaultValue: [] as string[],
    getValue: (item: Row) => item.status,
    type: 'select',
  },
} satisfies FilterSchema<Row>

describe('useFilterBar', () => {
  it('filters items from current values', () => {
    const scope = effectScope(true)
    scope.run(() => {
      const api = useFilterBar({
        schema,
        values: ref({
          search: '',
          status: ['active'],
        }),
      })

      expect(api.filter(rows).map((row) => row.id)).toEqual([1])
    })
    scope.stop()
  })

  it('reset() restores schema defaults', () => {
    const scope = effectScope(true)
    scope.run(() => {
      const values = ref({
        search: 'beta',
        status: ['archived'],
      })

      const api = useFilterBar({ schema, values })

      api.reset()

      expect(values.value).toEqual({
        search: '',
        status: [],
      })
    })
    scope.stop()
  })

  it('debounces onChange with watchDebounced', async () => {
    vi.useFakeTimers()
    const scope = effectScope(true)
    await scope.run(async () => {
      const onChange = vi.fn()

      const values = ref({
        search: '',
        status: [] as string[],
      })

      useFilterBar({
        debounce: 300,
        onChange,
        schema,
        values,
      })

      values.value = { ...values.value, status: ['active'] }
      expect(onChange).not.toHaveBeenCalled()

      await vi.advanceTimersByTimeAsync(300)
      expect(onChange).toHaveBeenCalledWith({
        search: '',
        status: ['active'],
      })
    })
    scope.stop()
    vi.useRealTimers()
  })

  it('flushSearch() emits immediately', () => {
    const scope = effectScope(true)
    scope.run(() => {
      const onChange = vi.fn()
      const values = ref({
        search: 'al',
        status: [] as string[],
      })

      const api = useFilterBar({
        onChange,
        schema,
        values,
      })

      api.flushSearch()

      expect(onChange).toHaveBeenCalledWith({
        search: 'al',
        status: [],
      })
    })
    scope.stop()
  })
})
