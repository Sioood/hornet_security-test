import type { InjectionKey, Ref, ClassValue } from 'vue'
import type { ComponentIntent, ComponentSize } from '~/utils/Components/contextBase'

export type SelectIntent = NonNullable<
  Extract<ComponentIntent, 'neutral' | 'primary' | 'secondary' | 'accent'>
>
export type SelectSize = NonNullable<ComponentSize>

export interface SelectItem {
  label: string
  value: string
  disabled?: boolean
  group?: string
}

export interface SelectChromeContext {
  intent: Ref<SelectIntent>
  size: Ref<SelectSize>
}

export const selectChromeKey: InjectionKey<SelectChromeContext> = Symbol('selectChrome')

export interface UISelectSlots {
  root?: ClassValue
  label?: ClassValue
  control?: ClassValue
  trigger?: ClassValue
  valueText?: ClassValue
  indicator?: ClassValue
  clearTrigger?: ClassValue
  positioner?: ClassValue
  content?: ClassValue
  itemGroup?: ClassValue
  itemGroupLabel?: ClassValue
  item?: ClassValue
  itemText?: ClassValue
  itemIndicator?: ClassValue
}
