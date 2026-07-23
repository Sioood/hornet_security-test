<script setup lang="ts">
import type { TagsInputRootBaseProps, TagsInputRootProviderBaseProps } from '@ark-ui/vue/tags-input'
import type { ComboboxItem } from '~/utils/Components/Form/Combobox/context'
import type {
  TagsInputIntent,
  TagsInputSize,
  UITagsInputSlots,
} from '~/utils/Components/Form/TagsInput/context'

defineOptions({ inheritAttrs: false })

export type { ComboboxItem as TagsInputComboboxItem } from '~/utils/Components/Form/Combobox/context'

export interface TagsInputProps
  extends
    Omit<TagsInputRootBaseProps, 'modelValue' | 'inputValue'>,
    Omit<TagsInputRootProviderBaseProps, 'value'> {
  /** When set (including `null` for async), enables combobox autocomplete mode. */
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
  allowCustomValue?: boolean
  intent?: TagsInputIntent
  size?: TagsInputSize
  ui?: Partial<UITagsInputSlots>
}

const modelValue = defineModel<string[]>({ default: () => [] })
const inputValue = defineModel<string>('inputValue', { default: '' })

const props = withDefaults(defineProps<TagsInputProps>(), {
  addOnPaste: false,
  allowCustomValue: true,
  delimiter: ',',
  editable: true,
  emptyText: 'tagsInput.noOptions',
  error: undefined,
  helperText: undefined,
  intent: 'primary',
  items: undefined,
  label: undefined,
  loading: false,
  loadingText: 'tagsInput.loading',
  placeholder: 'tagsInput.placeholder',
  portalled: true,
  showClear: true,
  size: 'md',
  teleportTo: 'body',
  ui: undefined,
  value: undefined,
})

const comboboxMode = computed(() => props.items !== undefined)

const attrs = useAttrs()

const hasTags = computed(() => modelValue.value.length > 0)

const shellProps = computed(() => ({
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
    portalled: _portalled,
    showClear: _showClear,
    teleportTo: _teleportTo,
    ui: _ui,
    ...rest
  } = props
  return rest
})

extendCompodiumMeta({
  defaultProps: {
    intent: 'primary',
    label: 'Tags',
    placeholder: 'tagsInput.placeholder',
    size: 'md',
  },
})
</script>

<template>
  <UIFormTagsInputComboboxShell
    v-if="comboboxMode"
    v-bind="{ ...props, ...attrs }"
    v-model="modelValue"
    v-model:input-value="inputValue"
    :items
  />

  <UIFormTagsInputRoot
    v-else
    v-bind="{ ...rootPassthrough, ...attrs }"
    v-model="modelValue"
    v-model:input-value="inputValue"
    :intent
    :size
    :ui="{ root: ui?.root }"
  >
    <UIFormControlShell v-bind="shellProps">
      <UIFormTagsInputControl :ui="cn('border-0 bg-transparent p-0 shadow-none', ui?.control)">
        <UIFormTagsInputItems
          :intent
          :size
          :ui="{
            root: ui?.items,
            tag: ui?.tag,
            tagRemove: ui?.tagRemove,
          }"
        />

        <UIFormTagsInputFieldInput
          :placeholder="$te(placeholder) ? $t(placeholder) : placeholder"
          :ui="cn('min-w-12 flex-1', ui?.input)"
        />

        <UIFormTagsInputClearTrigger v-if="showClear && hasTags" :ui="ui?.clearTrigger" />
      </UIFormTagsInputControl>
    </UIFormControlShell>

    <UIFormTagsInputHiddenInput :ui="ui?.hiddenInput" />

    <slot />
  </UIFormTagsInputRoot>
</template>
