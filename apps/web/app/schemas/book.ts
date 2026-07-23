import { z } from 'zod'

import type { Book, BookGenre, BooksListResponse } from '~/types/book'

const publishedDateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/)

export const bookGenreSchema = z.enum([
  'Fantasy',
  'Science Fiction',
  'Mystery',
  'Romance',
  'Horror',
  'Non-Fiction',
  'Other',
] satisfies [BookGenre, ...BookGenre[]])

export const bookFormSchema = z.object({
  author: z.string().trim().min(1),
  description: z.string(),
  genre: bookGenreSchema,
  image: z.string().trim().min(1),
  isbn: z.string().trim().min(10).max(13),
  published: publishedDateSchema,
  publisher: z.string().trim().min(1),
  title: z.string().trim().min(1),
})

export type BookFormValues = z.infer<typeof bookFormSchema>

export const bookSchema: z.ZodType<Book> = z.object({
  author: z.string().min(1),
  description: z.string(),
  genre: bookGenreSchema,
  id: z.number().int().positive(),
  image: z.string().min(1),
  isbn: z.string().min(10).max(13),
  published: publishedDateSchema,
  publisher: z.string().min(1),
  title: z.string().min(1),
})

export const booksListResponseSchema: z.ZodType<BooksListResponse> = z.object({
  code: z.literal(200),
  data: z.array(bookSchema),
  status: z.literal('OK'),
  total: z.number().int().nonnegative(),
})

export const bookDetailResponseSchema = z.object({
  code: z.literal(200),
  data: bookSchema,
  status: z.literal('OK'),
})

export const booksListQuerySchema = z.object({
  _page: z.coerce.number().int().positive().default(1),
  _quantity: z.coerce.number().int().positive().max(100).default(12),
  _seed: z.coerce.number().int().optional(),
})

export type BooksListQuery = z.infer<typeof booksListQuerySchema>
export type BookDetailResponse = z.infer<typeof bookDetailResponseSchema>
