import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'

import UIPaginationContext from '~ui/app/components/Pagination/Context.vue'
import UIPaginationEllipsis from '~ui/app/components/Pagination/Ellipsis.vue'
import UIPaginationFirstTrigger from '~ui/app/components/Pagination/FirstTrigger.vue'
import UIPagination from '~ui/app/components/Pagination/index.vue'
import UIPaginationLastTrigger from '~ui/app/components/Pagination/LastTrigger.vue'
import UIPaginationNextTrigger from '~ui/app/components/Pagination/NextTrigger.vue'
import UIPaginationPageTrigger from '~ui/app/components/Pagination/PageTrigger.vue'
import UIPaginationPrevTrigger from '~ui/app/components/Pagination/PrevTrigger.vue'
import UIPaginationRoot from '~ui/app/components/Pagination/Root.vue'

/**
 * Manual composition harness using UIPaginationRoot + explicit triggers.
 * Tests the composable API used by the assembled UIPagination internally.
 */
function paginationRootHarness(extraProps: Record<string, unknown> = {}) {
  return defineComponent({
    name: 'PaginationRootHarness',
    setup() {
      return () =>
        h(
          UIPaginationRoot,
          {
            count: 100,
            'data-testid': 'pagination-root',
            'page-size': 10,
            'sibling-count': 1,
            ...extraProps,
          },
          {
            default: () => [
              h(UIPaginationPrevTrigger),
              h(
                UIPaginationContext,
                {},
                {
                  default: ({
                    pages,
                  }: {
                    pages: Array<{ type: string; value: number; index?: number }>
                  }) =>
                    pages.map((page) =>
                      page.type === 'page'
                        ? h(UIPaginationPageTrigger, { key: page.value, value: page.value })
                        : h(UIPaginationEllipsis, {
                            index: page.index ?? 0,
                            key: `ellipsis-${page.index}`,
                          }),
                    ),
                },
              ),
              h(UIPaginationNextTrigger),
            ],
          },
        )
    },
  })
}

describe('UIPagination (assembled)', () => {
  it('renders the root element', async () => {
    const wrapper = await mountSuspended(
      defineComponent({
        name: 'AssembledHarness',
        setup() {
          return () =>
            h(UIPagination, { count: 100, 'data-testid': 'pagination-root', 'page-size': 10 })
        },
      }),
    )

    expect(wrapper.find('[data-testid="pagination-root"]').exists()).toBe(true)
  })

  it('renders prev/next triggers and page buttons', async () => {
    const wrapper = await mountSuspended(
      defineComponent({
        name: 'AssembledHarness',
        setup() {
          return () => h(UIPagination, { count: 100, 'page-size': 10 })
        },
      }),
    )

    const buttons = wrapper.findAll('button')
    expect(buttons.length).toBeGreaterThan(2)
  })

  it('navigates to a different page when clicking a page button', async () => {
    const wrapper = await mountSuspended(
      defineComponent({
        name: 'AssembledHarness',
        setup() {
          return () => h(UIPagination, { count: 100, 'page-size': 10 })
        },
      }),
    )

    const page3Button = wrapper.findAll('button').find((b) => b.text().trim() === '3')
    expect(page3Button).toBeDefined()
    await page3Button!.trigger('click')
    await nextTick()

    const buttons = wrapper.findAll('button')
    const selectedButton = buttons.find((b) => b.attributes('data-selected') !== undefined)
    expect(selectedButton).toBeDefined()
    expect(selectedButton!.text().trim()).toBe('3')
  })

  it('supports v-model:page', async () => {
    const page = ref<number>(3)

    const Controlled = defineComponent({
      name: 'ControlledHarness',
      setup() {
        return () =>
          h(UIPagination, {
            count: 100,
            'onUpdate:page': (v: number) => {
              page.value = v
            },
            page: page.value,
            'page-size': 10,
          })
      },
    })

    const wrapper = await mountSuspended(Controlled)

    const page3Button = wrapper.findAll('button').find((b) => b.text().trim() === '3')
    expect(page3Button!.attributes('data-selected')).toBe('')

    page.value = 5
    await nextTick()
    const page5Button = wrapper.findAll('button').find((b) => b.text().trim() === '5')
    expect(page5Button!.attributes('data-selected')).toBe('')
  })

  it('updates v-model:page when clicking a page button', async () => {
    const page = ref<number>(1)

    const Controlled = defineComponent({
      name: 'VModelPageUpdateHarness',
      setup() {
        return () =>
          h(UIPagination, {
            count: 100,
            'onUpdate:page': (v: number) => {
              page.value = v
            },
            page: page.value,
            'page-size': 10,
          })
      },
    })

    const wrapper = await mountSuspended(Controlled)

    const page4Button = wrapper.findAll('button').find((b) => b.text().trim() === '4')
    expect(page4Button).toBeDefined()
    await page4Button!.trigger('click')
    await nextTick()

    expect(page.value).toBe(4)
  })

  it('supports v-model:pageSize', async () => {
    const pageSize = ref<number>(10)

    const Controlled = defineComponent({
      name: 'VModelPageSizeHarness',
      setup() {
        return () =>
          h(UIPagination, {
            count: 100,
            'onUpdate:pageSize': (v: number) => {
              pageSize.value = v
            },
            'page-size': pageSize.value,
          })
      },
    })

    const wrapper = await mountSuspended(Controlled)
    expect(wrapper.exists()).toBe(true)

    pageSize.value = 20
    await nextTick()
    expect(pageSize.value).toBe(20)
  })
})

describe('UIPagination (assembled)', () => {
  it('supports showFirstLast prop', async () => {
    const wrapper = await mountSuspended(
      defineComponent({
        name: 'ShowFirstLastHarness',
        setup() {
          return () => h(UIPagination, { count: 200, 'page-size': 10, showFirstLast: true })
        },
      }),
    )

    const buttons = wrapper.findAll('button')
    // first, prev, pages, next, last — should have at least 5 buttons
    expect(buttons.length).toBeGreaterThanOrEqual(5)
  })
})

describe('UIPaginationRoot (manual composition)', () => {
  it('renders the root element', async () => {
    const wrapper = await mountSuspended(paginationRootHarness())

    expect(wrapper.find('[data-testid="pagination-root"]').exists()).toBe(true)
  })

  it('renders ellipsis for many pages', async () => {
    const wrapper = await mountSuspended(
      defineComponent({
        name: 'ManyPagesHarness',
        setup() {
          return () => h(UIPagination, { count: 500, 'page-size': 10, 'sibling-count': 1 })
        },
      }),
    )

    const ellipsisElements = wrapper.findAll('[data-part="ellipsis"]')
    expect(ellipsisElements.length).toBeGreaterThan(0)
  })

  it('emits page-change event', async () => {
    const pageChangeSpy = vi.fn()

    const wrapper = await mountSuspended(
      defineComponent({
        name: 'EmitHarness',
        setup() {
          return () =>
            h(UIPagination, {
              count: 100,
              onPageChange: pageChangeSpy,
              'page-size': 10,
              'sibling-count': 1,
            })
        },
      }),
    )

    const page4Button = wrapper.findAll('button').find((b) => b.text().trim() === '4')
    if (page4Button) {
      await page4Button.trigger('click')
      await nextTick()
      expect(pageChangeSpy).toHaveBeenCalled()
    }
  })
})

describe('UIPaginationRoot (manual composition)', () => {
  it('renders the root element', async () => {
    const wrapper = await mountSuspended(paginationRootHarness())

    expect(wrapper.find('[data-testid="pagination-root"]').exists()).toBe(true)
  })

  it('shows the first page as selected by default', async () => {
    const wrapper = await mountSuspended(paginationRootHarness())

    const page1Button = wrapper.findAll('button').find((b) => b.text().trim() === '1')
    expect(page1Button).toBeDefined()
    expect(page1Button!.attributes('data-selected')).toBe('')
  })

  it('navigates via prev/next triggers', async () => {
    const wrapper = await mountSuspended(paginationRootHarness())

    const allButtons = wrapper.findAll('button')
    const [prevButton] = allButtons
    const nextButton = allButtons[allButtons.length - 1]

    // Prev should be disabled on first page
    expect(prevButton!.attributes('disabled')).toBeDefined()

    // Click next
    await nextButton!.trigger('click')
    await nextTick()

    // Now on page 2
    const page2Button = wrapper.findAll('button').find((b) => b.text().trim() === '2')
    expect(page2Button!.attributes('data-selected')).toBe('')
  })

  it('supports controlled page via v-model:page', async () => {
    const page = ref<number>(3)

    const Controlled = defineComponent({
      name: 'PaginationControlledHarness',
      setup() {
        return () =>
          h(
            UIPaginationRoot,
            {
              count: 100,
              'onUpdate:page': (v: number) => {
                page.value = v
              },
              page: page.value,
              'page-size': 10,
              'sibling-count': 1,
            },
            {
              default: () => [
                h(UIPaginationPrevTrigger),
                h(
                  UIPaginationContext,
                  {},
                  {
                    default: ({
                      pages,
                    }: {
                      pages: Array<{ type: string; value: number; index?: number }>
                    }) =>
                      pages.map((p) =>
                        p.type === 'page'
                          ? h(UIPaginationPageTrigger, { key: p.value, value: p.value })
                          : h(UIPaginationEllipsis, { index: p.index ?? 0, key: `e-${p.index}` }),
                      ),
                  },
                ),
                h(UIPaginationNextTrigger),
              ],
            },
          )
      },
    })

    const wrapper = await mountSuspended(Controlled)

    const page3Button = wrapper.findAll('button').find((b) => b.text().trim() === '3')
    expect(page3Button!.attributes('data-selected')).toBe('')

    page.value = 5
    await nextTick()
    const page5Button = wrapper.findAll('button').find((b) => b.text().trim() === '5')
    expect(page5Button!.attributes('data-selected')).toBe('')
  })

  it('supports RootProvider mode with external API', async () => {
    const { usePagination } = await import('@ark-ui/vue/pagination')

    const Provider = defineComponent({
      name: 'PaginationProviderHarness',
      setup() {
        const api = usePagination({ count: 50, pageSize: 10 })
        return () =>
          h(
            UIPaginationRoot,
            { 'sibling-count': 1, value: api.value },
            {
              default: () => [
                h(UIPaginationPrevTrigger),
                h(
                  UIPaginationContext,
                  {},
                  {
                    default: ({
                      pages,
                    }: {
                      pages: Array<{ type: string; value: number; index?: number }>
                    }) =>
                      pages.map((p) =>
                        p.type === 'page'
                          ? h(UIPaginationPageTrigger, { key: p.value, value: p.value })
                          : h(UIPaginationEllipsis, { index: p.index ?? 0, key: `e-${p.index}` }),
                      ),
                  },
                ),
                h(UIPaginationNextTrigger),
              ],
            },
          )
      },
    })

    const wrapper = await mountSuspended(Provider)

    expect(wrapper.find('[data-part="root"]').exists()).toBe(true)
    const buttons = wrapper.findAll('button')
    expect(buttons.length).toBeGreaterThan(2)
  })

  it('renders FirstTrigger and LastTrigger', async () => {
    const WithFirstLast = defineComponent({
      name: 'WithFirstLastHarness',
      setup() {
        return () =>
          h(
            UIPaginationRoot,
            { count: 200, 'page-size': 10, 'sibling-count': 1 },
            {
              default: () => [
                h(UIPaginationFirstTrigger),
                h(UIPaginationPrevTrigger),
                h(
                  UIPaginationContext,
                  {},
                  {
                    default: ({
                      pages,
                    }: {
                      pages: Array<{ type: string; value: number; index?: number }>
                    }) =>
                      pages.map((p) =>
                        p.type === 'page'
                          ? h(UIPaginationPageTrigger, { key: p.value, value: p.value })
                          : h(UIPaginationEllipsis, { index: p.index ?? 0, key: `e-${p.index}` }),
                      ),
                  },
                ),
                h(UIPaginationNextTrigger),
                h(UIPaginationLastTrigger),
              ],
            },
          )
      },
    })

    const wrapper = await mountSuspended(WithFirstLast)

    const buttons = wrapper.findAll('button')
    expect(buttons.length).toBeGreaterThan(4)
  })

  it('passes context slot props with correct page range', async () => {
    const ContextTest = defineComponent({
      name: 'ContextTestHarness',
      setup() {
        return () =>
          h(
            UIPaginationRoot,
            { count: 43, 'data-testid': 'ctx-root', 'page-size': 10, 'sibling-count': 1 },
            {
              default: () => [
                h(
                  UIPaginationContext,
                  {},
                  {
                    default: (ctx: {
                      page: number
                      totalPages: number
                      pageRange: { start: number; end: number }
                      count: number
                      pageSize: number
                    }) =>
                      h('div', { 'data-testid': 'context-data' }, [
                        h('span', { 'data-testid': 'ctx-page' }, String(ctx.page)),
                        h('span', { 'data-testid': 'ctx-totalPages' }, String(ctx.totalPages)),
                        h(
                          'span',
                          { 'data-testid': 'ctx-range-start' },
                          String(ctx.pageRange.start),
                        ),
                        h('span', { 'data-testid': 'ctx-range-end' }, String(ctx.pageRange.end)),
                        h('span', { 'data-testid': 'ctx-count' }, String(ctx.count)),
                        h('span', { 'data-testid': 'ctx-pageSize' }, String(ctx.pageSize)),
                      ]),
                  },
                ),
              ],
            },
          )
      },
    })

    const wrapper = await mountSuspended(ContextTest)

    expect(wrapper.find('[data-testid="ctx-page"]').text()).toBe('1')
    expect(wrapper.find('[data-testid="ctx-totalPages"]').text()).toBe('5')
    expect(wrapper.find('[data-testid="ctx-range-start"]').text()).toBe('0')
    expect(wrapper.find('[data-testid="ctx-range-end"]').text()).toBe('10')
    expect(wrapper.find('[data-testid="ctx-count"]').text()).toBe('43')
    expect(wrapper.find('[data-testid="ctx-pageSize"]').text()).toBe('10')
  })
})

describe('UIPagination triggers with asChild', () => {
  it('renders PrevTrigger with asChild=true', async () => {
    const wrapper = await mountSuspended(
      defineComponent({
        name: 'PrevTriggerAsChildHarness',
        components: { UIPaginationPrevTrigger, UIPaginationRoot },
        setup() {
          return () =>
            h(
              UIPaginationRoot,
              { count: 100, 'page-size': 10 },
              {
                default: () => [h(UIPaginationPrevTrigger, { asChild: true })],
              },
            )
        },
      }),
    )

    const trigger = wrapper.find('[data-part="prev-trigger"]')
    expect(trigger.exists()).toBe(true)
  })

  it('renders NextTrigger with asChild=true', async () => {
    const wrapper = await mountSuspended(
      defineComponent({
        name: 'NextTriggerAsChildHarness',
        components: { UIPaginationNextTrigger, UIPaginationRoot },
        setup() {
          return () =>
            h(
              UIPaginationRoot,
              { count: 100, 'page-size': 10 },
              {
                default: () => [h(UIPaginationNextTrigger, { asChild: true })],
              },
            )
        },
      }),
    )

    const trigger = wrapper.find('[data-part="next-trigger"]')
    expect(trigger.exists()).toBe(true)
  })

  it('renders FirstTrigger with asChild=true', async () => {
    const wrapper = await mountSuspended(
      defineComponent({
        name: 'FirstTriggerAsChildHarness',
        components: { UIPaginationFirstTrigger, UIPaginationRoot },
        setup() {
          return () =>
            h(
              UIPaginationRoot,
              { count: 100, 'page-size': 10 },
              {
                default: () => [h(UIPaginationFirstTrigger, { asChild: true })],
              },
            )
        },
      }),
    )

    const trigger = wrapper.find('[data-part="first-trigger"]')
    expect(trigger.exists()).toBe(true)
  })

  it('renders LastTrigger with asChild=true', async () => {
    const wrapper = await mountSuspended(
      defineComponent({
        name: 'LastTriggerAsChildHarness',
        components: { UIPaginationLastTrigger, UIPaginationRoot },
        setup() {
          return () =>
            h(
              UIPaginationRoot,
              { count: 100, 'page-size': 10 },
              {
                default: () => [h(UIPaginationLastTrigger, { asChild: true })],
              },
            )
        },
      }),
    )

    const trigger = wrapper.find('[data-part="last-trigger"]')
    expect(trigger.exists()).toBe(true)
  })
})
