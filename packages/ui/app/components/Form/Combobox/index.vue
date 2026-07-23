<script setup lang="ts">
import {
  type ComboboxInputValueChangeDetails,
  type ComboboxRootBaseProps,
  type ComboboxRootProviderBaseProps,
  type UseComboboxReturn,
} from '@ark-ui/vue/combobox'
import { useFilter } from '@ark-ui/vue/locale'

import { formTagsInputComboboxPositioning } from '~/composables/useFormTagsInputCombobox'
import {
  createComboboxCollection,
  filterComboboxItems,
} from '~/utils/Components/Form/Combobox/collection'
import { resolveComboboxEnterMatch } from '~/utils/Components/Form/Combobox/match-item'
import { comboboxControlRowCVA } from '~/utils/Components/Form/Combobox/variants'

import type {
  ComboboxIntent,
  ComboboxItem,
  ComboboxSize,
  UIComboboxSlots,
} from '~/utils/Components/Form/Combobox/context'
import type { FormControlShellProps } from '~ui/app/components/Form/FormControlShell.vue'

defineOptions({ inheritAttrs: false })

export type { ComboboxItem } from '~/utils/Components/Form/Combobox/context'

export interface ComboboxProps
  extends
    Omit<ComboboxRootBaseProps<ComboboxItem>, 'collection' | 'modelValue' | 'open' | 'inputValue'>,
    Omit<ComboboxRootProviderBaseProps<ComboboxItem>, 'value'> {
  value?: UseComboboxReturn<ComboboxItem>
  items?: ComboboxItem[] | null
  label?: string
  helperText?: string
  error?: string
  loading?: boolean
  loadingText?: string
  emptyText?: string
  portalled?: boolean
  teleportTo?: string
  showClear?: boolean
  showTrigger?: boolean
  maxSelection?: number
  intent?: ComboboxIntent
  size?: ComboboxSize
  ui?: Partial<UIComboboxSlots>
  filterDebounceMs?: number
}

const modelValue = defineModel<string[]>({ default: () => [] })
const open = defineModel<boolean>('open', { default: false })
const inputValue = defineModel<string>('inputValue', { default: '' })

const props = withDefaults(defineProps<ComboboxProps>(), {
  allowCustomValue: false,
  closeOnSelect: undefined,
  emptyText: 'combobox.noOptions',
  error: undefined,
  filterDebounceMs: 250,
  helperText: undefined,
  inputBehavior: 'none',
  intent: 'primary',
  items: () => [],
  label: undefined,
  loading: false,
  loadingText: 'combobox.loading',
  maxSelection: undefined,
  multiple: false,
  placeholder: 'combobox.placeholder',
  portalled: true,
  selectionBehavior: undefined,
  showClear: true,
  showTrigger: true,
  size: 'md',
  teleportTo: 'body',
  ui: undefined,
  value: undefined,
})

const attrs = useAttrs()
const filters = useFilter({ sensitivity: 'base' })

/** Debounced query for list filtering — keeps `inputValue` immediate for the input field. */
const debouncedFilterInput = refDebounced(inputValue, () => props.filterDebounceMs)

const filterQuery = computed(() =>
  inputValue.value.trim() === '' ? '' : debouncedFilterInput.value,
)

const rawItems = computed(() => props.items ?? [])

const isGrouped = computed(() => rawItems.value.some((item) => item.group))

const hasMaxReached = computed(
  () =>
    props.multiple &&
    props.maxSelection !== undefined &&
    modelValue.value.length >= props.maxSelection,
)

const processedItems = computed(() =>
  rawItems.value.map((item) => ({
    ...item,
    disabled: item.disabled || (hasMaxReached.value && !modelValue.value.includes(item.value)),
  })),
)

const collection = computed(() => {
  if (props.items === null) {
    return createComboboxCollection([])
  }

  const filtered = filterComboboxItems(
    processedItems.value,
    filterQuery.value,
    filters.value.contains,
  )

  if (isGrouped.value) {
    return createComboboxCollection(filtered, {
      groupBy: (item: ComboboxItem) => item.group ?? '',
    })
  }

  return createComboboxCollection(filtered)
})

const isProvider = computed(() => props.value !== undefined)

const hasValue = computed(() => modelValue.value.length > 0)

const resolvedCloseOnSelect = computed(() => {
  if (props.closeOnSelect !== undefined) return props.closeOnSelect
  return !props.multiple
})

const resolvedSelectionBehavior = computed(() => {
  if (props.selectionBehavior !== undefined) return props.selectionBehavior
  return props.multiple ? 'clear' : 'replace'
})

const shellProps = computed<FormControlShellProps>(() => ({
  disabled: props.disabled,
  error: props.error,
  helperText: props.helperText,
  intent: props.intent,
  invalid: props.invalid || String(props.error ?? '').length > 0,
  label: props.label,
  readOnly: props.readOnly,
  required: props.required,
  size: props.size,
  ui: {
    shell: cn('px-1 py-0.5', props.ui?.control),
  },
}))

const rootPassthrough = computed(() => {
  const {
    emptyText: _emptyText,
    error: _error,
    helperText: _helperText,
    items: _items,
    label: _label,
    loading: _loading,
    loadingText: _loadingText,
    maxSelection: _maxSelection,
    portalled: _portalled,
    showClear: _showClear,
    showTrigger: _showTrigger,
    teleportTo: _teleportTo,
    ui: _ui,
    ...rest
  } = props
  return rest
})

function handleValueChange(details: { value: string[] }) {
  if (props.maxSelection !== undefined && details.value.length > props.maxSelection) return
  modelValue.value = details.value
}

const resolvedPositioning = computed(() => props.positioning ?? formTagsInputComboboxPositioning)

function handleInputValueChange(details: ComboboxInputValueChangeDetails) {
  if (inputValue.value !== details.inputValue) {
    inputValue.value = details.inputValue
  }
  if (!isProvider.value) {
    open.value = details.inputValue.length > 0
  }
}

function handleInputKeydown(event: KeyboardEvent) {
  if (event.key !== 'Enter') return

  const currentInput = inputValue.value.trim()
  if (!currentInput) return

  const availableItems = filterComboboxItems(
    processedItems.value,
    currentInput,
    filters.value.contains,
  ).filter((item) => !item.disabled)
  const match = resolveComboboxEnterMatch(currentInput, availableItems, rawItems.value)
  if (!match) return

  event.preventDefault()
  event.stopImmediatePropagation()

  if (props.multiple) {
    if (modelValue.value.includes(match.value)) {
      inputValue.value = ''
      open.value = false
      return
    }
    if (props.maxSelection !== undefined && modelValue.value.length >= props.maxSelection) return
    modelValue.value = [...modelValue.value, match.value]
    inputValue.value = ''
  } else {
    modelValue.value = [match.value]
  }

  open.value = false
}

extendCompodiumMeta({
  defaultProps: {
    intent: 'primary',
    label: 'Combobox',
    placeholder: 'combobox.placeholder',
    size: 'md',
  },
})
</script>

<template>
  <UIFormComboboxRoot
    v-bind="{ ...rootPassthrough, ...attrs }"
    v-model="modelValue"
    v-model:open="open"
    v-model:input-value="inputValue"
    :collection="isProvider ? undefined : collection"
    :close-on-select="resolvedCloseOnSelect"
    :positioning="resolvedPositioning"
    :selection-behavior="resolvedSelectionBehavior"
    :ui="{ root: ui?.root }"
    @value-change="handleValueChange"
    @input-value-change="handleInputValueChange"
  >
    <UIFormControlShell v-bind="shellProps">
      <UIFormComboboxControl :ui="cn('border-0 bg-transparent p-0 shadow-none', ui?.control)">
        <UIFormComboboxSelectedItems
          v-if="multiple"
          :items="rawItems"
          :intent
          :ui="{
            root: ui?.selectedItems,
            tag: ui?.tag,
            tagRemove: ui?.tagRemove,
          }"
        />

        <div :class="comboboxControlRowCVA()">
          <UIFormComboboxInput
            :placeholder="$te(placeholder) ? $t(placeholder) : placeholder"
            :ui="cn('min-w-0 flex-1', ui?.input)"
            @keydown.capture="handleInputKeydown"
          />
          <UIFormComboboxClearTrigger v-if="showClear && hasValue" :ui="ui?.clearTrigger" />
          <UIFormComboboxTrigger v-if="showTrigger" :ui="ui?.trigger" />
        </div>
      </UIFormComboboxControl>
    </UIFormControlShell>

    <Teleport :to="teleportTo" :disabled="!portalled">
      <UIFormComboboxPositioner :ui="ui?.positioner">
        <UIFormComboboxContent :ui="ui?.content">
          <slot name="content" :collection :loading :is-grouped>
            <UIFormComboboxListContent
              :collection
              :intent
              :size
              :loading
              :loading-text="$te(loadingText) ? $t(loadingText) : loadingText"
              :empty-text="$te(emptyText) ? $t(emptyText) : emptyText"
              :is-grouped
              :ui
            />
          </slot>
        </UIFormComboboxContent>
      </UIFormComboboxPositioner>
    </Teleport>

    <slot />
  </UIFormComboboxRoot>
</template>
