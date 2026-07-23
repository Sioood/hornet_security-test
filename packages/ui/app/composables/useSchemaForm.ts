import { useForm } from '@tanstack/vue-form'

import type { FormValidateOrFn } from '@tanstack/form-core'
import type { z } from 'zod'

export type SchemaFormValidationMode = 'change' | 'blur' | 'submit'

export interface UseSchemaFormOptions<TValues extends Record<string, unknown>> {
  schema: z.ZodType<TValues>
  defaultValues: TValues
  onSubmit?: (payload: { value: TValues }) => void | Promise<void>
  /**
   * When to run the form-level Zod schema (Standard Schema).
   * Default: `['change']` only. Use `['blur']` or `['submit']` for quieter validation;
   * combine modes e.g. `['change', 'blur']` to validate on both.
   */
  validateSchemaOn?: SchemaFormValidationMode[]
}

function buildFormValidators<TValues extends Record<string, unknown>>(
  schema: z.ZodType<TValues>,
  modes: SchemaFormValidationMode[],
): {
  onChange?: FormValidateOrFn<TValues>
  onBlur?: FormValidateOrFn<TValues>
  onSubmit?: FormValidateOrFn<TValues>
} {
  const s = schema as FormValidateOrFn<TValues>
  const out: {
    onChange?: FormValidateOrFn<TValues>
    onBlur?: FormValidateOrFn<TValues>
    onSubmit?: FormValidateOrFn<TValues>
  } = {}
  if (modes.includes('change')) out.onChange = s
  if (modes.includes('blur')) out.onBlur = s
  if (modes.includes('submit')) out.onSubmit = s
  return out
}

/**
 * `useForm` preset: form-level Zod schema (Standard Schema) on selected lifecycle events,
 * plus typed `defaultValues` / `onSubmit`.
 */
export function useSchemaForm<TValues extends Record<string, unknown>>(
  options: UseSchemaFormOptions<TValues>,
) {
  const modes = options.validateSchemaOn ?? ['change']
  const formValidators = buildFormValidators(options.schema, modes)

  const form = useForm({
    defaultValues: options.defaultValues,
    onSubmit: async ({ value }) => {
      await options.onSubmit?.({ value: value as TValues })
    },
    validators: formValidators,
  })

  return { form }
}
