<script setup lang="ts">
import type { BookFormValues } from '../../schemas/book'

const router = useRouter()
const { t } = useI18n()
const toaster = useToast()
const booksStore = useBooksStore()

const initialValues: BookFormValues = {
  author: '',
  description: '',
  genre: 'Fantasy',
  image: '',
  isbn: '',
  published: '',
  publisher: '',
  title: '',
}

function onSubmit(values: BookFormValues): void {
  const created = booksStore.createBookLocal(values)

  toaster.value?.success({
    description: t('books.form.toastCreateDescription', { title: created.title }),
    title: t('books.form.toastSuccessTitle'),
  })

  void router.push(`/books/${created.id}`)
}

useHead(() => ({
  title: `${t('books.form.createTitle')} — ${t('navLibrary')}`,
}))
</script>

<template>
  <section class="space-y-8">
    <UIButton
      class="mb-10"
      icon="tabler:arrow-left"
      intent="neutral"
      size="sm"
      :text="$t('books.backToLibrary')"
      to="/books"
      variant="ghost"
    />

    <div class="mx-auto w-full max-w-2xl space-y-8">
      <header class="space-y-2">
        <h1 class="font-display txt-h1 text-neutral-text">{{ $t('books.form.createTitle') }}</h1>
        <p class="txt-base text-neutral-text-muted">{{ $t('books.form.createSubtitle') }}</p>
      </header>

      <BookForm
        cancel-to="/books"
        :initial-values="initialValues"
        :submit-label="$t('books.form.submitCreate')"
        @submit="onSubmit"
      />
    </div>
  </section>
</template>
