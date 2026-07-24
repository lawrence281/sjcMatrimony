import { useNavigate } from 'react-router-dom'
import { Heart, ShoppingBag, Trash2 } from 'lucide-react'
import { useState, useEffect } from 'react'
import ProductCard from '../components/ProductCard'

export default function Wishlist() {
  const [wishlist, setWishlist] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const saved = localStorage.getItem('wishlist')
    if (saved) setWishlist(JSON.parse(saved))

    const handleStorage = () => {
      const updated = localStorage.getItem('wishlist')
      if (updated) setWishlist(JSON.parse(updated))
    }
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  const handleRemove = (productId) => {
    const updated = wishlist.filter(p => p._id !== productId)
    setWishlist(updated)
    localStorage.setItem('wishlist', JSON.stringify(updated))
  }

  return (
    <div className="wishlist-page container section">
      <div className="section-header">
        <h1 className="section-title">Target Display List</h1>
        <p className="section-sub">Keep track of the effects you want for your next big show.</p>
      </div>

      {wishlist.length > 0 ? (
        <div className="products-grid products-grid-4">
          {wishlist.map(product => (
            <div key={product._id} className="wishlist-item-wrapper">
              <ProductCard product={product} />
              <button 
                className="wishlist-remove-overlay" 
                onClick={(e) => { e.stopPropagation(); handleRemove(product._id); }}
                title="Remove from list"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="wishlist-empty-container">
          <div className="wishlist-empty-icon">
            <Heart size={44} strokeWidth={1.5} />
          </div>
          <h2 className="wishlist-empty-text">Your list is empty</h2>
          <p className="wishlist-empty-desc">Scout some amazing effects and save them here.</p>
          <button onClick={() => navigate('/products')} className="btn-orange">Explore Catalog</button>
        </div>
      )}
    </div>
  )
}
