import { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  products,
  matchesFilter,
  getFilterLabel,
  resolveSearchCategory,
  searchProducts,
} from '../data/mockData'
import { pathForFilter } from '../data/catalog'

const FAVORITES_KEY = 'terraestilo-favorites'

function loadStoredFavorites() {
  try {
    const stored = localStorage.getItem(FAVORITES_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

function cartLineKey(product) {
  const size = product.selectedSize || product.size || ''
  return `${product.id}::${size}`
}

const ShopContext = createContext(null)

export function ShopProvider({ children }) {
  const navigate = useNavigate()
  const [cart, setCart] = useState([])
  const [favorites, setFavorites] = useState(loadStoredFavorites)
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('Todos')
  const [cartOpen, setCartOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState(null)

  useEffect(() => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites))
  }, [favorites])

  const showToast = useCallback((message) => {
    setToastMessage(message)
    window.setTimeout(() => setToastMessage(null), 3500)
  }, [])

  const navigateToCollection = useCallback((filterId) => {
    setSearchQuery('')
    setCategoryFilter(filterId || 'Todos')
    const path = pathForFilter(filterId)
    navigate(path)
  }, [navigate])

  const performSearch = useCallback((termOverride) => {
    const term = (termOverride ?? searchQuery).trim()
    if (!term) return false

    setSearchQuery(term)

    const categoryTarget = resolveSearchCategory(term)
    if (categoryTarget === '__colecoes__') {
      setCategoryFilter('Todos')
      navigate('/colecoes')
      return true
    }

    if (categoryTarget === '__novidades__') {
      setCategoryFilter('Todos')
      navigate('/')
      window.setTimeout(() => {
        document.getElementById('novidades')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 80)
      return true
    }

    if (categoryTarget) {
      setCategoryFilter(categoryTarget)
      navigate(pathForFilter(categoryTarget))
      return true
    }

    setCategoryFilter('Todos')
    navigate('/')
    window.setTimeout(() => {
      document.getElementById('novidades')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 80)
    return true
  }, [navigate, searchQuery])

  const clearSearch = useCallback(() => {
    setSearchQuery('')
    setCategoryFilter('Todos')
  }, [])

  const addToCart = useCallback((product, options = {}) => {
    const selectedSize = options.size ?? product.selectedSize ?? product.size
    const requireSize = options.requireSize !== false
    const sizesNeeded = requireSize && !(options.skipSizeCheck)

    if (sizesNeeded && !selectedSize) {
      showToast('Selecione um tamanho para continuar.')
      return false
    }

    const line = {
      ...product,
      selectedSize: selectedSize || null,
      lineId: cartLineKey({ ...product, selectedSize }),
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
    const sizeLabel = selectedSize ? ` (${selectedSize})` : ''
    showToast(`${product.name}${sizeLabel} adicionado ao carrinho.`)
    return true
  }, [showToast])

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
  }, [categoryFilter, isSearchActive, searchQuery])

  const activeFilterLabel = useMemo(() => {
    if (isSearchActive) {
      return `Busca: “${searchQuery.trim()}”`
    }
    return getFilterLabel(categoryFilter)
  }, [categoryFilter, isSearchActive, searchQuery])

  const value = {
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
