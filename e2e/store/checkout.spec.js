import { test, expect } from '@playwright/test'

test.describe('Checkout público (sem pedido real se DB sem migration)', () => {
  test('página de checkout carrega', async ({ page }) => {
    await page.goto('/checkout')
    await expect(page.getByRole('heading', { name: /finalize seu pedido/i })).toBeVisible()
  })

  test('carrinho vazio mostra estado vazio no checkout', async ({ page }) => {
    await page.goto('/checkout')
    await expect(page.getByText(/carrinho está vazio/i)).toBeVisible()
  })
})
