<script setup lang="ts">
import {
  Field as ArkField,
  type FieldRootBaseProps as ArkFieldRootBaseProps,
} from '@ark-ui/vue/field'
import { Fieldset as ArkFieldset } from '@ark-ui/vue/fieldset'
import { cva, type VariantProps } from 'class-variance-authority'

import type { Component } from 'vue'
import type { FormFieldIntent, FormFieldSize, UIFieldSlots } from '~/utils/Components/Form/context'

export type { UIFieldSlots } from '~/utils/Components/Form/context'

defineOptions({ inheritAttrs: false })

const fieldRootCVA = cva('flex flex-col gap-1', {
  variants: {
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
      true: '',
    },
    size: {
      lg: '',
      md: '',
      sm: '',
    } satisfies Record<FormFieldSize, string>,
  },
})

type FieldCVAProps = VariantProps<typeof fieldRootCVA>

const fieldLabelCVA = cva('', {
  variants: {
    intent: {
      accent: 'text-accent-text',
      error: 'text-error-text',
      info: 'text-info-text',
      neutral: 'text-neutral-text',
      primary: 'text-primary-text',
      secondary: 'text-secondary-text',
      success: 'text-success-text',
      warning: 'text-warning-text',
    } satisfies Record<FormFieldIntent, string>,
    size: {
      lg: 'txt-h6',
      md: 'txt-label',
      sm: 'txt-caption',
    } satisfies Record<FormFieldSize, string>,
  },
})

const fieldHelperTextCVA = cva('', {
  variants: {
    intent: {
      accent: 'text-accent-text-subtle',
      error: 'text-error-text-subtle',
      info: 'text-info-text-subtle',
      neutral: 'text-neutral-text-subtle',
      primary: 'text-primary-text-subtle',
      secondary: 'text-secondary-text-subtle',
      success: 'text-success-text-subtle',
      warning: 'text-warning-text-subtle',
    } satisfies Record<FormFieldIntent, string>,
    size: {
      lg: 'txt-body',
      md: 'txt-caption',
      sm: 'txt-legal',
    } satisfies Record<FormFieldSize, string>,
  },
})

export interface FieldProps extends ArkFieldRootBaseProps {
  /**
   * When true, the root is `Fieldset` (legend + helper under legend) for control groups
   * (e.g. `Checkbox.Group`). Error text stays last.
   */
  asFieldset?: boolean
  /** Shown when `invalid` is true (e.g. validation message). */
  error?: string
  helperText?: string
  /** When true, the field label row is omitted (e.g. checkbox with label beside the control). */
  hideLabel?: boolean
  intent?: FieldCVAProps['intent']
  label?: string
  /**
   * When false, the label is rendered as plain text (no `label for=`).
   * Use for groups of controls where a single target id would be wrong.
   * Ignored when `asFieldset` is true (legend is always used).
   */
  labelAssociatesControl?: boolean
  /** Prefer setting on the field so Ark can wire label and control ids. */
  size?: FieldCVAProps['size']
  ui?: Partial<UIFieldSlots>
}

const props = withDefaults(defineProps<FieldProps>(), {
  asFieldset: false,
  error: undefined,
  helperText: undefined,
  intent: 'primary',
  label: undefined,
  labelAssociatesControl: true,
  size: 'md',
  ui: undefined,
})

const slots = useSlots()

const attrs = useAttrs()

const fieldRootAttrs = computed(() => {
  const { ui: _ui, ...rest } = attrs as Record<string, unknown> & { ui?: Partial<UIFieldSlots> }
  return rest
})

const shouldShowError = computed(
  () => props.invalid && (Boolean(slots.error) || String(props.error ?? '').length > 0),
)

const invalid = computed(
  () => props.invalid || Boolean(slots.error) || String(props.error ?? '').length > 0,
)

const arkFieldRootProps = computed(() => ({
  ...pick(props, ['asChild', 'disabled', 'id', 'ids', 'readOnly', 'required'] as const),
  invalid: invalid.value,
}))

const fieldsetRootProps = computed(() => ({
  ...pick(props, ['asChild', 'disabled', 'id'] as const),
  invalid: invalid.value,
}))

const labelComponent = computed((): Component | string => {
  if (props.asFieldset) return ArkFieldset.Legend
  if (props.labelAssociatesControl) return ArkField.Label
  return 'div'
})

const errorTextComponent = computed(() =>
  props.asFieldset ? ArkFieldset.ErrorText : ArkField.ErrorText,
)

const fieldRootTag = computed(() => (props.asFieldset ? ArkFieldset.Root : ArkField.Root))

const mergedRootBind = computed(() => ({
  ...(props.asFieldset ? fieldsetRootProps.value : arkFieldRootProps.value),
  ...fieldRootAttrs.value,
}))

extendCompodiumMeta({
  defaultProps: {
    error: undefined,
    helperText: 'Enter your email address',
    intent: 'primary',
    invalid: false,
    label: 'Email',
    required: true,
    size: 'md',
  },
})
</script>

<template>
  <component
    :is="fieldRootTag"
    v-bind="mergedRootBind"
    :class="cn(fieldRootCVA({ size, invalid }), ui?.root)"
  >
    <component
      :is="labelComponent"
      v-if="!hideLabel && (label || required)"
      :class="cn(fieldLabelCVA({ intent, size }), ui?.label)"
    >
      <template v-if="label">{{ label }}</template>
      <ArkField.RequiredIndicator
        v-if="required && !asFieldset"
        :class="cn('txt-caption text-error-icon', ui?.requiredIndicator)"
      >
        *
      </ArkField.RequiredIndicator>
      <span
        v-else-if="required"
        :class="cn('txt-caption text-error-icon', ui?.requiredIndicator)"
        aria-hidden="true"
      >
        *
      </span>
    </component>

    <template v-if="asFieldset && helperText">
      <ArkFieldset.HelperText :class="cn(fieldHelperTextCVA({ intent, size }), ui?.helperText)">
        {{ helperText }}
      </ArkFieldset.HelperText>
    </template>

    <slot />

    <template v-if="!asFieldset && helperText">
      <ArkField.HelperText :class="cn(fieldHelperTextCVA({ intent, size }), ui?.helperText)">
        {{ helperText }}
      </ArkField.HelperText>
    </template>

    <component
      :is="errorTextComponent"
      v-if="shouldShowError"
      aria-live="polite"
      :class="cn('txt-caption text-error-text', ui?.error)"
    >
      <slot name="error">{{ error }}</slot>
    </component>
  </component>
</template>
