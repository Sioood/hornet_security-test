<script setup lang="ts" generic="TItem">
import { hasActiveFilters as computeHasActiveFilters } from '~/utils/Components/Filter/apply-filters'
import {
  buildDefaultFilterValues,
  filterLayoutRowKeys,
  mergeFilterValues,
  resolveSearchFieldKey,
} from '~/utils/Components/Filter/schema'

import type { FilterBarLayout, FilterSchema, FilterValues } from '~/utils/Components/Filter/schema'
import type { UIFormSearchInputExpose } from '~ui/app/components/Form/SearchInput.vue'

export type { FilterBarLayout, FilterSchema, FilterValues }

type FilterIntent = 'accent' | 'neutral' | 'primary' | 'secondary'

export interface FilterBarProps<TItem> {
  schema: FilterSchema<TItem>
  layout?: FilterBarLayout<keyof FilterSchema<TItem> & string>[]
  size?: 'sm' | 'md'
  /** When true, always use the compact popover layout (ignores breakpoint). */
  forceCompact?: boolean
  debounce?: number
  intent?: FilterIntent
  /** When true, search is rendered inside the filter menu (compact layout only). */
  searchInMenu?: boolean
  showSearchPending?: boolean
  resetLabel?: string
}

export interface UIFilterBarExpose {
  filter: (items: readonly TItem[]) => TItem[]
  reset: () => void
  flushSearch: () => void
  hasActiveFilters: ComputedRef<boolean>
  isSearchPending: Ref<boolean>
  values: Ref<FilterValues>
}

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<FilterBarProps<TItem>>(), {
  debounce: 300,
  forceCompact: false,
  intent: 'primary',
  layout: undefined,
  resetLabel: 'filter.reset',
  searchInMenu: false,
  showSearchPending: false,
  size: 'md',
})

const emit = defineEmits<{
  change: [values: FilterValues]
}>()

const modelValue = defineModel<FilterValues>()

const defaults = computed(() => buildDefaultFilterValues(props.schema))

const internalValues = ref<FilterValues>(mergeFilterValues(defaults.value, modelValue.value))

watch(
  () => modelValue.value,
  (next) => {
    if (!next) {
      return
    }
    const merged = mergeFilterValues(defaults.value, next)
    if (JSON.stringify(merged) !== JSON.stringify(internalValues.value)) {
      internalValues.value = merged
    }
  },
  { deep: true },
)

watch(
  internalValues,
  (next) => {
    const snapshot = { ...next }
    if (JSON.stringify(modelValue.value) !== JSON.stringify(snapshot)) {
      modelValue.value = snapshot
    }
  },
  { deep: true },
)

const breakpoints = useBreakpoints({ lg: 1024 })
const isLargeScreen = breakpoints.greaterOrEqual('lg')

const searchKey = computed(() => resolveSearchFieldKey(props.schema))

const schemaKeys = computed(() => {
  if (props.layout?.length) {
    return props.layout.flatMap((row) => filterLayoutRowKeys(row))
  }
  return Object.keys(props.schema)
})

const {
  filter,
  flushSearch,
  isSearchPending,
  reset: resetValues,
  setFieldValue,
  values,
} = useFilterBar<TItem>({
  debounce: props.debounce,
  onChange: (next) => emit('change', next),
  schema: props.schema,
  values: internalValues,
})

const hasActiveFilters = computed(() => computeHasActiveFilters(props.schema, internalValues.value))

const filtersOpen = ref(false)

const showMenu = computed(() => props.forceCompact || !isLargeScreen.value)

const searchSchema = computed(() => {
  const key = searchKey.value
  if (!key) {
    return undefined
  }
  const config = props.schema[key]
  return config?.type === 'search' ? config : undefined
})

const showSearchInBar = computed(() =>
  Boolean(searchSchema.value && !(props.searchInMenu && showMenu.value)),
)

const showSearchInMenu = computed(() =>
  Boolean(searchSchema.value && props.searchInMenu && showMenu.value),
)

const fieldKeys = computed(() => schemaKeys.value.filter((key) => key !== searchKey.value))

const filterIcon = computed(() =>
  hasActiveFilters.value ? 'tabler:filter-check' : 'tabler:filter',
)

const searchRef = ref<UIFormSearchInputExpose | null>(null)

function reset() {
  resetValues()
  searchRef.value?.cancelSearch()
}

function flushSearchFromRef() {
  searchRef.value?.flushSearch()
  flushSearch()
}

defineExpose<UIFilterBarExpose>({
  filter,
  flushSearch: flushSearchFromRef,
  hasActiveFilters,
  isSearchPending,
  reset,
  values,
})

extendCompodiumMeta({
  defaultProps: {
    intent: 'primary',
    size: 'md',
  },
})
</script>

<template>
  <div data-ui-filter-bar class="flex w-full flex-col gap-3">
    <div
      v-if="showMenu"
      :class="cn('flex w-full items-end gap-2', !showSearchInBar && 'justify-end')"
    >
      <UIFormSearchInput
        v-if="showSearchInBar && searchKey"
        ref="searchRef"
        :model-value="(internalValues[searchKey] as string) ?? ''"
        :debounce="searchSchema?.debounce ?? debounce"
        :intent
        :label="searchSchema?.label"
        :placeholder="searchSchema?.placeholder"
        :show-pending="showSearchPending"
        :size="size === 'sm' ? 'sm' : 'md'"
        :ui="{ root: 'min-w-0 flex-1' }"
        @update:model-value="setFieldValue(searchKey, $event)"
      />

      <UIPopover
        v-model:open="filtersOpen"
        :auto-focus="false"
        :lazy-mount="false"
        :intent
        :positioning="{ gutter: 8, placement: 'bottom-end' }"
        :ui="{ content: 'min-w-72 p-0' }"
      >
        <template #trigger>
          <UIButton
            :aria-label="$t('filter.open')"
            :intent
            class="shrink-0"
            size="sm"
            square
            variant="subtle"
          >
            <Icon :name="filterIcon" class="size-5" />
          </UIButton>
        </template>

        <template #content>
          <div class="flex flex-col gap-3 p-3">
            <UIFormSearchInput
              v-if="showSearchInMenu && searchKey"
              ref="searchRef"
              :model-value="(internalValues[searchKey] as string) ?? ''"
              :debounce="searchSchema?.debounce ?? debounce"
              :intent
              :label="searchSchema?.label"
              :placeholder="searchSchema?.placeholder"
              :show-pending="showSearchPending"
              size="sm"
              @update:model-value="setFieldValue(searchKey, $event)"
            />

            <UIFilterField
              v-for="key in fieldKeys"
              :key="key"
              :model-value="internalValues[key]!"
              menu-mode
              :config="schema[key]!"
              :field-key="key"
              :intent
              @update:model-value="setFieldValue(key, $event)"
            />

            <div class="border-t border-neutral-border-subtle pt-3">
              <UIButton
                class="w-full"
                :disabled="!hasActiveFilters"
                :intent
                size="sm"
                variant="subtle"
                @click="reset()"
              >
                {{ $te(resetLabel) ? $t(resetLabel) : resetLabel }}
              </UIButton>
            </div>
          </div>
        </template>
      </UIPopover>
    </div>

    <div v-else class="flex flex-wrap items-end gap-3">
      <UIFormSearchInput
        v-if="showSearchInBar && searchKey"
        ref="searchRef"
        :model-value="(internalValues[searchKey] as string) ?? ''"
        :debounce="searchSchema?.debounce ?? debounce"
        :intent
        :label="searchSchema?.label"
        :placeholder="searchSchema?.placeholder"
        :show-pending="showSearchPending"
        :size="size === 'sm' ? 'sm' : 'md'"
        @update:model-value="setFieldValue(searchKey, $event)"
      />

      <UIFilterField
        v-for="key in fieldKeys"
        :key="key"
        :model-value="internalValues[key]!"
        :config="schema[key]!"
        :field-key="key"
        :intent
        @update:model-value="setFieldValue(key, $event)"
      />

      <UIButton
        class="shrink-0"
        :disabled="!hasActiveFilters"
        :intent
        size="sm"
        variant="subtle"
        @click="reset()"
      >
        {{ $te(resetLabel) ? $t(resetLabel) : resetLabel }}
      </UIButton>
    </div>
  </div>
</template>
