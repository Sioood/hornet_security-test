import type { ClassValue } from 'vue'
import type { ButtonIntent, ButtonSize, ButtonVariant } from '~/utils/Components/Button/context'
import type { ComponentOrientation } from '~/utils/Components/contextBase'

export type ToggleIntent = NonNullable<ButtonIntent>
export type ToggleSize = NonNullable<ButtonSize>
export type ToggleVariant = NonNullable<ButtonVariant>

export type ToggleGroupOrientation = NonNullable<
  Extract<ComponentOrientation, 'horizontal' | 'vertical'>
>

export interface UIToggleSlots {
  root?: ClassValue
  indicator?: ClassValue
}

export interface UIToggleGroupSlots {
  root?: ClassValue
  item?: ClassValue
}
