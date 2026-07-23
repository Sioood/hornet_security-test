import type { ClassValue } from 'vue'
import type {
  ComponentIntent,
  ComponentSize,
  ComponentVariant,
} from '~/utils/Components/contextBase'

export type CardVariant = NonNullable<
  Extract<ComponentVariant, 'default' | 'subtle' | 'strong' | 'inverse'>
>

export type CardIntent = NonNullable<
  Extract<ComponentIntent, 'neutral' | 'primary' | 'secondary' | 'accent'>
>

export type CardSize = NonNullable<ComponentSize>

export interface UICardBaseSlots {
  root?: ClassValue
  header?: ClassValue
  body?: ClassValue
  content?: ClassValue
  footer?: ClassValue
}

export interface UICardSlots {
  bodyHeader?: ClassValue
  bodyTitleDescriptionWrapper?: ClassValue
  bodyTitle?: ClassValue
  bodyDescription?: ClassValue
  content?: ClassValue
}
