import type { ClassValue, InjectionKey, Ref } from 'vue'
import type { ComponentIntent, ComponentSize } from '~/utils/Components/contextBase'

export type { SelectItem as ComboboxItem } from '~/utils/Components/Form/Select/context'

export type ComboboxIntent = NonNullable<
  Extract<ComponentIntent, 'neutral' | 'primary' | 'secondary' | 'accent'>
>
export type ComboboxSize = NonNullable<ComponentSize>

export interface ComboboxChromeContext {
  intent: Ref<ComboboxIntent>
  size: Ref<ComboboxSize>
}

export const comboboxChromeKey: InjectionKey<ComboboxChromeContext> = Symbol.for(
  'hornet_security-test.ui.form.combobox.chrome',
)

export interface UIComboboxSlots {
  root?: ClassValue
  label?: ClassValue
  control?: ClassValue
  input?: ClassValue
  trigger?: ClassValue
  clearTrigger?: ClassValue
  positioner?: ClassValue
  content?: ClassValue
  empty?: ClassValue
  itemGroup?: ClassValue
  itemGroupLabel?: ClassValue
  item?: ClassValue
  itemText?: ClassValue
  itemIndicator?: ClassValue
  selectedItems?: ClassValue
  tag?: ClassValue
  tagRemove?: ClassValue
}
