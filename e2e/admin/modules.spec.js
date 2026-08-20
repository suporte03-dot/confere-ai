import { test, expect } from '@playwright/test'

const adminEmail = process.env.E2E_ADMIN_EMAIL
const adminPassword = process.env.E2E_ADMIN_PASSWORD

async function loginAsAdmin(page) {
  await page.goto('/admin/login')
  await page.getByRole('textbox', { name: 'E-mail' }).fill(adminEmail)
  await page.getByRole('textbox', { name: 'Senha' }).fill(adminPassword)
  await page.getByRole('button', { name: 'Entrar' }).click()
  await expect(page).toHaveURL(/\/admin$/)
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
    await expect(page.getByRole('heading', { name: /Estoque/i })).toBeVisible()
  })

  test('account page shows user info', async ({ page }) => {
    await loginAsAdmin(page)
    await page.goto('/admin/minha-conta')
    await expect(page.getByText(adminEmail)).toBeVisible()
    await expect(page.getByText(/Administrador|Proprietário|Owner/i)).toBeVisible()
  })

  test('create and delete audit test product', async ({ page }) => {
    await loginAsAdmin(page)
    const stamp = Date.now()
    const productName = `[TESTE AUDIT] Produto ${stamp}`

    await page.goto('/admin/produtos/novo')
    await page.getByLabel(/^Nome$/i).fill(productName)
    await page.getByLabel(/^Preço/i).fill('99,90')
    await page.getByRole('button', { name: /Salvar produto/i }).click()

    await expect(page.getByText(/Produto salvo/i)).toBeVisible({ timeout: 15_000 })
    await expect(page).toHaveURL(/\/admin\/produtos\//)

    page.once('dialog', (dialog) => dialog.accept())
    await page.getByRole('button', { name: 'Excluir teste' }).click()
    await expect(page).toHaveURL(/\/admin\/produtos$/)
    await expect(page.getByText(productName)).toHaveCount(0)
  })
})
