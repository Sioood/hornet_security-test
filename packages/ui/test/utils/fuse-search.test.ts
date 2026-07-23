import { describe, expect, it } from 'vitest'

import { runFuseSearch } from '~ui/app/utils/Components/Filter/fuse-search'

import type { SearchFilterField } from '~ui/app/utils/Components/Filter/schema'

interface Book {
  title: string
  author: string
}

const books: Book[] = [
  { author: 'John Scalzi', title: "Old Man's War" },
  { author: 'Douglas Crockford', title: 'JavaScript: The Good Parts' },
  { author: 'Steve Hamilton', title: 'The Lock Artist' },
]

const searchField: SearchFilterField<Book> = {
  defaultValue: '',
  fuse: {
    fuseOptions: {
      keys: ['title', 'author'],
      threshold: 0.4,
    },
    matchAllWhenSearchEmpty: true,
  },
  type: 'search',
}

describe('runFuseSearch', () => {
  it('returns all items when query is empty and matchAllWhenSearchEmpty is true', () => {
    expect(runFuseSearch(books, { field: searchField, query: '' })).toEqual(books)
  })

  it('returns empty list when query is empty and matchAllWhenSearchEmpty is false', () => {
    const field: SearchFilterField<Book> = {
      ...searchField,
      fuse: { ...searchField.fuse, matchAllWhenSearchEmpty: false },
    }
    expect(runFuseSearch(books, { field, query: '' })).toEqual([])
  })

  it('matches typos via Fuse', () => {
    const results = runFuseSearch(books, { field: searchField, query: 'javscript' })
    expect(results.map((book) => book.title)).toContain('JavaScript: The Good Parts')
  })

  it('supports token search options', () => {
    const field: SearchFilterField<Book> = {
      ...searchField,
      fuse: {
        fuseOptions: {
          keys: ['title'],
          threshold: 0.4,
          useTokenSearch: true,
        },
      },
    }
    const results = runFuseSearch(books, { field, query: 'good parts' })
    expect(results.map((book) => book.title)).toContain('JavaScript: The Good Parts')
  })

  it('uses custom search override when provided', () => {
    const field: SearchFilterField<Book> = {
      ...searchField,
      search: (items, query) => items.filter((item) => item.author.includes(query)),
    }
    const results = runFuseSearch(books, { field, query: 'Crockford' })
    expect(results).toHaveLength(1)
    expect(results[0]?.title).toBe('JavaScript: The Good Parts')
  })

  it('respects resultLimit', () => {
    const field: SearchFilterField<Book> = {
      ...searchField,
      fuse: {
        ...searchField.fuse,
        resultLimit: 1,
      },
    }
    expect(runFuseSearch(books, { field, query: 'a' })).toHaveLength(1)
  })
})
