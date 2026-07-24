import { useState, useEffect } from 'react'
import { ShoppingCart, RefreshCw } from 'lucide-react'
import api from '../services/api'
import toast from 'react-hot-toast'
import { formatPrice } from '../utils/format'
import { MESSAGES } from '../constants'

const STATUS_OPTIONS = ['pending', 'processing', 'shipped', 'delivered', 'cancelled']
const TABS = ['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled']

export default function Orders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('all')
  const [updating, setUpdating] = useState(null)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const params = activeTab !== 'all' ? { status: activeTab } : {}
      const res = await api.get('/orders', { params })
      setOrders(res.data.orders)
    } catch (err) {
      toast.error('Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchOrders() }, [activeTab])

  const updateStatus = async (id, status) => {
    setUpdating(id)
    try {
      const res = await api.put(`/orders/${id}/status`, { status })
      setOrders(prev => prev.map(o => o._id === id ? { ...o, status } : o))
      toast.success(MESSAGES.ORDER.UPDATED)
    } catch (err) {
      toast.error('Failed to update tactical status')
    } finally {
      setUpdating(null)
    }
  }

  const filteredOrders = activeTab === 'all' ? orders : orders.filter(o => o.status === activeTab)

  return (
    <div>
      <div className="page-header-row page-header">
        <div>
          <h1>Manifest Logs</h1>
          <p>{orders.length} total displays recorded</p>
        </div>
        <button className="btn btn-outline" onClick={fetchOrders}>
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      <div className="filter-bar">
        {TABS.map(tab => (
          <button key={tab} className={`filter-tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}>
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div className="card">
        {loading ? (
          <div className="loading-spinner"><div className="spinner" /></div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Location</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map(order => (
                  <tr key={order._id}>
                    <td style={{ fontFamily: 'monospace', fontSize: 11, color: 'var(--text-muted)' }}>
                      #{order._id.slice(-8).toUpperCase()}
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, fontSize: 13 }}>
                        {order.user?.name || order.shippingAddress?.fullName || 'Guest'}
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                        {order.user?.email || order.guestEmail || ''}
                      </div>
                    </td>
                    <td style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                      {order.shippingAddress?.city}, {order.shippingAddress?.state}
                    </td>
                    <td>
                      <div style={{ fontSize: 12 }}>{order.items?.length} item{order.items?.length !== 1 ? 's' : ''}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                        {order.items?.slice(0, 2).map(i => i.name).join(', ')}
                        {order.items?.length > 2 ? '...' : ''}
                      </div>
                    </td>
                    <td style={{ fontWeight: 700, color: 'var(--success)' }}>{formatPrice(order.total || 0)}</td>
                    <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                      {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td>
                      <select className="status-select" value={order.status}
                        disabled={updating === order._id}
                        onChange={e => updateStatus(order._id, e.target.value)}>
                        {STATUS_OPTIONS.map(s => (
                          <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
                {filteredOrders.length === 0 && (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>
                      <ShoppingCart size={32} style={{ margin: '0 auto 10px', display: 'block', opacity: 0.3 }} />
                      No manifests recorded
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
