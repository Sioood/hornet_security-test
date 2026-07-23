import type { InjectionKey, Ref } from 'vue'
import type { ComponentIntent, ComponentSize } from '~/utils/Components/contextBase'

export type StepsIntent = NonNullable<
  Extract<ComponentIntent, 'neutral' | 'primary' | 'secondary' | 'accent'>
>
export type StepsSize = NonNullable<Extract<ComponentSize, 'sm' | 'md' | 'lg'>>

export interface StepsChromeContext {
  intent: Ref<StepsIntent>
  size: Ref<StepsSize>
  orientation: Ref<'horizontal' | 'vertical'>
}

export const stepsChromeKey: InjectionKey<StepsChromeContext> = Symbol.for(
  'hornet_security-test.ui.steps.chrome',
)
