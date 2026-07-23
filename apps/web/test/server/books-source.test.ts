import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { getBookById, getBooksList, paginateBooks } from '../../server/utils/books-source'

import type { Book } from '../../app/types/book'
import type { BooksSourceConfig } from '../../server/utils/books-source'

const testConfig = {
  fakerApiBaseUrl: 'https://fakerapi.it/api/v1',
  fakerApiTimeout: 3000,
} satisfies BooksSourceConfig

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

function createBooks(count: number): Book[] {
  return Array.from({ length: count }, (_, index) => ({
    ...sampleBook,
    id: index + 1,
    title: `Book ${index + 1}`,
  }))
}

describe('paginateBooks', () => {
  it('returns the first page slice with total count', () => {
    const books = createBooks(10)

    const result = paginateBooks(books, 1, 3)

    expect(result).toEqual({
      code: 200,
      data: books.slice(0, 3),
      status: 'OK',
      total: 10,
    })
  })

  it('returns the requested page slice', () => {
    const books = createBooks(10)

    const result = paginateBooks(books, 3, 4)

    expect(result.data).toEqual(books.slice(8, 12))
    expect(result.total).toBe(10)
  })

  it('returns an empty page when offset is beyond the collection', () => {
    const books = createBooks(5)

    const result = paginateBooks(books, 3, 4)

    expect(result.data).toEqual([])
    expect(result.total).toBe(5)
  })
})

describe('getBooksList', () => {
  beforeEach(() => {
    fetchMock.mockReset()
    vi.stubGlobal('$fetch', fetchMock)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('returns validated FakerAPI data when the request succeeds', async () => {
    const apiResponse = {
      code: 200,
      data: [sampleBook],
      status: 'OK',
      total: 1,
    }

    fetchMock.mockResolvedValue(apiResponse)

    const result = await getBooksList({ _page: 1, _quantity: 10 }, testConfig)

    expect(fetchMock).toHaveBeenCalledWith(`${testConfig.fakerApiBaseUrl}/books`, {
      query: { _page: 1, _quantity: 10 },
      timeout: testConfig.fakerApiTimeout,
    })
    expect(result).toEqual(apiResponse)
  })

  it('falls back to the local fixture when FakerAPI fails', async () => {
    fetchMock.mockRejectedValue(new Error('FakerAPI unavailable'))

    const result = await getBooksList({ _page: 2, _quantity: 5 }, testConfig)

    expect(result.status).toBe('OK')
    expect(result.code).toBe(200)
    expect(result.total).toBe(80)
    expect(result.data).toHaveLength(5)
    expect(result.data[0]?.id).toBe(6)
    expect(result.data[0]?.title).toBe('Midnight Equations')
  })
})

describe('getBookById', () => {
  beforeEach(() => {
    fetchMock.mockReset()
    vi.stubGlobal('$fetch', fetchMock)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('returns a book from FakerAPI detail response', async () => {
    fetchMock.mockResolvedValue({
      code: 200,
      data: sampleBook,
      status: 'OK',
    })

    const result = await getBookById(sampleBook.id, testConfig)

    expect(fetchMock).toHaveBeenCalledWith(`${testConfig.fakerApiBaseUrl}/books/${sampleBook.id}`, {
      timeout: testConfig.fakerApiTimeout,
    })
    expect(result).toEqual(sampleBook)
  })

  it('falls back to the local fixture when FakerAPI fails', async () => {
    fetchMock.mockRejectedValue(new Error('FakerAPI unavailable'))

    const result = await getBookById(3, testConfig)

    expect(result?.id).toBe(3)
    expect(result?.title).toBe('Beneath the Amber Sky')
  })

  it('returns null when the book is missing from the fixture fallback', async () => {
    fetchMock.mockRejectedValue(new Error('FakerAPI unavailable'))

    const result = await getBookById(99_999, testConfig)

    expect(result).toBeNull()
  })
})
