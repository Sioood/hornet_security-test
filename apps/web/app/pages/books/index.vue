<script setup lang="ts">
import type { Book } from '../types/book'
import type { FilterValues } from '~ui/app/utils/Components/Filter/schema'

definePageMeta({
  viewTransition: true,
})

const LIST_PAGE_SIZE = 12
const CATALOG_PAGE_SIZE = 100

const { hasListError, listError, listPending, mergedBooks, fetchBooks, refreshList, isFavorite } =
  extractStore(useBooksStore())

const filterValues = ref<FilterValues>({
  favoritesOnly: false,
  genre: [],
  search: '',
})

const filterBarRef = ref<{
  filter: (items: readonly Book[]) => Book[]
  reset: () => void
} | null>(null)

const listPage = ref(1)

onMounted(() => {
  void fetchBooks({ _page: 1, _quantity: CATALOG_PAGE_SIZE })
})

const filteredBooks = computed(() => {
  void filterValues.value
  return filterBarRef.value?.filter(mergedBooks.value) ?? mergedBooks.value
})

const pagedBooks = computed(() => {
  const start = (listPage.value - 1) * LIST_PAGE_SIZE
  return filteredBooks.value.slice(start, start + LIST_PAGE_SIZE)
})

const skeletonItems = computed(() => Array.from({ length: LIST_PAGE_SIZE }, (_, index) => index))

watch(
  filterValues,
  () => {
    listPage.value = 1
  },
  { deep: true },
)

watch(
  () => filteredBooks.value.length,
  (count) => {
    const maxPage = Math.max(1, Math.ceil(count / LIST_PAGE_SIZE))
    if (listPage.value > maxPage) {
      listPage.value = maxPage
    }
  },
)
</script>

<template>
  <section class="space-y-8">
    <header class="space-y-3">
      <p class="txt-label tracking-[0.2em] text-neutral-text-muted uppercase">
        {{ $t('navLibrary') }}
      </p>
      <h1 class="font-display txt-h1 text-neutral-text">{{ $t('libraryTitle') }}</h1>
      <p class="txt-base max-w-2xl text-neutral-text-muted">{{ $t('librarySubtitle') }}</p>
    </header>

    <BooksFilterBar ref="filterBarRef" v-model="filterValues" />

    <BooksSpineShelf
      v-if="!hasListError && (listPending || filteredBooks.length > 0)"
      :books="filteredBooks"
      :loading="listPending"
    />

    <UIAlert
      v-if="hasListError"
      :actions="[
        {
          intent: 'error',
          onClick: refreshList,
          text: $t('books.errorRetry'),
          variant: 'subtle',
        },
      ]"
      :description="listError?.message ?? $t('books.errorDescription')"
      :title="$t('books.errorTitle')"
      type="error"
    />

    <template v-else-if="listPending">
      <div
        class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        aria-busy="true"
        :aria-label="$t('books.loading')"
      >
        <div
          v-for="item in skeletonItems"
          :key="item"
          class="flex animate-pulse flex-col gap-4 rounded-xs border border-neutral-border-subtle bg-neutral-surface-subtle p-2"
        >
          <div class="aspect-3/4 rounded-xs bg-neutral-surface" />
          <div class="flex flex-col gap-2 px-1">
            <div class="h-5 w-20 rounded-xs bg-neutral-surface" />
            <div class="h-6 w-full rounded-xs bg-neutral-surface" />
            <div class="h-4 w-2/3 rounded-xs bg-neutral-surface" />
            <div class="h-4 w-full rounded-xs bg-neutral-surface" />
          </div>
        </div>
      </div>
    </template>

    <template v-else>
      <p class="txt-caption text-neutral-text-muted">
        {{ $t('books.results', { count: filteredBooks.length }) }}
      </p>

      <BooksEmptyState v-if="filteredBooks.length === 0" @reset="filterBarRef?.reset()" />

      <template v-else>
        <div
          class="grid grid-cols-1 items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          <BookCard
            v-for="book in pagedBooks"
            :key="book.id"
            :book="book"
            :favorite="isFavorite(book.id)"
          />
        </div>

        <div v-if="filteredBooks.length > LIST_PAGE_SIZE" class="flex justify-center pt-4">
          <UIPagination
            v-model:page="listPage"
            :count="filteredBooks.length"
            :page-size="LIST_PAGE_SIZE"
            intent="neutral"
            size="sm"
          />
        </div>
      </template>
    </template>
  </section>
</template>
