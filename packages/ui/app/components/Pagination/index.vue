<script setup lang="ts">
import type {
  PaginationRootBaseProps,
  PaginationRootProviderBaseProps,
  UsePaginationReturn,
} from '@ark-ui/vue/pagination'
import type { ClassValue } from 'vue'
import type {
  PaginationIntent,
  PaginationSize,
  PaginationVariant,
} from '~/utils/Components/Pagination/context'

defineOptions({ inheritAttrs: false })

const attrs = useAttrs()

export interface UIPaginationSlots {
  root?: ClassValue
}

/**
 * Fully assembled pagination component.
 *
 * Pass high-level props like `count`, `pageSize`, `siblingCount` — the component
 * renders prev/next triggers, page buttons, and ellipsis automatically.
 *
 * For full control, compose manually using `<UIPaginationRoot>` +
 * `<UIPaginationPrevTrigger>`, `<UIPaginationPageTrigger>`, etc.
 */
export interface PaginationProps
  extends
    Omit<PaginationRootBaseProps, 'page' | 'pageSize'>,
    Omit<PaginationRootProviderBaseProps, 'value'> {
  value?: UsePaginationReturn['value']
  intent?: PaginationIntent
  size?: PaginationSize
  variant?: PaginationVariant
  /** Show first-page and last-page trigger buttons. @default false */
  showFirstLast?: boolean
  ui?: Partial<UIPaginationSlots>
}

const props = withDefaults(defineProps<PaginationProps>(), {
  intent: 'primary',
  showFirstLast: false,
  size: 'md',
  ui: undefined,
  value: undefined,
  variant: 'ghost',
})

const page = defineModel<number>('page', { required: false })
const pageSize = defineModel<number>('pageSize', { required: false })

const rootPassthrough = computed(() => {
  const { showFirstLast: _, ...rest } = props as PaginationProps & { showFirstLast: boolean }
  return rest
})
</script>

<template>
  <UIPaginationRoot
    v-bind="{ ...rootPassthrough, ...attrs }"
    v-model:page="page"
    v-model:page-size="pageSize"
  >
    <UIPaginationFirstTrigger v-if="showFirstLast" />
    <UIPaginationPrevTrigger />
    <UIPaginationContext v-slot="{ pages }">
      <template v-for="(p, index) in pages" :key="index">
        <UIPaginationPageTrigger v-if="p.type === 'page'" :value="p.value" />
        <UIPaginationEllipsis v-else :index />
      </template>
    </UIPaginationContext>
    <UIPaginationNextTrigger />
    <UIPaginationLastTrigger v-if="showFirstLast" />
  </UIPaginationRoot>
</template>
