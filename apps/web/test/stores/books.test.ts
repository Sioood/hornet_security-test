import { createPinia, setActivePinia } from 'pinia'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { isRef, ref } from 'vue'

import { extractStore } from '../../../../packages/nuxt-essentials/app/composables/store'
import { useBooksStore } from '../../app/stores/books'

import type { Book } from '../../app/types/book'
import type { Ref } from 'vue'

const sampleBook = {
  author: 'Jane Doe',
  description: 'A test book.',
  genre: 'Fantasy',
  id: 42,
  image: 'https://example.com/cover.jpg',
  isbn: '9780000000042',
  published: '2021-06-15',
  publisher: 'Test Press',
  title: 'Sample Book',
} satisfies Book

const fetchMock = vi.fn()
const localStorageState = new Map<string, Ref<unknown>>()

function mockUseLocalStorage<T>(key: string, defaultValue: T): Ref<T> {
  if (!localStorageState.has(key)) {
    localStorageState.set(key, ref(defaultValue))
  }

  return localStorageState.get(key) as Ref<T>
}

describe('useBooksStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorageState.clear()
    fetchMock.mockReset()
    vi.stubGlobal('$fetch', fetchMock)
    vi.stubGlobal('useLocalStorage', mockUseLocalStorage)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('fetchBooks updates list state on success', async () => {
    fetchMock.mockResolvedValue({
      code: 200,
      data: [sampleBook],
      status: 'OK',
      total: 1,
    })

    const store = useBooksStore()
    await store.fetchBooks({ _page: 1, _quantity: 10 })

    expect(fetchMock).toHaveBeenCalledWith('/api/books', {
      query: { _page: 1, _quantity: 10 },
    })
    expect(store.books).toEqual([sampleBook])
    expect(store.total).toBe(1)
    expect(store.listStatus).toBe('success')
    expect(store.listError).toBeNull()
    expect(store.listPending).toBe(false)
  })

  it('fetchBooks sets error state when the request fails', async () => {
    fetchMock.mockRejectedValue(new Error('Network error'))

    const store = useBooksStore()
    await store.fetchBooks()

    expect(store.listStatus).toBe('error')
    expect(store.listError?.message).toBe('Network error')
    expect(store.books).toEqual([])
  })

  it('fetchBookById updates detail state on success', async () => {
    fetchMock.mockResolvedValue({
      code: 200,
      data: sampleBook,
      status: 'OK',
    })

    const store = useBooksStore()
    await store.fetchBookById(sampleBook.id)

    expect(fetchMock).toHaveBeenCalledWith(`/api/books/${sampleBook.id}`)
    expect(store.currentBook).toEqual(sampleBook)
    expect(store.currentBookId).toBe(sampleBook.id)
    expect(store.detailStatus).toBe('success')
    expect(store.mergedCurrentBook).toEqual(sampleBook)
  })

  it('setPage triggers a fetch with the new page', async () => {
    fetchMock.mockResolvedValue({
      code: 200,
      data: [sampleBook],
      status: 'OK',
      total: 20,
    })

    const store = useBooksStore()
    await store.setPage(2)

    expect(store.page).toBe(2)
    expect(fetchMock).toHaveBeenCalledWith('/api/books', {
      query: { _page: 2, _quantity: 12 },
    })
  })

  it('toggleFavorite persists favorite ids', () => {
    const store = useBooksStore()

    store.toggleFavorite(1)
    expect(store.isFavorite(1)).toBe(true)
    expect(store.favoriteIds).toEqual([1])

    store.toggleFavorite(1)
    expect(store.isFavorite(1)).toBe(false)
    expect(store.favoriteIds).toEqual([])
  })

  it('tracks multiple favorites', () => {
    const store = useBooksStore()

    store.toggleFavorite(1)
    store.toggleFavorite(2)

    expect(store.favoriteIds).toEqual([1, 2])
    expect(store.isFavorite(1)).toBe(true)
    expect(store.isFavorite(2)).toBe(true)
  })

  it('favoriteBooks returns only merged favorite books', async () => {
    const otherBook = { ...sampleBook, id: 43, title: 'Other Book' }
    fetchMock.mockResolvedValue({
      code: 200,
      data: [sampleBook, otherBook],
      status: 'OK',
      total: 2,
    })

    const store = useBooksStore()
    await store.fetchBooks()
    store.toggleFavorite(sampleBook.id)

    expect(store.favoriteBooks).toEqual([sampleBook])
    expect(store.mergedBooks).toHaveLength(2)
  })

  it('updateBookLocal applies overrides in mergedBooks', async () => {
    fetchMock.mockResolvedValue({
      code: 200,
      data: [sampleBook],
      status: 'OK',
      total: 1,
    })

    const store = useBooksStore()
    await store.fetchBooks()
    store.updateBookLocal(sampleBook.id, { title: 'Updated title' })

    expect(store.mergedBooks[0]?.title).toBe('Updated title')
    expect(store.books[0]?.title).toBe('Sample Book')
    expect(store.getBookById(sampleBook.id)?.title).toBe('Updated title')
  })

  it('updateBookLocal applies overrides to mergedCurrentBook', async () => {
    fetchMock.mockResolvedValue({
      code: 200,
      data: sampleBook,
      status: 'OK',
    })

    const store = useBooksStore()
    await store.fetchBookById(sampleBook.id)
    store.updateBookLocal(sampleBook.id, { title: 'Detail title' })

    expect(store.currentBook?.title).toBe('Sample Book')
    expect(store.mergedCurrentBook?.title).toBe('Detail title')
  })

  it('deleteBookLocal hides a book from mergedBooks', async () => {
    fetchMock.mockResolvedValue({
      code: 200,
      data: [sampleBook],
      status: 'OK',
      total: 1,
    })

    const store = useBooksStore()
    await store.fetchBooks()
    store.deleteBookLocal(sampleBook.id)

    expect(store.mergedBooks).toEqual([])
    expect(store.getBookById(sampleBook.id)).toBeNull()
    expect(store.books).toEqual([sampleBook])
  })

  it('createBookLocal adds a book to mergedBooks', () => {
    const store = useBooksStore()

    const created = store.createBookLocal({
      author: 'Local Author',
      description: 'A locally created book.',
      genre: 'Mystery',
      image: 'https://example.com/cover.jpg',
      isbn: '9780000000999',
      published: '2024-01-01',
      publisher: 'Local Press',
      title: 'Local Book',
    })

    expect(created.id).toBeGreaterThan(0)
    expect(store.mergedBooks).toContainEqual(created)
    expect(store.getBookById(created.id)).toEqual(created)
  })

  it('updateBookLocal updates a locally created book', () => {
    const store = useBooksStore()

    const created = store.createBookLocal({
      author: 'Local Author',
      description: 'A locally created book.',
      genre: 'Mystery',
      image: 'https://example.com/cover.jpg',
      isbn: '9780000000999',
      published: '2024-01-01',
      publisher: 'Local Press',
      title: 'Local Book',
    })

    store.updateBookLocal(created.id, { title: 'Updated Local Book' })

    expect(store.getBookById(created.id)?.title).toBe('Updated Local Book')
    expect(store.localBooks[0]?.title).toBe('Updated Local Book')
  })

  it('restoreBookLocal makes a deleted book visible again', async () => {
    fetchMock.mockResolvedValue({
      code: 200,
      data: [sampleBook],
      status: 'OK',
      total: 1,
    })

    const store = useBooksStore()
    await store.fetchBooks()
    store.deleteBookLocal(sampleBook.id)
    store.restoreBookLocal(sampleBook.id)

    expect(store.mergedBooks).toEqual([sampleBook])
    expect(store.getBookById(sampleBook.id)).toEqual(sampleBook)
  })
})

describe('extractStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorageState.clear()
    fetchMock.mockReset()
    vi.stubGlobal('$fetch', fetchMock)
    vi.stubGlobal('useLocalStorage', mockUseLocalStorage)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('exposes reactive store state via extractStore', async () => {
    fetchMock.mockResolvedValue({
      code: 200,
      data: [sampleBook],
      status: 'OK',
      total: 1,
    })

    const books = extractStore(useBooksStore())
    await books.fetchBooks()

    expect(isRef(books.books)).toBe(true)
    expect(books.books.value).toEqual([sampleBook])
    expect(typeof books.setPage).toBe('function')
  })

  it('wraps the same store instance through extractStore', () => {
    const directStore = useBooksStore()
    const extracted = extractStore(directStore)

    directStore.page = 3

    expect(extracted.page.value).toBe(3)
  })
})
