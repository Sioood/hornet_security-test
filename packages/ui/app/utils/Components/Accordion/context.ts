import type { InjectionKey, Ref } from 'vue'
import type { ComponentIntent, ComponentSize } from '~/utils/Components/contextBase'

export type AccordionIntent = NonNullable<
  Extract<ComponentIntent, 'neutral' | 'primary' | 'secondary' | 'accent'>
>
export type AccordionSize = NonNullable<Extract<ComponentSize, 'md'>>

export interface AccordionChromeContext {
  intent: Ref<AccordionIntent>
  size: Ref<AccordionSize>
}

export const accordionChromeKey: InjectionKey<AccordionChromeContext> = Symbol.for(
  'hornet_security-test.ui.accordion.chrome',
)
