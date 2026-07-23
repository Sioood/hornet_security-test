<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const { locale, t } = useI18n()
const booksStore = useBooksStore()

const {
  deleteBookLocal,
  detailError,
  detailPending,
  getBookById,
  hasDetailError,
  isFavorite,
  mergedCurrentBook,
  refreshDetail,
  toggleFavorite,
} = extractStore(booksStore)

const deleteDialogOpen = ref(false)

const bookId = computed(() => Number(route.params.id))
const isValidId = computed(() => Number.isInteger(bookId.value) && bookId.value > 0)

await useAsyncData(
  () => `book-detail-${bookId.value}`,
  async () => {
    if (!isValidId.value) {
      return null
    }

    await booksStore.fetchBookById(bookId.value)
    return booksStore.mergedCurrentBook
  },
  { watch: [bookId] },
)

const book = computed(() => {
  if (!isValidId.value) {
    return null
  }

  if (mergedCurrentBook.value?.id === bookId.value) {
    return mergedCurrentBook.value
  }

  return getBookById(bookId.value)
})

const isNotFoundError = computed(() => {
  const message = detailError.value?.message?.toLowerCase() ?? ''
  return message.includes('404') || message.includes('not found')
})

const showNotFound = computed(
  () =>
    isValidId.value &&
    !detailPending.value &&
    (isNotFoundError.value || (!hasDetailError.value && book.value === null)),
)

const showFetchError = computed(
  () => isValidId.value && !detailPending.value && hasDetailError.value && !isNotFoundError.value,
)

const formattedPublished = computed(() => {
  if (!book.value) {
    return ''
  }

  const date = new Date(`${book.value.published}T00:00:00`)

  return new Intl.DateTimeFormat(locale.value, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date)
})

const genreLabel = computed(() => {
  if (!book.value) {
    return ''
  }

  const key = `books.genres.${book.value.genre}`
  return t(key) === key ? book.value.genre : t(key)
})

function confirmDelete(): void {
  if (!book.value) {
    return
  }

  deleteBookLocal(book.value.id)
  deleteDialogOpen.value = false
  void router.push('/books')
}

useHead(() => ({
  title: book.value ? `${book.value.title} — ${t('navLibrary')}` : t('books.detailTitle'),
}))
</script>

<template>
  <section>
    <UIButton
      class="mb-10"
      icon="tabler:arrow-left"
      intent="neutral"
      size="sm"
      :text="$t('books.backToLibrary')"
      to="/books"
      variant="ghost"
    />

    <div class="space-y-8">
      <UIAlert
        v-if="!isValidId"
        :description="$t('books.invalidIdDescription')"
        :title="$t('books.notFoundTitle')"
        type="error"
      />

      <UIAlert
        v-else-if="showFetchError"
        :actions="[
          {
            intent: 'error',
            onClick: () => refreshDetail(),
            text: $t('books.errorRetry'),
            variant: 'subtle',
          },
        ]"
        :description="detailError?.message ?? $t('books.detailErrorDescription')"
        :title="$t('books.detailErrorTitle')"
        type="error"
      />

      <template v-else-if="detailPending && !book">
        <div aria-busy="true" :aria-label="$t('books.detailLoading')" class="animate-pulse">
          <div class="grid gap-8 lg:grid-cols-[minmax(0,20rem)_1fr] lg:items-start">
            <div class="aspect-3/4 rounded-xs bg-neutral-surface-subtle" />
            <div class="flex flex-col gap-4">
              <div class="h-6 w-24 rounded-xs bg-neutral-surface-subtle" />
              <div class="h-10 w-3/4 rounded-xs bg-neutral-surface-subtle" />
              <div class="h-5 w-1/2 rounded-xs bg-neutral-surface-subtle" />
              <div class="h-24 w-full rounded-xs bg-neutral-surface-subtle" />
            </div>
          </div>
        </div>
      </template>

      <UIAlert
        v-else-if="showNotFound"
        :description="$t('books.notFoundDescription')"
        :title="$t('books.notFoundTitle')"
        type="warning"
      />

      <article
        v-else-if="book"
        class="grid gap-8 lg:grid-cols-[minmax(0,20rem)_1fr] lg:items-start"
      >
        <div class="relative aspect-3/4 overflow-hidden rounded-xs bg-neutral-surface">
          <NuxtImg
            :alt="book.title"
            class="size-full object-cover"
            densities="1x 2x"
            format="webp"
            height="960"
            loading="eager"
            :src="book.image"
            width="720"
          />
          <UIBadge
            v-if="isFavorite(book.id)"
            class="absolute top-3 right-3"
            intent="accent"
            :label="$t('books.favoriteBadge')"
            size="sm"
            variant="subtle"
          />
        </div>

        <div class="flex flex-col gap-6">
          <header class="space-y-3">
            <UIBadge :label="genreLabel" intent="neutral" size="sm" variant="subtle" />
            <h1 class="font-display txt-h1 text-neutral-text">{{ book.title }}</h1>
            <p class="txt-base text-neutral-text-muted">
              {{ $t('books.byAuthor', { author: book.author }) }}
            </p>
          </header>

          <p class="txt-base leading-relaxed text-neutral-text">
            {{ book.description }}
          </p>

          <dl
            class="grid gap-4 rounded-xs border border-neutral-border-subtle bg-neutral-surface-subtle p-4 sm:grid-cols-2"
          >
            <div class="space-y-1">
              <dt class="txt-caption text-neutral-text-muted">{{ $t('books.publishedLabel') }}</dt>
              <dd class="txt-base text-neutral-text">{{ formattedPublished }}</dd>
            </div>
            <div class="space-y-1">
              <dt class="txt-caption text-neutral-text-muted">{{ $t('books.publisherLabel') }}</dt>
              <dd class="txt-base text-neutral-text">{{ book.publisher }}</dd>
            </div>
            <div class="space-y-1 sm:col-span-2">
              <dt class="txt-caption text-neutral-text-muted">{{ $t('books.isbnLabel') }}</dt>
              <dd class="txt-base font-mono text-neutral-text">{{ book.isbn }}</dd>
            </div>
          </dl>

          <div class="flex flex-wrap items-center gap-3">
            <UIButton
              :icon="isFavorite(book.id) ? 'tabler:heart-filled' : 'tabler:heart'"
              :intent="isFavorite(book.id) ? 'accent' : 'neutral'"
              size="sm"
              :text="isFavorite(book.id) ? $t('books.removeFavorite') : $t('books.addFavorite')"
              :variant="isFavorite(book.id) ? 'solid' : 'subtle'"
              @click="toggleFavorite(book.id)"
            />

            <UIButton
              :aria-label="$t('books.editBook')"
              icon="tabler:pencil"
              intent="neutral"
              size="sm"
              :text="$t('books.editBook')"
              :to="`/books/${book.id}/edit`"
              variant="subtle"
            />

            <UIButton
              icon="tabler:trash"
              intent="error"
              size="sm"
              :text="$t('books.deleteBook')"
              variant="subtle"
              @click="deleteDialogOpen = true"
            />
          </div>
        </div>
      </article>

      <UIDialog
        v-model:open="deleteDialogOpen"
        hide-trigger
        :description="$t('books.deleteConfirmDescription', { title: book?.title ?? '' })"
        size="sm"
        :title="$t('books.deleteConfirmTitle')"
      >
        <template #footer>
          <UIButton
            intent="neutral"
            :text="$t('books.deleteCancel')"
            variant="subtle"
            @click="deleteDialogOpen = false"
          />
          <UIButton
            intent="error"
            :text="$t('books.deleteConfirm')"
            variant="solid"
            @click="confirmDelete"
          />
        </template>
      </UIDialog>
    </div>
  </section>
</template>
