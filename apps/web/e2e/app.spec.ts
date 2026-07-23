import { test, expect } from '@playwright/test'

test.describe('App Shell', () => {
  test('renders without errors and displays main heading', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/.+/)
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  })

  test('has no console errors on initial load', async ({ page }) => {
    const errors: string[] = []
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text())
    })

    await page.goto('/')
    await page.waitForLoadState('networkidle')

    expect(errors).toHaveLength(0)
  })

  test('page has valid meta tags for SEO', async ({ page }) => {
    await page.goto('/')

    const description = page.locator('meta[name="description"]')
    await expect(description).toHaveCount(1)

    const ogTitle = page.locator('meta[property="og:title"]')
    await expect(ogTitle).toHaveCount(1)
  })

  test('html element has a valid lang attribute', async ({ page }) => {
    await page.goto('/')

    const html = page.locator('html')
    await expect(html).toHaveAttribute('lang', /\w{2}/)
  })
})

test.describe('i18n', () => {
  test('renders French content by default', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('domcontentloaded')

    const html = page.locator('html')
    const lang = await html.getAttribute('lang')
    expect(lang).toMatch(/fr/)
  })
})

test.describe('PWA', () => {
  test('serves a valid web manifest', async ({ page }) => {
    await page.goto('/')

    const manifest = page.locator('link[rel="manifest"]')
    await expect(manifest).toHaveCount(1)
  })
})

test.describe('Error Handling', () => {
  test('shows error page for 404 routes', async ({ page }) => {
    await page.goto('/this-page-does-not-exist-404')

    await expect(page.locator('span.txt-title')).toHaveText('404')
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  })
})
