import type { ClassValue, InjectionKey, Ref } from 'vue'
import type { ComponentIntent, ComponentSize } from '~/utils/Components/contextBase'
import type { UIFieldSlots } from '~/utils/Components/Form/context'

export type RatingIntent = NonNullable<
  Extract<ComponentIntent, 'neutral' | 'primary' | 'secondary' | 'accent'>
>
export type RatingSize = NonNullable<ComponentSize>

export interface RatingChromeContext {
  intent: Ref<RatingIntent>
  size: Ref<RatingSize>
}

export const ratingChromeKey: InjectionKey<RatingChromeContext> = Symbol.for(
  'hornet_security-test.ui.form.rating.chrome',
)

export interface UIRatingSlots extends UIFieldSlots {
  control?: ClassValue
  item?: ClassValue
  itemIndicator?: ClassValue
  hiddenInput?: ClassValue
  valueText?: ClassValue
}
