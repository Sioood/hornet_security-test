<script setup lang="ts">
import {
  Field as ArkField,
  type FieldInputBaseProps as ArkFieldInputBaseProps,
} from '@ark-ui/vue/field'

import { fieldInputCVA } from '~/utils/Components/Form/variants'

import type { UIInputSlots } from '~/utils/Components/Form/context'
import type { FormControlShellProps } from '~ui/app/components/Form/FormControlShell.vue'

export type { UIInputSlots } from '~/utils/Components/Form/context'

/** Public API for imperative focus (e.g. dialog `initialFocusEl`). */
export interface UIFormInputExpose {
  getControlElement: () => HTMLInputElement | null
  focus: () => void
}

defineOptions({ inheritAttrs: false })

interface InputProps extends Omit<FormControlShellProps, 'ui'>, ArkFieldInputBaseProps {
  name?: string
  placeholder?: string
  type?: string
  /** Show a clear button when the input has a value */
  clearable?: boolean
  ui?: Partial<UIInputSlots>
}

const emit = defineEmits<{
  blur: [event: FocusEvent]
}>()

const modelValue = defineModel<string>({ default: '' })

const props = withDefaults(defineProps<InputProps>(), {
  clearable: false,
  error: undefined,
  errorIcon: undefined,
  helperText: undefined,
  icon: undefined,
  infoIcon: undefined,
  intent: 'primary',
  label: undefined,
  leading: false,
  leadingIcon: undefined,
  loadingIcon: undefined,
  mode: 'leadingAndTrailing',
  name: undefined,
  placeholder: '',
  size: 'md',
  state: 'default',
  successIcon: undefined,
  trailing: false,
  trailingIcon: undefined,
  type: 'text',
  ui: undefined,
  warningIcon: undefined,
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
    'mode',
    'readOnly',
    'required',
    'size',
    'state',
    'successIcon',
    'warningIcon',
  ] as const),
  errorIcon: props.errorIcon,
  invalid: props.invalid || String(props.error ?? '').length > 0,
  trailing: isPasswordField.value ? false : props.trailing,
  trailingIcon: isPasswordField.value ? undefined : props.trailingIcon,
  ui: props.ui,
}))

const resolvedInputType = computed(() =>
  isPasswordField.value ? (showPassword.value ? 'text' : 'password') : props.type,
)

const inputProps = computed(() => ({
  ...pick(props, ['name', 'placeholder', 'disabled', 'readOnly', 'required'] as const),
  invalid: props.invalid || String(props.error ?? '').length > 0,
  type: resolvedInputType.value,
}))

const isPasswordField = computed(() => props.type === 'password')
const showPassword = ref(false)
const passwordToggleLabel = computed(() => (showPassword.value ? 'Hide password' : 'Show password'))

const attrs = useAttrs()

const inputFallthroughAttrs = computed(() => {
  const { ui: _ui, ...rest } = attrs as Record<string, unknown> & { ui?: Partial<UIInputSlots> }
  return rest
})

const arkInputRef = ref<InstanceType<typeof ArkField.Input> | null>(null)

const controlElement = computed((): HTMLInputElement | null => {
  const inst = arkInputRef.value
  if (!inst) return null
  const el = (inst as { $el?: unknown }).$el
  return el instanceof HTMLInputElement ? el : null
})

defineExpose({
  focus: (): void => {
    controlElement.value?.focus()
  },
  getControlElement: (): HTMLInputElement | null => controlElement.value,
} satisfies UIFormInputExpose)

extendCompodiumMeta({
  defaultProps: {
    intent: 'primary',
    label: 'Email',
    leading: true,
    leadingIcon: 'tabler:sparkles',
    modelValue: '',
    placeholder: 'you@example.com',
    required: true,
    size: 'md',
    type: 'text',
  },
})
</script>

<template>
  <UIFormControlShell v-bind="shellProps">
    <template v-if="$slots.leading" #leading>
      <slot name="leading" />
    </template>

    <template v-if="$slots['inner-leading']" #inner-leading>
      <slot name="inner-leading" />
    </template>

    <ArkField.Input
      ref="arkInputRef"
      v-bind="{ ...inputProps, ...inputFallthroughAttrs }"
      v-model="modelValue"
      :type="resolvedInputType"
      :class="cn(fieldInputCVA({ size, intent, disabled }), ui?.input)"
      @blur="emit('blur', $event)"
    />

    <template #inner-trailing>
      <UIButton
        v-if="clearable && modelValue"
        size="sm"
        variant="ghost"
        intent="error"
        icon-only
        icon="tabler:x"
        :disabled="disabled || readOnly"
        :ui="{
          root: 'h-full',
        }"
        @click="modelValue = ''"
      />
      <UIToggle
        v-if="isPasswordField"
        v-model:pressed="showPassword"
        variant="ghost"
        intent="primary"
        size="sm"
        icon-only
        :disabled="disabled || readOnly"
        :aria-label="passwordToggleLabel"
      >
        <template #on>
          <Icon name="tabler:eye-off" class="size-4 shrink-0" />
        </template>
        <template #off>
          <Icon name="tabler:eye" class="size-4 shrink-0" />
        </template>
      </UIToggle>
    </template>

    <template v-if="$slots.trailing" #trailing>
      <slot name="trailing" />
    </template>
  </UIFormControlShell>
</template>
