import { z } from 'zod'

import type { Book, BooksListResponse } from '~/types/book'

const publishedDateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/)

export const bookSchema: z.ZodType<Book> = z.object({
  author: z.string().min(1),
  description: z.string(),
  genre: z.string().min(1),
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
