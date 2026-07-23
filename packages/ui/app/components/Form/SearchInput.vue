<script setup lang="ts">
import { cva } from 'class-variance-authority'

import type { ClassValue } from 'vue'
import type { UIInputSlots } from '~/utils/Components/Form/context'

type SearchInputSize = 'sm' | 'md' | 'lg'
type SearchInputIntent = 'accent' | 'neutral' | 'primary' | 'secondary'

const searchInputCVA = cva('min-w-48 flex-1', {
  variants: {
    size: {
      lg: 'min-w-56',
      md: 'min-w-48',
      sm: 'min-w-40',
    } satisfies Record<SearchInputSize, string>,
  },
})

export interface UIFormSearchInputSlots {
  root?: ClassValue
}

export interface FormSearchInputProps {
  debounce?: number
  intent?: SearchInputIntent
  label?: string
  placeholder?: string
  size?: SearchInputSize
  showPending?: boolean
  ui?: Partial<UIFormSearchInputSlots>
}

export interface UIFormSearchInputExpose {
  flushSearch: () => void
  cancelSearch: () => void
}

defineOptions({ inheritAttrs: false })

const modelValue = defineModel<string>({ default: '' })

const props = withDefaults(defineProps<FormSearchInputProps>(), {
  debounce: 300,
  intent: 'primary',
  label: undefined,
  placeholder: 'Search…',
  showPending: false,
  size: 'md',
  ui: undefined,
})

const inputValue = ref(modelValue.value)
const debouncedQuery = refDebounced(inputValue, () => props.debounce)

const effectiveQuery = computed(() => (inputValue.value.trim() === '' ? '' : debouncedQuery.value))

watch(effectiveQuery, (next) => {
  if (modelValue.value !== next) {
    modelValue.value = next
  }
})

watch(modelValue, (next) => {
  const normalized = next ?? ''
  if (inputValue.value !== normalized) {
    inputValue.value = normalized
  }
})

const isPending = computed(
  () =>
    props.showPending &&
    inputValue.value.trim() !== '' &&
    effectiveQuery.value !== inputValue.value,
)

function flushSearch() {
  const next = inputValue.value.trim() === '' ? '' : inputValue.value
  if (modelValue.value !== next) {
    modelValue.value = next
  }
}

function cancelSearch() {
  const normalized = modelValue.value ?? ''
  if (inputValue.value !== normalized) {
    inputValue.value = normalized
  }
}

function onBlur() {
  flushSearch()
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Enter') {
    flushSearch()
  }
}

onBeforeUnmount(() => {
  cancelSearch()
})

defineExpose<UIFormSearchInputExpose>({
  cancelSearch,
  flushSearch,
})

extendCompodiumMeta({
  defaultProps: {
    intent: 'primary',
    placeholder: 'Search…',
    size: 'md',
  },
})
</script>

<template>
  <div :class="cn(searchInputCVA({ size: props.size }), props.ui?.root)">
    <UIFormInput
      v-model="inputValue"
      type="text"
      role="searchbox"
      inputmode="search"
      autocomplete="off"
      :intent="props.intent"
      :label="props.label"
      :placeholder="props.placeholder"
      :size="props.size"
      leading-icon="tabler:search"
      clearable
      :state="isPending ? 'loading' : 'default'"
      :trailing="isPending"
      loading-icon="tabler:loader-2"
      :ui="{ root: 'w-full' } satisfies Partial<UIInputSlots>"
      @blur="onBlur"
      @keydown="onKeydown"
    />
  </div>
</template>
