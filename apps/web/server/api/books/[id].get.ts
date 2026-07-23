import { z } from 'zod'

import { bookDetailResponseSchema } from '../../../app/schemas/book'

const bookIdParamSchema = z.coerce.number().int().positive()

export default defineEventHandler(async (event) => {
  const parsedId = bookIdParamSchema.safeParse(getRouterParam(event, 'id'))

  if (!parsedId.success) {
    throw createError({
      data: z.flattenError(parsedId.error),
      statusCode: 400,
      statusMessage: 'Invalid book id',
    })
  }

  const config = useRuntimeConfig(event)
  const book = await getBookById(parsedId.data, {
    fakerApiBaseUrl: config.fakerApiBaseUrl,
    fakerApiTimeout: Number(config.fakerApiTimeout),
  })

  if (!book) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Book not found',
    })
  }

  return bookDetailResponseSchema.parse({
    code: 200,
    data: book,
    status: 'OK',
  })
})
