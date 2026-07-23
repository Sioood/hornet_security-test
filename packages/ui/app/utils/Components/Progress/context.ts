import type { ComponentIntent, ComponentSize } from '~/utils/Components/contextBase'

export type ProgressIntent = NonNullable<
  Extract<ComponentIntent, 'neutral' | 'primary' | 'secondary' | 'accent'>
>
export type ProgressSize = NonNullable<Extract<ComponentSize, 'sm' | 'md' | 'lg'>>
export type ProgressCircularSize = NonNullable<
  Extract<ComponentSize, 'icon-sm' | 'icon-md' | 'icon-lg'>
>
