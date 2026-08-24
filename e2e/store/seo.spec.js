import { test, expect } from '@playwright/test'

test.describe('SEO public routes', () => {
  test('robots.txt allows storefront and points to www sitemap', async ({ request }) => {
    const res = await request.get('/robots.txt')
    expect(res.ok()).toBeTruthy()
    const body = await res.text()
    expect(body).toMatch(/Allow:\s*\//i)
    expect(body).toMatch(/Disallow:\s*\/admin\//i)
    expect(body).toMatch(/Disallow:\s*\/checkout/i)
    expect(body).toMatch(/Disallow:\s*\/pedido\//i)
    expect(body).toMatch(/Sitemap:\s*https:\/\/www\.terraeestilo\.com\.br\/sitemap\.xml/i)
  })

  test('sitemap.xml returns public URLs', async ({ request }) => {
    const res = await request.get('/sitemap.xml')
    expect(res.ok()).toBeTruthy()
    const body = await res.text()
    expect(body).toContain('https://www.terraeestilo.com.br/')
    expect(body).toContain('/feminino')
    expect(body).toContain('/colecoes')
  })

  test('home is indexable with canonical metadata', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('h1').first()).toBeVisible()
    const robots = await page.locator('meta[name="robots"]').getAttribute('content')
    expect(robots || '').not.toMatch(/noindex/i)
    const canonical = await page.locator('link[rel="canonical"]').getAttribute('href')
    expect(canonical).toMatch(/terraeestilo\.com\.br/)
  })

  test('admin login is noindex', async ({ page }) => {
    await page.goto('/admin/login')
    const robots = await page.locator('meta[name="robots"]').getAttribute('content')
    expect(robots || '').toMatch(/noindex/i)
  })

  test('checkout is noindex', async ({ page }) => {
    await page.goto('/checkout')
    const robots = await page.locator('meta[name="robots"]').getAttribute('content')
    expect(robots || '').toMatch(/noindex/i)
  })
})
