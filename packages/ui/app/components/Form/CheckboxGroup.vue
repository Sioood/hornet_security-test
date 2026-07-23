<script setup lang="ts">
import { Checkbox as ArkCheckbox } from '@ark-ui/vue/checkbox'
import { cva } from 'class-variance-authority'

import type { FormFieldOrientation, UIFieldSlots } from '~/utils/Components/Form/context'
import type { FieldProps } from '~ui/app/components/Form/Field.vue'

export type { UICheckboxGroupSlots } from '~/utils/Components/Form/context'

defineOptions({ inheritAttrs: false })

const checkboxGroupCVA = cva('', {
  variants: {
    orientation: {
      horizontal: 'flex flex-row flex-wrap gap-2',
      vertical: 'flex flex-col gap-2',
    } satisfies Record<FormFieldOrientation, string>,
  },
})

export interface CheckboxGroupItem {
  disabled?: boolean
  label: string
  value: string
}

export interface CheckboxGroupProps extends FieldProps {
  items: CheckboxGroupItem[]
  /** Passed to `Checkbox.Group` for form submission. */
  name?: string
  /** Passed to `Checkbox.Group`. */
  maxSelectedValues?: number
  orientation?: FormFieldOrientation
}

const props = withDefaults(defineProps<CheckboxGroupProps>(), {
  error: undefined,
  helperText: undefined,
  intent: 'primary',
  label: undefined,
  maxSelectedValues: undefined,
  name: undefined,
  orientation: 'vertical',
  readOnly: undefined,
  required: undefined,
  size: 'md',
  ui: undefined,
})

const attrs = useAttrs()

const modelValue = defineModel<string[]>({
  default: () => [],
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
  ...pick(props, ['disabled', 'readOnly', 'name', 'maxSelectedValues'] as const),
  invalid: invalid.value,
}))

const passthroughAttrs = computed(() => {
  const { ui: _ui, ...rest } = attrs as Record<string, unknown> & { ui?: Partial<UIFieldSlots> }
  return rest
})
</script>

<template>
  <UIFormField v-bind="{ ...fieldProps, ...passthroughAttrs }" :class="cn(ui?.root)">
    <ArkCheckbox.Group
      v-model="modelValue"
      v-bind="groupProps"
      :class="cn(checkboxGroupCVA({ orientation }))"
    >
      <UIFormCheckbox
        v-for="item in items"
        :key="item.value"
        in-group
        :disabled="item.disabled || disabled"
        :intent
        :invalid="invalid"
        :label="item.label"
        :size
        :value="item.value"
      />
    </ArkCheckbox.Group>
  </UIFormField>
</template>
