<script setup lang="ts">
import {
  SignaturePad as ArkSignaturePad,
  type SignaturePadRootBaseProps as ArkSignaturePadRootBaseProps,
  type SignaturePadRootProviderBaseProps as ArkSignaturePadRootProviderBaseProps,
  type UseSignaturePadReturn,
} from '@ark-ui/vue/signature-pad'
import { cva } from 'class-variance-authority'

import type {
  FormFieldIntent,
  FormFieldSize,
  FormFieldVariant,
  UISignaturePadSlots,
} from '~/utils/Components/Form/context'

defineOptions({ inheritAttrs: false })

const signaturePadSegmentCVA = cva(
  'w-full touch-none focus-visible:focus-ring [&_path]:fill-current',
  {
    variants: {
      intent: {
        accent: 'text-accent-text',
        error: '',
        info: '',
        neutral: 'text-neutral-text',
        primary: 'text-primary-text',
        secondary: 'text-secondary-text',
        success: '',
        warning: '',
      } satisfies Record<FormFieldIntent, string>,
      size: {
        lg: 'min-h-48',
        md: 'min-h-40',
        sm: 'min-h-32',
      } satisfies Record<FormFieldSize, string>,
    },
  },
)

const signaturePadShellCVA = cva('flex w-full min-w-0 items-stretch gap-0.5 border p-0', {
  compoundVariants: [
    {
      class:
        'border-neutral-border bg-neutral-fill-subtle text-neutral-text focus-within:border-neutral-border-strong focus-within:focus-ring disabled:pointer-events-none disabled:opacity-40',
      disabled: false,
      intent: 'neutral',
      variant: 'default',
    },
    {
      class: 'border-neutral text-neutral bg-neutral-fill-subtle',
      disabled: true,
      intent: 'neutral',
      variant: 'default',
    },
    {
      class:
        'border-primary-border bg-primary-fill-subtle text-primary-text focus-within:border-primary-border-strong focus-within:focus-ring disabled:pointer-events-none disabled:opacity-40',
      disabled: false,
      intent: 'primary',
      variant: 'default',
    },
    {
      class: 'border-primary text-primary bg-primary-fill-subtle',
      disabled: true,
      intent: 'primary',
      variant: 'default',
    },
    {
      class:
        'border-secondary-border bg-secondary-fill-subtle text-secondary-text focus-within:border-secondary-border-strong focus-within:focus-ring disabled:pointer-events-none disabled:opacity-40',
      disabled: false,
      intent: 'secondary',
      variant: 'default',
    },
    {
      class: 'border-secondary text-secondary bg-secondary-fill-subtle',
      disabled: true,
      intent: 'secondary',
      variant: 'default',
    },
    {
      class:
        'border-accent-border bg-accent-fill-subtle text-accent-text focus-within:border-accent-border-strong focus-within:focus-ring disabled:pointer-events-none disabled:opacity-40',
      disabled: false,
      intent: 'accent',
      variant: 'default',
    },
    {
      class: 'border-accent text-accent bg-accent-fill-subtle',
      disabled: true,
      intent: 'accent',
      variant: 'default',
    },
    {
      class:
        'border-neutral-border bg-transparent text-neutral-text focus-within:border-neutral-border-strong focus-within:focus-ring',
      disabled: false,
      intent: 'neutral',
      variant: 'subtle',
    },
    {
      class: 'border-neutral text-neutral bg-transparent',
      disabled: true,
      intent: 'neutral',
      variant: 'subtle',
    },
    {
      class:
        'border-primary-border bg-transparent text-primary-text focus-within:border-primary-border-strong focus-within:focus-ring',
      disabled: false,
      intent: 'primary',
      variant: 'subtle',
    },
    {
      class: 'border-primary text-primary bg-transparent',
      disabled: true,
      intent: 'primary',
      variant: 'subtle',
    },
    {
      class:
        'border-secondary-border bg-transparent text-secondary-text focus-within:border-secondary-border-strong focus-within:focus-ring',
      disabled: false,
      intent: 'secondary',
      variant: 'subtle',
    },
    {
      class: 'border-secondary text-secondary bg-transparent',
      disabled: true,
      intent: 'secondary',
      variant: 'subtle',
    },
    {
      class:
        'border-accent-border bg-transparent text-accent-text focus-within:border-accent-border-strong focus-within:focus-ring',
      disabled: false,
      intent: 'accent',
      variant: 'subtle',
    },
    {
      class: 'border-accent text-accent bg-transparent',
      disabled: true,
      intent: 'accent',
      variant: 'subtle',
    },
  ],
  defaultVariants: {
    variant: 'default',
  },
  variants: {
    disabled: {
      true: 'cursor-not-allowed',
    },
    intent: {
      accent: '',
      error: '',
      info: '',
      neutral: '',
      primary: '',
      secondary: '',
      success: '',
      warning: '',
    } satisfies Record<FormFieldIntent, string>,
    invalid: {
      true: 'border-error-border!',
    },
    size: {
      lg: 'min-h-48',
      md: 'min-h-40',
      sm: 'min-h-32',
    } satisfies Record<FormFieldSize, string>,
    variant: {
      default: '',
      subtle: '',
    } satisfies Record<FormFieldVariant, string>,
  },
})

const signaturePadGuideCVA = cva(
  'pointer-events-none absolute right-6 bottom-6 left-6 border-b border-dashed',
  {
    variants: {
      intent: {
        accent: 'border-accent-border',
        error: '',
        info: '',
        neutral: 'border-neutral-border',
        primary: 'border-primary-border',
        secondary: 'border-secondary-border',
        success: '',
        warning: '',
      } satisfies Record<FormFieldIntent, string>,
    },
  },
)

export interface SignaturePadProps
  extends
    Omit<ArkSignaturePadRootBaseProps, 'defaultPaths'>,
    Omit<ArkSignaturePadRootProviderBaseProps, 'value'> {
  /**
   * Pass the return value of `useSignaturePad()` to enable **RootProvider** mode.
   * Omit (or leave `undefined`) to use the default **Root** mode with `v-model`.
   */
  value?: UseSignaturePadReturn['value']
  /** Visual shell style. @default 'default' */
  variant?: FormFieldVariant
  intent?: FormFieldIntent
  size?: FormFieldSize
  label?: string
  helperText?: string
  error?: string
  invalid?: boolean
  /** When false, hides the built-in clear button. @default true */
  clearable?: boolean
  ui?: Partial<UISignaturePadSlots>
}

const modelValue = defineModel<string[]>()

const props = withDefaults(defineProps<SignaturePadProps>(), {
  clearable: true,
  disabled: undefined,
  drawing: undefined,
  error: undefined,
  helperText: undefined,
  id: undefined,
  ids: undefined,
  intent: 'primary',
  invalid: undefined,
  label: undefined,
  name: undefined,
  readOnly: undefined,
  required: undefined,
  size: 'md',
  translations: undefined,
  ui: undefined,
  value: undefined,
  variant: 'default',
})

const attrs = useAttrs()

const isProvider = computed(() => props.value !== undefined)

const rootComponent = computed(() =>
  isProvider.value ? ArkSignaturePad.RootProvider : ArkSignaturePad.Root,
)

const rootProps = computed(() => {
  if (isProvider.value) {
    return pick(props, ['asChild', 'value'])
  }
  return pick(props, [
    'asChild',
    'disabled',
    'drawing',
    'id',
    'ids',
    'name',
    'readOnly',
    'required',
    'translations',
  ])
})

const arkAttrs = computed(() =>
  splitArkAttrs(attrs, [
    'ui',
    'label',
    'error',
    'helperText',
    'clearable',
    'intent',
    'invalid',
    'size',
    'variant',
  ]),
)

const invalid = computed(() => props.invalid || String(props.error ?? '').length > 0)

const rootBindings = computed(() => {
  const base: Record<string, unknown> = {
    ...rootProps.value,
    ...arkAttrs.value,
    class: cn('flex w-full flex-col gap-0', props.ui?.root),
  }

  if (!isProvider.value) {
    if (modelValue.value !== undefined && modelValue.value.length > 0) {
      base.defaultPaths = [...modelValue.value]
    }
    base['onUpdate:paths'] = (paths: string[]) => {
      modelValue.value = paths
    }
  }

  return base
})

const fieldProps = computed(() => ({
  ...pick(props, [
    'asChild',
    'disabled',
    'error',
    'helperText',
    'id',
    'ids',
    'label',
    'readOnly',
    'required',
  ]),
  intent: props.intent,
  invalid: invalid.value,
  size: props.size,
  ui: {
    error: props.ui?.error,
    helperText: props.ui?.helperText,
    label: props.ui?.label,
    requiredIndicator: props.ui?.requiredIndicator,
    root: props.ui?.root,
  },
}))

extendCompodiumMeta({
  defaultProps: {
    clearable: true,
    helperText: 'Sign in the box above',
    intent: 'primary',
    label: 'Signature',
    modelValue: [],
    size: 'md',
    variant: 'default',
  },
})
</script>

<template>
  <UIFormField v-bind="fieldProps">
    <component :is="rootComponent" v-bind="rootBindings">
      <ArkSignaturePad.Context v-slot="api">
        <div
          :class="
            cn(
              signaturePadShellCVA({
                variant,
                intent,
                size,
                invalid,
                disabled: disabled ?? false,
              }),
              'relative',
              ui?.shell,
            )
          "
        >
          <ArkSignaturePad.Control :class="cn('flex w-full flex-1', ui?.control)">
            <ArkSignaturePad.Segment
              :class="cn(signaturePadSegmentCVA({ intent, size }), ui?.segment)"
            />

            <ArkSignaturePad.Guide :class="cn(signaturePadGuideCVA({ intent }), ui?.guide)" />

            <ArkSignaturePad.ClearTrigger v-if="clearable" as-child>
              <UIButton
                variant="ghost"
                :intent
                size="sm"
                icon-only
                icon="tabler:x"
                :disabled="disabled || readOnly"
                :ui="{ root: cn('absolute top-2 right-2 z-10', ui?.clearTrigger) }"
                aria-label="Clear signature"
              />
            </ArkSignaturePad.ClearTrigger>
          </ArkSignaturePad.Control>
        </div>

        <ArkSignaturePad.HiddenInput :value="JSON.stringify(api.paths)" :class="ui?.hiddenInput" />

        <slot :api="api" />
      </ArkSignaturePad.Context>
    </component>
  </UIFormField>
</template>
