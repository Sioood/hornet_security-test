import type {
  ComponentIntent,
  ComponentSize,
  ComponentVariant,
} from '~/utils/Components/contextBase'

export type ButtonIntent = NonNullable<ComponentIntent>
export type ButtonSize = NonNullable<ComponentSize>
export type ButtonVariant = NonNullable<Extract<ComponentVariant, 'default' | 'subtle' | 'ghost'>>
