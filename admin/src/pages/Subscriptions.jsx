import { useState, useEffect } from 'react'
import {
  CreditCard, Plus, Search, Filter, Pencil, Trash2, Eye,
  CheckCircle2, XCircle, ChevronRight, Layers, Sparkles,
  ArrowUpDown, RefreshCw, Check, X, Tag, DollarSign, Calendar
} from 'lucide-react'
import api from '../services/api'
import toast from 'react-hot-toast'

export default function Subscriptions() {
  const [subscriptions, setSubscriptions] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [planTypeFilter, setPlanTypeFilter] = useState('ALL')
  const [sortBy, setSortBy] = useState('displayOrder')
  const [sortOrder, setSortOrder] = useState('asc')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalResults, setTotalResults] = useState(0)

  // Modals state
  const [modalOpen, setModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState('add') // 'add', 'edit', 'view'
  const [currentPlan, setCurrentPlan] = useState(null)
  const [saving, setSaving] = useState(false)
  const [deleteConfirmId, setDeleteConfirmId] = useState(null)

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    planType: 'standard',
    description: '',
    duration: 30,
    durationUnit: 'days',
    price: 999,
    currency: 'INR',
    features: '',
    maxContactRequests: 15,
    maxProfileViews: 50,
    status: 'active',
    displayOrder: 1,
    isPopular: false
  })

  useEffect(() => {
    fetchSubscriptions()
  }, [statusFilter, planTypeFilter, sortBy, sortOrder, page])

  const fetchSubscriptions = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page,
        limit: 10,
        status: statusFilter,
        planType: planTypeFilter,
        sortBy,
        sortOrder,
        ...(search ? { search } : {})
      })
      const res = await api.get(`/subscriptions?${params.toString()}`)
      if (res.data && res.data.success) {
        setSubscriptions(res.data.subscriptions || [])
        setTotalPages(res.data.pages || 1)
        setTotalResults(res.data.total || 0)
      }
    } catch (err) {
      console.error('Failed to load subscriptions:', err)
      toast.error(err.response?.data?.message || 'Failed to fetch subscription plans')
    } finally {
      setLoading(false)
    }
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    setPage(1)
    fetchSubscriptions()
  }

  const openAddModal = () => {
    setCurrentPlan(null)
    setFormData({
      name: '',
      planType: 'standard',
      description: '',
      duration: 1,
      durationUnit: 'months',
      price: 999,
      currency: 'INR',
      features: 'Full profile view\nDirect contact request\nPriority customer support',
      maxContactRequests: 20,
      maxProfileViews: 100,
      status: 'active',
      displayOrder: subscriptions.length + 1,
      isPopular: false
    })
    setModalMode('add')
    setModalOpen(true)
  }

  const openEditModal = (plan) => {
    setCurrentPlan(plan)
    setFormData({
      name: plan.name || '',
      planType: plan.planType || 'standard',
      description: plan.description || '',
      duration: plan.duration || 1,
      durationUnit: plan.durationUnit || 'months',
      price: plan.price ?? 0,
      currency: plan.currency || 'INR',
      features: Array.isArray(plan.features) ? plan.features.join('\n') : '',
      maxContactRequests: plan.maxContactRequests ?? -1,
      maxProfileViews: plan.maxProfileViews ?? -1,
      status: plan.status || 'active',
      displayOrder: plan.displayOrder ?? 0,
      isPopular: !!plan.isPopular
    })
    setModalMode('edit')
    setModalOpen(true)
  }

  const openViewModal = (plan) => {
    setCurrentPlan(plan)
    setModalMode('view')
    setModalOpen(true)
  }

  const handleSubmitPlan = async (e) => {
    e.preventDefault()
    if (!formData.name.trim()) return toast.error('Plan name is required')
    if (formData.price < 0) return toast.error('Price cannot be negative')
    if (formData.duration <= 0) return toast.error('Duration must be greater than 0')

    setSaving(true)
    try {
      const payload = {
        ...formData,
        features: formData.features
          ? formData.features.split('\n').map(f => f.trim()).filter(Boolean)
          : []
      }

      if (modalMode === 'add') {
        const res = await api.post('/subscriptions', payload)
        toast.success(res.data.message || 'Subscription created successfully')
      } else if (modalMode === 'edit' && currentPlan) {
        const res = await api.put(`/subscriptions/${currentPlan._id}`, payload)
        toast.success(res.data.message || 'Subscription updated successfully')
      }
      setModalOpen(false)
      fetchSubscriptions()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save subscription plan')
    } finally {
      setSaving(false)
    }
  }

  const handleToggleStatus = async (plan) => {
    try {
      const res = await api.patch(`/subscriptions/${plan._id}/status`)
      toast.success(res.data.message || 'Status updated')
      setSubscriptions(prev => prev.map(p => p._id === plan._id ? res.data.subscription : p))
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to toggle status')
    }
  }

  const handleDeletePlan = async (id) => {
    try {
      const res = await api.delete(`/subscriptions/${id}`)
      toast.success(res.data.message || 'Plan deleted successfully')
      setDeleteConfirmId(null)
      fetchSubscriptions()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete plan')
    }
  }

  // Summary Metrics
  const activeCount = subscriptions.filter(s => s.status === 'active').length
  const inactiveCount = subscriptions.filter(s => s.status === 'inactive').length

  return (
    <div className="subscriptions-page" style={{ paddingBottom: 40 }}>
      {/* Breadcrumb Navigation */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-muted)', marginBottom: 16 }}>
        <span>Admin Dashboard</span>
        <ChevronRight size={14} />
        <span style={{ color: 'var(--accent)', fontWeight: 600 }}>Subscription Management</span>
      </div>

      {/* Header Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
            <CreditCard style={{ color: 'var(--accent)' }} size={28} />
            Subscription Management
          </h1>
          <p style={{ color: 'var(--text-muted)', marginTop: 4, fontSize: 14 }}>
            Create, configure, and manage membership plans for matrimonial members.
          </p>
        </div>
        <button className="btn btn-primary" onClick={openAddModal} style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          <Plus size={16} /> Create New Plan
        </button>
      </div>

      {/* Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 24 }}>
        <div className="card" style={{ padding: 20, display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(197, 155, 78, 0.15)', display: 'grid', placeItems: 'center', color: 'var(--accent)' }}>
            <Layers size={22} />
          </div>
          <div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>Total Plans</div>
            <div style={{ fontSize: 24, fontWeight: 700, marginTop: 2 }}>{totalResults}</div>
          </div>
        </div>
        <div className="card" style={{ padding: 20, display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(16, 185, 129, 0.15)', display: 'grid', placeItems: 'center', color: '#10b981' }}>
            <CheckCircle2 size={22} />
          </div>
          <div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>Active Plans</div>
            <div style={{ fontSize: 24, fontWeight: 700, marginTop: 2 }}>{activeCount}</div>
          </div>
        </div>
        <div className="card" style={{ padding: 20, display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(239, 68, 68, 0.15)', display: 'grid', placeItems: 'center', color: '#ef4444' }}>
            <XCircle size={22} />
          </div>
          <div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>Inactive Plans</div>
            <div style={{ fontSize: 24, fontWeight: 700, marginTop: 2 }}>{inactiveCount}</div>
          </div>
        </div>
      </div>

      {/* Controls Bar: Search, Filters & Sorting */}
      <div className="card" style={{ padding: 18, marginBottom: 24 }}>
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', flexWrap: 'wrap', gap: 14, alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ flex: '1 1 280px', display: 'flex', alignItems: 'center', gap: 10, background: 'var(--bg-primary)', padding: '6px 14px', borderRadius: 8, border: '1px solid var(--border)' }}>
            <Search size={16} style={{ color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search plan by name or description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', color: 'var(--text-primary)', fontSize: 14 }}
            />
          </div>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1) }}
              className="form-select"
              style={{ width: 'auto', padding: '8px 12px', fontSize: 13 }}
            >
              <option value="ALL">All Statuses</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
            </select>

            {/* Plan Type Filter */}
            <select
              value={planTypeFilter}
              onChange={(e) => { setPlanTypeFilter(e.target.value); setPage(1) }}
              className="form-select"
              style={{ width: 'auto', padding: '8px 12px', fontSize: 13 }}
            >
              <option value="ALL">All Plan Types</option>
              <option value="free">Free</option>
              <option value="basic">Basic</option>
              <option value="standard">Standard</option>
              <option value="premium">Premium</option>
              <option value="vip">VIP</option>
              <option value="custom">Custom</option>
            </select>

            {/* Sort Field */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="form-select"
              style={{ width: 'auto', padding: '8px 12px', fontSize: 13 }}
            >
              <option value="displayOrder">Sort by Display Order</option>
              <option value="price">Sort by Price</option>
              <option value="name">Sort by Name</option>
              <option value="createdAt">Sort by Creation Date</option>
            </select>

            {/* Sort direction toggle */}
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
              title={`Sorting: ${sortOrder.toUpperCase()}`}
              style={{ padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 6 }}
            >
              <ArrowUpDown size={14} /> {sortOrder.toUpperCase()}
            </button>

            <button type="submit" className="btn btn-outline" style={{ padding: '8px 14px' }}>
              Filter
            </button>
          </div>
        </form>
      </div>

      {/* Subscription List Table */}
      <div className="card" style={{ overflow: 'hidden', padding: 0 }}>
        {loading ? (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>
            <RefreshCw className="spin" size={24} style={{ marginBottom: 12, color: 'var(--accent)' }} />
            <div>Loading subscription plans...</div>
          </div>
        ) : subscriptions.length === 0 ? (
          <div style={{ padding: 48, textAlign: 'center', color: 'var(--text-muted)' }}>
            <CreditCard size={48} style={{ opacity: 0.3, marginBottom: 12 }} />
            <h3 style={{ fontSize: 18, color: 'var(--text-primary)', marginBottom: 4 }}>No Subscriptions Found</h3>
            <p style={{ fontSize: 14, maxWidth: 400, margin: '0 auto 16px' }}>
              No subscription plans match your search or filter criteria. Try resetting filters or create a new plan.
            </p>
            <button className="btn btn-primary btn-sm" onClick={openAddModal}>
              <Plus size={14} /> Create Subscription Plan
            </button>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13.5 }}>
              <thead>
                <tr style={{ background: 'var(--bg-hover)', borderBottom: '1px solid var(--border)', textAlign: 'left' }}>
                  <th style={{ padding: '12px 16px', fontWeight: 600 }}>Order</th>
                  <th style={{ padding: '12px 16px', fontWeight: 600 }}>Plan Name & Type</th>
                  <th style={{ padding: '12px 16px', fontWeight: 600 }}>Price</th>
                  <th style={{ padding: '12px 16px', fontWeight: 600 }}>Duration</th>
                  <th style={{ padding: '12px 16px', fontWeight: 600 }}>Limits (Contact / Views)</th>
                  <th style={{ padding: '12px 16px', fontWeight: 600 }}>Status</th>
                  <th style={{ padding: '12px 16px', fontWeight: 600, textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {subscriptions.map((plan) => (
                  <tr key={plan._id} style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.15s' }}>
                    <td style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--text-muted)' }}>
                      #{plan.displayOrder ?? 0}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: 14 }}>{plan.name}</span>
                        {plan.isPopular && (
                          <span style={{ background: 'rgba(197, 155, 78, 0.15)', color: 'var(--accent)', padding: '2px 8px', borderRadius: 10, fontSize: 11, fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                            <Sparkles size={10} /> POPULAR
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)', textTransform: 'capitalize', marginTop: 2 }}>
                        Type: <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>{plan.planType}</span>
                      </div>
                    </td>
                    <td style={{ padding: '14px 16px', fontWeight: 700, color: 'var(--accent)' }}>
                      {plan.price === 0 ? 'FREE' : `₹${plan.price.toLocaleString('en-IN')}`}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ fontWeight: 600 }}>{plan.duration}</span> {plan.durationUnit}
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: 12 }}>
                      <div>Contacts: <strong>{plan.maxContactRequests === -1 ? 'Unlimited' : plan.maxContactRequests}</strong></div>
                      <div>Views: <strong>{plan.maxProfileViews === -1 ? 'Unlimited' : plan.maxProfileViews}</strong></div>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <button
                        onClick={() => handleToggleStatus(plan)}
                        style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: 0 }}
                        title="Click to toggle status"
                      >
                        {plan.status === 'active' ? (
                          <span style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', padding: '4px 10px', borderRadius: 12, fontWeight: 600, fontSize: 12, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                            <CheckCircle2 size={12} /> Active
                          </span>
                        ) : (
                          <span style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', padding: '4px 10px', borderRadius: 12, fontWeight: 600, fontSize: 12, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                            <XCircle size={12} /> Inactive
                          </span>
                        )}
                      </button>
                    </td>
                    <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: 6 }}>
                        <button className="btn btn-outline btn-sm" onClick={() => openViewModal(plan)} title="View Details">
                          <Eye size={14} />
                        </button>
                        <button className="btn btn-outline btn-sm" onClick={() => openEditModal(plan)} title="Edit Plan">
                          <Pencil size={14} />
                        </button>
                        <button
                          className="btn btn-outline btn-sm"
                          onClick={() => setDeleteConfirmId(plan._id)}
                          style={{ color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.3)' }}
                          title="Delete Plan"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 20px', borderTop: '1px solid var(--border)', background: 'var(--bg-primary)' }}>
            <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
              Showing Page <strong>{page}</strong> of <strong>{totalPages}</strong> ({totalResults} plans total)
            </span>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn btn-outline btn-sm" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>
                Previous
              </button>
              <button className="btn btn-outline btn-sm" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'grid', placeItems: 'center', padding: 20 }}>
          <div className="card" style={{ maxWidth: 420, width: '100%', padding: 24, borderRadius: 12 }}>
            <h3 style={{ margin: '0 0 8px 0', fontSize: 18, color: '#ef4444' }}>Confirm Delete</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 20 }}>
              Are you sure you want to delete this subscription plan? This action cannot be undone.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button className="btn btn-outline btn-sm" onClick={() => setDeleteConfirmId(null)}>Cancel</button>
              <button className="btn btn-primary btn-sm" style={{ background: '#ef4444', borderColor: '#ef4444' }} onClick={() => handleDeletePlan(deleteConfirmId)}>
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit / View Modal */}
      {modalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'grid', placeItems: 'center', padding: 20, overflowY: 'auto' }}>
          <div className="card" style={{ maxWidth: 650, width: '100%', padding: 28, borderRadius: 12, margin: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: 14, marginBottom: 20 }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                <CreditCard size={22} style={{ color: 'var(--accent)' }} />
                {modalMode === 'add' ? 'Create New Subscription Plan' : modalMode === 'edit' ? 'Edit Subscription Plan' : 'Subscription Details'}
              </h2>
              <button onClick={() => setModalOpen(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                <X size={20} />
              </button>
            </div>

            {modalMode === 'view' && currentPlan ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, background: 'var(--bg-primary)', padding: 16, borderRadius: 8 }}>
                  <div>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Plan Name</span>
                    <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>{currentPlan.name}</div>
                  </div>
                  <div>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Plan Type</span>
                    <div style={{ fontSize: 14, fontWeight: 600, textTransform: 'capitalize' }}>{currentPlan.planType}</div>
                  </div>
                  <div>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Price</span>
                    <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--accent)' }}>₹{currentPlan.price}</div>
                  </div>
                  <div>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Duration</span>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{currentPlan.duration} {currentPlan.durationUnit}</div>
                  </div>
                </div>

                <div>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>Description</span>
                  <p style={{ marginTop: 4, fontSize: 14, color: 'var(--text-secondary)' }}>{currentPlan.description || 'No description provided.'}</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div style={{ background: 'var(--bg-primary)', padding: 12, borderRadius: 8 }}>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Max Contact Requests</div>
                    <div style={{ fontSize: 16, fontWeight: 700 }}>{currentPlan.maxContactRequests === -1 ? 'Unlimited' : currentPlan.maxContactRequests}</div>
                  </div>
                  <div style={{ background: 'var(--bg-primary)', padding: 12, borderRadius: 8 }}>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Max Profile Views</div>
                    <div style={{ fontSize: 16, fontWeight: 700 }}>{currentPlan.maxProfileViews === -1 ? 'Unlimited' : currentPlan.maxProfileViews}</div>
                  </div>
                </div>

                <div>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: 8 }}>Features Included</span>
                  {currentPlan.features && currentPlan.features.length > 0 ? (
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {currentPlan.features.map((feat, idx) => (
                        <li key={idx} style={{ fontSize: 13, display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-secondary)' }}>
                          <Check size={14} style={{ color: '#10b981' }} /> {feat}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span style={{ fontSize: 13, color: 'var(--text-muted)', italic: 'true' }}>No explicit features listed.</span>
                  )}
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 12 }}>
                  <button className="btn btn-outline btn-sm" onClick={() => setModalOpen(false)}>Close</button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmitPlan} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Plan Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Gold Quarterly Plan"
                      className="form-input"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      style={{ width: '100%', padding: '8px 12px' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Plan Type</label>
                    <select
                      className="form-select"
                      value={formData.planType}
                      onChange={(e) => setFormData(prev => ({ ...prev, planType: e.target.value }))}
                      style={{ width: '100%', padding: '8px 12px' }}
                    >
                      <option value="free">Free</option>
                      <option value="basic">Basic</option>
                      <option value="standard">Standard</option>
                      <option value="premium">Premium</option>
                      <option value="vip">VIP</option>
                      <option value="custom">Custom</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Price (₹) *</label>
                    <input
                      type="number"
                      required
                      min="0"
                      className="form-input"
                      value={formData.price}
                      onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                      style={{ width: '100%', padding: '8px 12px' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Duration Value *</label>
                    <input
                      type="number"
                      required
                      min="1"
                      className="form-input"
                      value={formData.duration}
                      onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                      style={{ width: '100%', padding: '8px 12px' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Duration Unit</label>
                    <select
                      className="form-select"
                      value={formData.durationUnit}
                      onChange={(e) => setFormData(prev => ({ ...prev, durationUnit: e.target.value }))}
                      style={{ width: '100%', padding: '8px 12px' }}
                    >
                      <option value="days">Days</option>
                      <option value="months">Months</option>
                      <option value="years">Years</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Max Contact Requests (-1 = Unlimited)</label>
                    <input
                      type="number"
                      className="form-input"
                      value={formData.maxContactRequests}
                      onChange={(e) => setFormData(prev => ({ ...prev, maxContactRequests: e.target.value }))}
                      style={{ width: '100%', padding: '8px 12px' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Max Profile Views (-1 = Unlimited)</label>
                    <input
                      type="number"
                      className="form-input"
                      value={formData.maxProfileViews}
                      onChange={(e) => setFormData(prev => ({ ...prev, maxProfileViews: e.target.value }))}
                      style={{ width: '100%', padding: '8px 12px' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Plan Description</label>
                  <textarea
                    rows={2}
                    placeholder="Brief overview of plan benefits..."
                    className="form-textarea"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    style={{ width: '100%', padding: '8px 12px', resize: 'vertical' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Features (One per line)</label>
                  <textarea
                    rows={3}
                    placeholder="Unlimited direct phone calls&#10;Verified badge display&#10;Dedicated relationship manager"
                    className="form-textarea"
                    value={formData.features}
                    onChange={(e) => setFormData(prev => ({ ...prev, features: e.target.value }))}
                    style={{ width: '100%', padding: '8px 12px', resize: 'vertical' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14, alignItems: 'center' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Display Order</label>
                    <input
                      type="number"
                      className="form-input"
                      value={formData.displayOrder}
                      onChange={(e) => setFormData(prev => ({ ...prev, displayOrder: e.target.value }))}
                      style={{ width: '100%', padding: '8px 12px' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Status</label>
                    <select
                      className="form-select"
                      value={formData.status}
                      onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                      style={{ width: '100%', padding: '8px 12px' }}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>

                  <div style={{ paddingTop: 18 }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
                      <input
                        type="checkbox"
                        checked={formData.isPopular}
                        onChange={(e) => setFormData(prev => ({ ...prev, isPopular: e.target.checked }))}
                      />
                      Mark as Popular Plan
                    </label>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 12, borderTop: '1px solid var(--border)', paddingTop: 16 }}>
                  <button type="button" className="btn btn-outline" onClick={() => setModalOpen(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={saving}>
                    {saving ? 'Saving...' : modalMode === 'add' ? 'Create Plan' : 'Save Changes'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
