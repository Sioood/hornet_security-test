<script setup lang="ts">
import { formatFieldErrors } from '~ui/app/utils/form-field-errors'

import { bookFormSchema, bookGenreSchema } from '../schemas/book'

import type { BookFormValues } from '../schemas/book'

const props = defineProps<{
  cancelTo: string
  initialValues: BookFormValues
  submitLabel: string
}>()

const emit = defineEmits<{
  submit: [values: BookFormValues]
}>()

const { t } = useI18n()

const genreOptions = computed(() =>
  bookGenreSchema.options.map((genre) => ({
    label: t(`books.genres.${genre}`),
    value: genre,
  })),
)

const { form } = useSchemaForm({
  defaultValues: props.initialValues,
  onSubmit: ({ value }) => {
    emit('submit', value)
  },
  schema: bookFormSchema,
  validateSchemaOn: ['change', 'blur'],
})

watch(
  () => props.initialValues,
  (next) => {
    form.reset(next)
  },
  { deep: true },
)

const canSubmit = form.useStore((state) => state.canSubmit)
const isSubmitting = form.useStore((state) => state.isSubmitting)
</script>

<template>
  <form
    class="flex w-full flex-col gap-6"
    novalidate
    :aria-busy="isSubmitting ? true : undefined"
    @submit.prevent="void form.handleSubmit()"
  >
    <form.Field name="title">
      <template #default="{ field, state }">
        <UIFormInput
          :error="formatFieldErrors(state.meta.errors)"
          :invalid="state.meta.errors.length > 0"
          :label="$t('books.form.fields.title')"
          :model-value="state.value"
          :name="field.name"
          :placeholder="$t('books.form.placeholders.title')"
          required
          @blur="field.handleBlur()"
          @update:model-value="field.handleChange($event)"
        />
      </template>
    </form.Field>

    <form.Field name="author">
      <template #default="{ field, state }">
        <UIFormInput
          :error="formatFieldErrors(state.meta.errors)"
          :invalid="state.meta.errors.length > 0"
          :label="$t('books.form.fields.author')"
          :model-value="state.value"
          :name="field.name"
          :placeholder="$t('books.form.placeholders.author')"
          required
          @blur="field.handleBlur()"
          @update:model-value="field.handleChange($event)"
        />
      </template>
    </form.Field>

    <form.Field name="genre">
      <template #default="{ field, state }">
        <UIFormSelect
          :error="formatFieldErrors(state.meta.errors)"
          :invalid="state.meta.errors.length > 0"
          :items="genreOptions"
          :label="$t('books.form.fields.genre')"
          :model-value="state.value ? [state.value] : []"
          :name="field.name"
          :placeholder="$t('books.form.placeholders.genre')"
          required
          @blur="field.handleBlur()"
          @update:model-value="field.handleChange($event[0] ?? '')"
        />
      </template>
    </form.Field>

    <form.Field name="description">
      <template #default="{ field, state }">
        <UIFormTextarea
          autoresize
          :error="formatFieldErrors(state.meta.errors)"
          :invalid="state.meta.errors.length > 0"
          :label="$t('books.form.fields.description')"
          :model-value="state.value"
          :name="field.name"
          :placeholder="$t('books.form.placeholders.description')"
          @blur="field.handleBlur()"
          @update:model-value="field.handleChange($event)"
        />
      </template>
    </form.Field>

    <div class="grid gap-6 sm:grid-cols-2">
      <form.Field name="published">
        <template #default="{ field, state }">
          <UIFormInput
            :error="formatFieldErrors(state.meta.errors)"
            :invalid="state.meta.errors.length > 0"
            :label="$t('books.form.fields.published')"
            :model-value="state.value"
            :name="field.name"
            required
            type="date"
            @blur="field.handleBlur()"
            @update:model-value="field.handleChange($event)"
          />
        </template>
      </form.Field>

      <form.Field name="publisher">
        <template #default="{ field, state }">
          <UIFormInput
            :error="formatFieldErrors(state.meta.errors)"
            :invalid="state.meta.errors.length > 0"
            :label="$t('books.form.fields.publisher')"
            :model-value="state.value"
            :name="field.name"
            :placeholder="$t('books.form.placeholders.publisher')"
            required
            @blur="field.handleBlur()"
            @update:model-value="field.handleChange($event)"
          />
        </template>
      </form.Field>
    </div>

    <form.Field name="isbn">
      <template #default="{ field, state }">
        <UIFormInput
          :error="formatFieldErrors(state.meta.errors)"
          :invalid="state.meta.errors.length > 0"
          :label="$t('books.form.fields.isbn')"
          :model-value="state.value"
          :name="field.name"
          :placeholder="$t('books.form.placeholders.isbn')"
          required
          @blur="field.handleBlur()"
          @update:model-value="field.handleChange($event)"
        />
      </template>
    </form.Field>

    <form.Field name="image">
      <template #default="{ field, state }">
        <UIFormInput
          :error="formatFieldErrors(state.meta.errors)"
          :helper-text="$t('books.form.helpers.image')"
          :invalid="state.meta.errors.length > 0"
          :label="$t('books.form.fields.image')"
          :model-value="state.value"
          :name="field.name"
          :placeholder="$t('books.form.placeholders.image')"
          required
          type="url"
          @blur="field.handleBlur()"
          @update:model-value="field.handleChange($event)"
        />
      </template>
    </form.Field>

    <div class="ml-auto flex w-fit gap-3">
      <UIButton
        intent="neutral"
        size="sm"
        :text="$t('books.form.cancel')"
        :to="cancelTo"
        variant="subtle"
      />
      <UIButton
        :disabled="!canSubmit || isSubmitting"
        size="sm"
        :text="submitLabel"
        type="submit"
      />
    </div>
  </form>
</template>
