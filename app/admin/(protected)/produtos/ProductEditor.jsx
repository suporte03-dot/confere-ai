'use client'

import { useEffect, useRef, useState, useTransition } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import { productImagePublicUrl } from '../../../../src/lib/admin/format'
import { slugify } from '../../../../src/lib/admin/slugify'
import {
  buildProductImagePath,
  formatImageBytes,
  removeStorageObject,
  uploadImageToBucket,
  validateImageFile,
} from '../../../../src/lib/admin/product-image-upload'
import { createClient } from '../../../../src/lib/supabase/client'
import {
  attachProductImage,
  checkProductSlug,
  deleteProductImage,
  reorderProductImages,
  replaceProductImage,
  saveProduct,
  setProductCoverImage,
  deleteProduct,
} from './actions'
import { isAuditTestRecord } from '../../../../src/lib/admin/test-records'

const AiAssistPanel = dynamic(() => import('./AiAssistPanel'), { ssr: false })

function moneyToInput(value) {
  if (value == null || value === '') return ''
  const n = Number(value)
  if (!Number.isFinite(n)) return ''
  return n.toFixed(2).replace('.', ',')
}

function createVariantDraft(seed = {}) {
  return {
    id: seed.id || null,
    _key: seed._key || `tmp-${Math.random().toString(36).slice(2, 10)}`,
    size: seed.size || '',
    color: seed.color || '',
    stock: seed.stock ?? 0,
    sku: seed.sku || '',
  }
}

function AiHint({ show }) {
  if (!show) return null
  return <span className="admin-ai-hint">✨ Sugerido pela IA</span>
}

export default function ProductEditor({
  mode = 'create',
  readOnly = false,
  product = null,
  categories = [],
  collections = [],
  highlightVariantId = '',
  aiEnabled = false,
}) {
  const router = useRouter()
  const fileInputRef = useRef(null)
  const replaceInputRef = useRef(null)
  const replaceTargetRef = useRef(null)
  const [pending, startTransition] = useTransition()

  const [name, setName] = useState(product?.name || '')
  const [slug, setSlug] = useState(product?.slug || '')
  const [slugTouched, setSlugTouched] = useState(Boolean(product?.slug))
  const [description, setDescription] = useState(product?.description || '')
  const [price, setPrice] = useState(moneyToInput(product?.price))
  const [compareAtPrice, setCompareAtPrice] = useState(
    moneyToInput(product?.compare_at_price),
  )
  const [categoryId, setCategoryId] = useState(product?.category_id || '')
  const [collectionId, setCollectionId] = useState(product?.collection_id || '')
  const [active, setActive] = useState(product?.active ?? false)
  const [featured, setFeatured] = useState(product?.featured ?? false)
  const [sku, setSku] = useState(product?.sku || '')
  const [variants, setVariants] = useState(
    (product?.product_variants || []).map((v) => createVariantDraft(v)),
  )
  const [images, setImages] = useState(product?.product_images || [])
  const [productId, setProductId] = useState(product?.id || null)

  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [slugHint, setSlugHint] = useState('')
  const [busyImage, setBusyImage] = useState(false)
  const [uploads, setUploads] = useState([])
  const [aiHints, setAiHints] = useState({})

  const isView = readOnly || mode === 'view'

  useEffect(() => {
    if (!message && !error) return undefined
    const timer = setTimeout(() => {
      setMessage('')
      setError('')
    }, 4500)
    return () => clearTimeout(timer)
  }, [message, error])

  useEffect(() => {
    if (!slug || isView) return undefined

    let cancelled = false
    const timer = setTimeout(async () => {
      const result = await checkProductSlug(slug, productId)
      if (cancelled) return
      if (!result.ok) {
        setSlugHint('Não foi possível validar o slug.')
        return
      }
      setSlugHint(
        result.available
          ? 'Slug disponível.'
          : 'Este slug já está em uso. Escolha outro.',
      )
    }, 350)

    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [slug, productId, isView])

  useEffect(() => {
    if (!highlightVariantId) return undefined
    const node = document.querySelector(
      `[data-variant-id="${CSS.escape(highlightVariantId)}"]`,
    )
    if (!node) return undefined
    node.scrollIntoView({ behavior: 'smooth', block: 'center' })
    return undefined
  }, [highlightVariantId, variants.length])

  function onNameChange(value) {
    setName(value)
    setAiHints((prev) => ({ ...prev, name: false }))
    if (!slugTouched && !isView) {
      setSlug(slugify(value))
      setAiHints((prev) => ({ ...prev, slug: false }))
    }
  }

  function onSlugChange(value) {
    setSlugTouched(true)
    setSlug(slugify(value))
    setAiHints((prev) => ({ ...prev, slug: false }))
  }

  function updateVariant(key, field, value) {
    setVariants((prev) =>
      prev.map((row) => (row._key === key ? { ...row, [field]: value } : row)),
    )
    if (field === 'color' || field === 'size') {
      setAiHints((prev) => ({ ...prev, [field]: false }))
    }
  }

  function addVariant() {
    setVariants((prev) => [...prev, createVariantDraft()])
  }

  function removeVariant(key) {
    setVariants((prev) => prev.filter((row) => row._key !== key))
  }

  function applyAiSuggestions(suggestion) {
    if (!suggestion || isView) return
    const hints = {}
    if (suggestion.name) {
      setName(suggestion.name)
      hints.name = true
    }
    if (suggestion.slug) {
      setSlugTouched(true)
      setSlug(suggestion.slug)
      hints.slug = true
    } else if (suggestion.name && !slugTouched) {
      setSlug(slugify(suggestion.name))
      hints.slug = true
    }
    if (suggestion.description) {
      setDescription(suggestion.description)
      hints.description = true
    }
    if (suggestion.categoryId) {
      setCategoryId(suggestion.categoryId)
      hints.categoryId = true
    }
    if (suggestion.primaryColor || suggestion.detectedSize) {
      setVariants((prev) => {
        if (!prev.length) {
          return [
            createVariantDraft({
              color: suggestion.primaryColor || '',
              size: suggestion.detectedSize || '',
            }),
          ]
        }
        const [first, ...rest] = prev
        return [
          {
            ...first,
            color: suggestion.primaryColor || first.color,
            size: suggestion.detectedSize || first.size,
          },
          ...rest,
        ]
      })
      if (suggestion.primaryColor) hints.color = true
      if (suggestion.detectedSize) hints.size = true
    }
    setAiHints(hints)
    setMessage('Sugestões aplicadas. Revise e salve o produto.')
  }

  function onSave(event) {
    event.preventDefault()
    if (isView) return
    setError('')
    setMessage('')

    if (slugHint.includes('já está em uso')) {
      setError('Este slug já está em uso. Escolha outro.')
      return
    }

    startTransition(async () => {
      const result = await saveProduct({
        id: productId,
        name,
        slug,
        description,
        price,
        compareAtPrice,
        categoryId: categoryId || null,
        collectionId: collectionId || null,
        active,
        featured,
        sku,
        variants,
      })

      if (!result.ok) {
        setError(result.error)
        return
      }

      setMessage(result.message || 'Produto salvo com sucesso.')
      setProductId(result.id)

      if (mode === 'create') {
        router.replace(`/admin/produtos/${result.id}`)
        router.refresh()
        return
      }

      router.refresh()
    })
  }

  async function onDeleteProduct() {
    if (!productId || isView) return
    if (
      !window.confirm(
        `Excluir o produto de teste “${name}”? Esta ação não pode ser desfeita.`,
      )
    ) {
      return
    }
    startTransition(async () => {
      const result = await deleteProduct(productId)
      if (!result.ok) {
        setError(result.error)
        return
      }
      router.replace('/admin/produtos')
      router.refresh()
    })
  }

  async function onPickImages(event) {
    const files = [...(event.target.files || [])]
    event.target.value = ''
    if (!files.length) return

    if (!productId) {
      setError('Salve o produto antes de enviar fotos.')
      return
    }

    const prepared = files.map((file, index) => ({
      key: `${Date.now()}-${index}-${file.name}`,
      file,
      name: file.name,
      size: file.size,
      previewUrl: URL.createObjectURL(file),
      status: 'Preparando imagem...',
      error: validateImageFile(file),
    }))

    const invalid = prepared.find((item) => item.error)
    if (invalid) {
      prepared.forEach((item) => URL.revokeObjectURL(item.previewUrl))
      setError(invalid.error)
      return
    }

    setUploads(prepared)
    setBusyImage(true)
    setError('')
    setMessage('Preparando imagem...')

    const supabase = createClient()
    try {
      for (const item of prepared) {
        setUploads((prev) =>
          prev.map((row) =>
            row.key === item.key ? { ...row, status: 'Enviando imagem...' } : row,
          ),
        )
        setMessage('Enviando imagem...')

        let storagePath = ''
        try {
          storagePath = buildProductImagePath(productId, item.file)
          await uploadImageToBucket(supabase, item.file, storagePath)
        } catch {
          setUploads((prev) =>
            prev.map((row) =>
              row.key === item.key
                ? { ...row, status: 'Não foi possível enviar a imagem.', error: true }
                : row,
            ),
          )
          setError('Não foi possível enviar a imagem.')
          break
        }

        const result = await attachProductImage({
          productId,
          storagePath,
          altText: name || item.name,
        })

        if (!result.ok) {
          await removeStorageObject(supabase, storagePath)
          setUploads((prev) =>
            prev.map((row) =>
              row.key === item.key
                ? { ...row, status: 'Não foi possível enviar a imagem.', error: true }
                : row,
            ),
          )
          setError(result.error || 'Não foi possível enviar a imagem.')
          break
        }

        setImages((prev) => {
          const next = [
            ...prev.map((img) =>
              result.image.is_cover ? { ...img, is_cover: false } : img,
            ),
            {
              ...result.image,
              publicUrl: productImagePublicUrl(result.image.storage_path),
            },
          ]
          return next.sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
        })
        setUploads((prev) =>
          prev.map((row) =>
            row.key === item.key ? { ...row, status: 'Imagem enviada.' } : row,
          ),
        )
        setMessage('Imagem enviada.')
      }
      router.refresh()
    } finally {
      setBusyImage(false)
      window.setTimeout(() => {
        setUploads((prev) => {
          prev.forEach((item) => URL.revokeObjectURL(item.previewUrl))
          return []
        })
      }, 1200)
    }
  }

  async function onSetCover(imageId) {
    if (!productId || isView) return
    setBusyImage(true)
    setError('')
    const result = await setProductCoverImage(productId, imageId)
    setBusyImage(false)
    if (!result.ok) {
      setError(result.error)
      return
    }
    setImages((prev) =>
      prev.map((img) => ({ ...img, is_cover: img.id === imageId })),
    )
    setMessage(result.message || 'Imagem atualizada.')
    router.refresh()
  }

  async function onDeleteImage(imageId) {
    if (isView) return
    const confirmed = window.confirm('Excluir esta imagem?')
    if (!confirmed) return
    setBusyImage(true)
    setError('')
    const result = await deleteProductImage(imageId)
    setBusyImage(false)
    if (!result.ok) {
      setError(result.error)
      return
    }
    setImages((prev) => {
      const next = prev.filter((img) => img.id !== imageId)
      if (next.length && !next.some((img) => img.is_cover)) {
        next[0] = { ...next[0], is_cover: true }
      }
      return next
    })
    setMessage(result.message || 'Imagem atualizada.')
    router.refresh()
  }

  async function moveImage(imageId, direction) {
    if (!productId || isView) return
    const index = images.findIndex((img) => img.id === imageId)
    if (index < 0) return
    const target = index + direction
    if (target < 0 || target >= images.length) return

    const next = [...images]
    const [item] = next.splice(index, 1)
    next.splice(target, 0, item)
    const ordered = next.map((img, position) => ({ ...img, position }))
    setImages(ordered)

    setBusyImage(true)
    const result = await reorderProductImages(
      productId,
      ordered.map((img) => img.id),
    )
    setBusyImage(false)
    if (!result.ok) {
      setError(result.error)
      router.refresh()
      return
    }
    setMessage(result.message || 'Imagem atualizada.')
    router.refresh()
  }

  function onReplaceClick(imageId) {
    replaceTargetRef.current = imageId
    replaceInputRef.current?.click()
  }

  async function onReplaceFile(event) {
    const file = event.target.files?.[0]
    event.target.value = ''
    const imageId = replaceTargetRef.current
    replaceTargetRef.current = null
    if (!file || !imageId || !productId) return

    const fileError = validateImageFile(file)
    if (fileError) {
      setError(fileError)
      return
    }

    setBusyImage(true)
    setError('')
    setMessage('Preparando imagem...')
    const supabase = createClient()
    let storagePath = ''
    try {
      setMessage('Enviando imagem...')
      storagePath = buildProductImagePath(productId, file)
      await uploadImageToBucket(supabase, file, storagePath)
      const result = await replaceProductImage({ imageId, storagePath })
      if (!result.ok) {
        await removeStorageObject(supabase, storagePath)
        setError(result.error || 'Não foi possível enviar a imagem.')
        return
      }
      if (result.image) {
        setImages((prev) =>
          prev.map((img) =>
            img.id === imageId
              ? {
                  ...img,
                  ...result.image,
                  publicUrl: productImagePublicUrl(result.image.storage_path),
                }
              : img,
          ),
        )
      }
      setMessage('Imagem enviada.')
      router.refresh()
    } catch {
      if (storagePath) await removeStorageObject(supabase, storagePath)
      setError('Não foi possível enviar a imagem.')
    } finally {
      setBusyImage(false)
    }
  }

  return (
    <form className="admin-form admin-form--product" onSubmit={onSave} noValidate>
      {message ? <p className="admin-success" role="status">{message}</p> : null}
      {error ? <p className="admin-error" role="alert">{error}</p> : null}

      {mode === 'create' && !isView ? (
        <AiAssistPanel
          enabled={aiEnabled}
          disabled={pending}
          onApply={applyAiSuggestions}
        />
      ) : null}

      <section className="admin-section">
        <h2>Informações</h2>
        <div className="admin-grid-2">
          <div className="admin-field">
            <label htmlFor="product-name">Nome <AiHint show={aiHints.name} /></label>
            <input
              id="product-name"
              value={name}
              onChange={(e) => onNameChange(e.target.value)}
              disabled={isView || pending}
              required
            />
          </div>
          <div className="admin-field">
            <label htmlFor="product-slug">Slug <AiHint show={aiHints.slug} /></label>
            <input
              id="product-slug"
              value={slug}
              onChange={(e) => onSlugChange(e.target.value)}
              disabled={isView || pending}
              required
            />
            {slugHint ? (
              <span
                className={`admin-field-hint ${slugHint.includes('já está') ? 'is-error' : 'is-ok'}`}
              >
                {slugHint}
              </span>
            ) : null}
          </div>
        </div>
        <div className="admin-field">
          <label htmlFor="product-description">Descrição <AiHint show={aiHints.description} /></label>
          <textarea
            id="product-description"
            rows={5}
            value={description}
            onChange={(e) => {
              setDescription(e.target.value)
              setAiHints((prev) => ({ ...prev, description: false }))
            }}
            disabled={isView || pending}
          />
        </div>
        <div className="admin-field">
          <label htmlFor="product-sku">SKU</label>
          <input
            id="product-sku"
            value={sku}
            onChange={(e) => setSku(e.target.value)}
            disabled={isView || pending}
            placeholder="Opcional"
          />
        </div>
      </section>

      <section className="admin-section">
        <h2>Preço</h2>
        <div className="admin-grid-2">
          <div className="admin-field">
            <label htmlFor="product-price">Preço atual</label>
            <input
              id="product-price"
              inputMode="decimal"
              placeholder="0,00"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              disabled={isView || pending}
              required
            />
          </div>
          <div className="admin-field">
            <label htmlFor="product-compare">Preço anterior / promocional</label>
            <input
              id="product-compare"
              inputMode="decimal"
              placeholder="Opcional"
              value={compareAtPrice}
              onChange={(e) => setCompareAtPrice(e.target.value)}
              disabled={isView || pending}
            />
          </div>
        </div>
      </section>

      <section className="admin-section">
        <h2>Classificação</h2>
        <div className="admin-grid-2">
          <div className="admin-field">
            <label htmlFor="product-category">
              Categoria <AiHint show={aiHints.categoryId} />
            </label>
            <select
              id="product-category"
              value={categoryId}
              onChange={(e) => {
                setCategoryId(e.target.value)
                setAiHints((prev) => ({ ...prev, categoryId: false }))
              }}
              disabled={isView || pending}
            >
              <option value="">Selecione…</option>
              {categories.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
          <div className="admin-field">
            <label htmlFor="product-collection">Coleção</label>
            <select
              id="product-collection"
              value={collectionId}
              onChange={(e) => setCollectionId(e.target.value)}
              disabled={isView || pending}
            >
              <option value="">Selecione…</option>
              {collections.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      <section className="admin-section">
        <div className="admin-section__head">
          <h2>Variações</h2>
          {!isView ? (
            <button type="button" className="admin-btn admin-btn--ghost" onClick={addVariant}>
              + Variante
            </button>
          ) : null}
        </div>

        {!variants.length ? (
          <p className="admin-muted">Nenhuma variante cadastrada.</p>
        ) : (
          <div className="admin-variants">
            {variants.map((variant, index) => (
              <div
                key={variant._key}
                data-variant-id={variant.id || ''}
                className={`admin-variant-row${
                  highlightVariantId && variant.id === highlightVariantId
                    ? ' admin-variant-row--alert'
                    : ''
                }`}
              >
                <div className="admin-field">
                  <label>
                    Tamanho <AiHint show={index === 0 && aiHints.size} />
                  </label>
                  <input
                    value={variant.size}
                    onChange={(e) => updateVariant(variant._key, 'size', e.target.value)}
                    disabled={isView || pending}
                    placeholder="P, M, G…"
                  />
                </div>
                <div className="admin-field">
                  <label>
                    Cor <AiHint show={index === 0 && aiHints.color} />
                  </label>
                  <input
                    value={variant.color}
                    onChange={(e) => updateVariant(variant._key, 'color', e.target.value)}
                    disabled={isView || pending}
                    placeholder="Preto, Marrom…"
                  />
                </div>
                <div className="admin-field">
                  <label>Estoque</label>
                  <input
                    type="number"
                    min="0"
                    value={variant.stock}
                    onChange={(e) => updateVariant(variant._key, 'stock', e.target.value)}
                    disabled={isView || pending}
                  />
                </div>
                <div className="admin-field">
                  <label>SKU variante</label>
                  <input
                    value={variant.sku}
                    onChange={(e) => updateVariant(variant._key, 'sku', e.target.value)}
                    disabled={isView || pending}
                    placeholder="Opcional"
                  />
                </div>
                {!isView ? (
                  <button
                    type="button"
                    className="admin-link-btn admin-variant-remove"
                    onClick={() => removeVariant(variant._key)}
                  >
                    Remover
                  </button>
                ) : null}
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="admin-section">
        <div className="admin-section__head">
          <h2>Fotos</h2>
          {!isView ? (
            <button
              type="button"
              className="admin-btn admin-btn--ghost"
              disabled={busyImage || pending}
              onClick={() => {
                if (!productId) {
                  setError('Salve o produto antes de enviar fotos.')
                  return
                }
                fileInputRef.current?.click()
              }}
            >
              + Adicionar fotos
            </button>
          ) : null}
        </div>

        {!productId && !isView ? (
          <p className="admin-muted">
            Salve o produto uma primeira vez para liberar o envio de imagens.
          </p>
        ) : null}

        <div className="admin-photos">
          {images.map((image, index) => (
            <article
              key={image.id}
              className={`admin-photo ${image.is_cover ? 'is-cover' : ''}`}
            >
              <div className="admin-photo__preview">
                {image.publicUrl || productImagePublicUrl(image.storage_path) ? (
                  <img
                    src={image.publicUrl || productImagePublicUrl(image.storage_path)}
                    alt={image.alt_text || ''}
                  />
                ) : (
                  <span>Sem preview</span>
                )}
                <span className="admin-photo__badge">
                  {image.is_cover ? 'CAPA' : index + 1}
                </span>
              </div>
              {!isView ? (
                <div className="admin-photo__actions">
                  {!image.is_cover ? (
                    <button type="button" onClick={() => onSetCover(image.id)} disabled={busyImage}>
                      Definir capa
                    </button>
                  ) : null}
                  <button type="button" onClick={() => moveImage(image.id, -1)} disabled={busyImage || index === 0}>
                    ←
                  </button>
                  <button
                    type="button"
                    onClick={() => moveImage(image.id, 1)}
                    disabled={busyImage || index === images.length - 1}
                  >
                    →
                  </button>
                  <button type="button" onClick={() => onReplaceClick(image.id)} disabled={busyImage}>
                    Substituir
                  </button>
                  <button type="button" onClick={() => onDeleteImage(image.id)} disabled={busyImage}>
                    Excluir
                  </button>
                </div>
              ) : null}
            </article>
          ))}

          {uploads.map((item) => (
            <article key={item.key} className="admin-photo admin-photo--pending">
              <div className="admin-photo__preview">
                <img src={item.previewUrl} alt="" />
              </div>
              <p className="admin-photo__meta">
                <strong>{item.name}</strong>
                <span>{formatImageBytes(item.size)}</span>
                <em>{item.status}</em>
              </p>
            </article>
          ))}

          {!isView ? (
            <button
              type="button"
              className="admin-photo admin-photo--add"
              disabled={busyImage || pending}
              onClick={() => {
                if (!productId) {
                  setError('Salve o produto antes de enviar fotos.')
                  return
                }
                fileInputRef.current?.click()
              }}
              aria-label="Adicionar foto"
            >
              <span>+</span>
            </button>
          ) : null}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          hidden
          onChange={onPickImages}
        />
        <input
          ref={replaceInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          hidden
          onChange={onReplaceFile}
        />
      </section>

      <section className="admin-section">
        <h2>Publicação</h2>
        <div className="admin-grid-2">
          <label className="admin-check">
            <input
              type="checkbox"
              checked={active}
              onChange={(e) => setActive(e.target.checked)}
              disabled={isView || pending}
            />
            <span>Publicado na loja</span>
          </label>
          <p className="admin-field-hint" style={{ gridColumn: '1 / -1', marginTop: '-0.35rem' }}>
            Produtos não publicados ficam como rascunho e não aparecem na loja.
          </p>
          <label className="admin-check">
            <input
              type="checkbox"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              disabled={isView || pending}
            />
            <span>Produto em destaque</span>
          </label>
        </div>
      </section>

      <div className="admin-sticky-actions">
        <Link href="/admin/produtos" className="admin-btn admin-btn--ghost">
          {isView ? 'Voltar' : 'Cancelar'}
        </Link>
        {productId && isView ? (
          <Link href={`/admin/produtos/${productId}`} className="admin-btn">
            Editar
          </Link>
        ) : null}
        {!isView ? (
          <button type="submit" className="admin-btn" disabled={pending}>
            {pending ? 'Salvando…' : 'Salvar produto'}
          </button>
        ) : null}
        {!isView && productId && isAuditTestRecord({ name, slug }) ? (
          <button
            type="button"
            className="admin-btn admin-btn--danger-ghost"
            disabled={pending}
            onClick={onDeleteProduct}
          >
            Excluir teste
          </button>
        ) : null}
      </div>
    </form>
  )
}
