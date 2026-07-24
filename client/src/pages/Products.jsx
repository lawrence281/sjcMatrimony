import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'
import { Package } from 'lucide-react'
import { formatPrice } from '../utils/format'

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)
  const [sort, setSort] = useState('-createdAt')
  const [maxPrice, setMaxPrice] = useState(1000)
  const [minRating, setMinRating] = useState(0)

  const activeCategory = searchParams.get('category') || ''
  const search = searchParams.get('search') || ''
  const badge = searchParams.get('badge') || ''
  const featured = searchParams.get('featured') || ''

  useEffect(() => {
    api.get('/categories').then(r => setCategories(r.data.categories.filter(c => c.isActive)))
  }, [])

  useEffect(() => {
    fetchProducts()
  }, [activeCategory, search, badge, featured, page, sort, maxPrice, minRating])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const params = { page, limit: 12, sort, maxPrice }
      if (activeCategory) params.category = activeCategory
      if (search) params.search = search
      if (badge) params.badge = badge
      if (featured) params.featured = featured
      if (minRating > 0) params.rating = minRating

      const res = await api.get('/products', { params })
      setProducts(res.data.products)
      setTotal(res.data.total)
      setPages(res.data.pages)
    } catch (err) {
      console.error('Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  const setCategory = (slug) => {
    const p = new URLSearchParams()
    if (slug) p.set('category', slug)
    setSearchParams(p)
    setPage(1)
  }

  return (
    <div className="products-page">
      <div className="container">
        {/* Breadcrumb */}
        <div className="breadcrumb">
          <a href="/">Home</a>
          <span>›</span>
          <span>{activeCategory ? categories.find(c => c.slug === activeCategory)?.name || activeCategory : 'All Products'}</span>
        </div>

        <div className="products-list-header">
          <h1>
            {search ? `Search: "${search}"` : activeCategory ? categories.find(c => c.slug === activeCategory)?.name || 'Products' : 'All Effects'}
          </h1>
          <p>
            The ultimate arsenal for display professionals and lighting enthusiasts. Explore our curated selection of high-impact pyrotechnics.
          </p>
        </div>

        <div className="products-layout">
          {/* Filter Sidebar */}
          <aside className="filter-sidebar">
            <div className="filter-group">
              <div className="filter-title">Categories</div>
              <div className="filter-option" onClick={() => setCategory('')} style={{ cursor: 'pointer' }}>
                <span className={!activeCategory ? 'filter-option active' : ''}>All</span>
                {!activeCategory && <span className="filter-option-badge">✓</span>}
              </div>
              {categories.map(cat => {
                const isActive = activeCategory === cat.slug
                return (
                  <div key={cat._id} className={`filter-option ${isActive ? 'active' : ''}`}
                    onClick={() => setCategory(isActive ? '' : cat.slug)} style={{ cursor: 'pointer' }}>
                    <span>{cat.name}</span>
                    {isActive && <span className="filter-option-badge">✓</span>}
                  </div>
                )
              })}
            </div>

            <div className="filter-group">
              <div className="filter-title">Price Range</div>
              <div className="price-range">
                <input type="range" className="price-slider" min="0" max="1000" step="10" value={maxPrice}
                  onChange={e => { setMaxPrice(Number(e.target.value)); setPage(1) }} />
                <div className="price-labels"><span>{formatPrice(0)}</span><span>{formatPrice(maxPrice)}+</span></div>
              </div>
            </div>

            <div className="filter-group">
              <div className="filter-title">Min Reviews</div>
              {[0, 3, 4, 4.5].map(r => (
                <div key={r} className={`filter-option ${minRating === r ? 'active' : ''}`}
                  onClick={() => { setMinRating(r); setPage(1) }} style={{ cursor: 'pointer' }}>
                  <span>
                    {r === 0 ? 'Any rating' : (
                      <>
                        <span className="rating-stars">{'★'.repeat(Math.floor(r))}</span>
                        {r % 1 !== 0 && <span className="rating-stars">½</span>}
                        {' & up'}
                      </>
                    )}
                  </span>
                  {minRating === r && <span className="filter-option-badge">✓</span>}
                </div>
              ))}
            </div>

            {(activeCategory || minRating > 0 || badge) && (
              <button className="filter-clear-btn"
                onClick={() => { setCategory(''); setMinRating(0); setSearchParams({}) }}>
                ✕ Clear all filters
              </button>
            )}
          </aside>

          {/* Product Grid */}
          <div>
            {/* My Recent Orders (Requirement Fix) */}
            <RecentOrders />

            <div className="products-header">
              <span className="products-count">Showing {products.length} of {total} results</span>
              <select className="sort-select" value={sort} onChange={e => { setSort(e.target.value); setPage(1) }}>
                <option value="-createdAt">Sort by: Newest</option>
                <option value="price">Price: Low to High</option>
                <option value="-price">Price: High to Low</option>
                <option value="-salesCount">Sort by: Popularity</option>
                <option value="-averageRating">Sort by: Rating</option>
              </select>
            </div>

            {loading ? (
              <div className="loading-wrap"><div className="loading-ring" /></div>
            ) : products.length === 0 ? (
              <div className="empty-state-container">
                <div className="empty-state-icon">🔍</div>
                <p className="empty-state-title">No products found</p>
                <p className="empty-state-desc">Try adjusting your filters</p>
              </div>
            ) : (
              <div className="products-grid">
                {products.map(p => <ProductCard key={p._id} product={p} />)}
              </div>
            )}

            {/* Pagination */}
            {pages > 1 && (
              <div className="pagination">
                <button className={`page-btn ${page === 1 ? 'disabled' : ''}`}
                  onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>‹</button>
                {Array.from({ length: Math.min(pages, 10) }, (_, i) => i + 1).map(p => (
                  <button key={p} className={`page-btn ${page === p ? 'active' : ''}`}
                    onClick={() => setPage(p)}>{p}</button>
                ))}
                {pages > 10 && <button className="page-btn disabled">...</button>}
                <button className={`page-btn ${page === pages ? 'disabled' : ''}`}
                  onClick={() => setPage(p => Math.min(pages, p + 1))} disabled={page === pages}>›</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function RecentOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setLoading(true);
      api.get('/orders/my?limit=1')
        .then(res => setOrders(res.data.orders.slice(0, 1)))
        .catch(() => { })
        .finally(() => setLoading(false));
    }
  }, [user]);

  if (!user || orders.length === 0) return null;

  const order = orders[0];

  return (
    <div style={{ marginBottom: 30, background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12, padding: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Package size={18} color="var(--brand)" />
          <h3 style={{ fontSize: 14, fontWeight: 700 }}>Your Recent Order</h3>
        </div>
        <a href="/profile" style={{ fontSize: 12, color: 'var(--brand)', textDecoration: 'none', fontWeight: 600 }}>View History</a>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20 }}>
        <div style={{ flex: 1, minWidth: 200 }}>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>ID: <span style={{ color: 'var(--text-dark)', fontWeight: 600 }}>#{order._id.slice(-8).toUpperCase()}</span></div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Status: <span style={{ textTransform: 'capitalize', color: 'var(--success)', fontWeight: 600 }}>{order.status}</span></div>
        </div>
        <div style={{ flex: 2, minWidth: 250 }}>
          <div style={{ fontSize: 13 }}>
            {order.items.map((it, idx) => (
              <span key={idx}>{it.product?.name || it.name} (x{it.quantity}){idx < order.items.length - 1 ? ', ' : ''}</span>
            ))}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 2 }}>Total</div>
          <div style={{ fontSize: 16, fontWeight: 800 }}>{formatPrice(order.total)}</div>
        </div>
      </div>
    </div>
  );
}
