import type { ClassValue, InjectionKey, Ref } from 'vue'
import type { ComponentIntent, ComponentSize } from '~/utils/Components/contextBase'

export type TagsInputIntent = NonNullable<
  Extract<ComponentIntent, 'neutral' | 'primary' | 'secondary' | 'accent'>
>
export type TagsInputSize = NonNullable<ComponentSize>

export interface TagsInputChromeContext {
  intent: Ref<TagsInputIntent>
  size: Ref<TagsInputSize>
}

export const tagsInputChromeKey: InjectionKey<TagsInputChromeContext> = Symbol.for(
  'hornet_security-test.ui.form.tags-input.chrome',
)

export interface UITagsInputSlots {
  root?: ClassValue
  label?: ClassValue
  control?: ClassValue
  input?: ClassValue
  clearTrigger?: ClassValue
  hiddenInput?: ClassValue
  items?: ClassValue
  tag?: ClassValue
  tagRemove?: ClassValue
  item?: ClassValue
  itemPreview?: ClassValue
  itemText?: ClassValue
  itemInput?: ClassValue
  itemDeleteTrigger?: ClassValue
  positioner?: ClassValue
  content?: ClassValue
  empty?: ClassValue
  comboboxItem?: ClassValue
  comboboxItemText?: ClassValue
  comboboxItemIndicator?: ClassValue
}
