<script setup lang="ts">
import {
  Carousel as ArkCarousel,
  type CarouselRootBaseProps,
  type CarouselRootProviderBaseProps,
  type UseCarouselReturn,
} from '@ark-ui/vue/carousel'

import {
  carouselChromeKey,
  type CarouselIndicatorVariant,
  type CarouselIntent,
  type CarouselSize,
} from '~/utils/Components/Carousel/context'
import { carouselRootCVA } from '~/utils/Components/Carousel/variants'

import type { ClassValue } from 'vue'

defineOptions({ inheritAttrs: false })

export interface UICarouselRootSlots {
  root?: ClassValue
}

/**
 * Carousel root component.
 *
 * Supports both Root (controlled/uncontrolled via `v-model:page`) and
 * RootProvider (pass a `useCarousel()` return via `:value`) modes.
 *
 * `allowMouseDrag` defaults to `true` (Ark default is `false`).
 */
export interface CarouselRootProps
  extends
    Omit<CarouselRootBaseProps, 'page' | 'allowMouseDrag'>,
    Omit<CarouselRootProviderBaseProps, 'value'> {
  /** Pass the return value of `useCarousel()` to enable RootProvider mode. */
  value?: UseCarouselReturn['value']
  /** Whether mouse drag scrolling is enabled. @default true */
  allowMouseDrag?: boolean
  intent?: CarouselIntent
  size?: CarouselSize
  indicatorVariant?: CarouselIndicatorVariant
  ui?: Partial<UICarouselRootSlots>
}

const props = withDefaults(defineProps<CarouselRootProps>(), {
  allowMouseDrag: true,
  indicatorVariant: 'dot',
  intent: 'primary',
  size: 'md',
  ui: undefined,
  value: undefined,
})

const page = defineModel<number>('page', { required: false })

const attrs = useAttrs()

const intent = toRef(props, 'intent')
const size = toRef(props, 'size')
const indicatorVariant = toRef(props, 'indicatorVariant')
const orientation = computed<'horizontal' | 'vertical'>(() => props.orientation ?? 'horizontal')

provide(carouselChromeKey, { indicatorVariant, intent, orientation, size })

const isProvider = computed(() => props.value !== undefined)

const rootComponent = computed(() =>
  isProvider.value ? ArkCarousel.RootProvider : ArkCarousel.Root,
)

const rootProps = computed(() => {
  if (isProvider.value) {
    return pick(props, ['asChild', 'value'] as const)
  }
  return pick(props, [
    'allowMouseDrag',
    'asChild',
    'autoplay',
    'autoSize',
    'defaultPage',
    'id',
    'ids',
    'inViewThreshold',
    'loop',
    'orientation',
    'padding',
    'slideCount',
    'slidesPerMove',
    'slidesPerPage',
    'snapType',
    'spacing',
    'translations',
  ] as const)
})

const arkAttrs = computed(() => splitArkAttrs(attrs))

const rootBindings = computed(() => {
  const base: Record<string, unknown> = {
    ...rootProps.value,
    ...arkAttrs.value,
    class: cn(
      carouselRootCVA({ intent: intent.value, size: size.value }),
      arkAttrs.value.class as ClassValue,
      props.ui?.root,
    ),
  }

  if (!isProvider.value && page.value !== undefined) {
    base.page = page.value
    base['onUpdate:page'] = (next: number) => {
      page.value = next
    }
  }

  return base
})

extendCompodiumMeta({
  defaultProps: {
    allowMouseDrag: true,
    intent: 'primary',
    size: 'md',
    slideCount: 5,
  },
})
</script>

<template>
  <component :is="rootComponent" v-bind="rootBindings">
    <slot />
  </component>
</template>
