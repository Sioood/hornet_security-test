import type { InjectionKey, Ref } from 'vue'
import type { ButtonIntent, ButtonSize } from '~/utils/Components/Button/context'

export type CarouselIntent = NonNullable<
  Extract<ButtonIntent, 'neutral' | 'primary' | 'secondary' | 'accent'>
>
export type CarouselSize = NonNullable<ButtonSize>
export type CarouselIndicatorVariant = 'dot' | 'thumbnail'

export interface CarouselChromeContext {
  intent: Ref<CarouselIntent>
  size: Ref<CarouselSize>
  orientation: Ref<'horizontal' | 'vertical'>
  indicatorVariant: Ref<CarouselIndicatorVariant>
}

export const carouselChromeKey: InjectionKey<CarouselChromeContext> = Symbol.for(
  'hornet_security-test.ui.carousel.chrome',
)
