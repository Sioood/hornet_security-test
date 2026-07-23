<script setup lang="ts">
import {
  NumberInput as ArkNumberInput,
  type NumberInputRootProps as ArkNumberInputRootProps,
  type NumberInputRootProviderProps as ArkNumberInputRootProviderProps,
  type UseNumberInputReturn,
} from '@ark-ui/vue/number-input'

import { controlShellCVA, fieldInputCVA } from '~/utils/Components/Form/variants'
import { type UseComponentIconsProps } from '~ui/app/composables/useComponentIcons'

import type { UINumberInputSlots } from '~/utils/Components/Form/context'
import type { FormControlShellProps } from '~ui/app/components/Form/FormControlShell.vue'

export interface UIFormNumberInputExpose {
  getControlElement: () => HTMLInputElement | null
  focus: () => void
}

defineOptions({ inheritAttrs: false })

export interface NumberInputProps
  extends
    Omit<ArkNumberInputRootProps, 'modelValue'>,
    Omit<ArkNumberInputRootProviderProps, 'value'>,
    Omit<FormControlShellProps, 'ui' | 'ids'> {
  /**
   * Pass the return value of `useNumberInput()` to enable **RootProvider** mode.
   * Omit (or leave `undefined`) to use the default **Root** mode with `v-model`.
   */
  value?: UseNumberInputReturn['value']
  /** Placeholder text for the input. */
  placeholder?: string
  scrubber?: boolean
  ui?: Partial<UINumberInputSlots>
}

const modelValue = defineModel<string>({ required: false })

const emit = defineEmits<{
  blur: [event: FocusEvent]
}>()

const props = withDefaults(defineProps<NumberInputProps>(), {
  allowMouseWheel: true,
  disabled: undefined,
  intent: 'primary',
  invalid: undefined,
  label: undefined,
  mode: 'leadingAndTrailing',
  placeholder: '0',
  scrubber: true,
  size: 'md',
  state: 'default',
  trailing: false,
  ui: undefined,
  value: undefined,
})

const attrs = useAttrs()

const isProvider = computed(() => props.value !== undefined)

const rootComponent = computed(() =>
  isProvider.value ? ArkNumberInput.RootProvider : ArkNumberInput.Root,
)

const rootProps = computed(() => {
  if (isProvider.value) {
    return { value: props.value }
  }
  return pick(props, [
    'allowMouseWheel',
    'allowOverflow',
    'clampValueOnBlur',
    'defaultValue',
    'disabled',
    'focusInputOnChange',
    'formatOptions',
    'form',
    'id',
    'ids',
    'inputMode',
    'locale',
    'max',
    'min',
    'name',
    'pattern',
    'readOnly',
    'required',
    'spinOnPress',
    'step',
    'translations',
  ] as const)
})

const arkAttrs = computed(() => splitArkAttrs(attrs))

const invalid = computed(() => props.invalid || String(props.error ?? '').length > 0)
const disabled = computed(() => props.disabled ?? false)

const rootBindings = computed(() => {
  const base: Record<string, unknown> = {
    ...rootProps.value,
    ...arkAttrs.value,
    class: cn(
      controlShellCVA({
        disabled: disabled.value,
        intent: props.intent,
        invalid: invalid.value,
        size: props.size,
      }),
      'flex w-full items-stretch gap-0',
      props.ui?.shell,
    ),
    invalid: invalid.value,
  }
  if (!isProvider.value) {
    if (modelValue.value !== undefined) {
      base.modelValue = modelValue.value
      base['onUpdate:modelValue'] = (v: string) => {
        modelValue.value = v
      }
    }
  }
  return base
})

const iconProps = computed<UseComponentIconsProps>(() => ({
  ...pick(props, [
    'errorIcon',
    'icon',
    'infoIcon',
    'leading',
    'leadingIcon',
    'loadingIcon',
    'state',
    'successIcon',
    'trailing',
    'trailingIcon',
    'warningIcon',
  ] as const),
}))

const { isLeading, isTrailing, leadingIconName, trailingIconName, shouldAnimate } =
  useComponentIcons(iconProps)

const fieldProps = computed<FormControlShellProps>(() => ({
  ...pick(props, [
    'disabled',
    'error',
    'helperText',
    'id',
    'ids',
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

const inputAttrs = computed(() => {
  const { ui: _ui, ...rest } = attrs as Record<string, unknown> & {
    ui?: Partial<UINumberInputSlots>
  }
  return rest
})

const numberInputRef = ref<InstanceType<typeof ArkNumberInput.Input> | null>(null)

const controlElement = computed((): HTMLInputElement | null => {
  const inst = numberInputRef.value
  if (!inst) return null
  const el = (inst as { $el?: unknown }).$el
  return el instanceof HTMLInputElement ? el : null
})

defineExpose({
  focus: (): void => {
    controlElement.value?.focus()
  },
  getControlElement: (): HTMLInputElement | null => controlElement.value,
} satisfies UIFormNumberInputExpose)

extendCompodiumMeta({
  defaultProps: {
    intent: 'primary',
    label: 'Quantity',
    max: 100,
    min: 0,
    size: 'md',
    step: 1,
  },
})
</script>

<template>
  <UIFormField v-bind="fieldProps">
    <component :is="rootComponent" v-bind="rootBindings">
      <span
        v-if="isLeading && leadingIconName"
        :class="cn('flex shrink-0 items-center pl-2 text-primary-icon-subtle', ui?.leadingIcon)"
        aria-hidden="true"
      >
        <Icon
          :name="leadingIconName"
          class="size-4 shrink-0"
          :class="{ 'animate-spin': shouldAnimate }"
        />
      </span>

      <ArkNumberInput.Control class="flex min-w-0 flex-1">
        <ArkNumberInput.Input
          ref="numberInputRef"
          :placeholder
          v-bind="inputAttrs"
          :class="
            cn(fieldInputCVA({ size, intent, disabled }), 'text-center tabular-nums', ui?.input)
          "
          @blur="emit('blur', $event)"
        />
      </ArkNumberInput.Control>

      <div class="flex shrink-0 items-stretch gap-0">
        <div class="join join-vertical flex flex-col" :class="ui?.stepperGroup">
          <ArkNumberInput.IncrementTrigger as-child :class="ui?.incrementTrigger">
            <UIButton
              variant="subtle"
              :intent
              size="sm"
              icon-only
              :disabled="disabled || readOnly"
              :ui="{ root: 'flex-1 gap-0! rounded-none px-0.5! py-0! join-item' }"
              icon="tabler:chevron-up"
            />
          </ArkNumberInput.IncrementTrigger>

          <ArkNumberInput.DecrementTrigger as-child :class="ui?.decrementTrigger">
            <UIButton
              variant="subtle"
              :intent
              size="sm"
              icon-only
              :disabled="disabled || readOnly"
              :ui="{ root: 'flex-1 gap-0! rounded-none px-0.5! py-0! join-item' }"
              icon="tabler:chevron-down"
            />
          </ArkNumberInput.DecrementTrigger>
        </div>

        <ArkNumberInput.Scrubber
          v-if="scrubber"
          :class="
            cn(
              'flex w-5 shrink-0 cursor-ew-resize items-center justify-center text-primary-icon-subtle transition-colors select-none',
              'hover:bg-primary-fill-subtle-hover active:cursor-ew-resize active:bg-primary-fill-subtle-active',
              ui?.scrubber,
            )
          "
        >
          <Icon name="tabler:arrow-bar-both" class="size-3 shrink-0" />
        </ArkNumberInput.Scrubber>
      </div>

      <span
        v-if="isTrailing && trailingIconName"
        :class="cn('flex shrink-0 items-center px-2 text-primary-icon-subtle', ui?.trailingIcon)"
        aria-hidden="true"
      >
        <Icon
          :name="trailingIconName"
          class="size-4 shrink-0"
          :class="{ 'animate-spin': shouldAnimate }"
        />
      </span>
    </component>
  </UIFormField>
</template>
