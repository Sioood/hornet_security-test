<script setup lang="ts">
import {
  Field as ArkField,
  type FieldTextareaBaseProps as ArkFieldTextareaBaseProps,
} from '@ark-ui/vue/field'

import { fieldInputCVA } from '~/utils/Components/Form/variants'

import type { UIInputSlots } from '~/utils/Components/Form/context'
import type { FormControlShellProps } from '~ui/app/components/Form/FormControlShell.vue'

export type { UIInputSlots } from '~/utils/Components/Form/context'

/** Public API for imperative focus. */
export interface UIFormTextareaExpose {
  getControlElement: () => HTMLTextAreaElement | null
  focus: () => void
}

defineOptions({ inheritAttrs: false })

interface TextareaProps extends Omit<FormControlShellProps, 'ui'>, ArkFieldTextareaBaseProps {
  name?: string
  placeholder?: string
  /** When true, the textarea auto-grows to fit content. @default false */
  autoresize?: boolean
  /** Minimum number of rows when autoresize is enabled. */
  rows?: number
  ui?: Partial<UIInputSlots>
}

const emit = defineEmits<{
  blur: [event: FocusEvent]
}>()

const modelValue = defineModel<string>({ default: '' })

const props = withDefaults(defineProps<TextareaProps>(), {
  intent: 'primary',
  mode: 'leadingAndTrailing',
  name: undefined,
  placeholder: '',
  rows: 3,
  size: 'md',
  state: 'default',
  ui: undefined,
})

const shellProps = computed<FormControlShellProps>(() => ({
  ...pick(props, [
    'disabled',
    'error',
    'helperText',
    'icon',
    'infoIcon',
    'intent',
    'label',
    'leading',
    'leadingIcon',
    'loadingIcon',
    'readOnly',
    'required',
    'size',
    'state',
    'successIcon',
    'trailing',
    'trailingIcon',
    'warningIcon',
  ] as const),
  errorIcon: props.errorIcon,
  invalid: props.invalid || String(props.error ?? '').length > 0,
  ui: props.ui,
}))

const attrs = useAttrs()

const textareaFallthroughAttrs = computed(() => {
  const { ui: _ui, ...rest } = attrs as Record<string, unknown> & { ui?: Partial<UIInputSlots> }
  return rest
})

const textareaProps = computed(() => ({
  ...pick(props, [
    'name',
    'placeholder',
    'disabled',
    'readOnly',
    'required',
    'autoresize',
  ] as const),
  invalid: props.invalid || String(props.error ?? '').length > 0,
  rows: props.rows,
}))

const arkTextareaRef = ref<InstanceType<typeof ArkField.Textarea> | null>(null)

const controlElement = computed((): HTMLTextAreaElement | null => {
  const inst = arkTextareaRef.value
  if (!inst) return null
  const el = (inst as { $el?: unknown }).$el
  return el instanceof HTMLTextAreaElement ? el : null
})

defineExpose({
  focus: (): void => {
    controlElement.value?.focus()
  },
  getControlElement: (): HTMLTextAreaElement | null => controlElement.value,
} satisfies UIFormTextareaExpose)

extendCompodiumMeta({
  defaultProps: {
    autoresize: false,
    intent: 'primary',
    label: 'Bio',
    modelValue: '',
    placeholder: 'Tell us about yourself…',
    size: 'md',
  },
})
</script>

<template>
  <UIFormControlShell v-bind="shellProps">
    <ArkField.Textarea
      ref="arkTextareaRef"
      v-bind="{ ...textareaProps, ...textareaFallthroughAttrs }"
      v-model="modelValue"
      :class="cn(fieldInputCVA({ size, intent, disabled }), ui?.input, 'resize-y')"
      @blur="emit('blur', $event)"
    />
  </UIFormControlShell>
</template>
