<script setup lang="ts" generic="TValues extends Record<string, unknown>">
import { useSchemaForm, type SchemaFormValidationMode } from '~ui/app/composables/useSchemaForm'
import { formatFieldErrors } from '~ui/app/utils/form-field-errors'

import {
  layoutRowKeys,
  type SchemaFieldConfig,
  type SchemaFieldsMap,
  type SchemaFormLayout,
} from '~/utils/Components/Form/schema'

import type { z } from 'zod'

const props = withDefaults(
  defineProps<{
    schema: z.ZodType<TValues>
    defaultValues: TValues
    fields: SchemaFieldsMap<TValues>
    layout: SchemaFormLayout<keyof TValues & string>[]
    validateSchemaOn?: SchemaFormValidationMode[]
    /** When true, show a screen-reader alert with top-level form errors after a submit attempt. */
    showErrorSummary?: boolean
  }>(),
  {
    showErrorSummary: false,
    validateSchemaOn: undefined,
  },
)

const emit = defineEmits<{
  submit: [value: TValues]
}>()

const { form } = useSchemaForm<TValues>({
  defaultValues: props.defaultValues,
  onSubmit: ({ value }) => {
    const transformed = { ...value } as Record<string, unknown>
    for (const row of props.layout) {
      for (const k of layoutRowKeys(row)) {
        const key = k as keyof TValues & string
        const cfg = props.fields[key]
        if (!cfg) continue
        const raw = transformed[key]
        if (typeof raw === 'string') {
          let v = raw
          if (cfg.prefix) v = `${cfg.prefix}${v}`
          if (cfg.suffix) v = `${v}${cfg.suffix}`
          transformed[key] = v
        }
      }
    }
    emit('submit', transformed as TValues)
  },
  schema: props.schema,
  validateSchemaOn: props.validateSchemaOn,
})

const formSubmitting = form.useStore((s) => s.isSubmitting)
const formCanSubmit = form.useStore((s) => s.canSubmit)
const formSubmissionAttempts = form.useStore((s) => s.submissionAttempts)
const formFieldMeta = form.useStore((s) => s.fieldMeta)

const errorSummaryText = computed(() => {
  const messages: string[] = []
  for (const meta of Object.values(formFieldMeta.value) as Array<{ errors?: readonly unknown[] }>) {
    if (!meta?.errors?.length) continue
    const text = formatFieldErrors(meta.errors)
    if (text) messages.push(text)
  }
  return messages.join(', ')
})

function hasMultipleFields(row: SchemaFormLayout<keyof TValues & string>): boolean {
  return layoutRowKeys(row).length > 1
}

/** One config lookup per layout field per reactive update (avoid repeated `fields[key]` in template). */
const fieldConfigByKey = computed(
  (): Record<string, SchemaFieldConfig<TValues, keyof TValues & string>> => {
    const out: Record<string, SchemaFieldConfig<TValues, keyof TValues & string>> = {}
    for (const row of props.layout) {
      for (const k of layoutRowKeys(row)) {
        if (out[k]) continue
        const key = k as keyof TValues & string
        const cfg = props.fields[key]
        if (cfg === undefined || cfg === null) {
          throw new Error(`[UIForm] Missing fields["${k}"]`)
        }
        out[k] = cfg
      }
    }
    return out
  },
)

if (import.meta.dev) {
  watchEffect(() => {
    const valueKeys = new Set(Object.keys(props.defaultValues) as (keyof TValues & string)[])
    for (const row of props.layout) {
      for (const k of layoutRowKeys(row)) {
        if (!valueKeys.has(k as keyof TValues & string)) {
          // console.warn(`[UIForm] Layout key "${k}" is not present on defaultValues`)
        }
      }
    }
  })
}

defineExpose({ form })
</script>

<template>
  <form
    class="flex flex-col gap-4"
    novalidate
    :aria-busy="formSubmitting ? true : undefined"
    data-ui-form
    @submit.prevent="void form.handleSubmit()"
  >
    <div
      v-if="showErrorSummary && formSubmissionAttempts > 0 && errorSummaryText.length > 0"
      role="alert"
      class="txt-caption text-error-text"
    >
      {{ errorSummaryText }}
    </div>

    <template v-for="(row, rowIndex) in layout" :key="rowIndex">
      <div
        class="gap-4"
        :class="hasMultipleFields(row) ? 'flex flex-row flex-wrap items-start' : 'flex flex-col'"
      >
        <template v-for="fieldKey in layoutRowKeys(row)" :key="String(fieldKey)">
          <div class="min-w-0 flex-1">
            <form.Field
              :name="fieldKey"
              :validators="fieldConfigByKey[String(fieldKey)]!.validators"
            >
              <template #default="{ field }">
                <UIFormBoundControl
                  :field-name="fieldKey as keyof TValues & string"
                  :config="fieldConfigByKey[String(fieldKey)]!"
                  :field-api="field"
                  :state="field.state"
                />
              </template>
            </form.Field>
          </div>
        </template>
      </div>
    </template>
    <slot name="actions" :can-submit="formCanSubmit" :is-submitting="formSubmitting" />
  </form>
</template>
