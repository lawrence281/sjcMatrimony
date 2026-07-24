import { Link, useLocation } from 'react-router-dom'
import { CheckCircle, Package, Truck, Zap } from 'lucide-react'
import { APP_NAME } from '../constants'
import { useEffect, useState } from 'react'
import api from '../services/api'
import { formatPrice } from '../utils/format'

export default function OrderSuccess() {
  const { state } = useLocation()
  const orderId = state?.orderId
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (orderId) {
      api.get(`/orders/${orderId}`)
        .then(res => setOrder(res.data.order))
        .catch(err => console.error('Failed to load order details'))
        .finally(() => setLoading(false))
    }
  }, [orderId])

  return (
    <div className="success-page container">
      <div className="success-card">
        <div className="success-icon">
          <CheckCircle size={40} />
        </div>
        <h1>Display Booked!</h1>
        <p style={{ margin: '10px 0 20px' }}>
          Thank you for choosing {APP_NAME}. Your sequence is confirmed and our technicians are preparing your shipment.
        </p>

        {orderId && (
          <div className="order-id-badge" style={{ marginBottom: 20 }}>
            Manifest #{orderId.slice(-8).toUpperCase()}
          </div>
        )}

        {loading ? (
          <div className="loading-wrap"><div className="loading-ring" /></div>
        ) : order && (
          <div style={{ textAlign: 'left', background: '#f8fafc', padding: 20, borderRadius: 12, marginBottom: 24, border: '1px solid #e2e8f0' }}>
            <h4 style={{ fontSize: 12, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Package size={14} /> Mission Cargo
            </h4>
            <div style={{ marginBottom: 16 }}>
              {order.items.map((item, idx) => (
                <div key={idx} style={{ fontSize: 14, display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span>{item.product?.name || item.name} x{item.quantity}</span>
                  <span style={{ fontWeight: 600 }}>{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div style={{ borderTop: '1px dashed #cbd5e1', paddingTop: 12, display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: 16 }}>
              <span>Total Investment</span>
              <span>{formatPrice(order.total)}</span>
            </div>
          </div>
        )}

        <p style={{ fontSize: 13, color: 'var(--text-body)', marginBottom: 24 }}>
          📱 You'll receive a WhatsApp dispatch notification shortly.
        </p>
        
        <div className="success-actions">
          <Link to="/" className="btn btn-dark">Return to Base</Link>
          <Link to="/products" className="btn btn-outline">
            View Catalog
          </Link>
        </div>
      </div>
    </div>
  )
}

