import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Heart } from 'lucide-react'
import { useCart } from '../context/CartContext'
import api from '../services/api'
import toast from 'react-hot-toast'
import { formatPrice } from '../utils/format'
import { DEFAULT_FIREWORK_IMG } from '../constants'

function Stars({ rating, className = '' }) {
  return (
    <span className={`rating-stars ${className}`}>
      {'★'.repeat(Math.round(rating))}{'☆'.repeat(5 - Math.round(rating))}
    </span>
  )
}

export default function ProductDetail() {
  const { id } = useParams()
  const { addItem, items, setItemQty } = useCart()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [mainImg, setMainImg] = useState(0)
  const [qty, setQty] = useState(1)
  const [wished, setWished] = useState(false)

  const itemKey = product ? product._id : ''
  const cartItem = items.find(i => i.product._id === itemKey)

  // Sync qty state with cart
  useEffect(() => {
    if (cartItem) {
      setQty(cartItem.quantity)
    } else {
      setQty(1)
    }
  }, [cartItem?.quantity, !!cartItem])

  const updateQuantity = (newQty) => {
    setQty(newQty)
    if (cartItem) {
      setItemQty(itemKey, newQty)
    }
  }

  const PLACEHOLDER_IMG = DEFAULT_FIREWORK_IMG

  useEffect(() => {
    setLoading(true)
    api.get(`/products/${id}`)
      .then(r => {
        setProduct(r.data.product)
        const list = JSON.parse(localStorage.getItem('wishlist') || '[]')
        setWished(list.some(p => p._id === r.data.product._id))
      })
      .catch(() => toast.error('Product not found'))
      .finally(() => setLoading(false))
  }, [id])

  const handleWishlist = () => {
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

  if (loading) return <div className="loading-wrap"><div className="loading-ring" /></div>
  if (!product) return <div className="container" style={{ padding: '60px 24px', textAlign: 'center' }}>Product not found</div>

  const images = product.images?.length > 0
    ? product.images.map(i => i.startsWith('/') ? `http://localhost:3009${i}` : i)
    : [PLACEHOLDER_IMG]

  const handleAddToCart = () => {
    if (cartItem) {
      toast.success('Cart updated!')
      return
    }
    addItem(product, qty)
    toast.success(`${product.name} added to cart!`)
  }

  const discount = product.originalPrice > 0
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0

  return (
    <div className="product-detail">
      <div className="container">
        <div className="breadcrumb">
          <Link to="/">Home</Link>
          <span>›</span>
          <Link to="/products">Products</Link>
          <span>›</span>
          <span>{product.name}</span>
        </div>

        <div className="product-detail-grid">
          <div className="product-gallery">
            <div className="gallery-main">
              <img 
                src={images[mainImg]} 
                alt={product.name} 
                className={product.isOutOfStock ? 'out-of-stock-fade' : ''}
                onError={(e) => { e.target.onerror = null; e.target.src = PLACEHOLDER_IMG; }}
              />
            </div>
            {images.length > 1 && (
              <div className="gallery-thumbs">
                {images.map((img, i) => (
                  <div key={i} className={`gallery-thumb ${mainImg === i ? 'active' : ''}`}
                    onClick={() => setMainImg(i)}>
                    <img 
                      src={img} 
                      alt={`${product.name} ${i + 1}`} 
                      onError={(e) => { e.target.onerror = null; e.target.src = PLACEHOLDER_IMG; }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="product-detail-info">
            <div className="product-detail-category">{product.category?.name}</div>
            <h1 className="product-detail-name">{product.name}</h1>

            <div className="product-detail-rating">
              <Stars rating={product.averageRating || 0} />
              <span className="rating-val">
                {product.averageRating || 0}
              </span>
              <span className="review-count">
                ({product.totalReviews || 0} review{product.totalReviews !== 1 ? 's' : ''})
              </span>
            </div>

            <div className="detail-price-row">
              <div className="product-detail-price">{formatPrice(product.price)}</div>
              {product.originalPrice > 0 && (
                <div className="product-detail-original">
                  {formatPrice(product.originalPrice)}
                  <span className="detail-discount-badge" style={{ marginLeft: 8 }}>
                    -{discount}% OFF
                  </span>
                </div>
              )}
            </div>

            <p className="product-detail-desc">{product.description}</p>


            <div className="option-label">Quantity</div>
            <div className={`qty-control ${product.isOutOfStock ? 'disabled' : ''}`}>
              <button className="qty-btn" onClick={() => updateQuantity(Math.max(1, qty - 1))} disabled={product.isOutOfStock}>−</button>
              <span className="qty-display">{product.isOutOfStock ? 0 : qty}</span>
              <button className="qty-btn" onClick={() => updateQuantity(Math.min(product.stock, qty + 1))} disabled={product.isOutOfStock}>+</button>
            </div>

            {product.isOutOfStock ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div className="stock-status-out">Out of Stock</div>
                <button className="btn btn-dark" style={{ width: '100%', padding: '14px', borderRadius: '12px' }} 
                  onClick={() => toast.success("We'll notify you when it's back in stock!")}>
                  🔔 Notify Me
                </button>
              </div>
            ) : (
              <button className="add-to-cart-btn" onClick={handleAddToCart}>
                {cartItem ? '✓ In Cart (Syncing)' : '🛒 Add to Cart'}
              </button>
            )}
            <button className={`wishlist-btn ${wished ? 'active' : ''}`} onClick={handleWishlist}>
              <Heart size={16} fill={wished ? '#ff4d00' : 'none'} color={wished ? '#ff4d00' : 'currentColor'} />
              {wished ? 'Saved to Target List' : 'Save to Target List'}
            </button>

            {/* <p className={`product-stock-status ${product.stock < 5 && product.stock > 0 ? 'low' : product.stock > 0 ? 'in' : 'out'}`}>
              {product.stock < 5 && product.stock > 0 ? `⚠️ Only ${product.stock} left!` : product.stock > 0 ? `✓ In stock (${product.stock} available)` : '✗ Out of stock'}
            </p> */}
          </div>
        </div>

        <div className="reviews-section">
          <div className="reviews-header">
            <h2>Customer Reviews</h2>
            {product.totalReviews > 0 && (
              <div className="reviews-summary">
                <Stars rating={product.averageRating} />
                <span className="reviews-avg-val">{product.averageRating}</span>
                <span className="reviews-total-scale">/ 5</span>
              </div>
            )}
          </div>

          {!product.ratings || product.ratings.length === 0 ? (
            <div className="empty-reviews">
              <div className="empty-reviews-icon">⭐</div>
              <p>No reviews yet. Be the first to review this product!</p>
            </div>
          ) : (
            product.ratings.map((review, i) => (
              <div key={i} className="review-card">
                <div className="review-header">
                  <div>
                    <div className="reviewer-name">{review.user?.name || 'Verified Buyer'}</div>
                    <Stars rating={review.rating} />
                  </div>
                  <div className="review-date">{new Date(review.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</div>
                </div>
                {review.review && <p className="review-text">{review.review}</p>}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
