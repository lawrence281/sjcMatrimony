import { Link, useNavigate } from 'react-router-dom'
import { Heart, Star, ShoppingBag } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useState } from 'react'
import { formatPrice } from '../utils/format'
import toast from 'react-hot-toast'
import { DEFAULT_FIREWORK_IMG } from '../constants'

export default function ProductCard({ product }) {
  const { addItem } = useCart()
  const navigate = useNavigate()
  const [wished, setWished] = useState(() => {
    const list = JSON.parse(localStorage.getItem('wishlist') || '[]')
    return list.some(p => p._id === product._id)
  })

  const handleWishlist = (e) => {
    e.stopPropagation()
    const list = JSON.parse(localStorage.getItem('wishlist') || '[]')
    let newList
    if (wished) {
      newList = list.filter(p => p._id !== product._id)
      toast.success('Removed from Target List')
    } else {
      newList = [...list, product]
      toast.success('Added to Target List')
    }
    localStorage.setItem('wishlist', JSON.stringify(newList))
    setWished(!wished)
    window.dispatchEvent(new Event('storage'))
  }

  const handleAddToCart = (e) => {
    e.stopPropagation()
    addItem(product, 1)
    toast.success(`${product.name} added to cart!`)
  }

  const stars = Math.round(product.averageRating || 0)

  return (
    <div className="product-card" onClick={() => navigate(`/products/${product._id}`)}>
      <div className="product-img-wrap">
        <img 
          src={product.images?.[0] ? (product.images[0].startsWith('/') ? `http://localhost:3009${product.images[0]}` : product.images[0]) : DEFAULT_FIREWORK_IMG} 
          alt={product.name} 
          loading="lazy" 
          className={product.isOutOfStock ? 'out-of-stock-fade' : ''}
          onError={(e) => { e.target.onerror = null; e.target.src = DEFAULT_FIREWORK_IMG; }}
        />
        {product.badge ? (
          <span className={`product-badge ${product.badge === 'SAVE' ? 'badge-save' : product.badge.includes('NEW') ? 'badge-new' : ''}`}>
            {product.badge}
          </span>
        ) : product.isCombo ? (
          <span className="product-badge" style={{ background: 'var(--brand)', color: 'white' }}>COMBO PACK</span>
        ) : product.isOutOfStock ? (
          <span className="product-badge badge-out-of-stock">OUT OF STOCK</span>
        ) : null}
        <button className={`product-wishlist ${wished ? 'active' : ''}`}
          onClick={handleWishlist}>
          <Heart size={14} fill={wished ? 'currentColor' : 'none'} />
        </button>
      </div>
      <div className="product-info">
        <div className="product-category">{product.category?.name}</div>
        <div className="product-name">{product.name}</div>

        <div className="product-rating">
          <span className="stars-display">{'★'.repeat(stars)}{'☆'.repeat(5 - stars)}</span>
          <span className="rating-count">({product.totalReviews || 0})</span>
        </div>
        <div className="product-price">
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span className="price-current">{formatPrice(product.price)}</span>
            {product.originalPrice > 0 && <span className="price-original">{formatPrice(product.originalPrice)}</span>}
          </div>
          <button 
            className={`add-to-cart-small ${product.isOutOfStock ? 'disabled' : ''}`} 
            onClick={product.isOutOfStock ? (e) => e.stopPropagation() : handleAddToCart} 
            title={product.isOutOfStock ? 'Out of Stock' : 'Quick Add'}
            disabled={product.isOutOfStock}
          >
            <ShoppingBag size={15} />
          </button>
        </div>
      </div>
    </div>
  )
}
