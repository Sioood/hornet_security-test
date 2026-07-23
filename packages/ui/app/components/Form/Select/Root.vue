<script setup lang="ts">
import {
  Select as ArkSelect,
  createListCollection,
  type SelectRootBaseProps,
  type SelectRootProviderBaseProps,
  type UseSelectReturn,
} from '@ark-ui/vue/select'

import {
  selectChromeKey,
  type SelectIntent,
  type SelectItem,
  type SelectSize,
  type UISelectSlots,
} from '~/utils/Components/Form/Select/context'
import { selectRootCVA } from '~/utils/Components/Form/Select/variants'

import type { ClassValue } from 'vue'

defineOptions({ inheritAttrs: false })

export interface UIFormSelectRootSlots {
  root?: ClassValue
}

export interface SelectRootProps
  extends
    Omit<SelectRootBaseProps<SelectItem>, 'modelValue' | 'open' | 'collection'>,
    Omit<SelectRootProviderBaseProps<SelectItem>, 'value'> {
  collection?: SelectRootBaseProps<SelectItem>['collection']
  /** Pass the return value of `useSelect()` to enable RootProvider mode. */
  value?: UseSelectReturn<SelectItem>['value']
  intent?: SelectIntent
  size?: SelectSize
  ui?: Partial<UIFormSelectRootSlots & UISelectSlots>
}

const props = withDefaults(defineProps<SelectRootProps>(), {
  collection: undefined,
  intent: 'primary',
  size: 'md',
  ui: undefined,
  value: undefined,
})

const modelValue = defineModel<string[]>()
const open = defineModel<boolean>('open')

const attrs = useAttrs()

provide(selectChromeKey, {
  intent: toRef(props, 'intent'),
  size: toRef(props, 'size'),
})

const arkAttrs = computed(() => splitArkAttrs(attrs))

const fallbackCollection = createListCollection<SelectItem>({ items: [] })

const rootOnlyProps = computed(() =>
  pick(props, [
    'asChild',
    'autoComplete',
    'closeOnSelect',
    'composite',
    'defaultHighlightedValue',
    'defaultOpen',
    'defaultValue',
    'deselectable',
    'disabled',
    'form',
    'highlightedValue',
    'id',
    'ids',
    'invalid',
    'lazyMount',
    'loopFocus',
    'multiple',
    'name',
    'positioning',
    'readOnly',
    'required',
    'scrollToIndexFn',
    'unmountOnExit',
  ] as const),
)

const rootClass = computed(() =>
  cn(selectRootCVA(), arkAttrs.value.class as ClassValue, props.ui?.root),
)

const providerBindings = computed(() => ({
  ...pick(props, ['asChild', 'lazyMount', 'unmountOnExit'] as const),
  ...arkAttrs.value,
  class: rootClass.value,
}))

const rootBindings = computed(() => ({
  ...rootOnlyProps.value,
  collection: props.collection ?? fallbackCollection,
  ...arkAttrs.value,
  class: rootClass.value,
  ...(open.value !== undefined
    ? {
        'onUpdate:open': (next: boolean) => {
          open.value = next
        },
        open: open.value,
      }
    : {}),
  modelValue: modelValue.value ?? [],
  'onUpdate:modelValue': (next: string[]) => {
    modelValue.value = next
  },
}))

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
  <ArkSelect.RootProvider v-if="value" :value="value" v-bind="providerBindings">
    <slot />
  </ArkSelect.RootProvider>
  <ArkSelect.Root v-else v-bind="rootBindings" @value-change="onValueChange">
    <slot />
  </ArkSelect.Root>
</template>
