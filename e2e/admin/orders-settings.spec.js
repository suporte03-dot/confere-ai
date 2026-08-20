import { test, expect } from '@playwright/test'

const hasAdminCreds = Boolean(
  process.env.E2E_ADMIN_EMAIL && process.env.E2E_ADMIN_PASSWORD,
)

test.describe('Admin pedidos e configurações', () => {
  test.skip(!hasAdminCreds, 'Defina E2E_ADMIN_EMAIL e E2E_ADMIN_PASSWORD')

  test.beforeEach(async ({ page }) => {
    await page.goto('/admin/login')
    await page.getByLabel(/e-?mail/i).fill(process.env.E2E_ADMIN_EMAIL)
    await page.getByLabel(/senha/i).fill(process.env.E2E_ADMIN_PASSWORD)
    await page.getByRole('button', { name: /entrar/i }).click()
    await expect(page).toHaveURL(/\/admin$/, { timeout: 20000 })
  })

  test('pedidos carrega', async ({ page }) => {
    await page.goto('/admin/pedidos')
    await expect(page.getByRole('heading', { name: /pedidos/i })).toBeVisible()
  })

  test('configurações carrega formulário Pix', async ({ page }) => {
    await page.goto('/admin/configuracoes')
    await expect(page.getByRole('heading', { name: /configurações/i })).toBeVisible()
    await expect(page.getByText(/chave pix/i).first()).toBeVisible()
  })
})
