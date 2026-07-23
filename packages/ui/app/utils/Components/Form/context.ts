import type { ClassValue } from 'vue'
import type {
  ComponentIntent,
  ComponentSize,
  ComponentOrientation,
  ComponentVariant,
} from '~/utils/Components/contextBase'

export type FormFieldIntent = NonNullable<ComponentIntent>

export type FormFieldSize = NonNullable<ComponentSize>
export type FormFieldOrientation = NonNullable<ComponentOrientation>
export type FormFieldVariant = NonNullable<Extract<ComponentVariant, 'default' | 'subtle'>>

export interface UIFieldSlots {
  root?: ClassValue
  label?: ClassValue
  helperText?: ClassValue
  error?: ClassValue
  requiredIndicator?: ClassValue
}

export interface UIInputSlots extends UIFieldSlots {
  shell?: ClassValue
  input?: ClassValue
  leadingIcon?: ClassValue
  trailingIcon?: ClassValue
  leadingContent?: ClassValue
  innerLeading?: ClassValue
}

export interface UICheckboxSlots {
  root?: ClassValue
  control?: ClassValue
  indicator?: ClassValue
  label?: ClassValue
  hiddenInput?: ClassValue
}

export interface UICheckboxGroupSlots {
  root?: ClassValue
}

export interface UISliderSlots extends UIFieldSlots {
  valueText?: ClassValue
  control?: ClassValue
  track?: ClassValue
  range?: ClassValue
  thumb?: ClassValue
  draggingIndicator?: ClassValue
  markerGroup?: ClassValue
  marker?: ClassValue
}

export interface UINumberInputSlots extends UIFieldSlots {
  shell?: ClassValue
  input?: ClassValue
  leadingIcon?: ClassValue
  trailingIcon?: ClassValue
  incrementTrigger?: ClassValue
  decrementTrigger?: ClassValue
  stepperGroup?: ClassValue
  scrubber?: ClassValue
}

/** @lintignore Public slot API for form field consumers */
export interface UITextareaSlots extends UIFieldSlots {
  shell?: ClassValue
  input?: ClassValue
  leadingIcon?: ClassValue
  trailingIcon?: ClassValue
}

export interface UIPinInputSlots extends UIFieldSlots {
  control?: ClassValue
  input?: ClassValue
  hiddenInput?: ClassValue
}

export interface UISignaturePadSlots extends UIFieldSlots {
  shell?: ClassValue
  control?: ClassValue
  segment?: ClassValue
  guide?: ClassValue
  clearTrigger?: ClassValue
  hiddenInput?: ClassValue
}

/** @lintignore Public slot API for form field consumers */
export interface UIFileUploadSlots extends UIFieldSlots {
  trigger?: ClassValue
  dropzone?: ClassValue
  dropzoneContent?: ClassValue
  dropzoneIcon?: ClassValue
  item?: ClassValue
  itemName?: ClassValue
  itemSizeText?: ClassValue
  itemPreview?: ClassValue
  itemDeleteTrigger?: ClassValue
  clearTrigger?: ClassValue
  rejectedItem?: ClassValue
  hiddenInput?: ClassValue
}
