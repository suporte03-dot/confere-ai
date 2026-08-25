import { test, expect } from '@playwright/test'

test.describe('Admin auth (public routes)', () => {
  test('login page loads', async ({ page }) => {
    await page.goto('/admin/login')
    await expect(page.getByRole('heading', { name: 'Área administrativa' })).toBeVisible()
    await expect(page.getByRole('textbox', { name: 'E-mail' })).toBeVisible()
    await expect(page.getByRole('textbox', { name: 'Senha' })).toBeVisible()
  })

  test('wrong credentials show error', async ({ page }) => {
    await page.goto('/admin/login')
    await page.getByRole('textbox', { name: 'E-mail' }).fill('naoexiste@teste.com')
    await page.getByRole('textbox', { name: 'Senha' }).fill('senhaerrada123')
    await page.getByRole('button', { name: 'Entrar' }).click()
    await expect(page.getByText('Não foi possível entrar. Verifique e-mail e senha.')).toBeVisible()
  })

  test('protected /admin redirects to login when unauthenticated', async ({ page }) => {
    await page.goto('/admin')
    await expect(page).toHaveURL(/\/admin\/login/)
  })

  test('protected product routes redirect to login', async ({ page }) => {
    await page.goto('/admin/produtos')
    await expect(page).toHaveURL(/\/admin\/login/)
  })

  test('protected desempenho redirects to login when unauthenticated', async ({ page }) => {
    await page.goto('/admin/desempenho')
    await expect(page).toHaveURL(/\/admin\/login/)
  })

  test('recover password page loads', async ({ page }) => {
    await page.goto('/admin/recuperar-senha')
    await expect(page.getByRole('heading', { name: 'Esqueci minha senha' })).toBeVisible()
  })
})

const adminEmail = process.env.E2E_ADMIN_EMAIL
const adminPassword = process.env.E2E_ADMIN_PASSWORD

test.describe('Admin auth (authenticated)', () => {
  test.skip(!adminEmail || !adminPassword, 'Set E2E_ADMIN_EMAIL and E2E_ADMIN_PASSWORD in .env.local')

  test('login succeeds and reaches dashboard', async ({ page }) => {
    await page.goto('/admin/login')
  await page.getByRole('textbox', { name: 'E-mail' }).fill(adminEmail)
  await page.getByRole('textbox', { name: 'Senha' }).fill(adminPassword)
    await page.getByRole('button', { name: 'Entrar' }).click()
    await expect(page).toHaveURL(/\/admin$/, { timeout: 20_000 })
    await expect(page.getByRole('heading', { name: 'Gestão Terra & Estilo', level: 1 })).toBeVisible()
  })

  test('logout returns to login', async ({ page }) => {
    await page.goto('/admin/login')
  await page.getByRole('textbox', { name: 'E-mail' }).fill(adminEmail)
  await page.getByRole('textbox', { name: 'Senha' }).fill(adminPassword)
    await page.getByRole('button', { name: 'Entrar' }).click()
    await expect(page).toHaveURL(/\/admin$/, { timeout: 20_000 })

    await page.goto('/admin/minha-conta')
    await page.getByRole('button', { name: /Sair da conta/i }).click()
    await expect(page).toHaveURL(/\/admin\/login/)
  })
})
