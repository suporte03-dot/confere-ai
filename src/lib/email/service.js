import nodemailer from 'nodemailer'
import { createClient } from '../supabase/server'
import { createPublicClient } from '../supabase/public'
import { fetchStoreSettings } from '../store/settings'
import { absoluteUrl } from '../seo/site'
import { getSmtpStatus, smtpConfig } from './config'

const EMAIL_EVENTS = new Set([
  'order_created',
  'payment_confirmed',
  'shipped',
  'delivered',
  'cancelled',
])

function createTransport() {
  const config = smtpConfig()
  if (!getSmtpStatus().configured) return null

  return nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: { user: config.user, pass: config.pass },
  })
}

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}

function formatMoney(value) {
  return (Number(value) || 0).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}

function formatDate(value) {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleString('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
    timeZone: 'America/Sao_Paulo',
  })
}

function maskEmail(value) {
  const [name, domain] = String(value || '').split('@')
  if (!domain) return '—'
  return `${(name || '').slice(0, 2)}***@${domain}`
}

function eventLabel(eventType) {
  return {
    order_created: 'Pedido recebido',
    payment_confirmed: 'Pagamento confirmado',
    shipped: 'Envio',
    delivered: 'Entrega',
    cancelled: 'Cancelamento',
  }[eventType] || 'Atualização do pedido'
}

function itemRows(items = []) {
  return items
    .map((item) => {
      const name = escapeHtml(item.product_name || item.name || 'Produto')
      const variant = item.variant_label
        ? `<small>${escapeHtml(item.variant_label)}</small>`
        : ''
      return `
        <tr>
          <td style="padding:12px 0;border-bottom:1px solid #e8dfd2;color:#272019;font-size:14px;">
            <strong>${name}</strong>${variant}
          </td>
          <td style="padding:12px 0;border-bottom:1px solid #e8dfd2;color:#746d64;font-size:13px;text-align:center;">
            ${escapeHtml(item.quantity)}
          </td>
          <td style="padding:12px 0;border-bottom:1px solid #e8dfd2;color:#272019;font-size:14px;text-align:right;">
            ${formatMoney(item.line_total)}
          </td>
        </tr>`
    })
    .join('')
}

function emailLayout({ title, intro, content, cta }) {
  return `<!doctype html>
  <html lang="pt-BR">
    <body style="margin:0;background:#171008;color:#272019;font-family:Arial,Helvetica,sans-serif;">
      <div style="width:100%;padding:28px 12px;background:#171008;">
        <div style="max-width:620px;margin:0 auto;overflow:hidden;background:#faf7f0;">
          <header style="padding:24px 30px;background:#0b0906;color:#faf7f0;border-bottom:2px solid #c99728;">
            <img src="${absoluteUrl('/images/brand/logo-terraestilo-header-transparent.png')}" alt="Terra &amp; Estilo" width="170" style="display:block;max-width:100%;height:auto;">
            <div style="margin-top:6px;color:#d6a62d;font-size:10px;letter-spacing:2px;text-transform:uppercase;">Essência em cada detalhe</div>
          </header>
          <main style="padding:34px 30px 30px;">
            <div style="color:#a77816;font-size:11px;font-weight:bold;letter-spacing:2px;text-transform:uppercase;">Terra &amp; Estilo</div>
            <h1 style="margin:8px 0 12px;color:#272019;font-family:Georgia,serif;font-size:30px;font-weight:normal;">${escapeHtml(title)}</h1>
            <p style="margin:0 0 24px;color:#746d64;font-size:15px;line-height:1.65;">${intro}</p>
            ${content}
            ${cta ? `<p style="margin:26px 0 0;"><a href="${escapeHtml(cta.href)}" style="display:inline-block;padding:13px 20px;background:#c99728;color:#171008;font-size:12px;font-weight:bold;letter-spacing:1px;text-decoration:none;text-transform:uppercase;">${escapeHtml(cta.label)}</a></p>` : ''}
          </main>
          <footer style="padding:22px 30px;background:#0b0906;color:#b8afa3;font-size:11px;line-height:1.6;">
            <strong style="color:#faf7f0;">Terra &amp; Estilo</strong><br>
            Essência em cada detalhe.<br>
            <a href="${absoluteUrl('/')}" style="color:#d6a62d;text-decoration:none;">Site</a>
            &nbsp;·&nbsp;
            <a href="${absoluteUrl('/contato')}" style="color:#d6a62d;text-decoration:none;">Contato</a>
          </footer>
        </div>
      </div>
    </body>
  </html>`
}

function orderContent(order, eventType, payment) {
  const number = escapeHtml(order.order_number || '—')
  const customerName = escapeHtml(order.customer_name || 'cliente')
  const items = itemRows(order.items)
  const total = formatMoney(order.total)
  const subtotal = formatMoney(order.subtotal)
  const pixContent =
    eventType === 'order_created' && payment?.pixKey
      ? `
        <div style="margin-top:22px;padding:16px;background:#f1ece4;border-left:3px solid #c99728;">
          <strong style="display:block;color:#272019;font-size:13px;">Pagamento por Pix</strong>
          <span style="display:block;margin-top:8px;color:#746d64;font-size:12px;">Valor: <strong style="color:#272019;">${total}</strong></span>
          <span style="display:block;margin-top:5px;color:#746d64;font-size:12px;">Chave Pix: <strong style="color:#272019;">${escapeHtml(payment.pixKey)}</strong></span>
          ${payment.pixInstructions ? `<span style="display:block;margin-top:8px;color:#746d64;font-size:12px;">${escapeHtml(payment.pixInstructions)}</span>` : ''}
          <p style="margin:12px 0 0;color:#746d64;font-size:12px;">Após realizar o pagamento, aguarde a confirmação da nossa equipe.</p>
        </div>`
      : ''

  const copy = {
    order_created: `Olá, ${customerName}. Recebemos o seu pedido e ele está aguardando a confirmação do pagamento.`,
    payment_confirmed: `Olá, ${customerName}. O pagamento foi confirmado e seu pedido agora seguirá para preparação.`,
    shipped: `Olá, ${customerName}. Seu pedido foi enviado e está a caminho.`,
    delivered: `Olá, ${customerName}. Seu pedido foi entregue. Agradecemos pela sua compra!`,
    cancelled: `Olá, ${customerName}. Seu pedido foi cancelado. Caso precise de ajuda, fale conosco pelos nossos canais de atendimento.`,
  }[eventType]

  return {
    intro: copy,
    content: `
      <div style="padding:16px;background:#f1ece4;">
        <table role="presentation" style="width:100%;border-collapse:collapse;font-size:13px;">
          <tr><td style="padding:4px 0;color:#746d64;">Número</td><td style="padding:4px 0;text-align:right;color:#272019;font-weight:bold;">${number}</td></tr>
          <tr><td style="padding:4px 0;color:#746d64;">Data</td><td style="padding:4px 0;text-align:right;color:#272019;">${formatDate(order.created_at)}</td></tr>
          <tr><td style="padding:4px 0;color:#746d64;">Status</td><td style="padding:4px 0;text-align:right;color:#272019;">${escapeHtml(eventLabel(eventType))}</td></tr>
        </table>
      </div>
      <h2 style="margin:28px 0 8px;color:#272019;font-family:Georgia,serif;font-size:20px;font-weight:normal;">Produtos</h2>
      <table role="presentation" style="width:100%;border-collapse:collapse;">
        <thead><tr><th style="padding:0 0 7px;text-align:left;color:#746d64;font-size:11px;font-weight:normal;text-transform:uppercase;">Item</th><th style="padding:0 0 7px;color:#746d64;font-size:11px;font-weight:normal;">Qtd.</th><th style="padding:0 0 7px;text-align:right;color:#746d64;font-size:11px;font-weight:normal;">Total</th></tr></thead>
        <tbody>${items}</tbody>
      </table>
      <div style="margin-top:18px;margin-left:auto;max-width:270px;color:#746d64;font-size:13px;line-height:1.8;">
        <div><span>Subtotal</span><strong style="float:right;color:#272019;">${subtotal}</strong></div>
        <div><span>Frete</span><strong style="float:right;color:#a77816;">A calcular</strong></div>
        <div style="margin-top:8px;padding-top:8px;border-top:1px solid #d9cebf;color:#272019;font-size:16px;"><strong>Total</strong><strong style="float:right;">${total}</strong></div>
      </div>
      ${pixContent}`,
  }
}

function adminContent(order) {
  const rows = (order.items || [])
    .map(
      (item) =>
        `<li style="padding:5px 0;color:#746d64;font-size:13px;">${escapeHtml(item.quantity)}× ${escapeHtml(item.product_name || 'Produto')} — ${formatMoney(item.line_total)}</li>`,
    )
    .join('')

  return `
    <div style="padding:18px;background:#f1ece4;">
      <p style="margin:0 0 8px;color:#746d64;font-size:13px;">Cliente <strong style="color:#272019;">${escapeHtml(order.customer_name)}</strong></p>
      <p style="margin:0 0 8px;color:#746d64;font-size:13px;">Telefone <strong style="color:#272019;">${escapeHtml(order.customer_phone)}</strong></p>
      <p style="margin:0;color:#746d64;font-size:13px;">Total <strong style="color:#272019;">${formatMoney(order.total)}</strong></p>
    </div>
    <h2 style="margin:26px 0 8px;color:#272019;font-family:Georgia,serif;font-size:20px;font-weight:normal;">Produtos</h2>
    <ul style="margin:0;padding-left:18px;">${rows}</ul>`
}

async function claimEvent({ orderId, eventType, recipient, force = false }) {
  const supabase = await createClient()
  const { data, error } = await supabase.rpc('claim_order_email_event', {
    p_order_id: orderId,
    p_event_type: eventType,
    p_recipient: recipient,
    p_force: force,
  })
  if (error) return { ok: false, error: 'Não foi possível registrar o evento de e-mail.', code: 'claim_failed' }
  if (!data?.ok) return { ok: false, error: data?.error || 'Não foi possível registrar o evento de e-mail.' }
  return data
}

async function completeEvent(eventId, success, code = null) {
  try {
    const supabase = await createClient()
    await supabase.rpc('complete_order_email_event', {
      p_event_id: eventId,
      p_status: success ? 'sent' : 'failed',
      p_error_code: code,
    })
  } catch {
    // The delivery result is still reflected by the SMTP attempt.
  }
}

async function sendClaimedEvent({ event, order, eventType, admin = false, payment = null }) {
  if (event.status === 'sent') return { ok: true, status: 'sent', skipped: true }
  const transport = createTransport()
  if (!transport) {
    await completeEvent(event.id, false, 'smtp_not_configured')
    return { ok: false, status: 'failed', error: 'SMTP não configurado.', code: 'smtp_not_configured' }
  }

  const config = smtpConfig()
  const content = admin ? { intro: 'Um novo pedido foi criado na loja.', content: adminContent(order) } : orderContent(order, eventType, payment)
  const subject = admin
    ? `NOVO PEDIDO — ${order.order_number}`
    : `Terra & Estilo | ${eventLabel(eventType)} — ${order.order_number}`

  try {
    await transport.sendMail({
      from: { name: config.fromName, address: config.fromEmail },
      to: event.recipient,
      subject,
      text: `${content.intro}\n\nPedido: ${order.order_number}\nTotal: ${formatMoney(order.total)}`,
      html: emailLayout({
        title: admin ? 'Novo pedido recebido' : eventLabel(eventType),
        intro: content.intro,
        content: content.content,
        cta: admin ? { label: 'Abrir pedido no ADM', href: absoluteUrl(`/admin/pedidos/${order.id}`) } : null,
      }),
    })
    await completeEvent(event.id, true)
    return { ok: true, status: 'sent' }
  } catch (error) {
    const code = String(error?.code || 'smtp_error').replace(/[^A-Za-z0-9_-]/g, '').slice(0, 40) || 'smtp_error'
    console.error('[email] delivery failed', { event: eventType, recipient: maskEmail(event.recipient), code })
    await completeEvent(event.id, false, code)
    return { ok: false, status: 'failed', error: 'Não foi possível enviar o e-mail.', code }
  }
}

async function fetchPublicOrder(publicToken) {
  const supabase = createPublicClient()
  const { data, error } = await supabase.rpc('get_order_by_public_token', {
    p_token: publicToken,
  })
  return error || !data?.ok ? null : data.order
}

export async function dispatchOrderCreatedEmails({ orderId, publicToken, phone = '' }) {
  try {
    const [order, settings] = await Promise.all([
      fetchPublicOrder(publicToken),
      fetchStoreSettings(),
    ])
    if (!order?.customer_email) return { ok: false, error: 'Pedido sem e-mail do cliente.' }

    const snapshot = {
      ...order,
      id: orderId,
      customer_phone: phone,
      items: order.items || [],
    }
    const results = []
    const customerClaim = await claimEvent({
      orderId,
      eventType: 'order_created',
      recipient: order.customer_email,
    })
    if (customerClaim.ok) {
      results.push(await sendClaimedEvent({
        event: customerClaim.event,
        order: snapshot,
        eventType: 'order_created',
        payment: {
          pixKey: settings.pix_key,
          pixInstructions: settings.pix_instructions,
        },
      }))
    }

    if (settings.commercial_email) {
      const adminClaim = await claimEvent({
        orderId,
        eventType: 'order_created',
        recipient: settings.commercial_email,
      })
      if (adminClaim.ok) {
        results.push(await sendClaimedEvent({
          event: adminClaim.event,
          order: snapshot,
          eventType: 'order_created',
          admin: true,
        }))
      }
    }
    return { ok: results.every((result) => result.ok), results }
  } catch (error) {
    console.error('[email] order-created dispatch failed', { orderId, code: error?.code || 'dispatch_failed' })
    return { ok: false, error: 'Não foi possível processar os e-mails do pedido.' }
  }
}

async function fetchAdminOrder(orderId) {
  const supabase = await createClient()
  const [{ data: order, error: orderError }, { data: items, error: itemsError }] = await Promise.all([
    supabase.from('orders').select('*').eq('id', orderId).maybeSingle(),
    supabase.from('order_items').select('*').eq('order_id', orderId).order('created_at', { ascending: true }),
  ])
  if (orderError || itemsError || !order) return null
  return { ...order, items: items || [] }
}

export async function dispatchOrderEmailEvent({ orderId, eventType, force = false }) {
  if (!EMAIL_EVENTS.has(eventType) || eventType === 'order_created') {
    return { ok: false, error: 'Evento de e-mail inválido.' }
  }
  try {
    const order = await fetchAdminOrder(orderId)
    if (!order?.customer_email) return { ok: false, error: 'Pedido sem e-mail do cliente.' }
    const claim = await claimEvent({
      orderId,
      eventType,
      recipient: order.customer_email,
      force,
    })
    if (!claim.ok) return claim
    return sendClaimedEvent({ event: claim.event, order, eventType })
  } catch {
    return { ok: false, error: 'Não foi possível processar o e-mail do pedido.' }
  }
}

export async function sendTestEmail(recipient) {
  const target = String(recipient || '').trim().toLowerCase()
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(target)) {
    return { ok: false, error: 'Informe um endereço de e-mail válido.' }
  }
  const transport = createTransport()
  if (!transport) return { ok: false, error: 'SMTP não configurado. Preencha as variáveis do ambiente.' }

  const config = smtpConfig()
  try {
    await transport.sendMail({
      from: { name: config.fromName, address: config.fromEmail },
      to: target,
      subject: 'Terra & Estilo | Teste de e-mail',
      text: 'Este é um e-mail de teste do Terra & Estilo.',
      html: emailLayout({
        title: 'E-mail de teste',
        intro: 'A configuração SMTP da Terra & Estilo respondeu corretamente.',
        content: '<div style="padding:18px;background:#f1ece4;color:#746d64;font-size:14px;">Este é um teste controlado. Nenhum pedido foi alterado.</div>',
      }),
    })
    return { ok: true, message: 'E-mail de teste enviado com sucesso.' }
  } catch (error) {
    const code = String(error?.code || 'smtp_error').replace(/[^A-Za-z0-9_-]/g, '').slice(0, 40) || 'smtp_error'
    console.error('[email] test delivery failed', { recipient: maskEmail(target), code })
    return { ok: false, error: 'Não foi possível enviar o e-mail de teste.' }
  }
}
