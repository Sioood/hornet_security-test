<script setup lang="ts">
import {
  Pagination as ArkPagination,
  type PaginationRootBaseProps,
  type PaginationRootProviderBaseProps,
  type UsePaginationReturn,
} from '@ark-ui/vue/pagination'

import {
  paginationChromeKey,
  type PaginationIntent,
  type PaginationSize,
  type PaginationVariant,
} from '~/utils/Components/Pagination/context'
import { paginationRootCVA } from '~/utils/Components/Pagination/variants'

import type { ClassValue } from 'vue'

defineOptions({ inheritAttrs: false })

export interface UIPaginationRootSlots {
  root?: ClassValue
}

/** Forwards Ark `Pagination.Root` props, events, and render strategy. */
export interface PaginationRootProps
  extends
    Omit<PaginationRootBaseProps, 'page' | 'pageSize'>,
    Omit<PaginationRootProviderBaseProps, 'value'> {
  /**
   * Pass the return value of `usePagination()` to enable **RootProvider** mode —
   * the component will be controlled entirely from outside via the Ark API object.
   * Omit (or leave `undefined`) to use the default **Root** mode with `v-model:page`.
   */
  value?: UsePaginationReturn['value']
  intent?: PaginationIntent
  size?: PaginationSize
  variant?: PaginationVariant
  ui?: Partial<UIPaginationRootSlots>
}

const props = withDefaults(defineProps<PaginationRootProps>(), {
  intent: 'primary',
  size: 'md',
  ui: undefined,
  value: undefined,
  variant: 'ghost',
})

const page = defineModel<number>('page', { required: false })
const pageSize = defineModel<number>('pageSize', { required: false })

const attrs = useAttrs()

const intent = toRef(props, 'intent')
const size = toRef(props, 'size')
const variant = toRef(props, 'variant')

provide(paginationChromeKey, { intent, size, variant })

const isProvider = computed(() => props.value !== undefined)

const rootComponent = computed(() =>
  isProvider.value ? ArkPagination.RootProvider : ArkPagination.Root,
)

const rootProps = computed(() => {
  if (isProvider.value) {
    return pick(props, ['asChild', 'value'] as const)
  }
  return pick(props, [
    'asChild',
    'count',
    'defaultPage',
    'defaultPageSize',
    'getPageUrl',
    'id',
    'ids',
    'siblingCount',
    'translations',
    'type',
  ] as const)
})

const arkAttrs = computed(() => splitArkAttrs(attrs))

const rootBindings = computed(() => {
  const base: Record<string, unknown> = {
    ...rootProps.value,
    ...arkAttrs.value,
    class: cn(
      paginationRootCVA({ intent: intent.value, size: size.value }),
      arkAttrs.value.class as ClassValue,
      props.ui?.root,
    ),
  }
  if (!isProvider.value) {
    if (page.value !== undefined) {
      base.page = page.value
      base['onUpdate:page'] = (next: number) => {
        page.value = next
      }
    }
    if (pageSize.value !== undefined) {
      base.pageSize = pageSize.value
      base['onUpdate:pageSize'] = (next: number) => {
        pageSize.value = next
      }
    }
  }
  return base
})
</script>

<template>
  <component :is="rootComponent" v-bind="rootBindings">
    <slot />
  </component>
</template>
