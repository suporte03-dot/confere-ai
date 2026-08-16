'use client'

import { ShopProvider } from '../src/context/ShopContext'

export default function Providers({ children }) {
  return <ShopProvider>{children}</ShopProvider>
}
