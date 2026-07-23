<script setup lang="ts">
import {
  PinInput as ArkPinInput,
  type PinInputRootProps as ArkPinInputRootProps,
  type PinInputRootProviderProps as ArkPinInputRootProviderProps,
  type UsePinInputReturn,
} from '@ark-ui/vue/pin-input'

import { fieldInputCVA, pinSlotCVA } from '~/utils/Components/Form/variants'

import type {
  FormFieldIntent,
  FormFieldSize,
  UIPinInputSlots,
} from '~/utils/Components/Form/context'

defineOptions({ inheritAttrs: false })

export interface UIFormPinInputExpose {
  getControlElement: () => HTMLInputElement | null
  focus: () => void
}

export interface PinInputProps
  extends
    Omit<ArkPinInputRootProps, 'modelValue' | 'defaultValue' | 'ids'>,
    Omit<ArkPinInputRootProviderProps, 'value'> {
  /**
   * Pass the return value of `usePinInput()` to enable **RootProvider** mode.
   * Omit (or leave `undefined`) to use the default **Root** mode with `v-model`.
   */
  value?: UsePinInputReturn['value']
  /** Field label. */
  label?: string
  /** Helper text shown below the input group. */
  helperText?: string
  /** Error message shown when invalid. */
  error?: string
  /** Visual intent for the pin slots. @default 'primary' */
  intent?: FormFieldIntent
  /** Visual size for the pin slots. @default 'md' */
  size?: FormFieldSize
  /** Slot-level class overrides. */
  ui?: Partial<UIPinInputSlots>
}

const modelValue = defineModel<string>()

const props = withDefaults(defineProps<PinInputProps>(), {
  autoFocus: false,
  autoSubmit: undefined,
  blurOnComplete: false,
  count: 5,
  disabled: undefined,
  error: undefined,
  helperText: undefined,
  intent: 'primary',
  invalid: undefined,
  label: undefined,
  mask: false,
  otp: false,
  placeholder: undefined,
  readOnly: undefined,
  required: undefined,
  selectOnFocus: undefined,
  size: 'md',
  type: 'numeric',
  ui: undefined,
  value: undefined,
})

const attrs = useAttrs()

const isProvider = computed(() => props.value !== undefined)

const rootComponent = computed(() =>
  isProvider.value ? ArkPinInput.RootProvider : ArkPinInput.Root,
)

const rootProps = computed(() => {
  if (isProvider.value) {
    return { value: props.value }
  }
  return pick(props, [
    'autoFocus',
    'autoSubmit',
    'blurOnComplete',
    'count',
    'disabled',
    'form',
    'id',
    'mask',
    'name',
    'otp',
    'pattern',
    'placeholder',
    'readOnly',
    'required',
    'sanitizeValue',
    'selectOnFocus',
    'translations',
    'type',
  ] as const)
})

const arkAttrs = computed(() => splitArkAttrs(attrs))

const invalid = computed(() => props.invalid || String(props.error ?? '').length > 0)
const disabled = computed(() => props.disabled ?? false)

/** Convert v-model string ↔ Ark's string[] internally. */
const arkValue = computed<string[]>({
  get: () => Array.from({ length: props.count }, (_, i) => modelValue.value?.[i] ?? ''),
  set: (v: string[]) => {
    modelValue.value = v.join('')
  },
})

const rootBindings = computed(() => {
  const base: Record<string, unknown> = {
    ...rootProps.value,
    ...arkAttrs.value,
    class: cn('flex flex-col gap-1.5', props.ui?.root),
    invalid: invalid.value,
  }
  if (!isProvider.value) {
    base.modelValue = arkValue.value
    base['onUpdate:modelValue'] = (v: string[]) => {
      modelValue.value = v.join('')
    }
  }
  return base
})

const fieldProps = computed(() => ({
  ...pick(props, [
    'disabled',
    'error',
    'helperText',
    'id',
    'intent',
    'label',
    'readOnly',
    'required',
    'size',
  ] as const),
  invalid: invalid.value,
  ui: {
    error: props.ui?.error,
    helperText: props.ui?.helperText,
    label: props.ui?.label,
    root: props.ui?.root,
  },
}))

/** Array [0..count-1] for v-for iteration over pin slots. */
const slotIndexes = computed(() => Array.from({ length: props.count }, (_, i) => i))

/** Hold refs to all pin inputs for focus / getControlElement APIs. */
const pinInputRefs = ref<Array<InstanceType<typeof ArkPinInput.Input> | null>>([])

const controlElement = computed((): HTMLInputElement | null => {
  const [inst] = pinInputRefs.value
  if (!inst) return null
  const el = (inst as { $el?: unknown }).$el
  return el instanceof HTMLInputElement ? el : null
})

defineExpose({
  focus: (): void => {
    controlElement.value?.focus()
  },
  getControlElement: (): HTMLInputElement | null => controlElement.value,
} satisfies UIFormPinInputExpose)

extendCompodiumMeta({
  defaultProps: {
    count: 5,
    intent: 'primary',
    label: 'Verification code',
    modelValue: '',
    size: 'md',
    type: 'numeric',
  },
})
</script>

<template>
  <UIFormField v-bind="fieldProps">
    <component :is="rootComponent" v-bind="rootBindings">
      <ArkPinInput.Control
        :class="cn('flex flex-wrap items-center justify-center gap-2', ui?.control)"
      >
        <ArkPinInput.Input
          v-for="index in slotIndexes"
          :key="index"
          :ref="
            (el: unknown) => {
              pinInputRefs[index] = el as InstanceType<typeof ArkPinInput.Input> | null
            }
          "
          :index
          :class="
            cn(
              fieldInputCVA({ intent, size, disabled, standalone: true }),
              pinSlotCVA({ size, invalid }),
              ui?.input,
            )
          "
        />
      </ArkPinInput.Control>

      <ArkPinInput.HiddenInput :class="ui?.hiddenInput" />
    </component>
  </UIFormField>
</template>
