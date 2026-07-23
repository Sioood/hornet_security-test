import type { InjectionKey, Ref } from 'vue'
import type { ButtonIntent, ButtonSize, ButtonVariant } from '~/utils/Components/Button/context'
export type PaginationIntent = NonNullable<
  Extract<ButtonIntent, 'neutral' | 'primary' | 'secondary' | 'accent'>
>
export type PaginationSize = NonNullable<ButtonSize>
export type PaginationVariant = NonNullable<ButtonVariant>

export interface PaginationChromeContext {
  intent: Ref<PaginationIntent>
  size: Ref<PaginationSize>
  variant: Ref<PaginationVariant>
}

export const paginationChromeKey: InjectionKey<PaginationChromeContext> = Symbol.for(
  'hornet_security-test.ui.pagination.chrome',
)
