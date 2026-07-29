import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  CreditCard, Check, Sparkles, ShieldCheck, Heart, ArrowRight,
  RefreshCw, CheckCircle2, AlertCircle, PhoneCall, Eye, Star
} from 'lucide-react'
import api from '../services/api'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import { UI_MESSAGES } from '../constants/uiMessages'

export default function Membership() {
  const navigate = useNavigate()
  const { user } = useAuth()

  const [plans, setPlans] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [confirmModalOpen, setConfirmModalOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchActivePlans()
  }, [])

  const fetchActivePlans = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await api.get('/subscriptions?status=active&sortBy=displayOrder&sortOrder=asc')
      if (res.data && res.data.success) {
        setPlans(res.data.subscriptions || [])
      } else {
        setPlans([])
      }
    } catch (err) {
      console.error('Error fetching subscription plans:', err)
      setError('Failed to load membership plans. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleChoosePlan = (plan) => {
    if (!user) {
      toast.error('Please log in to choose a membership plan.')
      navigate('/login', { state: { from: '/subscription' } })
      return
    }
    setSelectedPlan(plan)
    setConfirmModalOpen(true)
  }

  const handleConfirmSubscription = async () => {
    if (!selectedPlan) return
    setSubmitting(true)
    try {
      toast.success(`You have selected the "${selectedPlan.name}" plan! Our relationship manager will connect with you shorty.`)
      setConfirmModalOpen(false)
      setSelectedPlan(null)
    } catch (err) {
      toast.error('Failed to select plan.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8faf9', padding: '60px 24px 80px 24px', fontFamily: "'Inter', sans-serif" }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Page Header */}
        <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 56px auto' }}>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 16px',
            borderRadius: '20px',
            background: 'rgba(197, 155, 78, 0.15)',
            color: '#C59B4E',
            fontWeight: 700,
            fontSize: '11px',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            marginBottom: '14px'
          }}>
            <Sparkles size={14} /> Sacramental Matrimony Membership
          </span>
          <h1 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '42px',
            fontWeight: 700,
            color: '#1E2B45',
            margin: '0 0 12px 0',
            lineHeight: 1.2
          }}>
            Choose Your Sacred Membership Plan
          </h1>
          <p style={{ fontSize: '15px', color: '#64748B', lineHeight: 1.6, margin: 0 }}>
            Transparent plans designed to help you connect with verified Catholic profiles across parishes. All memberships include parish verification support and privacy protection.
          </p>
        </div>

        {/* Loading Skeletons */}
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 350px))', justifyContent: 'center', gap: '32px' }}>
            {[1, 2, 3].map((i) => (
              <div key={i} style={{ background: '#FFFFFF', padding: '36px 32px', borderRadius: '24px', border: '1px solid #EAE5DC' }}>
                <div style={{ height: '24px', background: '#EAE5DC', borderRadius: '6px', width: '40%', marginBottom: '16px' }}></div>
                <div style={{ height: '40px', background: '#EAE5DC', borderRadius: '6px', width: '70%', marginBottom: '20px' }}></div>
                <div style={{ height: '16px', background: '#EAE5DC', borderRadius: '6px', width: '100%', marginBottom: '12px' }}></div>
                <div style={{ height: '16px', background: '#EAE5DC', borderRadius: '6px', width: '80%', marginBottom: '24px' }}></div>
                <div style={{ height: '48px', background: '#EAE5DC', borderRadius: '24px', width: '100%' }}></div>
              </div>
            ))}
          </div>
        ) : error ? (
          /* Error State */
          <div style={{
            background: '#FFFFFF',
            border: '1px solid #ef4444',
            borderRadius: '24px',
            padding: '48px 32px',
            maxWidth: '500px',
            margin: '0 auto',
            textAlign: 'center',
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
          }}>
            <AlertCircle size={48} style={{ color: '#ef4444', margin: '0 auto 16px auto' }} />
            <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#1E2B45', marginBottom: '8px' }}>{error}</h3>
            <button
              onClick={fetchActivePlans}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 28px',
                borderRadius: '24px',
                border: '1.5px solid #1E2B45',
                color: '#1E2B45',
                fontSize: '13px',
                fontWeight: 600,
                background: '#FFFFFF',
                cursor: 'pointer',
                marginTop: '16px'
              }}
            >
              <RefreshCw size={14} /> Try Reloading Plans
            </button>
          </div>
        ) : plans.length === 0 ? (
          /* Empty State */
          <div style={{
            background: '#FFFFFF',
            border: '1px solid #EAE5DC',
            borderRadius: '24px',
            padding: '48px 32px',
            maxWidth: '500px',
            margin: '0 auto',
            textAlign: 'center',
            boxShadow: '0 4px 20px rgba(30, 43, 69, 0.05)'
          }}>
            <CreditCard size={48} style={{ color: '#64748B', opacity: 0.4, margin: '0 auto 16px auto' }} />
            <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#1E2B45', marginBottom: '8px' }}>No Active Membership Plans Available</h3>
            <p style={{ fontSize: '14px', color: '#64748B', marginBottom: '24px', lineHeight: 1.6 }}>
              Our parish membership plans are currently undergoing updates. Please check back shortly or contact parish support.
            </p>
            <Link to="/contact" style={{
              display: 'inline-block',
              padding: '12px 28px',
              borderRadius: '24px',
              background: '#1E2B45',
              color: '#FFFFFF',
              fontSize: '13px',
              fontWeight: 700,
              textDecoration: 'none'
            }}>
              Contact Support
            </Link>
          </div>
        ) : (
          /* Dynamic Active Plans Grid */
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 350px))', justifyContent: 'center', gap: '32px', alignItems: 'stretch' }}>
            {plans.map((plan) => {
              const isPopular = plan.isPopular
              return (
                <div
                  key={plan._id}
                  style={{
                    background: '#FFFFFF',
                    border: isPopular ? '2px solid #C59B4E' : '1px solid #EAE5DC',
                    borderRadius: '24px',
                    padding: '36px 32px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    position: 'relative',
                    boxShadow: isPopular ? '0 12px 32px rgba(197, 155, 78, 0.2)' : '0 4px 16px rgba(30, 43, 69, 0.06)'
                  }}
                >
                  {/* Popular Badge */}
                  {isPopular && (
                    <div style={{
                      position: 'absolute',
                      top: '-14px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      background: '#C59B4E',
                      color: '#FFFFFF',
                      padding: '4px 16px',
                      borderRadius: '20px',
                      fontSize: '11px',
                      fontWeight: 800,
                      letterSpacing: '1px',
                      textTransform: 'uppercase',
                      boxShadow: '0 4px 12px rgba(197, 155, 78, 0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <Star size={12} fill="currentColor" /> MOST POPULAR
                    </div>
                  )}

                  <div>
                    {/* Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 800, color: '#C59B4E', textTransform: 'uppercase', letterSpacing: '1px' }}>
                        {plan.planType} PLAN
                      </span>
                      <span style={{ fontSize: '12px', color: '#64748B', background: '#F8FAF9', padding: '4px 12px', borderRadius: '16px', border: '1px solid #EAE5DC', fontWeight: 600 }}>
                        {plan.duration} {plan.durationUnit}
                      </span>
                    </div>

                    <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '28px', fontWeight: 700, color: '#1E2B45', margin: '0 0 8px 0' }}>
                      {plan.name}
                    </h2>

                    <p style={{ fontSize: '13.5px', color: '#64748B', lineHeight: 1.5, margin: '0 0 24px 0', minHeight: '40px' }}>
                      {plan.description || 'Full parish profile access with privacy protection.'}
                    </p>

                    {/* Price Display */}
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', paddingBottom: '20px', marginBottom: '24px', borderBottom: '1px solid #EAE5DC' }}>
                      <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '42px', fontWeight: 700, color: '#1E2B45' }}>
                        {plan.price === 0 ? 'FREE' : `₹${plan.price.toLocaleString('en-IN')}`}
                      </span>
                      {plan.price > 0 && (
                        <span style={{ fontSize: '13px', color: '#64748B', fontWeight: 500 }}>
                          / {plan.duration} {plan.durationUnit}
                        </span>
                      )}
                    </div>

                    {/* Specifications (Contact Requests & Profile Views) */}
                    <div style={{
                      background: '#F8FAF9',
                      border: '1px solid #EAE5DC',
                      borderRadius: '16px',
                      padding: '16px 20px',
                      marginBottom: '24px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                      fontSize: '13px',
                      color: '#475467'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <PhoneCall size={15} style={{ color: '#C59B4E' }} /> Contact Requests:
                        </span>
                        <strong style={{ color: '#1E2B45', fontWeight: 700 }}>
                          {plan.maxContactRequests === -1 ? 'Unlimited' : plan.maxContactRequests}
                        </strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Eye size={15} style={{ color: '#C59B4E' }} /> Profile Views:
                        </span>
                        <strong style={{ color: '#1E2B45', fontWeight: 700 }}>
                          {plan.maxProfileViews === -1 ? 'Unlimited' : plan.maxProfileViews}
                        </strong>
                      </div>
                    </div>

                    {/* Features List */}
                    <div style={{ marginBottom: '32px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 800, color: '#1E2B45', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '12px' }}>
                        Included Features:
                      </span>
                      {plan.features && plan.features.length > 0 ? (
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                          {plan.features.map((feat, idx) => (
                            <li key={idx} style={{ fontSize: '13px', color: '#475467', display: 'flex', alignItems: 'flex-start', gap: '8px', lineHeight: 1.5 }}>
                              <Check size={16} style={{ color: '#10b981', flexShrink: 0, marginTop: '2px' }} />
                              <span>{feat}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                          <li style={{ fontSize: '13px', color: '#475467', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Check size={16} style={{ color: '#10b981' }} /> Full Verified Profile View
                          </li>
                          <li style={{ fontSize: '13px', color: '#475467', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Check size={16} style={{ color: '#10b981' }} /> Express Contact Request Feature
                          </li>
                          <li style={{ fontSize: '13px', color: '#475467', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Check size={16} style={{ color: '#10b981' }} /> Parish Assistance Support
                          </li>
                        </ul>
                      )}
                    </div>
                  </div>

                  {/* Choose Plan CTA */}
                  <button
                    onClick={() => handleChoosePlan(plan)}
                    style={{
                      display: 'block',
                      width: '100%',
                      padding: '14px',
                      borderRadius: '28px',
                      fontSize: '13px',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                      border: isPopular ? 'none' : '1.5px solid #1E2B45',
                      background: isPopular ? '#1E2B45' : 'transparent',
                      color: isPopular ? '#FFFFFF' : '#1E2B45',
                      cursor: 'pointer',
                      boxShadow: isPopular ? '0 4px 14px rgba(30, 43, 69, 0.2)' : 'none',
                      textAlign: 'center',
                      transition: 'all 0.2s'
                    }}
                  >
                    Select {plan.name}
                  </button>
                </div>
              )
            })}
          </div>
        )}

        {/* Feature Trust Bar */}
        <div style={{ marginTop: '80px', paddingTop: '48px', borderTop: '1px solid #EAE5DC', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '32px', textAlign: 'center' }}>
          <div>
            <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: 'rgba(197, 155, 78, 0.15)', color: '#C59B4E', margin: '0 auto 12px auto', display: 'grid', placeItems: 'center' }}>
              <ShieldCheck size={24} />
            </div>
            <h4 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '20px', fontWeight: 700, color: '#1E2B45', margin: '0 0 6px 0' }}>100% Parish Verified</h4>
            <p style={{ fontSize: '13px', color: '#64748B', margin: 0, lineHeight: 1.5 }}>
              Every profile is authenticated through parish references and pastoral identification.
            </p>
          </div>

          <div>
            <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: 'rgba(197, 155, 78, 0.15)', color: '#C59B4E', margin: '0 auto 12px auto', display: 'grid', placeItems: 'center' }}>
              <Heart size={24} />
            </div>
            <h4 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '20px', fontWeight: 700, color: '#1E2B45', margin: '0 0 6px 0' }}>Sacramental Commitment</h4>
            <p style={{ fontSize: '13px', color: '#64748B', margin: 0, lineHeight: 1.5 }}>
              Designed specifically for faithful Catholic families seeking holy matrimony.
            </p>
          </div>

          <div>
            <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: 'rgba(197, 155, 78, 0.15)', color: '#C59B4E', margin: '0 auto 12px auto', display: 'grid', placeItems: 'center' }}>
              <CheckCircle2 size={24} />
            </div>
            <h4 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '20px', fontWeight: 700, color: '#1E2B45', margin: '0 0 6px 0' }}>Strict Data Privacy</h4>
            <p style={{ fontSize: '13px', color: '#64748B', margin: 0, lineHeight: 1.5 }}>
              Your contact info remains private and is only disclosed upon mutual request approval.
            </p>
          </div>
        </div>
      </div>

      {/* Subscription Selection Confirmation Modal */}
      {confirmModalOpen && selectedPlan && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'grid', placeItems: 'center', padding: '16px' }}>
          <div style={{ background: '#FFFFFF', borderRadius: '24px', padding: '32px', maxWidth: '480px', width: '100%', boxShadow: '0 16px 40px rgba(0,0,0,0.2)', border: '1px solid #EAE5DC' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#C59B4E', marginBottom: '12px' }}>
              <Sparkles size={24} />
              <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '24px', fontWeight: 700, color: '#1E2B45', margin: 0 }}>Confirm Plan Selection</h3>
            </div>
            <p style={{ fontSize: '14px', color: '#475467', marginBottom: '16px', lineHeight: 1.6 }}>
              You are selecting the <strong style={{ color: '#1E2B45' }}>{selectedPlan.name}</strong> for{' '}
              <strong style={{ color: '#C59B4E' }}>
                {selectedPlan.price === 0 ? 'FREE' : `₹${selectedPlan.price}`}
              </strong>{' '}
              ({selectedPlan.duration} {selectedPlan.durationUnit}).
            </p>
            <div style={{ background: '#F8FAF9', border: '1px solid #EAE5DC', borderRadius: '16px', padding: '16px', fontSize: '13px', color: '#475467', marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div>• Contact Limit: <strong style={{ color: '#1E2B45' }}>{selectedPlan.maxContactRequests === -1 ? 'Unlimited' : selectedPlan.maxContactRequests}</strong></div>
              <div>• Profile Views: <strong style={{ color: '#1E2B45' }}>{selectedPlan.maxProfileViews === -1 ? 'Unlimited' : selectedPlan.maxProfileViews}</strong></div>
              <div>• Parish Help & Pastoral Support included</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button
                style={{
                  padding: '10px 20px',
                  borderRadius: '20px',
                  border: '1px solid #CBD5E1',
                  background: '#FFFFFF',
                  color: '#475467',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
                onClick={() => setConfirmModalOpen(false)}
                disabled={submitting}
              >
                {UI_MESSAGES.BUTTONS.CANCEL}
              </button>
              <button
                style={{
                  padding: '10px 24px',
                  borderRadius: '20px',
                  border: 'none',
                  background: '#1E2B45',
                  color: '#FFFFFF',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(30, 43, 69, 0.2)'
                }}
                onClick={handleConfirmSubscription}
                disabled={submitting}
              >
                {submitting ? 'Confirming...' : 'Proceed with Plan'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
