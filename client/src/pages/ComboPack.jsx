import { useState, useEffect } from 'react'
import ProductCard from '../components/ProductCard'
import api from '../services/api'
import { useLanguage } from '../context/LanguageContext'

export default function ComboPack() {
  const { t } = useLanguage()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)
  const [sort, setSort] = useState('-createdAt')

  useEffect(() => {
    fetchCombos()
  }, [page, sort])

  const fetchCombos = async () => {
    setLoading(true)
    try {
      const params = { isCombo: 'true', page, limit: 12, sort }
      const res = await api.get('/products', { params })
      setProducts(res.data.products)
      setTotal(res.data.total)
      setPages(res.data.pages)
    } catch (err) {
      console.error('Failed to lead combo products', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="products-page">
      <div className="container">
        {/* Simple Breadcrumb */}
        <div className="breadcrumb">
          <a href="/">Home</a>
          <span>›</span>
          <span>{t('combo_pack')}</span>
        </div>

        <div className="products-list-header">
          <h1>{t('combo_title')}</h1>
          <p>{t('combo_subtitle')}</p>
        </div>

        <div style={{ marginTop: '20px' }}>
          <div className="products-header">
            <span className="products-count">Showing {products.length} of {total} combos</span>
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
              <div className="empty-state-icon">🎁</div>
              <p className="empty-state-title">{t('no_combos')}</p>
              <p className="empty-state-desc">{t('check_back_soon')}</p>
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
  )
}
