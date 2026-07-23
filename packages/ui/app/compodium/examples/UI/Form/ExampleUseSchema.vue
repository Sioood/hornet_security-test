<script setup lang="ts">
// oxlint-disable no-console
import { z } from 'zod'

import { useSchemaForm } from '~ui/app/composables/useSchemaForm'
import { formatFieldErrors } from '~ui/app/utils/form-field-errors'

import type { InferSchemaValues } from '~/utils/Components/Form/schema'

const schema = z.object({
  firstName: z.string().trim().min(2),
  lastName: z.string().trim().min(1),
})

type FormValues = InferSchemaValues<typeof schema>

const defaultValues: FormValues = {
  firstName: '',
  lastName: '',
}

const submitted = ref('')

const { form } = useSchemaForm({
  defaultValues,
  onSubmit: ({ value }) => {
    submitted.value = JSON.stringify(value)
  },
  schema,
  /** Example: also validate on blur; default in composable is change-only. */
  validateSchemaOn: ['change', 'blur'],
})

const canSubmit = form.useStore((s) => s.canSubmit)
const isSubmitting = form.useStore((s) => s.isSubmitting)
</script>

<template>
  <div class="flex max-w-md flex-col gap-4">
    <form
      class="flex flex-col gap-4"
      novalidate
      :aria-busy="isSubmitting ? true : undefined"
      @submit.prevent="void form.handleSubmit()"
    >
      <div class="flex flex-row flex-wrap items-start gap-4">
        <div class="min-w-0 flex-1">
          <form.Field name="firstName">
            <template #default="{ field, state }">
              <UIFormInput
                label="First name"
                placeholder="Jane"
                required
                :name="field.name"
                :model-value="state.value"
                :invalid="state.meta.errors.length > 0"
                :error="formatFieldErrors(state.meta.errors)"
                @update:model-value="field.handleChange($event)"
                @blur="field.handleBlur()"
              />
            </template>
          </form.Field>
        </div>

        <div class="min-w-0 flex-1">
          <form.Field name="lastName">
            <template #default="{ field, state }">
              <UIFormInput
                label="Last name"
                placeholder="Doe"
                required
                :name="field.name"
                :model-value="state.value"
                :invalid="state.meta.errors.length > 0"
                :error="formatFieldErrors(state.meta.errors)"
                @update:model-value="field.handleChange($event)"
                @blur="field.handleBlur()"
              />
            </template>
          </form.Field>
        </div>
      </div>

      <UIButton
        type="submit"
        text="Submit"
        variant="subtle"
        intent="primary"
        :disabled="!canSubmit || isSubmitting"
      />
    </form>

    <p v-if="submitted" class="txt-caption text-primary-text-subtle">Submitted: {{ submitted }}</p>
  </div>
</template>
