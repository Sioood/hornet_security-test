<script setup lang="ts">
import { type ComboboxInputValueChangeDetails } from '@ark-ui/vue/combobox'
import { useFilter } from '@ark-ui/vue/locale'

import {
  createComboboxCollection,
  filterComboboxItems,
} from '~/utils/Components/Form/Combobox/collection'
import { resolveComboboxEnterMatch } from '~/utils/Components/Form/Combobox/match-item'

import type { ComboboxItem } from '~/utils/Components/Form/Combobox/context'
import type {
  TagsInputIntent,
  TagsInputSize,
  UITagsInputSlots,
} from '~/utils/Components/Form/TagsInput/context'
import type { FormControlShellProps } from '~ui/app/components/Form/FormControlShell.vue'

defineOptions({ inheritAttrs: false })

export interface TagsInputComboboxShellProps {
  items?: ComboboxItem[] | null
  label?: string
  helperText?: string
  error?: string
  placeholder?: string
  loading?: boolean
  loadingText?: string
  emptyText?: string
  portalled?: boolean
  teleportTo?: string
  showClear?: boolean
  allowCustomValue?: boolean
  intent?: TagsInputIntent
  size?: TagsInputSize
  disabled?: boolean
  readOnly?: boolean
  required?: boolean
  invalid?: boolean
  max?: number
  maxLength?: number
  delimiter?: string | RegExp
  editable?: boolean
  addOnPaste?: boolean
  blurBehavior?: 'add' | 'clear'
  allowOverflow?: boolean
  validate?: (details: { inputValue: string; value: string[] }) => boolean
  ui?: Partial<UITagsInputSlots>
}

const modelValue = defineModel<string[]>({ default: () => [] })
const inputValue = defineModel<string>('inputValue', { default: '' })

const props = withDefaults(defineProps<TagsInputComboboxShellProps>(), {
  addOnPaste: false,
  allowCustomValue: true,
  allowOverflow: false,
  blurBehavior: undefined,
  delimiter: ',',
  editable: true,
  emptyText: 'tagsInput.noOptions',
  error: undefined,
  helperText: undefined,
  intent: 'primary',
  items: () => [],
  label: undefined,
  loading: false,
  loadingText: 'tagsInput.loading',
  max: undefined,
  maxLength: undefined,
  placeholder: 'tagsInput.placeholder',
  portalled: true,
  showClear: true,
  size: 'md',
  teleportTo: 'body',
  ui: undefined,
  validate: undefined,
})

const filters = useFilter({ sensitivity: 'base' })

const rawItems = computed(() => props.items ?? [])

const isGrouped = computed(() => rawItems.value.some((item) => item.group))

const collection = computed(() => {
  const filtered = filterComboboxItems(rawItems.value, inputValue.value, filters.value.contains)

  if (isGrouped.value) {
    return createComboboxCollection(filtered, {
      groupBy: (item: ComboboxItem) => item.group ?? '',
    })
  }

  return createComboboxCollection(filtered)
})

const { tagsInput, combobox } = useFormTagsInputCombobox({
  allowCustomValue: props.allowCustomValue,
  collection,
  combobox: {
    onInputValueChange: (details: ComboboxInputValueChangeDetails) => {
      inputValue.value = details.inputValue
    },
  },
  tagsInput: {
    addOnPaste: props.addOnPaste,
    allowOverflow: props.allowOverflow,
    blurBehavior: props.blurBehavior,
    delimiter: props.delimiter,
    disabled: props.disabled,
    editable: props.editable,
    invalid: props.invalid || String(props.error ?? '').length > 0,
    max: props.max,
    maxLength: props.maxLength,
    placeholder: props.placeholder,
    readOnly: props.readOnly,
    required: props.required,
    validate: props.validate,
  },
})

function handleComboboxInputKeydown(event: KeyboardEvent) {
  if (event.key !== 'Enter') return

  const currentInput = (inputValue.value || tagsInput.value.inputValue).trim()
  if (!currentInput) return

  const availableItems = collection.value.items.filter((item) => !item.disabled)
  const match = resolveComboboxEnterMatch(currentInput, availableItems, rawItems.value)
  if (!match) return

  event.preventDefault()
  event.stopImmediatePropagation()

  if (!tagsInput.value.value.includes(match.value)) {
    tagsInput.value.addValue(match.value)
  }

  clearComposedInput(tagsInput, combobox)
  combobox.value.setOpen(false)
}

watch(
  modelValue,
  (next) => {
    if (next !== tagsInput.value.value) {
      tagsInput.value.setValue(next)
    }
  },
  { deep: true },
)

watch(
  () => tagsInput.value.value,
  (next) => {
    if (next !== modelValue.value) {
      modelValue.value = next
    }
  },
  { deep: true },
)

watch(
  inputValue,
  (next) => {
    if (next !== tagsInput.value.inputValue) {
      tagsInput.value.setInputValue(next)
    }
    combobox.value.setOpen(next.length > 0)
  },
  { immediate: true },
)

watch(
  () => tagsInput.value.inputValue,
  (next) => {
    if (next !== inputValue.value) {
      inputValue.value = next
    }
  },
)

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

const hasTags = computed(() => modelValue.value.length > 0)

function resolveLabel(value: string) {
  return rawItems.value.find((item) => item.value === value)?.label ?? value
}
</script>

<template>
  <UIFormComboboxRoot :value="combobox" :intent :size :ui="{ root: ui?.root }">
    <UIFormTagsInputRoot :value="tagsInput" :intent :size>
      <UIFormControlShell v-bind="shellProps">
        <UIFormTagsInputControl :ui="cn('border-0 bg-transparent p-0 shadow-none', ui?.control)">
          <UIFormTagsInputItems
            :intent
            :size
            :resolve-label="resolveLabel"
            :ui="{
              root: ui?.items,
              tag: ui?.tag,
              tagRemove: ui?.tagRemove,
            }"
          />

          <UIFormTagsInputComboboxInput
            :placeholder="$te(placeholder) ? $t(placeholder) : placeholder"
            :ui="cn('min-w-12 flex-1', ui?.input)"
            @keydown.capture="handleComboboxInputKeydown"
          />

          <UIFormTagsInputClearTrigger v-if="showClear && hasTags" :ui="ui?.clearTrigger" />
        </UIFormTagsInputControl>
      </UIFormControlShell>

      <UIFormTagsInputHiddenInput :ui="ui?.hiddenInput" />

      <Teleport :to="teleportTo" :disabled="!portalled">
        <UIFormComboboxPositioner :ui="ui?.positioner">
          <UIFormComboboxContent :intent :size :ui="ui?.content">
            <UIFormComboboxListContent
              :collection
              :intent
              :size
              :loading
              :loading-text="$te(loadingText) ? $t(loadingText) : loadingText"
              :empty-text="$te(emptyText) ? $t(emptyText) : emptyText"
              :is-grouped
              :ui="{
                empty: ui?.empty,
                item: ui?.comboboxItem,
                itemText: ui?.comboboxItemText,
                itemIndicator: ui?.comboboxItemIndicator,
                itemGroup: ui?.itemGroup,
                itemGroupLabel: ui?.itemGroupLabel,
              }"
            />
          </UIFormComboboxContent>
        </UIFormComboboxPositioner>
      </Teleport>
    </UIFormTagsInputRoot>
  </UIFormComboboxRoot>
</template>
