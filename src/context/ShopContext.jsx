'use client'

import { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import {
  matchesFilter,
  getFilterLabel,
  searchProducts,
} from '../data/mockData'
import { pathForFilter } from '../data/catalog'
import { resolveSearchIntent } from '../data/searchMap'

const FAVORITES_KEY = 'terraestilo-favorites'
const CART_KEY = 'terraestilo-cart'

function loadStoredFavorites() {
  try {
    const stored = localStorage.getItem(FAVORITES_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

function loadStoredCart() {
  try {
    const stored = localStorage.getItem(CART_KEY)
    const parsed = stored ? JSON.parse(stored) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function resolveVariantId(product, selectedSize, selectedColor) {
  if (product?.variantId) return product.variantId
  const variants = product?.variants || []
  if (!variants.length) return null
  const match = variants.find((v) => {
    const sizeOk = !selectedSize || v.size === selectedSize
    const colorOk = !selectedColor || !v.color || v.color === selectedColor
    return sizeOk && colorOk && (Number(v.stock) || 0) > 0
  })
  return match?.id || variants.find((v) => {
    const sizeOk = !selectedSize || v.size === selectedSize
    const colorOk = !selectedColor || !v.color || v.color === selectedColor
    return sizeOk && colorOk
  })?.id || null
}

function cartLineKey(product) {
  const size = product.selectedSize || product.size || ''
  const color = product.selectedColor || product.color || ''
  const variantId = product.variantId || ''
  return `${product.id}::${variantId}::${size}::${color}`
}

const ShopContext = createContext(null)

export function ShopProvider({
  children,
  products: catalogProducts = [],
  categories = [],
  collections = [],
}) {
  const router = useRouter()
  const products = Array.isArray(catalogProducts) ? catalogProducts : []
  const [cart, setCart] = useState([])
  const [cartHydrated, setCartHydrated] = useState(false)
  const [favorites, setFavorites] = useState(loadStoredFavorites)
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('Todos')
  const [cartOpen, setCartOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState(null)

  useEffect(() => {
    setCart(loadStoredCart())
    setCartHydrated(true)
  }, [])

  useEffect(() => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites))
  }, [favorites])

  useEffect(() => {
    if (!cartHydrated) return
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(cart))
    } catch {
      // ignore quota / private mode
    }
  }, [cart, cartHydrated])

  const showToast = useCallback((message) => {
    setToastMessage(message)
    window.setTimeout(() => setToastMessage(null), 3500)
  }, [])

  const navigateToCollection = useCallback((filterId) => {
    setSearchQuery('')
    setCategoryFilter(filterId || 'Todos')
    const path = pathForFilter(filterId)
    router.push(path)
  }, [router])

  const performSearch = useCallback((termOverride) => {
    const term = (termOverride ?? searchQuery).trim()
    if (!term) return false

    const intent = resolveSearchIntent(term)

    if (intent.type === 'special') {
      setSearchQuery('')
      setCategoryFilter('Todos')
      if (intent.path === '/#novidades') {
        router.push('/')
        window.setTimeout(() => {
          document.getElementById('novidades')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }, 80)
        return true
      }
      router.push(intent.path || '/colecoes')
      return true
    }

    if (intent.type === 'category') {
      setSearchQuery('')
      setCategoryFilter(intent.category || 'Todos')
      router.push(intent.path || pathForFilter(intent.category))
      return true
    }

    setSearchQuery(term)
    setCategoryFilter('Todos')
    router.push(intent.path || `/busca?q=${encodeURIComponent(term)}`)
    return true
  }, [router, searchQuery])

  const clearSearch = useCallback(() => {
    setSearchQuery('')
    setCategoryFilter('Todos')
  }, [])

  const addToCart = useCallback((product, options = {}) => {
    const selectedSize = options.size ?? product.selectedSize ?? product.size
    const selectedColor = options.color ?? product.selectedColor ?? product.color ?? null
    const requireSize = options.requireSize !== false
    const sizesNeeded = requireSize && !(options.skipSizeCheck)

    if (sizesNeeded && !selectedSize) {
      showToast('Selecione um tamanho para continuar.')
      return false
    }

    const catalogProduct = products.find((p) => p.id === product.id) || product
    const variantId =
      options.variantId ||
      resolveVariantId(catalogProduct, selectedSize, selectedColor)

    if (!variantId) {
      showToast('Selecione um tamanho disponível para continuar.')
      return false
    }

    const lineBase = {
      id: product.id,
      name: product.name,
      price: Number(catalogProduct.price ?? product.price) || 0,
      image: product.image || catalogProduct.image,
      subcategory: product.subcategory || catalogProduct.subcategory,
      variant: product.variant,
      selectedSize: selectedSize || null,
      selectedColor: selectedColor || null,
      variantId,
    }
    const line = {
      ...lineBase,
      lineId: cartLineKey(lineBase),
    }

    setCart((prev) => {
      const existing = prev.find((item) => item.lineId === line.lineId)
      if (existing) {
        return prev.map((item) =>
          item.lineId === line.lineId ? { ...item, qty: item.qty + 1 } : item,
        )
      }
      return [...prev, { ...line, qty: 1 }]
    })
    setCartOpen(true)
    const bits = [selectedSize, selectedColor].filter(Boolean).join(' · ')
    const detailLabel = bits ? ` (${bits})` : ''
    showToast(`${product.name}${detailLabel} adicionado ao carrinho.`)
    return true
  }, [products, showToast])

  const removeFromCart = useCallback((lineIdOrProductId) => {
    setCart((prev) =>
      prev.filter((item) => item.lineId !== lineIdOrProductId && item.id !== lineIdOrProductId),
    )
  }, [])

  const updateQty = useCallback((lineIdOrProductId, qty) => {
    if (qty < 1) {
      removeFromCart(lineIdOrProductId)
      return
    }
    setCart((prev) =>
      prev.map((item) =>
        item.lineId === lineIdOrProductId || item.id === lineIdOrProductId
          ? { ...item, qty }
          : item,
      ),
    )
  }, [removeFromCart])

  const clearCart = useCallback(() => {
    setCart([])
  }, [])

  const toggleFavorite = useCallback((productId) => {
    setFavorites((prev) => {
      if (prev.includes(productId)) {
        showToast('Removido dos favoritos.')
        return prev.filter((id) => id !== productId)
      }
      showToast('Adicionado aos favoritos.')
      return [...prev, productId]
    })
  }, [showToast])

  const cartCount = useMemo(() => cart.reduce((sum, item) => sum + item.qty, 0), [cart])
  const cartSubtotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.qty, 0),
    [cart],
  )

  const isSearchActive = Boolean(searchQuery.trim())

  const filteredProducts = useMemo(() => {
    if (isSearchActive) {
      return searchProducts(searchQuery, products)
    }

    return products.filter((product) => matchesFilter(product, categoryFilter))
  }, [categoryFilter, isSearchActive, products, searchQuery])

  const activeFilterLabel = useMemo(() => {
    if (isSearchActive) {
      return `Busca: “${searchQuery.trim()}”`
    }
    return getFilterLabel(categoryFilter)
  }, [categoryFilter, isSearchActive, searchQuery])

  const value = {
    products,
    categories,
    collections,
    cart,
    cartCount,
    cartSubtotal,
    cartOpen,
    setCartOpen,
    favorites,
    favoritesCount: favorites.length,
    searchQuery,
    setSearchQuery,
    performSearch,
    clearSearch,
    isSearchActive,
    categoryFilter,
    setCategoryFilter,
    navigateToCollection,
    filteredProducts,
    activeFilterLabel,
    addToCart,
    removeFromCart,
    updateQty,
    clearCart,
    toggleFavorite,
    isFavorite: (id) => favorites.includes(id),
    toastMessage,
    setToastMessage,
    showToast,
  }

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useShop() {
  const ctx = useContext(ShopContext)
  if (!ctx) throw new Error('useShop must be used within ShopProvider')
  return ctx
}
