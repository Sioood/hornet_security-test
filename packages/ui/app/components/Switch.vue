<script setup lang="ts">
import {
  Switch as ArkSwitch,
  type SwitchRootBaseProps as ArkSwitchRootBaseProps,
  type SwitchRootProviderBaseProps as ArkSwitchRootProviderBaseProps,
  type UseSwitchReturn,
} from '@ark-ui/vue/switch'
import { cva } from 'class-variance-authority'

import type { FieldProps } from '~ui/app/components/Form/Field.vue'

import type { ClassValue } from 'vue'

defineOptions({ inheritAttrs: false })

type SwitchIntent = 'neutral' | 'primary' | 'secondary' | 'accent'
type SwitchSize = 'sm' | 'md' | 'lg'

interface UISwitchSlots {
  root?: ClassValue
  control?: ClassValue
  thumb?: ClassValue
  label?: ClassValue
}

const switchControlCVA = cva(
  [
    'relative inline-flex shrink-0 items-center transition-colors duration-200',
    'not-data-[disabled]:cursor-pointer data-[disabled]:cursor-not-allowed',
    'data-[invalid]:outline data-[invalid]:outline-error-border',
  ],
  {
    defaultVariants: {
      intent: 'primary',
      size: 'md',
    },
    variants: {
      intent: {
        accent:
          'data-[disabled]:bg-primary! bg-accent-fill data-[state=checked]:bg-accent-fill-active',
        neutral:
          'data-[disabled]:bg-primary! bg-neutral-fill data-[state=checked]:bg-neutral-fill-active',
        primary:
          'data-[disabled]:bg-primary! bg-primary-fill data-[state=checked]:bg-primary-fill-active',
        secondary:
          'data-[disabled]:bg-primary! bg-secondary-fill data-[state=checked]:bg-secondary-fill-active',
      } satisfies Record<SwitchIntent, string>,
      size: {
        lg: 'h-6 w-11 rounded-xs',
        md: 'h-5 w-9 rounded-xs',
        sm: 'h-4 w-7 rounded-xs',
      } satisfies Record<SwitchSize, string>,
    },
  },
)

const switchThumbCVA = cva(
  'pointer-events-none block transition-transform duration-150 ease-in-out data-[state=checked]:rotate-90',
  {
    defaultVariants: {
      size: 'md',
    },
    variants: {
      intent: {
        accent: 'bg-accent-on-fill',
        neutral: 'bg-neutral-on-fill',
        primary: 'bg-primary-on-fill',
        secondary: 'bg-secondary-on-fill',
      } satisfies Record<SwitchIntent, string>,
      size: {
        lg: 'size-4 translate-x-1 rounded-xs data-[state=checked]:translate-x-6',
        md: 'size-3.5 translate-x-1 rounded-xs data-[state=checked]:translate-x-4.75',
        sm: 'size-2.5 translate-x-1 rounded-xs data-[state=checked]:translate-x-3.75',
      } satisfies Record<SwitchSize, string>,
    },
  },
)

const switchLabelCVA = cva('', {
  variants: {
    intent: {
      accent: 'data-[disabled]:text-accent text-accent-text',
      neutral: 'data-[disabled]:text-neutral text-neutral-text',
      primary: 'data-[disabled]:text-primary text-primary-text',
      secondary: 'data-[disabled]:text-secondary text-secondary-text',
    } satisfies Record<SwitchIntent, string>,
    size: {
      lg: 'txt-h6',
      md: 'txt-label',
      sm: 'txt-base',
    } satisfies Record<SwitchSize, string>,
  },
})

export interface SwitchProps
  extends
    Omit<ArkSwitchRootBaseProps, 'value' | 'checked'>,
    Omit<ArkSwitchRootProviderBaseProps, 'value'>,
    Omit<FieldProps, 'ids' | 'intent' | 'size'> {
  /**
   * Pass the return value of `useSwitch()` to enable **RootProvider** mode —
   * the component will be controlled entirely from outside via the Ark API object.
   * Omit (or leave `undefined`) to use the default **Root** mode with `v-model`.
   */
  value?: UseSwitchReturn['value']
  intent?: SwitchIntent
  size?: SwitchSize
  ui?: Partial<UISwitchSlots>
}

const props = withDefaults(defineProps<SwitchProps>(), {
  intent: 'primary',
  size: 'md',
  ui: undefined,
  value: undefined,
})

const modelValue = defineModel<boolean>('modelValue', { default: false })

const invalid = computed(() =>
  Boolean(props.invalid || (props.error && String(props.error).length > 0)),
)

const attrs = useAttrs()

const isProvider = computed(() => props.value !== undefined)

const rootComponent = computed(() => (isProvider.value ? ArkSwitch.RootProvider : ArkSwitch.Root))

const rootProps = computed(() => {
  if (isProvider.value) {
    return pick(props, ['asChild', 'value'] as const)
  }
  return pick(props, ['asChild', 'defaultChecked', 'disabled', 'id', 'name', 'required'] as const)
})

const fieldProps = computed(() => ({
  ...pick(props, [
    'asChild',
    'disabled',
    'error',
    'helperText',
    'hideLabel',
    'id',
    'ids',
    'intent',
    'label',
    'labelAssociatesControl',
    'readOnly',
    'required',
    'size',
  ] as const),
  hideLabel: true,
  invalid: invalid.value,
}))

const rootAttrs = computed(() => splitArkAttrs(attrs))

const rootBindings = computed(() => {
  const base: Record<string, unknown> = {
    ...rootProps.value,
    ...rootAttrs.value,
    class: cn('inline-flex items-center gap-2', props.ui?.root),
  }
  if (!isProvider.value) {
    base.checked = modelValue.value
    base['onUpdate:checked'] = (next: boolean) => {
      modelValue.value = next
    }
  }
  return base
})

extendCompodiumMeta({
  defaultProps: {
    disabled: false,
    intent: 'primary',
    size: 'md',
  },
})
</script>

<template>
  <UIFormField v-bind="fieldProps as FieldProps">
    <component :is="rootComponent" v-bind="rootBindings">
      <ArkSwitch.Control
        :class="
          cn(
            switchControlCVA({
              intent,
              size,
            }),
            ui?.control,
          )
        "
      >
        <ArkSwitch.Thumb
          :class="
            cn(
              switchThumbCVA({
                intent,
                size,
              }),
              ui?.thumb,
            )
          "
        />
      </ArkSwitch.Control>
      <ArkSwitch.Label :class="cn(switchLabelCVA({ intent, size }), ui?.label)">
        <template v-if="label">{{ label }}</template>

        <span v-if="required" class="txt-caption text-error-icon" aria-hidden="true"> * </span>
      </ArkSwitch.Label>
      <ArkSwitch.HiddenInput />
    </component>
  </UIFormField>
</template>
