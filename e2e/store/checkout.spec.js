import { test, expect } from '@playwright/test'

test.describe('Checkout público (sem pedido real se DB sem migration)', () => {
  test('página de checkout carrega', async ({ page }) => {
    await page.goto('/checkout')
    await expect(page.getByRole('heading', { name: /finalize seu pedido/i })).toBeVisible()
    await expect(page.getByRole('navigation', { name: /etapas do checkout/i })).toBeVisible()
    await expect(page.getByText('Ambiente seguro')).toBeVisible()
  })

  test('carrinho vazio mostra estado vazio no checkout', async ({ page }) => {
    await page.goto('/checkout')
    await expect(page.getByText(/carrinho está vazio/i)).toBeVisible()
  })

  test('checkout com itens mostra dados, resumo e frete sem valor fictício', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem(
        'terraestilo-cart',
        JSON.stringify([
          {
            id: 'checkout-preview-product',
            lineId: 'checkout-preview-product::variant-1::M::',
            name: 'Camiseta Premium',
            price: 129.9,
            image: '/images/categorias/camisas.jpg',
            selectedSize: 'M',
            variantId: 'variant-1',
            qty: 2,
          },
          {
            id: 'checkout-preview-product-2',
            lineId: 'checkout-preview-product-2::variant-2::G::',
            name: 'Jaqueta Campo',
            price: 249.9,
            image: '/images/categorias/jaquetas-masculinas.jpg',
            selectedSize: 'G',
            variantId: 'variant-2',
            qty: 1,
          },
        ]),
      )
    })
    await page.goto('/checkout')

    await expect(page.getByRole('heading', { name: 'Seus dados' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Resumo' })).toBeVisible()
    await expect(page.getByText('Subtotal (3 itens)')).toBeVisible()
    await expect(page.getByText('A calcular')).toBeVisible()
    await expect(page.getByText('Quantidade: 2')).toBeVisible()
    await expect(page.getByText('Quantidade: 1')).toBeVisible()
    await expect(page.getByRole('button', { name: /finalizar pedido/i })).toBeEnabled()

    await page.getByLabel('Telefone / WhatsApp').fill('54999999999')
    await expect(page.getByLabel('Telefone / WhatsApp')).toHaveValue('(54) 99999-9999')
    await page.getByLabel('CPF (opcional)').fill('12345678901')
    await expect(page.getByLabel('CPF (opcional)')).toHaveValue('123.456.789-01')
    await page.getByLabel('CEP').fill('95000000')
    await expect(page.getByLabel('CEP')).toHaveValue('95000-000')
    await page.getByRole('button', { name: /finalizar pedido/i }).click()
    await expect(page.locator('.checkout-error[role="alert"]')).toContainText(
      'Informe o nome completo.',
    )
  })
})
