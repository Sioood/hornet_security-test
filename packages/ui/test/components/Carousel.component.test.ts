import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'

import UICarouselContext from '~ui/app/components/Carousel/Context.vue'
import UICarousel from '~ui/app/components/Carousel/index.vue'
import UICarouselIndicator from '~ui/app/components/Carousel/Indicator.vue'
import UICarouselIndicatorGroup from '~ui/app/components/Carousel/IndicatorGroup.vue'
import UICarouselItem from '~ui/app/components/Carousel/Item.vue'
import UICarouselItemGroup from '~ui/app/components/Carousel/ItemGroup.vue'
import UICarouselNextTrigger from '~ui/app/components/Carousel/NextTrigger.vue'
import UICarouselPrevTrigger from '~ui/app/components/Carousel/PrevTrigger.vue'
import UICarouselRoot from '~ui/app/components/Carousel/Root.vue'

const slides = ['Slide 1', 'Slide 2', 'Slide 3']

function carouselRootHarness(extraProps: Record<string, unknown> = {}) {
  return defineComponent({
    name: 'CarouselRootHarness',
    setup() {
      return () =>
        h(
          UICarouselRoot,
          {
            'data-testid': 'carousel-root',
            slideCount: slides.length,
            ...extraProps,
          },
          {
            default: () => [
              h(UICarouselPrevTrigger),
              h(UICarouselItemGroup, {}, () =>
                slides.map((label, index) =>
                  h(UICarouselItem, { index, key: index }, () => h('div', {}, label)),
                ),
              ),
              h(UICarouselNextTrigger),
              h(
                UICarouselContext,
                {},
                {
                  default: ({ pageSnapPoints }: { pageSnapPoints: number[] }) =>
                    h(UICarouselIndicatorGroup, {}, () =>
                      pageSnapPoints.map((_, index) =>
                        h(UICarouselIndicator, { index, key: index }),
                      ),
                    ),
                },
              ),
            ],
          },
        )
    },
  })
}

describe('UICarousel (assembled)', () => {
  it('renders the root element', async () => {
    const wrapper = await mountSuspended(
      defineComponent({
        name: 'AssembledHarness',
        setup() {
          return () =>
            h(UICarousel, {
              'data-testid': 'carousel-root',
              items: slides,
            })
        },
      }),
    )

    expect(wrapper.find('[data-testid="carousel-root"]').exists()).toBe(true)
  })

  it('renders prev/next triggers and indicators by default', async () => {
    const wrapper = await mountSuspended(
      defineComponent({
        name: 'AssembledHarness',
        setup() {
          return () => h(UICarousel, { items: slides })
        },
      }),
    )

    expect(wrapper.find('[data-part="prev-trigger"]').exists()).toBe(true)
    expect(wrapper.find('[data-part="next-trigger"]').exists()).toBe(true)
    expect(wrapper.find('[data-part="indicator-group"]').exists()).toBe(true)
    expect(wrapper.findAll('[data-part="indicator"]').length).toBe(slides.length)
  })

  it('defaults allowMouseDrag to true on root', async () => {
    const wrapper = await mountSuspended(
      defineComponent({
        name: 'DragHarness',
        setup() {
          return () => h(UICarousel, { 'data-testid': 'carousel-root', items: slides })
        },
      }),
    )

    const root = wrapper.find('[data-testid="carousel-root"]')
    expect(root.attributes('data-scope')).toBe('carousel')
  })

  it('supports v-model:page', async () => {
    const page = ref(0)

    const Controlled = defineComponent({
      name: 'ControlledHarness',
      setup() {
        return () =>
          h(UICarousel, {
            items: slides,
            'onUpdate:page': (v: number) => {
              page.value = v
            },
            page: page.value,
          })
      },
    })

    const wrapper = await mountSuspended(Controlled)

    page.value = 2
    await nextTick()

    const currentIndicator = wrapper.find('[data-part="indicator"][data-current]')
    expect(currentIndicator.exists()).toBe(true)
    expect(currentIndicator.attributes('data-index')).toBe('2')
  })

  it('hides indicators when showIndicators is false', async () => {
    const wrapper = await mountSuspended(
      defineComponent({
        name: 'NoIndicatorsHarness',
        setup() {
          return () => h(UICarousel, { items: slides, showIndicators: false })
        },
      }),
    )

    expect(wrapper.find('[data-part="indicator-group"]').exists()).toBe(false)
  })

  it('emits page-change event', async () => {
    const pageChangeSpy = vi.fn()

    const wrapper = await mountSuspended(
      defineComponent({
        name: 'EmitHarness',
        setup() {
          return () =>
            h(UICarousel, {
              items: slides,
              onPageChange: pageChangeSpy,
            })
        },
      }),
    )

    const nextTrigger = wrapper.find('[data-part="next-trigger"]')
    await nextTrigger.trigger('click')
    await nextTick()

    expect(pageChangeSpy).toHaveBeenCalled()
  })
})

describe('UICarouselRoot (manual composition)', () => {
  it('renders the root element', async () => {
    const wrapper = await mountSuspended(carouselRootHarness())

    expect(wrapper.find('[data-testid="carousel-root"]').exists()).toBe(true)
  })

  it('navigates via next trigger', async () => {
    const wrapper = await mountSuspended(carouselRootHarness())

    const nextTrigger = wrapper.find('[data-part="next-trigger"]')
    await nextTrigger.trigger('click')
    await nextTick()

    const currentIndicator = wrapper.find('[data-part="indicator"][data-current]')
    expect(currentIndicator.attributes('data-index')).toBe('1')
  })

  it('supports RootProvider mode with external API', async () => {
    const { useCarousel } = await import('@ark-ui/vue/carousel')

    const Provider = defineComponent({
      name: 'CarouselProviderHarness',
      setup() {
        const api = useCarousel({ allowMouseDrag: true, slideCount: slides.length })
        return () =>
          h(
            UICarouselRoot,
            { value: api.value },
            {
              default: () => [
                h(UICarouselNextTrigger),
                h(UICarouselItemGroup, {}, () =>
                  slides.map((label, index) =>
                    h(UICarouselItem, { index, key: index }, () => h('div', {}, label)),
                  ),
                ),
              ],
            },
          )
      },
    })

    const wrapper = await mountSuspended(Provider)

    expect(wrapper.find('[data-part="root"]').exists()).toBe(true)
    expect(wrapper.find('[data-part="next-trigger"]').exists()).toBe(true)
  })

  it('passes context slot props with pageSnapPoints', async () => {
    const ContextTest = defineComponent({
      name: 'ContextTestHarness',
      setup() {
        return () =>
          h(
            UICarouselRoot,
            { 'data-testid': 'ctx-root', slideCount: slides.length },
            {
              default: () =>
                h(
                  UICarouselContext,
                  {},
                  {
                    default: (ctx: { page: number; pageSnapPoints: number[] }) =>
                      h('div', { 'data-testid': 'context-data' }, [
                        h('span', { 'data-testid': 'ctx-page' }, String(ctx.page)),
                        h(
                          'span',
                          { 'data-testid': 'ctx-snap-count' },
                          String(ctx.pageSnapPoints.length),
                        ),
                      ]),
                  },
                ),
            },
          )
      },
    })

    const wrapper = await mountSuspended(ContextTest)

    expect(wrapper.find('[data-testid="ctx-page"]').text()).toBe('0')
    expect(wrapper.find('[data-testid="ctx-snap-count"]').text()).toBe(String(slides.length))
  })
})

describe('UICarousel triggers with asChild', () => {
  it('renders PrevTrigger with asChild=true', async () => {
    const wrapper = await mountSuspended(
      defineComponent({
        name: 'PrevTriggerAsChildHarness',
        setup() {
          return () =>
            h(
              UICarouselRoot,
              { slideCount: 3 },
              {
                default: () => [h(UICarouselPrevTrigger, { asChild: true })],
              },
            )
        },
      }),
    )

    expect(wrapper.find('[data-part="prev-trigger"]').exists()).toBe(true)
  })

  it('renders NextTrigger with asChild=true', async () => {
    const wrapper = await mountSuspended(
      defineComponent({
        name: 'NextTriggerAsChildHarness',
        setup() {
          return () =>
            h(
              UICarouselRoot,
              { slideCount: 3 },
              {
                default: () => [h(UICarouselNextTrigger, { asChild: true })],
              },
            )
        },
      }),
    )

    expect(wrapper.find('[data-part="next-trigger"]').exists()).toBe(true)
  })
})
