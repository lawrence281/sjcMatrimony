import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Lock, Trash2 } from 'lucide-react'
import { useCart } from '../context/CartContext'
import api from '../services/api'
import toast from 'react-hot-toast'
import { formatPrice } from '../utils/format'
import { APP_NAME, MESSAGES, PROMO } from '../constants'

const US_STATES = ['AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY']

export default function Checkout() {
  const { items, subtotal, clearCart, removeItem, updateQty } = useCart()
  const navigate = useNavigate()
  const [paymentMethod, setPaymentMethod] = useState('credit_card')
  const [promoCode, setPromoCode] = useState('')
  const [discount, setDiscount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [shipping] = useState(0)
  const tax = Math.round(subtotal * 0.08 * 100) / 100
  const total = subtotal - discount + tax + shipping

  const [form, setForm] = useState({
    fullName: '', streetAddress: '', apartment: '',
    city: '', state: 'NY', zip: '',
    cardNumber: '', expiry: '', cvv: '',
  })

  const applyPromo = () => {
    if (promoCode.toUpperCase() === PROMO.CODE) {
      setDiscount(Math.round(subtotal * (PROMO.DISCOUNT_PERCENT / 100) * 100) / 100)
      toast.success(PROMO.SUCCESS)
    } else {
      toast.error(PROMO.INVALID)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (items.length === 0) { toast.error(MESSAGES.ORDER.EMPTY_CART); return }
    setLoading(true)
    try {
      const orderPayload = {
        items: items.map(i => ({
          product: i.product._id,
          name: i.product.name,
          image: i.product.images?.[0] || '',
          price: i.product.price,
          quantity: i.quantity,
        })),
        shippingAddress: {
          fullName: form.fullName,
          streetAddress: form.streetAddress,
          apartment: form.apartment,
          city: form.city,
          state: form.state,
          zip: form.zip,
          country: 'US',
        },
        paymentMethod,
        subtotal, tax, shipping, total, promoCode, discount,
      }
      const res = await api.post('/orders', orderPayload)
      clearCart()
      toast.success(MESSAGES.ORDER.SUCCESS)
      navigate('/order-success', { state: { orderId: res.data.order._id } })
    } catch (err) {
      toast.error(err.response?.data?.message || MESSAGES.ORDER.ERROR)
    } finally {
      setLoading(false)
    }
  }

  const f = (field, val) => setForm(p => ({ ...p, [field]: val }))

  if (items.length === 0) {
    return (
      <div className="container" style={{ padding: '80px 24px', textAlign: 'center' }}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>💣</div>
        <h2>{MESSAGES.ORDER.EMPTY_CART}</h2>
        <p style={{ color: 'var(--text-body)', margin: '10px 0 24px' }}>Fill your inventory before initiating the display.</p>
        <Link to="/products" className="btn btn-dark">View Catalog</Link>
      </div>
    )
  }

  return (
    <div className="checkout-page">
      <div className="container">
        {/* Header */}
        <div className="checkout-header-row">
          <Link to="/" style={{ textDecoration: 'none' }}>
            <div className="checkout-brand-row">
              <div className="checkout-logo-icon">S</div>
              <span style={{ fontSize: 16, fontWeight: 800, color: 'var(--brand)' }}>{APP_NAME}</span>
            </div>
          </Link>
          <div className="security-badges" style={{ margin: 0 }}>
            <span className="security-badge">
              <Lock size={12} /> SECURE BOOKING
            </span>
          </div>
        </div>

        {/* Steps */}
        <div className="checkout-steps">
          <div className="checkout-step active">
            <span className="step-num">1</span> Setup
          </div>
          <div className="step-divider" />
          <div className="checkout-step active">
            <span className="step-num">2</span> Payment
          </div>
          <div className="step-divider" />
          <div className="checkout-step">
            <span className="step-num">3</span> Launch
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="checkout-grid">
            <div>
              {/* Shipping */}
              <div className="checkout-section">
                <h2 className="checkout-section-title">📍 Dispatch Address</h2>
                <div className="form-group">
                  <label>FULL NAME</label>
                  <input style={{ width: '100%', padding: '12px 14px', border: '1px solid var(--border)', borderRadius: 8, fontSize: 14, outline: 'none', fontFamily: 'inherit' }}
                    placeholder="Commander John Doe" value={form.fullName} onChange={e => f('fullName', e.target.value)} required />
                </div>
                <div className="form-group">
                  <label>STREET ADDRESS</label>
                  <input style={{ width: '100%', padding: '12px 14px', border: '1px solid var(--border)', borderRadius: 8, fontSize: 14, outline: 'none', fontFamily: 'inherit' }}
                    placeholder="123 Ignition Way" value={form.streetAddress} onChange={e => f('streetAddress', e.target.value)} required />
                </div>
                <div className="form-group">
                  <label>LOCALE INFO (OPTIONAL)</label>
                  <input style={{ width: '100%', padding: '12px 14px', border: '1px solid var(--border)', borderRadius: 8, fontSize: 14, outline: 'none', fontFamily: 'inherit' }}
                    placeholder="Gate 4 / Loading Dock" value={form.apartment} onChange={e => f('apartment', e.target.value)} />
                </div>
                <div className="checkout-form-grid">
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label>CITY</label>
                    <input className="form-input" placeholder="New York" value={form.city} onChange={e => f('city', e.target.value)} required />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label>STATE</label>
                    <select className="form-input" style={{ background: 'white' }}
                      value={form.state} onChange={e => f('state', e.target.value)}>
                      {US_STATES.map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label>ZIP</label>
                    <input className="form-input" placeholder="10001" value={form.zip} onChange={e => f('zip', e.target.value)} required />
                  </div>
                </div>
              </div>

              {/* Payment */}
              <div className="checkout-section">
                <h2 className="checkout-section-title">💳 Billing Method</h2>
                <div className="payment-options">
                  {[
                    { value: 'credit_card', label: 'Credit Card', icon: '💳' },
                    { value: 'paypal', label: 'PayPal', icon: '🅿️' },
                    { value: 'apple_pay', label: 'Apple Pay', icon: '🍎' },
                  ].map(pm => (
                    <div key={pm.value} className={`payment-option ${paymentMethod === pm.value ? 'selected' : ''}`}
                      onClick={() => setPaymentMethod(pm.value)}>
                      <span style={{ fontSize: 24 }}>{pm.icon}</span>
                      <span>{pm.label}</span>
                    </div>
                  ))}
                </div>

                {paymentMethod === 'credit_card' && (
                  <div>
                    <div className="form-group">
                      <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5, display: 'block', marginBottom: 6 }}>CARD NUMBER</label>
                      <input style={{ width: '100%', padding: '12px 14px', border: '1px solid var(--border)', borderRadius: 8, fontSize: 14, outline: 'none', fontFamily: 'monospace', letterSpacing: 2 }}
                        placeholder="0000 0000 0000 0000" value={form.cardNumber} onChange={e => f('cardNumber', e.target.value)} maxLength={19} />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5, display: 'block', marginBottom: 6 }}>EXPIRY DATE</label>
                        <input style={{ width: '100%', padding: '12px 14px', border: '1px solid var(--border)', borderRadius: 8, fontSize: 14, outline: 'none', fontFamily: 'inherit' }}
                          placeholder="MM/YY" value={form.expiry} onChange={e => f('expiry', e.target.value)} maxLength={5} />
                      </div>
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5, display: 'block', marginBottom: 6 }}>CVV</label>
                        <input style={{ width: '100%', padding: '12px 14px', border: '1px solid var(--border)', borderRadius: 8, fontSize: 14, outline: 'none', fontFamily: 'inherit' }}
                          placeholder="123" value={form.cvv} onChange={e => f('cvv', e.target.value)} maxLength={4} type="password" />
                      </div>
                    </div>
                  </div>
                )}

                <div className="security-badges">
                  <span className="security-badge">🛡️ PCI-DSS Secure</span>
                  <span className="security-badge">🔒 Encrypted Transaction</span>
                  <span className="security-badge">↩️ Refund Guarantee</span>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="order-summary-card">
              <div className="order-summary-title">Manifest Summary</div>

              {items.map(item => {
                const itemKey = item.product._id;
                return (
                  <div key={itemKey} className="order-summary-item">
                    {item.product.images?.[0]
                      ? <img src={`http://localhost:3009${item.product.images[0]}`} className="order-item-img" alt={item.product.name} />
                      : <div className="order-item-img" style={{ display: 'grid', placeItems: 'center', fontSize: 18 }}>🎆</div>}
                    <div className="order-item-details">
                      <div className="order-item-name">{item.product.name}</div>
                      <div className="order-item-meta" style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 4 }}>
                        <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Qty:</span>
                        <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border)', borderRadius: 4, overflow: 'hidden' }}>
                          <button 
                            type="button" 
                            onClick={() => updateQty(itemKey, -1)}
                            style={{ width: 24, height: 24, padding: 0, background: 'var(--light-gray)', border: 'none', cursor: 'pointer', fontSize: 16 }}
                          >−</button>
                          <span style={{ padding: '0 8px', fontSize: 12, fontWeight: 700, minWidth: 20, textAlign: 'center' }}>{item.quantity}</span>
                          <button 
                            type="button" 
                            onClick={() => updateQty(itemKey, 1)}
                            style={{ width: 24, height: 24, padding: 0, background: 'var(--light-gray)', border: 'none', cursor: 'pointer', fontSize: 16 }}
                          >+</button>
                        </div>
                      </div>
                    </div>
                    <div className="order-item-actions" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
                      <div className="order-item-price">{formatPrice(item.product.price * item.quantity)}</div>
                      <button 
                        type="button" 
                        className="order-item-remove-btn" 
                        onClick={() => removeItem(itemKey)}
                        style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', padding: 4, display: 'flex', alignItems: 'center' }}
                        title="Remove Item"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}

              <div className="promo-row">
                <input className="promo-input" placeholder="Tactical code" value={promoCode}
                  onChange={e => setPromoCode(e.target.value)} />
                <button type="button" className="promo-btn" onClick={applyPromo}>Deploy</button>
              </div>

              <div className="summary-line"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
              {discount > 0 && <div className="summary-line" style={{ color: 'var(--success)' }}><span>Tactical Discount</span><span>-{formatPrice(discount)}</span></div>}
              <div className="summary-line"><span>Service Fee</span><span className="free">{shipping === 0 ? 'Wave' : formatPrice(shipping)}</span></div>
              <div className="summary-line"><span>Regulatory Tax</span><span>{formatPrice(tax)}</span></div>
              <div className="summary-line total"><span>TOTAL</span><span>{formatPrice(total)}</span></div>

              <button type="submit" className="complete-btn" disabled={loading}>
                {loading ? 'Initiating...' : `Confirm Booking`}
              </button>
              <p className="no-hidden-fees">All fees inclusive</p>
              <p style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'center', marginTop: 12 }}>
                By clicking "Confirm Booking", you agree to our <a href="#" style={{ color: 'var(--highlight)' }}>Terms of Service</a>
              </p>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 32, paddingTop: 20, borderTop: '1px solid var(--border)', fontSize: 12, color: 'var(--text-muted)' }}>
          <span>{APP_NAME} © 2026</span>
          <div style={{ display: 'flex', gap: 20 }}>
            <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>SAFETY</a>
            <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>POLICY</a>
            <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>SUPPORT</a>
          </div>
        </div>
      </div>
    </div>
  )
}
