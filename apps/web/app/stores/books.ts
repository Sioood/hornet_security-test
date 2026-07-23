import { useLocalStorage } from '@vueuse/core'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

import {
  bookDetailResponseSchema,
  booksListQuerySchema,
  booksListResponseSchema,
} from '../schemas/book'

import type { BooksListQuery } from '../schemas/book'
import type { Book } from '../types/book'

type FetchStatus = 'idle' | 'loading' | 'success' | 'error'

function toError(cause: unknown, fallbackMessage: string): Error {
  return cause instanceof Error ? cause : new Error(fallbackMessage)
}

export const useBooksStore = defineStore('books', () => {
  const books = ref<Book[]>([])
  const total = ref(0)
  const page = ref(1)
  const pageSize = ref(12)
  const listStatus = ref<FetchStatus>('idle')
  const listError = ref<Error | null>(null)

  const currentBook = ref<Book | null>(null)
  const currentBookId = ref<number | null>(null)
  const detailStatus = ref<FetchStatus>('idle')
  const detailError = ref<Error | null>(null)

  const favoriteIds = useLocalStorage<number[]>('books:favorites', [])
  const deletedIds = useLocalStorage<number[]>('books:deleted', [])
  const localOverrides = useLocalStorage<Record<string, Partial<Book>>>('books:overrides', {})

  const listPending = computed(() => listStatus.value === 'loading')
  const detailPending = computed(() => detailStatus.value === 'loading')
  const hasListError = computed(() => listStatus.value === 'error')
  const hasDetailError = computed(() => detailStatus.value === 'error')

  function isDeleted(id: number): boolean {
    return deletedIds.value.includes(id)
  }

  function applyOverride(book: Book): Book {
    const override = localOverrides.value[String(book.id)]
    if (!override) {
      return book
    }
    return { ...book, ...override }
  }

  const mergedBooks = computed(() =>
    books.value.filter((book) => !isDeleted(book.id)).map((book) => applyOverride(book)),
  )

  const favoriteBooks = computed(() => mergedBooks.value.filter((book) => isFavorite(book.id)))

  const mergedCurrentBook = computed(() => {
    if (!currentBook.value || isDeleted(currentBook.value.id)) {
      return null
    }
    return applyOverride(currentBook.value)
  })

  function getBookById(id: number): Book | null {
    if (isDeleted(id)) {
      return null
    }

    const fromList = books.value.find((book) => book.id === id)
    const fromDetail = currentBook.value?.id === id ? currentBook.value : null
    const base = fromDetail ?? fromList ?? null

    if (!base) {
      return null
    }

    return applyOverride(base)
  }

  function isFavorite(id: number): boolean {
    return favoriteIds.value.includes(id)
  }

  function toggleFavorite(id: number): void {
    if (isFavorite(id)) {
      favoriteIds.value = favoriteIds.value.filter((favoriteId) => favoriteId !== id)
      return
    }

    favoriteIds.value = [...favoriteIds.value, id]
  }

  function updateBookLocal(id: number, patch: Partial<Book>): void {
    const key = String(id)
    localOverrides.value = {
      ...localOverrides.value,
      [key]: { ...localOverrides.value[key], ...patch },
    }
  }

  function deleteBookLocal(id: number): void {
    if (deletedIds.value.includes(id)) {
      return
    }

    deletedIds.value = [...deletedIds.value, id]
  }

  function restoreBookLocal(id: number): void {
    deletedIds.value = deletedIds.value.filter((deletedId) => deletedId !== id)
  }

  async function fetchBooks(query?: Partial<BooksListQuery>): Promise<void> {
    listStatus.value = 'loading'
    listError.value = null

    try {
      const parsedQuery = booksListQuerySchema.parse({
        _page: page.value,
        _quantity: pageSize.value,
        ...query,
      })

      const response = booksListResponseSchema.parse(
        await $fetch('/api/books', { query: parsedQuery }),
      )

      books.value = response.data
      total.value = response.total
      page.value = parsedQuery._page
      pageSize.value = parsedQuery._quantity
      listStatus.value = 'success'
    } catch (cause) {
      listError.value = toError(cause, 'Failed to fetch books')
      listStatus.value = 'error'
    }
  }

  async function fetchBookById(id: number): Promise<void> {
    currentBookId.value = id
    detailStatus.value = 'loading'
    detailError.value = null

    try {
      const response = bookDetailResponseSchema.parse(await $fetch(`/api/books/${id}`))
      currentBook.value = response.data
      detailStatus.value = 'success'
    } catch (cause) {
      currentBook.value = null
      detailError.value = toError(cause, `Failed to fetch book ${id}`)
      detailStatus.value = 'error'
    }
  }

  async function refreshList(): Promise<void> {
    await fetchBooks({ _page: page.value, _quantity: pageSize.value })
  }

  async function refreshDetail(): Promise<void> {
    if (currentBookId.value === null) {
      return
    }

    await fetchBookById(currentBookId.value)
  }

  async function setPage(nextPage: number): Promise<void> {
    page.value = nextPage
    await fetchBooks({ _page: nextPage })
  }

  async function setPageSize(size: number): Promise<void> {
    pageSize.value = size
    page.value = 1
    await fetchBooks({ _page: 1, _quantity: size })
  }

  return {
    books,
    currentBook,
    currentBookId,
    deleteBookLocal,
    deletedIds,
    detailError,
    detailPending,
    detailStatus,
    favoriteBooks,
    favoriteIds,
    fetchBookById,
    fetchBooks,
    getBookById,
    hasDetailError,
    hasListError,
    isFavorite,
    listError,
    listPending,
    listStatus,
    localOverrides,
    mergedBooks,
    mergedCurrentBook,
    page,
    pageSize,
    refreshDetail,
    refreshList,
    restoreBookLocal,
    setPage,
    setPageSize,
    toggleFavorite,
    total,
    updateBookLocal,
  }
})
