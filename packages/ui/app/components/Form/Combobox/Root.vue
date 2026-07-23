<script setup lang="ts">
import {
  Combobox as ArkCombobox,
  type ComboboxRootBaseProps,
  type ComboboxRootProviderBaseProps,
  type UseComboboxReturn,
} from '@ark-ui/vue/combobox'

import {
  comboboxChromeKey,
  type ComboboxIntent,
  type ComboboxItem,
  type ComboboxSize,
  type UIComboboxSlots,
} from '~/utils/Components/Form/Combobox/context'
import { comboboxRootCVA } from '~/utils/Components/Form/Combobox/variants'

import type { ClassValue } from 'vue'

defineOptions({ inheritAttrs: false })

export interface UIFormComboboxRootSlots {
  root?: ClassValue
}

export interface ComboboxRootProps
  extends
    Omit<ComboboxRootBaseProps<ComboboxItem>, 'modelValue' | 'open' | 'inputValue'>,
    Omit<ComboboxRootProviderBaseProps<ComboboxItem>, 'value'> {
  value?: UseComboboxReturn<ComboboxItem>
  intent?: ComboboxIntent
  size?: ComboboxSize
  ui?: Partial<UIFormComboboxRootSlots & UIComboboxSlots>
}

const props = withDefaults(defineProps<ComboboxRootProps>(), {
  intent: 'primary',
  size: 'md',
  ui: undefined,
  value: undefined,
})

const modelValue = defineModel<string[]>()
const open = defineModel<boolean>('open')
const inputValue = defineModel<string>('inputValue')

const attrs = useAttrs()

provide(comboboxChromeKey, {
  intent: toRef(props, 'intent'),
  size: toRef(props, 'size'),
})

const isProvider = computed(() => props.value !== undefined)

const rootComponent = computed(() =>
  isProvider.value ? ArkCombobox.RootProvider : ArkCombobox.Root,
)

const rootProps = computed(() => {
  if (isProvider.value) {
    return pick(props, ['asChild', 'lazyMount', 'unmountOnExit', 'value'])
  }
  return pick(props, [
    'allowCustomValue',
    'alwaysSubmitOnEnter',
    'asChild',
    'closeOnSelect',
    'collection',
    'composite',
    'defaultHighlightedValue',
    'defaultInputValue',
    'defaultOpen',
    'defaultValue',
    'disabled',
    'disableLayer',
    'form',
    'highlightedValue',
    'id',
    'ids',
    'inputBehavior',
    'invalid',
    'lazyMount',
    'loopFocus',
    'multiple',
    'name',
    'navigate',
    'openOnChange',
    'openOnClick',
    'openOnKeyPress',
    'placeholder',
    'positioning',
    'readOnly',
    'required',
    'scrollToIndexFn',
    'selectionBehavior',
    'translations',
    'unmountOnExit',
  ])
})

const arkAttrs = computed(() => splitArkAttrs(attrs))

const rootBindings = computed(() => {
  const base: Record<string, unknown> = {
    ...rootProps.value,
    ...arkAttrs.value,
    class: cn(comboboxRootCVA(), arkAttrs.value.class as ClassValue, props.ui?.root),
  }

  if (!isProvider.value) {
    if (open.value !== undefined) {
      base.open = open.value
      base['onUpdate:open'] = (next: boolean) => {
        open.value = next
      }
    }
    if (inputValue.value !== undefined) {
      base.inputValue = inputValue.value
      base['onUpdate:inputValue'] = (next: string) => {
        inputValue.value = next
      }
    }
  }

  return base
})

function onValueChange(details: { value: string[] }) {
  if (modelValue.value !== undefined) {
    modelValue.value = details.value
  }
}

extendCompodiumMeta({
  defaultProps: {
    intent: 'primary',
    size: 'md',
  },
})
</script>

<template>
  <component :is="rootComponent" v-if="isProvider" v-bind="rootBindings">
    <slot />
  </component>

  <component
    :is="rootComponent"
    v-else
    v-bind="rootBindings"
    :model-value="modelValue"
    @update:model-value="(next: string[]) => (modelValue = next)"
    @value-change="onValueChange"
  >
    <slot />
  </component>
</template>
