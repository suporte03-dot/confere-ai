import { useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import {
  formatCurrency,
  getProductImage,
  getProductSizes,
} from '../data/mockData'

const TABS = [
  { id: 'sobre', label: 'Sobre o produto' },
  { id: 'provador', label: 'Provador Virtual' },
  { id: 'medidas', label: 'Tabela de Medidas' },
]

const CLOTHING_CHART = [
  { size: 'P', bust: '86–90', waist: '68–72', hip: '92–96' },
  { size: 'M', bust: '91–95', waist: '73–77', hip: '97–101' },
  { size: 'G', bust: '96–100', waist: '78–82', hip: '102–106' },
  { size: 'GG', bust: '101–106', waist: '83–88', hip: '107–112' },
]

const SHOE_CHART = [
  { size: '37', cm: '23,5' },
  { size: '38', cm: '24,0' },
  { size: '39', cm: '24,5' },
  { size: '40', cm: '25,5' },
  { size: '41', cm: '26,0' },
  { size: '42', cm: '26,5' },
]

const KIDS_CHART = [
  { size: '2', height: '86–92', age: '1–2 anos' },
  { size: '4', height: '98–104', age: '3–4 anos' },
  { size: '6', height: '110–116', age: '5–6 anos' },
  { size: '8', height: '122–128', age: '7–8 anos' },
  { size: '10', height: '134–140', age: '9–10 anos' },
]

const LETTER_ORDER = ['PP', 'P', 'M', 'G', 'GG', 'XG', 'XXG', 'EG', 'EGG']
const SHOE_ORDER = ['35', '36', '37', '38', '39', '40', '41', '42', '43', '44']
const KIDS_ORDER = ['2', '4', '6', '8', '10', '12', '14']

const FITTING_DEFAULTS = {
  step: 1,
  gender: 'feminino',
  height: '',
  weight: '',
  age: '',
  result: null,
}

const TRYON_DEFAULTS = {
  step: 1,
  photoUrl: null,
  scale: 1,
  offsetY: 8,
  offsetX: 0,
}

function defaultGenderForProduct(product) {
  return product?.department === 'Masculino' || product?.category === 'masculino'
    ? 'masculino'
    : 'feminino'
}

function getFocusableElements(container) {
  if (!container) return []
  return Array.from(
    container.querySelectorAll(
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
    ),
  ).filter((el) => !el.hasAttribute('disabled') && el.getAttribute('aria-hidden') !== 'true')
}

function chartKindFor(product) {
  const dept = product?.department || ''
  const category = product?.category || ''
  if (dept === 'Calçados' || category === 'calcados') return 'shoes'
  if (dept === 'Infantil' || category === 'infantil') return 'kids'
  if (dept === 'Acessórios' || category === 'acessorios') return 'accessories'
  return 'clothing'
}

function buildAboutDetails(product, sizes) {
  const colors = (product.colors || []).join(', ')
  const details = [
    { label: 'Categoria', value: [product.department, product.subcategory].filter(Boolean).join(' · ') },
    colors ? { label: 'Cores', value: colors } : null,
    sizes.length ? { label: 'Tamanhos', value: sizes.join(' · ') } : null,
    product.price != null ? { label: 'Preço', value: formatCurrency(product.price) } : null,
  ].filter(Boolean)

  const description =
    product.description ||
    `${product.name} da coleção Terra & Estilo — peça com acabamento premium, inspirada nas raízes e no estilo contemporâneo do Sul.`

  return { details, description }
}

function parseField(value) {
  const n = Number(String(value).trim().replace(',', '.'))
  return Number.isFinite(n) ? n : NaN
}

function pickClosestSize(preferred, available, order) {
  if (!available.length) return null
  if (available.includes(preferred)) return preferred

  const ranked = available
    .map((size) => {
      const idx = order.indexOf(size)
      return { size, idx: idx === -1 ? Number.POSITIVE_INFINITY : idx }
    })
    .filter((item) => Number.isFinite(item.idx))
    .sort((a, b) => a.idx - b.idx)

  if (!ranked.length) return available[0]

  const preferredIdx = order.indexOf(preferred)
  if (preferredIdx === -1) return ranked[Math.floor(ranked.length / 2)].size

  let best = ranked[0]
  let bestDist = Math.abs(ranked[0].idx - preferredIdx)
  for (const item of ranked) {
    const dist = Math.abs(item.idx - preferredIdx)
    if (dist < bestDist) {
      best = item
      bestDist = dist
    }
  }
  return best.size
}

function recommendSize({ gender, height, weight, age, sizes, chartKind }) {
  if (!sizes.length) {
    return {
      size: null,
      label: '—',
      explanation:
        'Esta peça não possui grade de tamanhos cadastrada. Consulte a tabela de medidas ou o atendimento.',
    }
  }

  if (chartKind === 'accessories' && sizes.length === 1) {
    return {
      size: sizes[0],
      label: sizes[0],
      explanation:
        'Acessórios Terra & Estilo costumam ter tamanho único ou grade reduzida. Sugerimos o tamanho disponível nesta peça.',
    }
  }

  if (chartKind === 'kids') {
    let preferred = '6'
    if (age <= 2) preferred = '2'
    else if (age <= 4) preferred = '4'
    else if (age <= 6) preferred = '6'
    else if (age <= 8) preferred = '8'
    else preferred = '10'

    const size = pickClosestSize(preferred, sizes, KIDS_ORDER)
    return {
      size,
      label: size,
      explanation: `Com base na idade informada (${age} anos) e na altura de ${height} cm, sugerimos o tamanho ${size} para esta peça infantil. Use a tabela de medidas para confirmar.`,
    }
  }

  if (chartKind === 'shoes') {
    // Heurística de demonstração: estatura + gênero → numeração aproximada
    let preferred = gender === 'feminino' ? '38' : '40'
    if (height < 160) preferred = gender === 'feminino' ? '36' : '38'
    else if (height < 168) preferred = gender === 'feminino' ? '37' : '39'
    else if (height < 176) preferred = gender === 'feminino' ? '38' : '40'
    else if (height < 184) preferred = gender === 'feminino' ? '39' : '41'
    else preferred = gender === 'feminino' ? '40' : '42'

    const size = pickClosestSize(preferred, sizes, SHOE_ORDER)
    return {
      size,
      label: size,
      explanation: `Estimativa de demonstração com base na altura (${height} cm) e no perfil ${gender}. Sugerimos o tamanho ${size}. Para calçados, o ideal é medir o pé e conferir a tabela.`,
    }
  }

  const heightM = height / 100
  const bmi = weight / (heightM * heightM)
  const adjusted = gender === 'feminino' ? bmi * 0.97 : bmi

  let preferred = 'M'
  if (adjusted < 19) preferred = 'P'
  else if (adjusted < 23.5) preferred = 'M'
  else if (adjusted < 27.5) preferred = 'G'
  else preferred = 'GG'

  // Altura muito alta tende a subir um ponto na grade
  if (height >= 185 && preferred === 'P') preferred = 'M'
  if (height >= 190 && preferred === 'M') preferred = 'G'

  const size = pickClosestSize(preferred, sizes, LETTER_ORDER)
  const genderLabel = gender === 'feminino' ? 'feminino' : 'masculino'

  return {
    size,
    label: size,
    explanation: `Com altura ${height} cm, peso ${weight} kg e perfil ${genderLabel}, sugerimos o tamanho ${size} nesta peça. É uma estimativa de demonstração — o caimento pode variar conforme o modelo.`,
  }
}

function validateFittingFields({ height, weight, age, chartKind }) {
  const h = parseField(height)
  const w = parseField(weight)
  const a = parseField(age)

  const heightOk = chartKind === 'kids' ? h >= 80 && h <= 170 : h >= 140 && h <= 220
  const weightOk = chartKind === 'kids' ? w >= 10 && w <= 80 : w >= 40 && w <= 180
  const ageOk = chartKind === 'kids' ? a >= 1 && a <= 14 : a >= 14 && a <= 90

  const missing = !String(height).trim() || !String(weight).trim() || !String(age).trim()
  if (missing) {
    return { valid: false, helper: 'Preencha altura, peso e idade para continuar.' }
  }
  if (!heightOk || !weightOk || !ageOk) {
    return {
      valid: false,
      helper:
        chartKind === 'kids'
          ? 'Use valores realistas: altura 80–170 cm, peso 10–80 kg e idade 1–14 anos.'
          : 'Use valores realistas: altura 140–220 cm, peso 40–180 kg e idade 14–90 anos.',
    }
  }

  return { valid: true, height: h, weight: w, age: a, helper: '' }
}

function FittingProgress({ step, total = 2 }) {
  return (
    <div className="product-info-modal__progress" aria-label={`Etapa ${step} de ${total}`}>
      {Array.from({ length: total }, (_, index) => {
        const current = index + 1
        return (
          <span
            key={current}
            className={`product-info-modal__dot${current === step ? ' is-active' : ''}${
              current < step ? ' is-done' : ''
            }`}
            aria-hidden="true"
          />
        )
      })}
      <span className="product-info-modal__progress-label">
        Etapa {step} de {total}
      </span>
    </div>
  )
}

function GenderToggle({ value, onChange }) {
  return (
    <fieldset className="product-info-modal__gender">
      <legend className="product-info-modal__field-label">Gênero do manequim</legend>
      <div className="product-info-modal__gender-options">
        {[
          { id: 'feminino', label: 'Feminino' },
          { id: 'masculino', label: 'Masculino' },
        ].map((option) => (
          <button
            key={option.id}
            type="button"
            className={`product-info-modal__gender-btn${value === option.id ? ' is-active' : ''}`}
            aria-pressed={value === option.id}
            onClick={() => onChange(option.id)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </fieldset>
  )
}

function MannequinSilhouette({ gender }) {
  const gradId = useId().replace(/:/g, '')
  const isFemale = gender !== 'masculino'
  const fill = `url(#${gradId})`
  return (
    <svg
      className="product-info-modal__mannequin-svg"
      viewBox="0 0 120 280"
      role="img"
      aria-label={isFemale ? 'Manequim feminino' : 'Manequim masculino'}
    >
      <defs>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(246, 239, 228, 0.28)" />
          <stop offset="100%" stopColor="rgba(201, 155, 50, 0.22)" />
        </linearGradient>
      </defs>
      <ellipse cx="60" cy="28" rx="18" ry="22" fill={fill} />
      <rect x="52" y="46" width="16" height="14" rx="4" fill={fill} />
      {isFemale ? (
        <path
          d="M38 60 C28 72 26 96 30 118 L34 168 C36 182 42 188 48 190 L72 190 C78 188 84 182 86 168 L90 118 C94 96 92 72 82 60 Z"
          fill={fill}
        />
      ) : (
        <path
          d="M34 60 C24 70 22 96 26 122 L32 170 C34 184 40 190 48 192 L72 192 C80 190 86 184 88 170 L94 122 C98 96 96 70 86 60 Z"
          fill={fill}
        />
      )}
      <path
        d={
          isFemale
            ? 'M38 68 C22 78 14 110 16 138 L26 140 C28 114 34 90 44 80 Z'
            : 'M34 68 C18 76 10 112 12 142 L24 144 C26 116 30 88 42 78 Z'
        }
        fill={fill}
      />
      <path
        d={
          isFemale
            ? 'M82 68 C98 78 106 110 104 138 L94 140 C92 114 86 90 76 80 Z'
            : 'M86 68 C102 76 110 112 108 142 L96 144 C94 116 90 88 78 78 Z'
        }
        fill={fill}
      />
      <path
        d="M48 188 L42 268 C41 274 44 276 48 276 L54 276 C58 276 60 274 59 268 L56 190 Z"
        fill={fill}
      />
      <path
        d="M72 188 L78 268 C79 274 76 276 72 276 L66 276 C62 276 60 274 61 268 L64 190 Z"
        fill={fill}
      />
    </svg>
  )
}

function TryOnPanel({
  productImage,
  productName,
  gender,
  onGenderChange,
  tryOn,
  setTryOn,
  fileInputRef,
  onBackToModes,
  onGoToSize,
}) {
  const photoId = useId()

  const revokePhoto = (url) => {
    if (url) URL.revokeObjectURL(url)
  }

  const handleFileChange = (event) => {
    const file = event.target.files?.[0]
    if (!file || !file.type.startsWith('image/')) return
    const nextUrl = URL.createObjectURL(file)
    setTryOn((prev) => {
      revokePhoto(prev.photoUrl)
      return { ...prev, photoUrl: nextUrl, step: 2 }
    })
    event.target.value = ''
  }

  const openFilePicker = () => {
    fileInputRef.current?.click()
  }

  const clearPhoto = () => {
    setTryOn((prev) => {
      revokePhoto(prev.photoUrl)
      return { ...TRYON_DEFAULTS, step: 1 }
    })
  }

  if (tryOn.step === 2 && tryOn.photoUrl) {
    return (
      <div className="product-info-modal__fitting">
        <FittingProgress step={2} />
        <h3 className="product-info-modal__subtitle">Como fica em você</h3>
        <p className="product-info-modal__lead product-info-modal__lead--tight">
          Compare sua foto com o manequim virtual vestindo {productName}.
        </p>

        <GenderToggle value={gender} onChange={onGenderChange} />

        <div className="product-info-modal__tryon-compare">
          <figure className="product-info-modal__tryon-pane">
            <figcaption className="product-info-modal__tryon-caption">Você</figcaption>
            <div className="product-info-modal__photo-frame">
              <img src={tryOn.photoUrl} alt="Sua foto enviada" />
            </div>
          </figure>

          <figure className="product-info-modal__tryon-pane">
            <figcaption className="product-info-modal__tryon-caption">Como fica</figcaption>
            <div className="product-info-modal__mannequin-stage" aria-live="polite">
              <MannequinSilhouette gender={gender} />
              <img
                className="product-info-modal__garment"
                src={productImage}
                alt=""
                aria-hidden="true"
                style={{
                  transform: `translate(calc(-50% + ${tryOn.offsetX}%), ${tryOn.offsetY}%) scale(${tryOn.scale})`,
                }}
              />
            </div>
          </figure>
        </div>

        <div className="product-info-modal__fit-controls">
          <label className="product-info-modal__slider">
            <span className="product-info-modal__field-label">Escala da peça</span>
            <input
              type="range"
              min="0.55"
              max="1.45"
              step="0.01"
              value={tryOn.scale}
              onChange={(event) =>
                setTryOn((prev) => ({ ...prev, scale: Number(event.target.value) }))
              }
              aria-valuetext={`${Math.round(tryOn.scale * 100)}%`}
            />
          </label>
          <label className="product-info-modal__slider">
            <span className="product-info-modal__field-label">Posição vertical</span>
            <input
              type="range"
              min="-8"
              max="28"
              step="1"
              value={tryOn.offsetY}
              onChange={(event) =>
                setTryOn((prev) => ({ ...prev, offsetY: Number(event.target.value) }))
              }
            />
          </label>
          <label className="product-info-modal__slider">
            <span className="product-info-modal__field-label">Posição horizontal</span>
            <input
              type="range"
              min="-18"
              max="18"
              step="1"
              value={tryOn.offsetX}
              onChange={(event) =>
                setTryOn((prev) => ({ ...prev, offsetX: Number(event.target.value) }))
              }
            />
          </label>
        </div>

        <p className="product-info-modal__disclaimer" role="note">
          Visualização ilustrativa para ajudar na escolha — não substitui prova física.
        </p>

        <div className="product-info-modal__fitting-actions">
          <button type="button" className="product-info-modal__nav-btn" onClick={clearPhoto}>
            Trocar foto
          </button>
          <button type="button" className="product-info-modal__nav-btn" onClick={onBackToModes}>
            Voltar
          </button>
          <button
            type="button"
            className="product-info-modal__action product-info-modal__action--primary"
            onClick={onGoToSize}
          >
            Usar tamanho sugerido
          </button>
        </div>

        <input
          ref={fileInputRef}
          id={photoId}
          type="file"
          accept="image/*"
          capture="user"
          className="product-info-modal__file-input"
          onChange={handleFileChange}
        />
      </div>
    )
  }

  return (
    <div className="product-info-modal__fitting">
      <FittingProgress step={1} />
      <h3 className="product-info-modal__subtitle">Envie sua foto</h3>
      <p className="product-info-modal__lead product-info-modal__lead--tight">
        Tire ou escolha uma foto de corpo inteiro ou meio corpo para montar o manequim virtual com a
        peça.
      </p>

      <GenderToggle value={gender} onChange={onGenderChange} />

      <div className="product-info-modal__upload">
        <div className="product-info-modal__upload-preview" aria-hidden="true">
          <MannequinSilhouette gender={gender} />
        </div>
        <label htmlFor={photoId} className="product-info-modal__upload-label">
          <span className="product-info-modal__upload-title">Selecionar foto</span>
          <span className="product-info-modal__upload-hint">
            JPG, PNG ou WEBP — câmera ou galeria
          </span>
        </label>
        <input
          ref={fileInputRef}
          id={photoId}
          type="file"
          accept="image/*"
          capture="user"
          className="product-info-modal__file-input"
          onChange={handleFileChange}
        />
        <button
          type="button"
          className="product-info-modal__action product-info-modal__action--primary"
          onClick={openFilePicker}
        >
          Enviar foto
        </button>
      </div>

      <p className="product-info-modal__disclaimer" role="note">
        Visualização ilustrativa para ajudar na escolha — não substitui prova física.
      </p>

      <div className="product-info-modal__fitting-actions">
        <button type="button" className="product-info-modal__nav-btn" onClick={onBackToModes}>
          Voltar
        </button>
      </div>
    </div>
  )
}

function ProvadorPanel({
  product,
  productImage,
  sizes,
  chartKind,
  onSelectSize,
  onClose,
  onOpenMedidas,
}) {
  const fileInputRef = useRef(null)
  const [mode, setMode] = useState(null)
  const [fitting, setFitting] = useState(() => ({
    ...FITTING_DEFAULTS,
    gender: defaultGenderForProduct(product),
  }))
  const [tryOn, setTryOn] = useState(TRYON_DEFAULTS)

  useEffect(() => {
    setMode(null)
    setFitting({
      ...FITTING_DEFAULTS,
      gender: defaultGenderForProduct(product),
    })
    setTryOn((prev) => {
      if (prev.photoUrl) URL.revokeObjectURL(prev.photoUrl)
      return { ...TRYON_DEFAULTS }
    })
  }, [product?.id, product?.department, product?.category])

  useEffect(() => {
    return () => {
      if (tryOn.photoUrl) URL.revokeObjectURL(tryOn.photoUrl)
    }
  }, [tryOn.photoUrl])

  const validation = validateFittingFields({
    height: fitting.height,
    weight: fitting.weight,
    age: fitting.age,
    chartKind,
  })

  const resetTryOnPhoto = () => {
    setTryOn((prev) => {
      if (prev.photoUrl) URL.revokeObjectURL(prev.photoUrl)
      return { ...TRYON_DEFAULTS }
    })
  }

  const goToModes = () => {
    setMode(null)
    setFitting((prev) => ({ ...prev, step: 1, result: null }))
    resetTryOnPhoto()
  }

  const goNext = () => {
    if (!validation.valid) return
    const result = recommendSize({
      gender: fitting.gender,
      height: validation.height,
      weight: validation.weight,
      age: validation.age,
      sizes,
      chartKind,
    })
    setFitting((prev) => ({ ...prev, step: 2, result }))
  }

  const goBack = () => {
    setFitting((prev) => ({ ...prev, step: 1 }))
  }

  const handleSelectRecommended = () => {
    const size = fitting.result?.size
    if (!size) return
    if (onSelectSize) {
      onSelectSize(size)
      return
    }
    onClose?.()
  }

  const enterSizeMode = () => {
    resetTryOnPhoto()
    setFitting((prev) => ({ ...prev, step: 1, result: null }))
    setMode('size')
  }

  if (!mode) {
    return (
      <div className="product-info-modal__fitting">
        <h3 className="product-info-modal__subtitle">Provador Virtual</h3>
        <p className="product-info-modal__lead product-info-modal__lead--tight">
          Escolha como prefere experimentar esta peça Terra & Estilo.
        </p>

        <div className="product-info-modal__mode-grid" role="group" aria-label="Modos do provador">
          <button
            type="button"
            className="product-info-modal__mode-card"
            onClick={() => setMode('size')}
          >
            <span className="product-info-modal__mode-kicker">Guia rápido</span>
            <span className="product-info-modal__mode-title">Sugestão de tamanho</span>
            <span className="product-info-modal__mode-text">
              Informe gênero, altura, peso e idade para receber uma estimativa de tamanho.
            </span>
          </button>

          <button
            type="button"
            className="product-info-modal__mode-card"
            onClick={() => setMode('tryon')}
          >
            <span className="product-info-modal__mode-kicker">Estilo Mercado Livre</span>
            <span className="product-info-modal__mode-title">Prova virtual</span>
            <span className="product-info-modal__mode-text">
              Envie sua foto e veja a peça no manequim virtual.
            </span>
          </button>
        </div>
      </div>
    )
  }

  if (mode === 'tryon') {
    return (
      <TryOnPanel
        productImage={productImage}
        productName={product.name}
        gender={fitting.gender}
        onGenderChange={(gender) => setFitting((prev) => ({ ...prev, gender }))}
        tryOn={tryOn}
        setTryOn={setTryOn}
        fileInputRef={fileInputRef}
        onBackToModes={goToModes}
        onGoToSize={enterSizeMode}
      />
    )
  }

  if (fitting.step === 2 && fitting.result) {
    const { result } = fitting
    return (
      <div className="product-info-modal__fitting">
        <FittingProgress step={2} />
        <h3 className="product-info-modal__subtitle">Seu tamanho sugerido</h3>
        <p className="product-info-modal__lead product-info-modal__lead--tight">
          Resultado da etapa 2 — estimativa para esta peça Terra & Estilo.
        </p>

        <div className="product-info-modal__result" aria-live="polite">
          <p className="product-info-modal__result-label">Tamanho ideal</p>
          <p className="product-info-modal__result-size">{result.label}</p>
          <p className="product-info-modal__result-text">{result.explanation}</p>
        </div>

        <div className="product-info-modal__fitting-actions">
          <button type="button" className="product-info-modal__nav-btn" onClick={goBack}>
            Voltar
          </button>
          {result.size && onSelectSize ? (
            <button
              type="button"
              className="product-info-modal__action product-info-modal__action--primary"
              onClick={handleSelectRecommended}
            >
              Selecionar tamanho {result.size}
            </button>
          ) : (
            <button
              type="button"
              className="product-info-modal__action product-info-modal__action--primary"
              onClick={onClose}
            >
              Fechar
            </button>
          )}
        </div>

        <button type="button" className="product-info-modal__text-link" onClick={onOpenMedidas}>
          Ver tabela de medidas
        </button>
        <button
          type="button"
          className="product-info-modal__text-link"
          onClick={() => {
            setFitting((prev) => ({ ...prev, step: 1, result: null }))
            setMode('tryon')
          }}
        >
          Ver prova virtual
        </button>
      </div>
    )
  }

  return (
    <div className="product-info-modal__fitting">
      <FittingProgress step={1} />
      <h3 className="product-info-modal__subtitle">Descubra o tamanho ideal da peça</h3>
      <p className="product-info-modal__lead product-info-modal__lead--tight">
        Informe seus dados na etapa 1 e avance para ver a sugestão de tamanho.
      </p>

      <fieldset className="product-info-modal__gender">
        <legend className="product-info-modal__field-label">Gênero</legend>
        <div className="product-info-modal__gender-options">
          {[
            { id: 'feminino', label: 'Feminino' },
            { id: 'masculino', label: 'Masculino' },
          ].map((option) => (
            <button
              key={option.id}
              type="button"
              className={`product-info-modal__gender-btn${
                fitting.gender === option.id ? ' is-active' : ''
              }`}
              aria-pressed={fitting.gender === option.id}
              onClick={() => setFitting((prev) => ({ ...prev, gender: option.id }))}
            >
              {option.label}
            </button>
          ))}
        </div>
      </fieldset>

      <div className="product-info-modal__fields">
        <label className="product-info-modal__field">
          <span className="product-info-modal__field-label">Altura (cm)</span>
          <input
            type="number"
            inputMode="decimal"
            min={chartKind === 'kids' ? 80 : 140}
            max={chartKind === 'kids' ? 170 : 220}
            placeholder="Ex: 168"
            value={fitting.height}
            onChange={(event) =>
              setFitting((prev) => ({ ...prev, height: event.target.value }))
            }
          />
        </label>
        <label className="product-info-modal__field">
          <span className="product-info-modal__field-label">Peso (kg)</span>
          <input
            type="number"
            inputMode="decimal"
            min={chartKind === 'kids' ? 10 : 40}
            max={chartKind === 'kids' ? 80 : 180}
            placeholder="Ex: 65"
            value={fitting.weight}
            onChange={(event) =>
              setFitting((prev) => ({ ...prev, weight: event.target.value }))
            }
          />
        </label>
        <label className="product-info-modal__field">
          <span className="product-info-modal__field-label">Idade (anos)</span>
          <input
            type="number"
            inputMode="numeric"
            min={chartKind === 'kids' ? 1 : 14}
            max={chartKind === 'kids' ? 14 : 90}
            placeholder="Ex: 28"
            value={fitting.age}
            onChange={(event) => setFitting((prev) => ({ ...prev, age: event.target.value }))}
          />
        </label>
      </div>

      {!validation.valid && (
        <p className="product-info-modal__helper" role="status">
          {validation.helper}
        </p>
      )}

      <div className="product-info-modal__fitting-actions">
        <button type="button" className="product-info-modal__nav-btn" onClick={goToModes}>
          Voltar
        </button>
        <button
          type="button"
          className="product-info-modal__action product-info-modal__action--primary"
          disabled={!validation.valid}
          onClick={goNext}
        >
          Próximo
        </button>
      </div>
    </div>
  )
}

function ProductInfoModal({ product, open, initialTab = 'sobre', onClose, onSelectSize }) {
  const titleId = useId()
  const dialogRef = useRef(null)
  const closeBtnRef = useRef(null)
  const previousFocusRef = useRef(null)
  const [activeTab, setActiveTab] = useState(initialTab)

  useEffect(() => {
    if (open) setActiveTab(initialTab)
  }, [open, initialTab])

  useEffect(() => {
    if (!open) return undefined

    previousFocusRef.current = document.activeElement
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const focusTimer = window.setTimeout(() => {
      closeBtnRef.current?.focus()
    }, 0)

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
        return
      }

      if (event.key !== 'Tab') return

      const focusable = getFocusableElements(dialogRef.current)
      if (focusable.length === 0) {
        event.preventDefault()
        dialogRef.current?.focus()
        return
      }

      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      window.clearTimeout(focusTimer)
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = previousOverflow
      previousFocusRef.current?.focus?.()
    }
  }, [open, onClose])

  if (!open || !product) return null

  const sizes = getProductSizes(product)
  const image = getProductImage(product)
  const { details, description } = buildAboutDetails(product, sizes)
  const chartKind = chartKindFor(product)

  return createPortal(
    <div className="product-info-modal" role="presentation">
      <button
        type="button"
        className="product-info-modal__backdrop"
        aria-label="Fechar"
        onClick={onClose}
      />
      <div
        ref={dialogRef}
        className="product-info-modal__dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
      >
        <button
          ref={closeBtnRef}
          type="button"
          className="product-info-modal__close"
          aria-label="Fechar"
          onClick={onClose}
        >
          <span aria-hidden="true">×</span>
        </button>

        <header className="product-info-modal__header">
          <div className="product-info-modal__thumb" aria-hidden="true">
            <img src={image} alt="" />
          </div>
          <div className="product-info-modal__intro">
            <p className="product-info-modal__eyebrow">Terra & Estilo</p>
            <h2 id={titleId} className="product-info-modal__title">
              {product.name}
            </h2>
            <span className="product-info-modal__ornament" aria-hidden="true" />
          </div>
        </header>

        <div className="product-info-modal__tabs" role="tablist" aria-label="Informações do produto">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              id={`product-info-tab-${tab.id}`}
              aria-selected={activeTab === tab.id}
              aria-controls={`product-info-panel-${tab.id}`}
              className={`product-info-modal__tab${activeTab === tab.id ? ' is-active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="product-info-modal__body">
          {activeTab === 'sobre' && (
            <div
              id="product-info-panel-sobre"
              role="tabpanel"
              aria-labelledby="product-info-tab-sobre"
              className="product-info-modal__panel"
            >
              <p className="product-info-modal__lead">{description}</p>
              <dl className="product-info-modal__meta">
                {details.map((item) => (
                  <div key={item.label} className="product-info-modal__meta-row">
                    <dt>{item.label}</dt>
                    <dd>{item.value}</dd>
                  </div>
                ))}
              </dl>
              <p className="product-info-modal__note">
                Cuidados: lavar com água fria, evitar alvejante e secar à sombra para preservar o
                acabamento Terra & Estilo.
              </p>
            </div>
          )}

          {activeTab === 'provador' && (
            <div
              id="product-info-panel-provador"
              role="tabpanel"
              aria-labelledby="product-info-tab-provador"
              className="product-info-modal__panel product-info-modal__panel--provador"
            >
              <ProvadorPanel
                key={`${product.id}-provador`}
                product={product}
                productImage={image}
                sizes={sizes}
                chartKind={chartKind}
                onSelectSize={onSelectSize}
                onClose={onClose}
                onOpenMedidas={() => setActiveTab('medidas')}
              />
            </div>
          )}

          {activeTab === 'medidas' && (
            <div
              id="product-info-panel-medidas"
              role="tabpanel"
              aria-labelledby="product-info-tab-medidas"
              className="product-info-modal__panel"
            >
              <p className="product-info-modal__lead">
                Guia genérico Terra & Estilo (medidas em cm). Use como referência — o caimento pode
                variar conforme o modelo.
              </p>

              {chartKind === 'clothing' && (
                <div className="product-info-modal__table-wrap">
                  <table className="product-info-modal__table">
                    <thead>
                      <tr>
                        <th scope="col">Tam.</th>
                        <th scope="col">Busto</th>
                        <th scope="col">Cintura</th>
                        <th scope="col">Quadril</th>
                      </tr>
                    </thead>
                    <tbody>
                      {CLOTHING_CHART.map((row) => (
                        <tr key={row.size}>
                          <th scope="row">{row.size}</th>
                          <td>{row.bust}</td>
                          <td>{row.waist}</td>
                          <td>{row.hip}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {chartKind === 'shoes' && (
                <div className="product-info-modal__table-wrap">
                  <table className="product-info-modal__table">
                    <thead>
                      <tr>
                        <th scope="col">Tam.</th>
                        <th scope="col">Comprimento do pé</th>
                      </tr>
                    </thead>
                    <tbody>
                      {SHOE_CHART.map((row) => (
                        <tr key={row.size}>
                          <th scope="row">{row.size}</th>
                          <td>{row.cm} cm</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {chartKind === 'kids' && (
                <div className="product-info-modal__table-wrap">
                  <table className="product-info-modal__table">
                    <thead>
                      <tr>
                        <th scope="col">Tam.</th>
                        <th scope="col">Altura</th>
                        <th scope="col">Idade aprox.</th>
                      </tr>
                    </thead>
                    <tbody>
                      {KIDS_CHART.map((row) => (
                        <tr key={row.size}>
                          <th scope="row">{row.size}</th>
                          <td>{row.height} cm</td>
                          <td>{row.age}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {chartKind === 'accessories' && (
                <div className="product-info-modal__accessories">
                  <p>
                    Acessórios Terra & Estilo costumam ter tamanho único ou grades reduzidas
                    {sizes.length ? ` (${sizes.join(', ')})` : ''}. Em caso de dúvida, escolha o
                    tamanho intermediário ou fale com nosso atendimento.
                  </p>
                </div>
              )}

              {sizes.length > 0 && chartKind !== 'accessories' && (
                <p className="product-info-modal__note">
                  Disponíveis nesta peça: {sizes.join(' · ')}.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body,
  )
}

export default ProductInfoModal
