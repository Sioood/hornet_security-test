<script setup lang="ts">
import {
  TagsInput as ArkTagsInput,
  type TagsInputRootBaseProps,
  type TagsInputRootProviderBaseProps,
  type UseTagsInputReturn,
} from '@ark-ui/vue/tags-input'

import {
  tagsInputChromeKey,
  type TagsInputIntent,
  type TagsInputSize,
  type UITagsInputSlots,
} from '~/utils/Components/Form/TagsInput/context'
import { tagsInputRootCVA } from '~/utils/Components/Form/TagsInput/variants'

import type { ClassValue } from 'vue'

defineOptions({ inheritAttrs: false })

export interface UIFormTagsInputRootSlots {
  root?: ClassValue
}

export interface TagsInputRootProps
  extends
    Omit<TagsInputRootBaseProps, 'modelValue' | 'inputValue'>,
    Omit<TagsInputRootProviderBaseProps, 'value'> {
  value?: UseTagsInputReturn
  intent?: TagsInputIntent
  size?: TagsInputSize
  ui?: Partial<UIFormTagsInputRootSlots & UITagsInputSlots>
}

const props = withDefaults(defineProps<TagsInputRootProps>(), {
  intent: 'primary',
  size: 'md',
  ui: undefined,
  value: undefined,
})

const modelValue = defineModel<string[]>()
const inputValue = defineModel<string>('inputValue')

const attrs = useAttrs()

provide(tagsInputChromeKey, {
  intent: toRef(props, 'intent'),
  size: toRef(props, 'size'),
})

const isProvider = computed(() => props.value !== undefined)

const rootComponent = computed(() =>
  isProvider.value ? ArkTagsInput.RootProvider : ArkTagsInput.Root,
)

const rootProps = computed(() => {
  if (isProvider.value) {
    return pick(props, ['asChild', 'value'])
  }
  return pick(props, [
    'addOnPaste',
    'allowOverflow',
    'asChild',
    'autoFocus',
    'blurBehavior',
    'defaultInputValue',
    'defaultValue',
    'delimiter',
    'disabled',
    'editable',
    'form',
    'id',
    'ids',
    'invalid',
    'max',
    'maxLength',
    'name',
    'placeholder',
    'readOnly',
    'required',
    'translations',
    'validate',
  ])
})

const arkAttrs = computed(() => splitArkAttrs(attrs))

const rootBindings = computed(() => {
  const base: Record<string, unknown> = {
    ...rootProps.value,
    ...arkAttrs.value,
    class: cn(tagsInputRootCVA(), arkAttrs.value.class as ClassValue, props.ui?.root),
  }

  if (!isProvider.value && inputValue.value !== undefined) {
    base.inputValue = inputValue.value
    base['onUpdate:inputValue'] = (next: string) => {
      inputValue.value = next
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
