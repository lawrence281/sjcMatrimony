import { createContext, useContext, useState } from 'react'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [items, setItems] = useState([])
  const [isOpen, setIsOpen] = useState(false)

  const addItem = (product, quantity = 1) => {
    setItems(prev => {
      const existing = prev.find(i => i.product._id === product._id)
      if (existing) {
        return prev.map(i =>
          i.product._id === product._id
            ? { ...i, quantity: i.quantity + quantity }
            : i
        )
      }
      return [...prev, { product, quantity }]
    })
    setIsOpen(true)
  }

  const removeItem = (id) => {
    setItems(prev => prev.filter(i => i.product._id !== id))
  }

  const updateQty = (id, delta) => {
    setItems(prev => prev
      .map(i => i.product._id === id ? { ...i, quantity: i.quantity + delta } : i)
      .filter(i => i.quantity > 0)
    )
  }

  const setItemQty = (id, absoluteQty) => {
    setItems(prev => prev
      .map(i => i.product._id === id ? { ...i, quantity: Math.max(0, absoluteQty) } : i)
      .filter(i => i.quantity > 0)
    )
  }

  const clearCart = () => setItems([])

  const subtotal = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0)
  const count = items.reduce((sum, i) => sum + i.quantity, 0)

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQty, setItemQty, clearCart, subtotal, count, isOpen, setIsOpen }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
