import { z } from 'zod'

import { booksListQuerySchema } from '../../../app/schemas/book'

export default defineEventHandler(async (event) => {
  const parsedQuery = booksListQuerySchema.safeParse(getQuery(event))

  if (!parsedQuery.success) {
    throw createError({
      data: z.flattenError(parsedQuery.error),
      statusCode: 400,
      statusMessage: 'Invalid query parameters',
    })
  }

  const config = useRuntimeConfig(event)

  return getBooksList(parsedQuery.data, {
    fakerApiBaseUrl: config.fakerApiBaseUrl,
    fakerApiTimeout: Number(config.fakerApiTimeout),
  })
})
