<script setup lang="ts">
import { RadioGroup as ArkRadioGroup } from '@ark-ui/vue/radio-group'
import { cva } from 'class-variance-authority'

import type { ClassValue } from 'vue'
import type {
  FormFieldIntent,
  FormFieldOrientation,
  FormFieldSize,
} from '~/utils/Components/Form/context'
import type { FieldProps } from '~ui/app/components/Form/Field.vue'

export interface UIRadioGroupSlots {
  root?: ClassValue
  group?: ClassValue
  item?: ClassValue
  control?: ClassValue
  indicator?: ClassValue
  label?: ClassValue
  hiddenInput?: ClassValue
}

defineOptions({ inheritAttrs: false })

const radioGroupCVA = cva('', {
  variants: {
    orientation: {
      horizontal: 'flex flex-row flex-wrap gap-4',
      vertical: 'flex flex-col gap-2',
    } satisfies Record<FormFieldOrientation, string>,
  },
})

const radioItemCVA = cva(
  'inline-flex items-center not-data-[disabled]:cursor-pointer data-[disabled]:cursor-not-allowed',
  {
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
      size: {
        lg: '',
        md: 'gap-2',
        sm: '',
      } satisfies Record<FormFieldSize, string>,
    },
  },
)

const radioControlCVA = cva('relative', {
  variants: {
    intent: {
      accent: '',
      error: '',
      info: '',
      neutral: '',
      primary:
        'border-primary-border data-hover:border-primary-border-hover data-[disabled]:border-primary-border-subtle data-[invalid]:border-error-border',
      secondary: '',
      success: '',
      warning: '',
    } satisfies Record<FormFieldIntent, string>,
    size: {
      lg: '',
      md: 'size-4 rounded-full border',
      sm: '',
    } satisfies Record<FormFieldSize, string>,
  },
})

const radioIndicatorCVA = cva('block shrink-0', {
  variants: {
    intent: {
      accent: '',
      error: '',
      info: '',
      neutral: '',
      primary: 'bg-primary-fill',
      secondary: '',
      success: '',
      warning: '',
    } satisfies Record<FormFieldIntent, string>,
    size: {
      lg: '',
      md: 'size-4 rounded-full',
      sm: '',
    } satisfies Record<FormFieldSize, string>,
  },
})

const radioItemLabelCVA = cva('', {
  variants: {
    intent: {
      accent: '',
      error: '',
      info: '',
      neutral: '',
      primary: 'data-[disabled]:text-primary text-primary-text',
      secondary: '',
      success: '',
      warning: '',
    } satisfies Record<FormFieldIntent, string>,
    size: {
      lg: '',
      md: 'txt-label',
      sm: '',
    } satisfies Record<FormFieldSize, string>,
  },
})

export interface RadioGroupItem {
  disabled?: boolean
  label: string
  value: string
}

export interface RadioGroupProps extends FieldProps {
  items: RadioGroupItem[]
  /** Passed to `RadioGroup.Root` for form submission. */
  name?: string
  /** Layout direction. Defaults to `vertical`. */
  orientation?: FormFieldOrientation
  ui?: Partial<UIRadioGroupSlots>
}

const props = withDefaults(defineProps<RadioGroupProps>(), {
  intent: 'primary',
  name: undefined,
  orientation: 'vertical',
  size: 'md',
  ui: undefined,
})

const attrs = useAttrs()

const modelValue = defineModel<string | null>({
  default: null,
})

const invalid = computed(() =>
  Boolean(props.invalid || (props.error && String(props.error).length > 0)),
)

const fieldProps = computed(() => ({
  asFieldset: true,
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
    'ui',
  ] as const),
  hideLabel: false,
  invalid: invalid.value,
}))

const groupProps = computed(() => ({
  ...pick(props, ['disabled', 'readOnly', 'name', 'orientation'] as const),
  invalid: invalid.value,
}))

const passthroughAttrs = computed(() => {
  const { ui: _ui, ...rest } = attrs as Record<string, unknown> & {
    ui?: Partial<UIRadioGroupSlots>
  }
  return rest
})

extendCompodiumMeta({
  defaultProps: {
    helperText: 'Choose your preferred framework',
    items: [
      { label: 'React', value: 'react' },
      { disabled: true, label: 'Solid', value: 'solid' },
      { label: 'Vue', value: 'vue' },
    ],
    label: 'Framework (radio group)',
    modelValue: 'react',
    orientation: 'vertical',
    required: true,
  },
})
</script>

<template>
  <UIFormField v-bind="{ ...fieldProps, ...passthroughAttrs }" :class="cn(ui?.root)">
    <ArkRadioGroup.Root
      v-model="modelValue"
      v-bind="groupProps"
      :class="cn('relative', radioGroupCVA({ orientation }), ui?.group)"
    >
      <ArkRadioGroup.Indicator :class="cn('absolute w-fit transition-none!', ui?.indicator)">
        <span :class="cn(radioIndicatorCVA({ intent, size }), ui?.indicator)" />
      </ArkRadioGroup.Indicator>
      <ArkRadioGroup.Item
        v-for="item in items"
        :key="item.value"
        :value="item.value"
        :disabled="item.disabled || disabled"
        :class="cn(radioItemCVA({ intent, size }), ui?.item)"
      >
        <ArkRadioGroup.ItemControl :class="cn(radioControlCVA({ intent, size }), ui?.control)" />
        <ArkRadioGroup.ItemText :class="cn(radioItemLabelCVA({ intent, size }), ui?.label)">
          {{ item.label }}
        </ArkRadioGroup.ItemText>
        <ArkRadioGroup.ItemHiddenInput :class="cn(ui?.hiddenInput)" />
      </ArkRadioGroup.Item>
    </ArkRadioGroup.Root>
  </UIFormField>
</template>
