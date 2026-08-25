import { test, expect } from '@playwright/test'

test.describe('Admin menu modules', () => {
  test.skip(
    !process.env.E2E_ADMIN_EMAIL || !process.env.E2E_ADMIN_PASSWORD,
    'Defina E2E_ADMIN_EMAIL e E2E_ADMIN_PASSWORD',
  )

  test.beforeEach(async ({ page }) => {
    await page.goto('/admin/login')
    await page.getByLabel(/e-?mail/i).fill(process.env.E2E_ADMIN_EMAIL)
    await page.getByLabel(/senha/i).fill(process.env.E2E_ADMIN_PASSWORD)
    await page.getByRole('button', { name: /entrar/i }).click()
    await expect(page).toHaveURL(/\/admin\/?$/, { timeout: 20000 })
  })

  test('sidebar inclui Pedidos, Configurações e Desempenho', async ({ page }) => {
    const nav = page.locator('.admin-sidebar__nav')
    await expect(nav.getByRole('link', { name: 'Pedidos' })).toBeVisible()
    await expect(nav.getByRole('link', { name: 'Configurações' })).toBeVisible()
    await expect(nav.getByRole('link', { name: 'Produtos' })).toBeVisible()
    await expect(nav.getByRole('link', { name: 'Desempenho' })).toBeVisible()
    await expect(nav.getByRole('link', { name: 'Minha Conta' })).toBeVisible()
  })

  test('rotas pedidos, configurações e desempenho carregam', async ({ page }) => {
    await page.goto('/admin/pedidos')
    await expect(page.getByRole('heading', { name: /pedidos/i })).toBeVisible()
    await page.goto('/admin/configuracoes')
    await expect(page.getByRole('heading', { name: /configurações/i })).toBeVisible()
    await expect(page.getByText(/chave pix/i).first()).toBeVisible()
    await page.goto('/admin/desempenho')
    await expect(page.getByRole('heading', { name: /Desempenho da Loja/i })).toBeVisible()
  })
})
