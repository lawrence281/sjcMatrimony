import { useNavigate,Link } from 'react-router-dom'
import { X, ShoppingBag, ArrowRight, LogIn, Trash2 } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import { formatPrice } from '../utils/format'

export default function CartDrawer({ isOpen, onClose }) {
  const { items, removeItem, updateQty, subtotal } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

  const handleCheckout = () => {
    if (!user) {
      toast.error('Please log in to proceed with checkout')
      onClose()
      navigate('/login')
      return
    }
    onClose()
    navigate('/checkout')
  }

  return (
    <>
      {isOpen && <div className="cart-overlay" onClick={onClose} />}
      <aside className={`cart-drawer ${isOpen ? 'open' : ''}`}>
        <div className="cart-header">
          <h3>Your Cart ({items.length})</h3>
          <button className="cart-close" onClick={onClose}><X size={20} /></button>
        </div>

        <div className="cart-items">
          {items.length === 0 ? (
            <div className="empty-cart">
              <ShoppingBag size={48} style={{ margin: '0 auto 12px', display: 'block', opacity: 0.2 }} />
              <p>Your cart is empty</p>
            </div>
          ) : items.map(item => {
            const key = item.product._id
            return (
              <div key={key} className="cart-item">
                {item.product.images?.[0]
                  ? <img src={item.product.images[0].startsWith('/') ? `http://localhost:3009${item.product.images[0]}` : item.product.images[0]} className="cart-item-img" alt={item.product.name} />
                  : <div className="cart-item-img" style={{ display: 'grid', placeItems: 'center', color: '#ccc' }}>📦</div>}
                <div className="cart-item-info">
                  <div className="cart-item-name">{item.product.name}</div>
                  <div className="cart-item-row">
                    <div className="cart-item-qty">
                      <button className="cart-qty-btn" onClick={() => updateQty(key, -1)}>−</button>
                      <span>{item.quantity}</span>
                      <button className="cart-qty-btn" onClick={() => updateQty(key, 1)}>+</button>
                      <button 
                        className="cart-item-remove" 
                        onClick={() => removeItem(key)}
                        style={{ marginLeft: 12, background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                        title="Remove"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <span className="cart-item-price">{formatPrice(item.product.price * item.quantity)}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="cart-footer">
          {items.length > 0 && (
            <div className="cart-total-row">
              <span>Subtotal</span><span>{formatPrice(subtotal)}</span>
            </div>
          )}
          <div className="cart-actions-column">
            {items.length > 0 && (
              <button className="checkout-link" onClick={handleCheckout}>
                {user ? <ArrowRight size={16} /> : <LogIn size={16} />}
                {user ? `Checkout · ${formatPrice(subtotal)}` : 'Log In to Checkout'}
              </button>
            )}
            <button className="btn-continue-shopping" onClick={onClose}>
              Continue Shopping
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}

