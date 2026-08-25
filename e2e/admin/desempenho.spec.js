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

test.describe('Admin desempenho', () => {
  test.skip(!adminEmail || !adminPassword, 'Set E2E_ADMIN_EMAIL and E2E_ADMIN_PASSWORD in .env.local')

  test('página carrega cards, gráficos e links operacionais', async ({ page }) => {
    await loginAsAdmin(page)
    await page.goto('/admin/desempenho')

    await expect(page.getByRole('heading', { name: 'Desempenho da Loja' })).toBeVisible()
    await expect(page.getByLabel('Indicadores principais')).toBeVisible()
    await expect(page.getByLabel('Pedidos aguardando ação')).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Faturamento por dia' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Pedidos por status' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Produtos mais vendidos' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Estoque em atenção' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Vendas por categoria' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Desempenho das coleções' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Últimos pedidos' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Hoje' })).toBeVisible()

    await expect(
      page.getByRole('link', { name: /Ver pedidos aguardando pagamento|Aguardando pagamento/i }).first(),
    ).toBeVisible()
    await expect(page.getByRole('link', { name: /Gerenciar estoque/i })).toBeVisible()

    await page.getByRole('button', { name: 'Hoje' }).click()
    await expect(page).toHaveURL(/periodo=today/)
    await page.getByRole('button', { name: 'Este mês' }).click()
    await expect(page).toHaveURL(/periodo=month/)
  })

  test('viewport mobile não gera overflow horizontal crítico', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await loginAsAdmin(page)
    await page.goto('/admin/desempenho')
    await expect(page.getByRole('heading', { name: 'Desempenho da Loja' })).toBeVisible()

    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth)
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth)
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 8)
  })
})
