export type BookGenre =
  | 'Fantasy'
  | 'Science Fiction'
  | 'Mystery'
  | 'Romance'
  | 'Horror'
  | 'Non-Fiction'
  | 'Other'

/** Single book record — shape aligned with FakerAPI `GET /api/v1/books`. */
export interface Book {
  id: number
  title: string
  author: string
  genre: BookGenre
  description: string
  isbn: string
  image: string
  published: string
  publisher: string
}

/** Paginated list response — shape aligned with FakerAPI list endpoints. */
export interface BooksListResponse {
  status: 'OK'
  code: 200
  total: number
  data: Book[]
}
