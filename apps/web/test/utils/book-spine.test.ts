import { describe, expect, it } from 'vitest'

import { getBookSpineStyle } from '../../app/utils/book-spine'

describe('getBookSpineStyle', () => {
  it('returns varied dimensions per book id', () => {
    const styles = [1, 2, 3, 4, 5, 6].map((id) => getBookSpineStyle(id))
    const widths = new Set(styles.map((style) => style.widthRem))
    const heights = new Set(styles.map((style) => style.heightRem))

    expect(widths.size).toBeGreaterThan(1)
    expect(heights.size).toBeGreaterThan(1)
    expect(styles[0]?.titleMaxWidthPx).toBe(Math.round((styles[0]?.heightRem ?? 0) * 0.9 * 16))
  })

  it('uses theme intent classes', () => {
    const style = getBookSpineStyle(7)

    expect(style.classes.background).toMatch(
      /^bg-(primary|accent|secondary|neutral|info|warning)-fill$/,
    )
    expect(style.classes.text).toMatch(/^text-.+-on-fill$/)
  })
})
