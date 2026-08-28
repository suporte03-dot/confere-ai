import { test, expect } from '@playwright/test'

const adminEmail = process.env.E2E_ADMIN_EMAIL
const adminPassword = process.env.E2E_ADMIN_PASSWORD

async function loginAsAdmin(page) {
  await page.goto('/admin/login')
  await page.getByRole('textbox', { name: 'E-mail' }).fill(adminEmail)
  await page.getByRole('textbox', { name: 'Senha' }).fill(adminPassword)
  await page.getByRole('button', { name: 'Entrar' }).click()
  await expect(page).toHaveURL(/\/admin$/, { timeout: 20_000 })
}

test.describe('Admin modules (authenticated)', () => {
  test.skip(!adminEmail || !adminPassword, 'Set E2E_ADMIN_EMAIL and E2E_ADMIN_PASSWORD in .env.local')

  test('dashboard KPIs and shortcuts', async ({ page }) => {
    await loginAsAdmin(page)
    await expect(page.getByLabel('Indicadores da loja')).toBeVisible()
    await expect(page.getByRole('link', { name: /Gerenciar produtos/i })).toBeVisible()
  })

  test('products list opens', async ({ page }) => {
    await loginAsAdmin(page)
    await page.getByRole('link', { name: /Gerenciar produtos/i }).click()
    await expect(page).toHaveURL(/\/admin\/produtos/)
    await expect(page.getByRole('heading', { name: /Produtos/i })).toBeVisible()
  })

  test('categories list opens', async ({ page }) => {
    await loginAsAdmin(page)
    await page.goto('/admin/categorias')
    await expect(page.getByRole('heading', { name: /Categorias/i })).toBeVisible()
  })

  test('collections list opens', async ({ page }) => {
    await loginAsAdmin(page)
    await page.goto('/admin/colecoes')
    await expect(page.getByRole('heading', { name: /Coleções/i })).toBeVisible()
  })

  test('stock monitor opens', async ({ page }) => {
    await loginAsAdmin(page)
    await page.goto('/admin/estoque')
    await expect(page.getByRole('heading', { name: 'Estoque', level: 1 })).toBeVisible()
  })

  test('desempenho dashboard opens with period filters', async ({ page }) => {
    await loginAsAdmin(page)
    await page.goto('/admin/desempenho')
    await expect(page.getByRole('heading', { name: /Desempenho da Loja/i })).toBeVisible()
    await expect(page.getByLabel('Indicadores principais')).toBeVisible()
    await expect(page.getByRole('button', { name: '30 dias' })).toBeVisible()
    await page.getByRole('button', { name: '7 dias' }).click()
    await expect(page).toHaveURL(/periodo=7d/)
    await expect(page.getByText(/Faturamento/i).first()).toBeVisible()
  })

  test('account page shows user info', async ({ page }) => {
    await loginAsAdmin(page)
    await page.goto('/admin/minha-conta')
    await expect(page.getByText(adminEmail)).toBeVisible()
    await expect(page.getByRole('article').getByText(/Administrador|Proprietário|Owner/i)).toBeVisible()
  })

  test('create and delete audit test product', async ({ page }) => {
    test.setTimeout(60_000)
    await loginAsAdmin(page)
    const stamp = Date.now()
    const productName = `[TESTE AUDIT] Produto ${stamp}`

    await page.goto('/admin/produtos/novo')
    const nameInput = page.getByRole('textbox', { name: /^Nome/i }).first()
    await expect(nameInput).toBeVisible({ timeout: 15_000 })
    await nameInput.fill(productName)
    await page.getByLabel(/^Preço atual/i).fill('99,90')
    await page.getByRole('button', { name: /Salvar produto/i }).click()

    await expect(page.getByText(/Produto salvo/i)).toBeVisible({ timeout: 15_000 })
    await expect(page).toHaveURL(/\/admin\/produtos\//)

    page.once('dialog', (dialog) => dialog.accept())
    await page.getByRole('button', { name: 'Excluir teste' }).click()
    await expect(page).toHaveURL(/\/admin\/produtos$/)
    await expect(page.getByText(productName)).toHaveCount(0)
  })

  test('product image lifecycle uses Storage and cleans the audit product', async ({ page }) => {
    test.setTimeout(90_000)
    await loginAsAdmin(page)
    const stamp = Date.now()
    const productName = `[TESTE AUDIT] Imagens ${stamp}`
    let productCreated = false

    try {
      await page.goto('/admin/produtos/novo')
      await page.getByRole('textbox', { name: /^Nome/i }).first().fill(productName)
      await page.getByLabel(/^Preço atual/i).fill('89,90')
      await page.getByRole('button', { name: /Salvar produto/i }).click()

      await expect(page.getByText(/Produto salvo/i)).toBeVisible({ timeout: 20_000 })
      await expect(page).toHaveURL(/\/admin\/produtos\/(?!novo(?:\/|$))/)
      productCreated = true

      const imageInput = page.locator(
        'input[type="file"][accept="image/jpeg,image/png,image/webp"][multiple]',
      )
      await imageInput.setInputFiles(['public/favicon.png', 'public/favicon.png'])
      await expect(page.getByText('Imagem enviada.').last()).toBeVisible({ timeout: 30_000 })
      const savedPhotos = page.locator(
        '.admin-photo:not(.admin-photo--pending):not(.admin-photo--add)',
      )
      await expect(savedPhotos).toHaveCount(2)
      await expect(
        savedPhotos.locator(
          'img[src*="/storage/v1/object/public/product-images/products/"][src$=".webp"]',
        ),
      ).toHaveCount(2)

      const coverButtons = page
        .locator('.admin-photo:not(.admin-photo--pending):not(.admin-photo--add)')
        .getByRole('button', { name: 'Definir capa' })
      await coverButtons.first().click()
      await expect(page.locator('.admin-photo.is-cover')).toHaveCount(1)

      page.once('dialog', (dialog) => dialog.accept())
      await page
        .locator('.admin-photo:not(.admin-photo--pending):not(.admin-photo--add)')
        .getByRole('button', { name: 'Excluir' })
        .first()
        .click()
      await expect(savedPhotos).toHaveCount(1)
    } finally {
      if (productCreated) {
        page.once('dialog', (dialog) => dialog.accept())
        await page.getByRole('button', { name: 'Excluir teste' }).click()
        await expect(page).toHaveURL(/\/admin\/produtos$/)
      }
    }
  })
})
