<script setup lang="ts">
import { controlShellCVA } from '~/utils/Components/Form/variants'
import {
  useComponentIcons,
  type UseComponentIconsProps,
} from '~ui/app/composables/useComponentIcons'

import type { FormFieldIntent, FormFieldSize, UIInputSlots } from '~/utils/Components/Form/context'
import type { FieldProps } from '~ui/app/components/Form/Field.vue'

defineOptions({ inheritAttrs: false })

/**
 * Reusable control shell for form inputs (Input, Textarea, NumberInput).
 * Renders UIFormField + visual shell (border, focus ring, icons) and
 * accepts the actual input element via the default slot.
 *
 * Slots:
 * - default: the input element
 * - leading: prefix addon outside the shell (e.g. a button or select)
 * - inner-leading: prefix content inside the shell (e.g. `$`, `@` indicator)
 * - inner-trailing: suffix content inside the shell (e.g. password toggle)
 * - trailing: suffix addon outside the shell (e.g. a button or `.com` text)
 */
export interface FormControlShellProps extends Omit<FieldProps, 'ui'>, UseComponentIconsProps {
  intent?: FormFieldIntent
  size?: FormFieldSize
  ui?: Partial<UIInputSlots>
}

const props = withDefaults(defineProps<FormControlShellProps>(), {
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
  size: 'md',
  state: 'default',
  successIcon: undefined,
  trailing: false,
  trailingIcon: undefined,
  ui: undefined,
  warningIcon: undefined,
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
    'ui',
  ] as const),
  invalid: props.invalid || String(props.error ?? '').length > 0,
}))

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

const invalid = computed(() => props.invalid || String(props.error ?? '').length > 0)
const disabled = computed(() => props.disabled ?? false)
</script>

<template>
  <UIFormField v-bind="fieldProps">
    <div class="flex w-full items-stretch gap-0">
      <slot name="leading" />

      <div
        :class="
          cn(
            controlShellCVA({
              intent,
              size,
              invalid,
              disabled,
            }),
            'min-w-0 flex-1',
            ui?.shell,
          )
        "
      >
        <span
          v-if="$slots['inner-leading']"
          :class="cn('flex shrink-0 items-center pl-2 text-neutral-text-subtle', ui?.innerLeading)"
        >
          <slot name="inner-leading" />
        </span>

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

        <slot />

        <slot name="inner-trailing" />

        <span
          v-if="isTrailing && trailingIconName"
          :class="cn('flex shrink-0 items-center pr-2 text-primary-icon-subtle', ui?.trailingIcon)"
          aria-hidden="true"
        >
          <Icon
            :name="trailingIconName"
            class="size-4 shrink-0"
            :class="{ 'animate-spin': shouldAnimate }"
          />
        </span>
      </div>

      <slot name="trailing" />
    </div>
  </UIFormField>
</template>
