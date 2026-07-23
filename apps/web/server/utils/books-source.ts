import { z } from 'zod'

import {
  bookDetailResponseSchema,
  bookSchema,
  booksListResponseSchema,
} from '../../app/schemas/book'
import booksFixture from '../data/books.fixture.json'

import type { BooksListQuery } from '../../app/schemas/book'
import type { Book, BooksListResponse } from '../../app/types/book'

export interface BooksSourceConfig {
  fakerApiBaseUrl: string
  fakerApiCooldownMs: number
  fakerApiTimeout: number
}

let cachedFixtureBooks: Book[] | undefined

const fakerApiCircuit = {
  unavailableUntil: null as number | null,
}

export function resetFakerApiCircuitForTests(): void {
  fakerApiCircuit.unavailableUntil = null
}

function isFakerApiInCooldown(now = Date.now()): boolean {
  return fakerApiCircuit.unavailableUntil !== null && now < fakerApiCircuit.unavailableUntil
}

function markFakerApiUnavailable(cooldownMs: number, now = Date.now()): void {
  fakerApiCircuit.unavailableUntil = now + cooldownMs
}

function markFakerApiAvailable(): void {
  fakerApiCircuit.unavailableUntil = null
}

function getFixtureBooks(): Book[] {
  if (!cachedFixtureBooks) {
    cachedFixtureBooks = z.array(bookSchema).parse(booksFixture)
  }
  return cachedFixtureBooks
}

export function paginateBooks(
  books: readonly Book[],
  page: number,
  quantity: number,
): BooksListResponse {
  const start = (page - 1) * quantity
  const data = books.slice(start, start + quantity)

  return {
    code: 200,
    data,
    status: 'OK',
    total: books.length,
  }
}

async function fetchBooksFromFakerApi(
  query: BooksListQuery,
  config: BooksSourceConfig,
): Promise<BooksListResponse> {
  const response = await $fetch<unknown>(`${config.fakerApiBaseUrl}/books`, {
    query: {
      _page: query._page,
      _quantity: query._quantity,
      ...(query._seed !== undefined ? { _seed: query._seed } : {}),
    },
    timeout: Number(config.fakerApiTimeout),
  })

  return booksListResponseSchema.parse(response)
}

async function fetchBookFromFakerApi(id: number, config: BooksSourceConfig): Promise<Book> {
  const response = await $fetch<unknown>(`${config.fakerApiBaseUrl}/books/${id}`, {
    timeout: Number(config.fakerApiTimeout),
  })

  const parsed = bookDetailResponseSchema.safeParse(response)
  if (parsed.success) {
    return parsed.data.data
  }

  const listParsed = booksListResponseSchema.safeParse(response)
  if (listParsed.success && listParsed.data.data[0]) {
    return listParsed.data.data[0]
  }

  throw new Error(`Unexpected FakerAPI response for book ${id}`)
}

interface FakerApiFallbackOptions<T> {
  config: BooksSourceConfig
  fallback: () => T
  logContext: string
  operation: () => Promise<T>
}

async function withFakerApiFallback<T>(options: FakerApiFallbackOptions<T>): Promise<T> {
  const { config, fallback, logContext, operation } = options

  if (isFakerApiInCooldown()) {
    return fallback()
  }

  try {
    const result = await operation()
    markFakerApiAvailable()
    return result
  } catch (error) {
    markFakerApiUnavailable(config.fakerApiCooldownMs)
    // oxlint-disable-next-line no-console
    console.warn(
      `[books-source] FakerAPI unavailable (${logContext}), using fixture fallback until ${new Date(fakerApiCircuit.unavailableUntil ?? 0).toISOString()}`,
      error,
    )
    return fallback()
  }
}

export async function getBooksList(
  query: BooksListQuery,
  config: BooksSourceConfig,
): Promise<BooksListResponse> {
  return withFakerApiFallback({
    config,
    fallback: () => paginateBooks(getFixtureBooks(), query._page, query._quantity),
    logContext: 'list',
    operation: () => fetchBooksFromFakerApi(query, config),
  })
}

export async function getBookById(id: number, config: BooksSourceConfig): Promise<Book | null> {
  return withFakerApiFallback({
    config,
    fallback: () => getFixtureBooks().find((book) => book.id === id) ?? null,
    logContext: `book ${id}`,
    operation: () => fetchBookFromFakerApi(id, config),
  })
}
