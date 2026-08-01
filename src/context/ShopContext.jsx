import { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react'
import {
  products,
  matchesFilter,
  scrollToProducts,
  scrollToSection,
  getFilterLabel,
  resolveSearchCategory,
  searchProducts,
} from '../data/mockData'

const FAVORITES_KEY = 'terraestilo-favorites'

function loadStoredFavorites() {
  try {
    const stored = localStorage.getItem(FAVORITES_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

const ShopContext = createContext(null)

export function ShopProvider({ children }) {
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
    setCategoryFilter(filterId)
    window.setTimeout(() => {
      if (document.getElementById('favoritos')) {
        scrollToSection('favoritos')
      } else if (document.getElementById('mais-vendidos')) {
        scrollToSection('mais-vendidos')
      } else {
        scrollToProducts()
      }
    }, 50)
  }, [])

  const performSearch = useCallback((termOverride) => {
    const term = (termOverride ?? searchQuery).trim()
    if (!term) return false

    setSearchQuery(term)

    const categoryTarget = resolveSearchCategory(term)
    if (categoryTarget === '__colecoes__') {
      setCategoryFilter('Todos')
      window.setTimeout(() => scrollToSection('colecoes'), 50)
      return true
    }

    if (categoryTarget) {
      setCategoryFilter(categoryTarget)
    } else {
      setCategoryFilter('Todos')
    }

    window.setTimeout(scrollToProducts, 50)
    return true
  }, [searchQuery])

  const clearSearch = useCallback(() => {
    setSearchQuery('')
    setCategoryFilter('Todos')
  }, [])

  const addToCart = useCallback((product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id)
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item,
        )
      }
      return [...prev, { ...product, qty: 1 }]
    })
    setCartOpen(true)
    showToast(`${product.name} adicionado ao carrinho.`)
  }, [showToast])

  const removeFromCart = useCallback((productId) => {
    setCart((prev) => prev.filter((item) => item.id !== productId))
  }, [])

  const updateQty = useCallback((productId, qty) => {
    if (qty < 1) {
      removeFromCart(productId)
      return
    }
    setCart((prev) =>
      prev.map((item) => (item.id === productId ? { ...item, qty } : item)),
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
