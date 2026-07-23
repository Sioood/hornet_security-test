<script setup lang="ts">
import type { BookFormValues } from '../../../schemas/book'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const toaster = useToast()
const booksStore = useBooksStore()

const bookId = computed(() => Number(route.params.id))
const isValidId = computed(() => Number.isInteger(bookId.value) && bookId.value > 0)

const { data: loadedBook, pending } = await useAsyncData(
  () => `book-edit-${bookId.value}`,
  async () => {
    if (!isValidId.value) {
      return null
    }

    const existing = booksStore.getBookById(bookId.value)
    if (existing) {
      return existing
    }

    await booksStore.fetchBookById(bookId.value)
    return booksStore.getBookById(bookId.value)
  },
  { watch: [bookId] },
)

const initialValues = computed<BookFormValues | null>(() => {
  if (!loadedBook.value) {
    return null
  }

  const book = loadedBook.value

  return {
    author: book.author,
    description: book.description,
    genre: book.genre,
    image: book.image,
    isbn: book.isbn,
    published: book.published,
    publisher: book.publisher,
    title: book.title,
  }
})

function onSubmit(values: BookFormValues): void {
  if (!isValidId.value) {
    return
  }

  booksStore.updateBookLocal(bookId.value, values)

  toaster.value?.success({
    description: t('books.form.toastEditDescription', { title: values.title }),
    title: t('books.form.toastSuccessTitle'),
  })

  void router.push(`/books/${bookId.value}`)
}

useHead(() => ({
  title: loadedBook.value
    ? `${t('books.form.editTitle')} — ${loadedBook.value.title}`
    : t('books.form.editTitle'),
}))
</script>

<template>
  <section class="space-y-8">
    <UIButton
      class="mb-10"
      icon="tabler:arrow-left"
      intent="neutral"
      size="sm"
      :text="$t('books.backToBook')"
      :to="isValidId ? `/books/${bookId}` : '/books'"
      variant="ghost"
    />

    <UIAlert
      v-if="!isValidId"
      :description="$t('books.invalidIdDescription')"
      :title="$t('books.notFoundTitle')"
      type="error"
    />

    <template v-else-if="pending && !loadedBook">
      <div
        aria-busy="true"
        :aria-label="$t('books.form.loading')"
        class="mx-auto w-full max-w-2xl animate-pulse space-y-4"
      >
        <div class="h-10 w-1/2 rounded-xs bg-neutral-surface-subtle" />
        <div class="h-12 w-full rounded-xs bg-neutral-surface-subtle" />
        <div class="h-12 w-full rounded-xs bg-neutral-surface-subtle" />
        <div class="h-32 w-full rounded-xs bg-neutral-surface-subtle" />
      </div>
    </template>

    <UIAlert
      v-else-if="!loadedBook || !initialValues"
      :description="$t('books.notFoundDescription')"
      :title="$t('books.notFoundTitle')"
      type="warning"
    />

    <div v-else class="mx-auto w-full max-w-2xl space-y-8">
      <header class="space-y-2">
        <h1 class="font-display txt-h1 text-neutral-text">{{ $t('books.form.editTitle') }}</h1>
        <p class="txt-base text-neutral-text-muted">
          {{ $t('books.form.editSubtitle', { title: loadedBook.title }) }}
        </p>
      </header>

      <BookForm
        :cancel-to="`/books/${bookId}`"
        :initial-values="initialValues"
        :submit-label="$t('books.form.submitEdit')"
        @submit="onSubmit"
      />
    </div>
  </section>
</template>
