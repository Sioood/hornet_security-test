<script setup lang="ts">
import { bookGenreSchema } from '../schemas/book'

import type { Book } from '../types/book'
import type { UIFilterBarExpose } from '~ui/app/components/Filter/Bar.vue'
import type { FilterSchema, FilterValues } from '~ui/app/utils/Components/Filter/schema'

const filterValues = defineModel<FilterValues>({ required: true })

const { t } = useI18n()
const booksStore = useBooksStore()

const filterBarRef = ref<UIFilterBarExpose | null>(null)

const genreOptions = computed(() =>
  bookGenreSchema.options.map((genre) => ({
    label: t(`books.genres.${genre}`),
    value: genre,
  })),
)

const schema = computed(
  () =>
    ({
      favoritesOnly: {
        defaultValue: false,
        filterFunction: (book: Book, value: boolean) => !value || booksStore.isFavorite(book.id),
        label: t('books.favoritesOnly'),
        type: 'toggle',
        variant: 'switch',
      },
      genre: {
        defaultValue: [] as string[],
        getValue: (book: Book) => book.genre,
        label: t('books.genreLabel'),
        props: {
          items: genreOptions.value,
          placeholder: t('books.genrePlaceholder'),
        },
        type: 'select',
      },
      search: {
        defaultValue: '',
        fuse: {
          fuseOptions: {
            keys: ['title', 'author', 'description', 'publisher'],
            threshold: 0.35,
            useTokenSearch: true,
          },
          matchAllWhenSearchEmpty: true,
        },
        label: t('books.searchLabel'),
        placeholder: t('books.searchPlaceholder'),
        type: 'search',
      },
    }) satisfies FilterSchema<Book>,
)

function filter(items: readonly Book[]): Book[] {
  return filterBarRef.value?.filter(items) ?? [...items]
}

function reset(): void {
  filterBarRef.value?.reset()
}

defineExpose({
  filter,
  reset,
})
</script>

<template>
  <UIFilterBar
    ref="filterBarRef"
    v-model="filterValues"
    :layout="['search', ['genre', 'favoritesOnly']]"
    :schema="schema"
    intent="neutral"
    show-search-pending
    size="md"
  />
</template>
