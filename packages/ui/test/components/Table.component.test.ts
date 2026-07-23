import { mountSuspended } from '@nuxt/test-utils/runtime'
import { flushPromises } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { defineComponent, h, ref } from 'vue'

import {
  createExpandToggleColumn,
  createSelectionColumn,
} from '~/utils/Components/Table/column-helpers'
import ExpandToggle from '~ui/app/components/Table/helpers/ExpandToggle.vue'
import RowContextMenu from '~ui/app/components/Table/helpers/RowContextMenu.vue'
import RowSelectionCell from '~ui/app/components/Table/helpers/RowSelectionCell.vue'
import RowSelectionHeader from '~ui/app/components/Table/helpers/RowSelectionHeader.vue'
import UITable from '~ui/app/components/Table/index.vue'
import { useUITable } from '~ui/app/composables/useUITable'

import type { UITableColumn } from '~/utils/Components/Table/types'

type Payment = {
  id: string
  email: string
  amount: number
}

const sampleData: Payment[] = [
  { amount: 100, email: 'alice@example.com', id: '1' },
  { amount: 200, email: 'bob@example.com', id: '2' },
]

describe('UITable (assembled)', () => {
  it('renders rows from data', async () => {
    const wrapper = await mountSuspended(
      defineComponent({
        setup() {
          const data = ref(sampleData)
          return () => h(UITable, { data: data.value, 'data-testid': 'table-root' })
        },
      }),
    )

    expect(wrapper.find('table').exists()).toBe(true)
    expect(wrapper.text()).toContain('alice@example.com')
    expect(wrapper.text()).toContain('bob@example.com')
  })

  it('renders empty state when data is empty', async () => {
    const wrapper = await mountSuspended(
      defineComponent({
        setup() {
          return () => h(UITable, { data: [], empty: 'No payments yet' })
        },
      }),
    )

    expect(wrapper.text()).toContain('No payments yet')
  })

  it('supports custom cell slots', async () => {
    const wrapper = await mountSuspended(
      defineComponent({
        setup() {
          const data = ref(sampleData)
          const columns = ref([
            { accessorKey: 'email', header: 'Email' },
            { accessorKey: 'amount', header: 'Amount' },
          ])

          return () =>
            h(
              UITable,
              { columns: columns.value, data: data.value },
              {
                'email-cell': ({ row }: { row: { original: Payment } }) =>
                  h('span', { 'data-testid': 'email-cell' }, row.original.email.toUpperCase()),
              },
            )
        },
      }),
    )

    expect(wrapper.find('[data-testid="email-cell"]').text()).toBe('ALICE@EXAMPLE.COM')
  })

  it('sorts rows when sorting state changes', async () => {
    const sorting = ref([{ desc: false, id: 'email' }])
    const data = ref(sampleData)
    const columns = ref<UITableColumn<Payment>[]>([
      { accessorKey: 'email', enableSorting: true, header: 'Email' },
    ])

    const wrapper = await mountSuspended(
      defineComponent({
        setup() {
          const table = useUITable({
            columns,
            data,
            stateModels: { sorting },
          })

          return () =>
            h('div', [
              h(
                'span',
                { 'data-testid': 'first-email' },
                table.getRowModel().rows[0]?.original.email ?? '',
              ),
              h(
                'button',
                {
                  'data-testid': 'sort-email',
                  onClick: (event: Event) => {
                    table.getColumn('email')?.getToggleSortingHandler()?.(event)
                  },
                },
                'Sort email',
              ),
            ])
        },
      }),
    )

    expect(wrapper.find('[data-testid="first-email"]').text()).toBe('alice@example.com')
    await wrapper.find('[data-testid="sort-email"]').trigger('click')
    await flushPromises()
    expect(sorting.value).toEqual([{ desc: true, id: 'email' }])
    expect(wrapper.find('[data-testid="first-email"]').text()).toBe('bob@example.com')
  })

  it('updates row selection through the table api', async () => {
    const rowSelection = ref<Record<string, boolean>>({})
    const data = ref(sampleData)
    const columns = ref<UITableColumn<Payment>[]>([{ accessorKey: 'email', header: 'Email' }])

    const wrapper = await mountSuspended(
      defineComponent({
        setup() {
          const table = useUITable({
            columns,
            data,
            getRowId: (row) => row.id,
            stateModels: { rowSelection },
          })

          return () =>
            h(
              'button',
              {
                'data-testid': 'select-first',
                onClick: () => {
                  table.getRowModel().rows[0]?.toggleSelected(true)
                },
              },
              'Select first',
            )
        },
      }),
    )

    await wrapper.find('[data-testid="select-first"]').trigger('click')
    await flushPromises()
    expect(Object.values(rowSelection.value).filter(Boolean).length).toBe(1)
  })

  it('filters rows through global filter state', async () => {
    const globalFilter = ref('')
    const data = ref(sampleData)
    const columns = ref<UITableColumn<Payment>[]>([{ accessorKey: 'email', header: 'Email' }])

    const wrapper = await mountSuspended(
      defineComponent({
        setup() {
          const table = useUITable({
            columns,
            data,
            stateModels: { globalFilter },
          })

          return () =>
            h('div', [
              h('span', { 'data-testid': 'row-count' }, String(table.getRowModel().rows.length)),
              h(
                'button',
                {
                  'data-testid': 'filter-bob',
                  onClick: () => {
                    table.setGlobalFilter('bob')
                  },
                },
                'Filter bob',
              ),
            ])
        },
      }),
    )

    expect(wrapper.find('[data-testid="row-count"]').text()).toBe('2')
    await wrapper.find('[data-testid="filter-bob"]').trigger('click')
    await flushPromises()
    expect(globalFilter.value).toBe('bob')
    expect(wrapper.find('[data-testid="row-count"]').text()).toBe('1')
  })

  it('calls toggleSelected from the selection cell checkbox', async () => {
    const toggleSelected = vi.fn()
    const wrapper = await mountSuspended(RowSelectionCell, {
      props: {
        checked: false,
        toggleSelected,
      },
    })

    await wrapper.find('input[type="checkbox"]').trigger('click')
    await flushPromises()
    expect(toggleSelected).toHaveBeenCalledWith(true)
  })

  it('selects rows when clicking the selection checkbox', async () => {
    const rowSelection = ref<Record<string, boolean>>({})
    const data = ref(sampleData)
    const columns = ref<UITableColumn<Payment>[]>([
      createSelectionColumn({
        Cell: RowSelectionCell,
        Header: RowSelectionHeader,
      }),
      { accessorKey: 'email', header: 'Email' },
    ])

    const Host = defineComponent({
      components: { UITable },
      setup() {
        return { columns, data, getRowId: (row: Payment) => row.id, rowSelection }
      },
      template: `
        <UITable
          v-model:row-selection="rowSelection"
          :data
          :columns
          :get-row-id="getRowId"
        />
      `,
    })

    const wrapper = await mountSuspended(Host)

    const [, rowCheckbox] = wrapper.findAll('input[type="checkbox"]')
    expect(rowCheckbox).toBeDefined()
    await rowCheckbox!.trigger('click')
    await flushPromises()
    expect(Object.values(rowSelection.value).filter(Boolean).length).toBe(1)
  })

  it('toggles expanded rows through the expand button', async () => {
    const expanded = ref<Record<string, boolean>>({ '1': true })
    const data = ref(sampleData)
    const columns = ref<UITableColumn<Payment>[]>([
      createExpandToggleColumn({
        Toggle: ExpandToggle,
      }),
      { accessorKey: 'email', header: 'Email' },
    ])

    const Host = defineComponent({
      components: { UITable },
      setup() {
        return {
          columns,
          data,
          expanded,
          getRowId: (row: Payment) => row.id,
        }
      },
      template: `
        <UITable
          v-model:expanded="expanded"
          :data
          :columns
          :get-row-id="getRowId"
        >
          <template #expanded="{ row }">
            <span data-testid="expanded-content">{{ row.original.email }}</span>
          </template>
        </UITable>
      `,
    })

    const wrapper = await mountSuspended(Host)

    expect(wrapper.find('[data-testid="expanded-content"]').exists()).toBe(true)

    const expandButtons = wrapper.findAll('button[aria-label="Toggle row expansion"]')
    expect(expandButtons.length).toBeGreaterThan(1)

    await expandButtons[1]!.trigger('click')
    await flushPromises()

    expect(expanded.value['1']).toBe(true)
    expect(expanded.value['2']).toBe(true)
    expect(wrapper.findAll('[data-testid="expanded-content"]').length).toBe(2)
  })

  it('renders context menu items after row contextmenu', async () => {
    const data = ref(sampleData)
    const columns = ref<UITableColumn<Payment>[]>([{ accessorKey: 'email', header: 'Email' }])
    const getItems = vi.fn(() => [
      { label: 'Log row data', type: 'item' as const, value: 'log-row' },
      { label: 'Copy email', type: 'item' as const, value: 'copy-email' },
    ])

    const Host = defineComponent({
      components: { RowContextMenu, UITable },
      setup() {
        return { columns, data, getItems, getRowId: (row: Payment) => row.id }
      },
      template: `
        <RowContextMenu :get-items="getItems">
          <template #default="{ onContextmenu }">
            <UITable
              :data
              :columns
              :get-row-id="getRowId"
              :on-contextmenu="onContextmenu"
            />
          </template>
        </RowContextMenu>
      `,
    })

    const wrapper = await mountSuspended(Host)

    await wrapper.find('tbody tr').trigger('contextmenu', {
      clientX: 120,
      clientY: 80,
    })
    await flushPromises()

    expect(getItems).toHaveBeenCalledTimes(1)
    expect(document.body.textContent).toContain('Log row data')
    expect(document.body.textContent).toContain('Copy email')
    expect(document.querySelectorAll('[data-part="item"]').length).toBeGreaterThanOrEqual(2)
  })

  it('keeps stable table options handlers across repeated sorts', async () => {
    const sorting = ref([{ desc: false, id: 'email' }])
    const data = ref(sampleData)
    const columns = ref<UITableColumn<Payment>[]>([
      { accessorKey: 'email', enableSorting: true, header: 'Email' },
    ])

    let table: ReturnType<typeof useUITable<Payment>> | undefined

    await mountSuspended(
      defineComponent({
        setup() {
          table = useUITable({
            columns,
            data,
            stateModels: { sorting },
          })
          return () => h('div')
        },
      }),
    )

    expect(table).toBeDefined()

    const durations: number[] = []
    for (let index = 0; index < 20; index += 1) {
      const started = performance.now()
      table!.getColumn('email')?.toggleSorting(index % 2 === 0)
      await flushPromises()
      durations.push(performance.now() - started)
    }

    const firstHalf = durations.slice(0, 10).reduce((sum, value) => sum + value, 0) / 10
    const secondHalf = durations.slice(10).reduce((sum, value) => sum + value, 0) / 10

    expect(secondHalf).toBeLessThan(firstHalf * 4)
  })
})
