<script setup lang="ts">
import {
  createListCollection,
  type SelectRootBaseProps as ArkSelectRootProps,
  type SelectRootProviderBaseProps as ArkSelectRootProviderBaseProps,
  type UseSelectReturn,
} from '@ark-ui/vue/select'

import type {
  SelectIntent,
  SelectSize,
  SelectItem,
  UISelectSlots,
} from '~/utils/Components/Form/Select/context'
import type { FormControlShellProps } from '~ui/app/components/Form/FormControlShell.vue'

defineOptions({ inheritAttrs: false })

export type { SelectItem } from '~/utils/Components/Form/Select/context'

export interface SelectProps
  extends
    Omit<ArkSelectRootProps<SelectItem>, 'collection'>,
    Omit<ArkSelectRootProviderBaseProps<SelectItem>, 'value'> {
  /**
   * Pass the return value of `useSelect()` to enable **RootProvider** mode —
   * the component will be controlled entirely from outside via the Ark API object.
   * Omit (or leave `undefined`) to use the default **Root** mode with `v-model`.
   */
  value?: UseSelectReturn<SelectItem>['value']
  /** Items to display. Pass `null` to indicate items have not been loaded yet (async). */
  items?: SelectItem[] | null
  placeholder?: string
  label?: string
  helperText?: string
  error?: string
  /** Allow multiple selection */
  multiple?: boolean
  /** Maximum number of items that can be selected (requires `multiple`) */
  maxSelection?: number
  /** Show a "Select All" button at the top of the dropdown (requires `multiple`) */
  allowSelectAll?: boolean
  /** Show a spinner inside the dropdown */
  loading?: boolean
  loadingText?: string
  emptyText?: string
  readOnly?: boolean
  /** Teleport dropdown to DOM (default: true) */
  portalled?: boolean
  teleportTo?: string
  intent?: SelectIntent
  size?: SelectSize
  /** Show a clear button when a value is selected */
  showClear?: boolean
  ui?: Partial<UISelectSlots>
}

const modelValue = defineModel<string[]>()
const open = defineModel<boolean>('open')

const props = withDefaults(defineProps<SelectProps>(), {
  allowSelectAll: false,
  closeOnSelect: true,
  emptyText: 'select.noOptions',
  error: undefined,
  helperText: undefined,
  intent: 'primary',
  items: () => [],
  label: undefined,
  lazyMount: true,
  loading: false,
  loadingText: 'select.loading',
  maxSelection: undefined,
  multiple: false,
  placeholder: 'select.select',
  portalled: true,
  readOnly: false,
  showClear: true,
  size: 'md',
  teleportTo: 'body',
  ui: undefined,
  unmountOnExit: true,
  value: undefined,
})

const attrs = useAttrs()

const rawItems = computed(() => props.items ?? [])

const coalescedValue = computed(() => modelValue.value ?? [])

const hasValue = computed(() => coalescedValue.value.length > 0)

const hasMaxReached = computed(
  () =>
    props.multiple &&
    props.maxSelection !== undefined &&
    coalescedValue.value.length >= props.maxSelection,
)

const collection = computed(() => {
  const processed: SelectItem[] = rawItems.value.map((item) => ({
    ...item,
    disabled:
      item.disabled === true || (hasMaxReached.value && !coalescedValue.value.includes(item.value)),
  }))

  if (processed.some((item) => item.group)) {
    return createListCollection({
      groupBy: (item: SelectItem) => item.group ?? '',
      items: processed,
    })
  }

  return createListCollection({ items: processed })
})

const isGrouped = computed(() => rawItems.value.some((item) => item.group))

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
    shell: props.ui?.control,
  },
}))

function handleValueChange(details: { value: string[] }) {
  if (props.maxSelection !== undefined && details.value.length > props.maxSelection) return
  modelValue.value = details.value
}

const rootPassthrough = computed(() => {
  const {
    allowSelectAll: _allowSelectAll,
    emptyText: _emptyText,
    error: _error,
    helperText: _helperText,
    items: _items,
    label: _label,
    loading: _loading,
    loadingText: _loadingText,
    maxSelection: _maxSelection,
    placeholder: _placeholder,
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
    label: 'Framework',
    placeholder: 'select.select',
    size: 'md',
  },
})
</script>

<template>
  <UIFormSelectRoot
    v-bind="{ ...rootPassthrough, ...attrs }"
    v-model="modelValue"
    v-model:open="open"
    :collection
    :intent
    :size
    :ui="{ root: ui?.root }"
    @value-change="handleValueChange"
  >
    <UIFormControlShell v-bind="shellProps">
      <UIFormSelectControl
        :ui="cn('min-w-0 flex-1 border-0 bg-transparent p-0 shadow-none', ui?.control)"
      >
        <UIFormSelectTrigger
          :disabled
          :ui="cn('w-full border-0 bg-transparent shadow-none active:scale-100', ui?.trigger)"
        >
          <UIFormSelectValueText
            :placeholder="$te(placeholder) ? $t(placeholder) : placeholder"
            :ui="ui?.valueText"
          />
          <ClientOnly>
            <UIFormSelectClearTrigger v-if="showClear && hasValue" :ui="ui?.clearTrigger" />
          </ClientOnly>
          <UIFormSelectIndicator :ui="ui?.indicator" />
        </UIFormSelectTrigger>
      </UIFormSelectControl>
    </UIFormControlShell>

    <Teleport :to="teleportTo" :disabled="!portalled">
      <UIFormSelectPositioner :ui="ui?.positioner">
        <UIFormSelectContent :ui="ui?.content">
          <slot name="content" :collection :loading :is-grouped>
            <UIFormSelectListContent
              :collection
              :intent
              :size
              :loading
              :loading-text="$te(loadingText) ? $t(loadingText) : loadingText"
              :empty-text="$te(emptyText) ? $t(emptyText) : emptyText"
              :allow-select-all="allowSelectAll && multiple"
              :is-grouped
              :ui
            />
          </slot>
        </UIFormSelectContent>
      </UIFormSelectPositioner>
    </Teleport>

    <ClientOnly>
      <UIFormSelectHiddenSelect />
    </ClientOnly>

    <slot />
  </UIFormSelectRoot>
</template>
