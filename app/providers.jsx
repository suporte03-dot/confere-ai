'use client'

import { ShopProvider } from '../src/context/ShopContext'

export default function Providers({
  children,
  products = [],
  categories = [],
  collections = [],
}) {
  return (
    <ShopProvider products={products} categories={categories} collections={collections}>
      {children}
    </ShopProvider>
  )
}
