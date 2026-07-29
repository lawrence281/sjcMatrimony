import { useState, useEffect } from 'react'
import {
  BookOpen, Plus, Search, Filter, Pencil, Trash2, Eye,
  CheckCircle2, Clock, AlertTriangle, ChevronRight, Upload,
  X, FileText, Calendar, Church, User, Phone, MapPin, Download,
  ArrowUpDown, RefreshCw, ShieldCheck, PlusCircle
} from 'lucide-react'
import api from '../services/api'
import toast from 'react-hot-toast'

export default function MarriageRegister() {
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [dioceseFilter, setDioceseFilter] = useState('ALL')
  const [sortBy, setSortBy] = useState('marriageDate')
  const [sortOrder, setSortOrder] = useState('desc')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalResults, setTotalResults] = useState(0)

  // Modals state
  const [modalOpen, setModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState('add') // 'add', 'edit', 'view'
  const [currentRecord, setCurrentRecord] = useState(null)
  const [saving, setSaving] = useState(false)
  const [deleteConfirmId, setDeleteConfirmId] = useState(null)
  const [uploadingDoc, setUploadingDoc] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    brideName: '',
    brideProfileId: '',
    brideDob: '',
    brideMobileNumber: '',
    groomName: '',
    groomProfileId: '',
    groomDob: '',
    groomMobileNumber: '',
    marriageDate: '',
    churchName: '',
    churchAddress: '',
    diocese: '',
    parish: '',
    priestName: '',
    marriageCertificateNumber: '',
    marriageStatus: 'registered',
    witnesses: [{ name: '', mobileNumber: '', relation: 'Witness' }],
    remarks: '',
    documents: [] // [{ docType, fileUrl, fileName }]
  })

  useEffect(() => {
    fetchRecords()
  }, [statusFilter, dioceseFilter, sortBy, sortOrder, page])

  const fetchRecords = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page,
        limit: 10,
        status: statusFilter,
        diocese: dioceseFilter,
        sortBy,
        sortOrder,
        ...(search ? { search } : {})
      })
      const res = await api.get(`/marriage-register?${params.toString()}`)
      if (res.data && res.data.success) {
        setRecords(res.data.records || [])
        setTotalPages(res.data.pages || 1)
        setTotalResults(res.data.total || 0)
      }
    } catch (err) {
      console.error('Failed to load marriage records:', err)
      toast.error(err.response?.data?.message || 'Failed to fetch marriage records')
    } finally {
      setLoading(false)
    }
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    setPage(1)
    fetchRecords()
  }

  const openAddModal = () => {
    setCurrentRecord(null)
    const today = new Date().toISOString().split('T')[0]
    setFormData({
      brideName: '',
      brideProfileId: '',
      brideDob: '',
      brideMobileNumber: '',
      groomName: '',
      groomProfileId: '',
      groomDob: '',
      groomMobileNumber: '',
      marriageDate: today,
      churchName: 'St. Joseph Cathedral',
      churchAddress: '',
      diocese: 'Diocese of Trichy',
      parish: '',
      priestName: '',
      marriageCertificateNumber: `MC-${Date.now().toString().slice(-6)}`,
      marriageStatus: 'registered',
      witnesses: [{ name: '', mobileNumber: '', relation: 'Witness' }],
      remarks: '',
      documents: []
    })
    setModalMode('add')
    setModalOpen(true)
  }

  const openEditModal = (rec) => {
    setCurrentRecord(rec)
    setFormData({
      brideName: rec.brideName || '',
      brideProfileId: rec.brideProfileId?._id || rec.brideProfileId || '',
      brideDob: rec.brideDob ? new Date(rec.brideDob).toISOString().split('T')[0] : '',
      brideMobileNumber: rec.brideMobileNumber || '',
      groomName: rec.groomName || '',
      groomProfileId: rec.groomProfileId?._id || rec.groomProfileId || '',
      groomDob: rec.groomDob ? new Date(rec.groomDob).toISOString().split('T')[0] : '',
      groomMobileNumber: rec.groomMobileNumber || '',
      marriageDate: rec.marriageDate ? new Date(rec.marriageDate).toISOString().split('T')[0] : '',
      churchName: rec.churchName || '',
      churchAddress: rec.churchAddress || '',
      diocese: rec.diocese || '',
      parish: rec.parish || '',
      priestName: rec.priestName || '',
      marriageCertificateNumber: rec.marriageCertificateNumber || '',
      marriageStatus: rec.marriageStatus || 'registered',
      witnesses: rec.witnesses && rec.witnesses.length > 0 ? rec.witnesses : [{ name: '', mobileNumber: '', relation: '' }],
      remarks: rec.remarks || '',
      documents: rec.documents || []
    })
    setModalMode('edit')
    setModalOpen(true)
  }

  const openViewModal = (rec) => {
    setCurrentRecord(rec)
    setModalMode('view')
    setModalOpen(true)
  }

  const handleWitnessChange = (index, field, value) => {
    const updated = [...formData.witnesses]
    updated[index][field] = value
    setFormData(prev => ({ ...prev, witnesses: updated }))
  }

  const addWitnessRow = () => {
    setFormData(prev => ({
      ...prev,
      witnesses: [...prev.witnesses, { name: '', mobileNumber: '', relation: 'Witness' }]
    }))
  }

  const removeWitnessRow = (index) => {
    if (formData.witnesses.length <= 1) return
    setFormData(prev => ({
      ...prev,
      witnesses: prev.witnesses.filter((_, i) => i !== index)
    }))
  }

  const handleFileUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    const data = new FormData()
    data.append('file', file)

    setUploadingDoc(true)
    try {
      const res = await api.post('/marriage-register/upload', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      if (res.data && res.data.fileUrl) {
        setFormData(prev => ({
          ...prev,
          documents: [
            ...prev.documents,
            { docType: 'Marriage Document', fileUrl: res.data.fileUrl, fileName: res.data.fileName || file.name }
          ]
        }))
        toast.success('Document uploaded successfully')
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to upload document')
    } finally {
      setUploadingDoc(false)
    }
  }

  const removeDocument = (index) => {
    setFormData(prev => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index)
    }))
  }

  const handleSubmitRecord = async (e) => {
    e.preventDefault()
    if (!formData.brideName.trim()) return toast.error('Bride name is required')
    if (!formData.groomName.trim()) return toast.error('Groom name is required')
    if (!formData.marriageDate) return toast.error('Marriage date is required')
    if (!formData.churchName.trim()) return toast.error('Church name is required')

    setSaving(true)
    try {
      const payload = {
        ...formData,
        witnesses: formData.witnesses.filter(w => w.name.trim() !== '')
      }

      if (modalMode === 'add') {
        const res = await api.post('/marriage-register', payload)
        toast.success(res.data.message || 'Marriage record created successfully')
      } else if (modalMode === 'edit' && currentRecord) {
        const res = await api.put(`/marriage-register/${currentRecord._id}`, payload)
        toast.success(res.data.message || 'Marriage record updated successfully')
      }
      setModalOpen(false)
      fetchRecords()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save marriage record')
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteRecord = async (id) => {
    try {
      const res = await api.delete(`/marriage-register/${id}`)
      toast.success(res.data.message || 'Record deleted successfully')
      setDeleteConfirmId(null)
      fetchRecords()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete record')
    }
  }

  // Status Badge Helper
  const getStatusBadge = (status) => {
    switch (status) {
      case 'registered':
      case 'verified':
        return (
          <span style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', padding: '3px 10px', borderRadius: 12, fontWeight: 600, fontSize: 12, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            <CheckCircle2 size={12} /> {status === 'verified' ? 'Verified' : 'Registered'}
          </span>
        )
      case 'pending':
        return (
          <span style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', padding: '3px 10px', borderRadius: 12, fontWeight: 600, fontSize: 12, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            <Clock size={12} /> Pending Verification
          </span>
        )
      case 'cancelled':
        return (
          <span style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', padding: '3px 10px', borderRadius: 12, fontWeight: 600, fontSize: 12, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            <X size={12} /> Cancelled
          </span>
        )
      default:
        return <span style={{ padding: '3px 10px', fontSize: 12 }}>{status}</span>
    }
  }

  return (
    <div className="marriage-register-page" style={{ paddingBottom: 40 }}>
      {/* Breadcrumb Navigation */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-muted)', marginBottom: 16 }}>
        <span>Admin Dashboard</span>
        <ChevronRight size={14} />
        <span style={{ color: 'var(--accent)', fontWeight: 600 }}>Marriage Register Data Collection</span>
      </div>

      {/* Header Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
            <BookOpen style={{ color: 'var(--accent)' }} size={28} />
            Marriage Register Collection
          </h1>
          <p style={{ color: 'var(--text-muted)', marginTop: 4, fontSize: 14 }}>
            Archive, collect, and maintain ecclesiastical marriage certificates and parish register records.
          </p>
        </div>
        <button className="btn btn-primary" onClick={openAddModal} style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          <Plus size={16} /> Add Marriage Record
        </button>
      </div>

      {/* Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 24 }}>
        <div className="card" style={{ padding: 20, display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(197, 155, 78, 0.15)', display: 'grid', placeItems: 'center', color: 'var(--accent)' }}>
            <Church size={22} />
          </div>
          <div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>Total Records</div>
            <div style={{ fontSize: 24, fontWeight: 700, marginTop: 2 }}>{totalResults}</div>
          </div>
        </div>
        <div className="card" style={{ padding: 20, display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(16, 185, 129, 0.15)', display: 'grid', placeItems: 'center', color: '#10b981' }}>
            <ShieldCheck size={22} />
          </div>
          <div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>Registered / Verified</div>
            <div style={{ fontSize: 24, fontWeight: 700, marginTop: 2 }}>
              {records.filter(r => r.marriageStatus === 'registered' || r.marriageStatus === 'verified').length}
            </div>
          </div>
        </div>
        <div className="card" style={{ padding: 20, display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(245, 158, 11, 0.15)', display: 'grid', placeItems: 'center', color: '#f59e0b' }}>
            <Clock size={22} />
          </div>
          <div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>Pending Verification</div>
            <div style={{ fontSize: 24, fontWeight: 700, marginTop: 2 }}>
              {records.filter(r => r.marriageStatus === 'pending').length}
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="card" style={{ padding: 18, marginBottom: 24 }}>
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', flexWrap: 'wrap', gap: 14, alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ flex: '1 1 300px', display: 'flex', alignItems: 'center', gap: 10, background: 'var(--bg-primary)', padding: '6px 14px', borderRadius: 8, border: '1px solid var(--border)' }}>
            <Search size={16} style={{ color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search by Bride, Groom, Church, Certificate #..."
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
              <option value="registered">Registered</option>
              <option value="verified">Verified</option>
              <option value="pending">Pending</option>
              <option value="cancelled">Cancelled</option>
            </select>

            {/* Sort Field */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="form-select"
              style={{ width: 'auto', padding: '8px 12px', fontSize: 13 }}
            >
              <option value="marriageDate">Sort by Marriage Date</option>
              <option value="createdAt">Sort by Entry Date</option>
              <option value="brideName">Sort by Bride Name</option>
              <option value="groomName">Sort by Groom Name</option>
              <option value="churchName">Sort by Church Name</option>
            </select>

            {/* Sort Order */}
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
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

      {/* Marriage Table */}
      <div className="card" style={{ overflow: 'hidden', padding: 0 }}>
        {loading ? (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>
            <RefreshCw className="spin" size={24} style={{ marginBottom: 12, color: 'var(--accent)' }} />
            <div>Loading marriage register records...</div>
          </div>
        ) : records.length === 0 ? (
          <div style={{ padding: 48, textAlign: 'center', color: 'var(--text-muted)' }}>
            <BookOpen size={48} style={{ opacity: 0.3, marginBottom: 12 }} />
            <h3 style={{ fontSize: 18, color: 'var(--text-primary)', marginBottom: 4 }}>No Marriage Records Found</h3>
            <p style={{ fontSize: 14, maxWidth: 400, margin: '0 auto 16px' }}>
              No records match your query. Add a new record or adjust your search filters.
            </p>
            <button className="btn btn-primary btn-sm" onClick={openAddModal}>
              <Plus size={14} /> Add Marriage Record
            </button>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13.5 }}>
              <thead>
                <tr style={{ background: 'var(--bg-hover)', borderBottom: '1px solid var(--border)', textAlign: 'left' }}>
                  <th style={{ padding: '12px 16px', fontWeight: 600 }}>Cert #</th>
                  <th style={{ padding: '12px 16px', fontWeight: 600 }}>Bride & Groom</th>
                  <th style={{ padding: '12px 16px', fontWeight: 600 }}>Church & Diocese</th>
                  <th style={{ padding: '12px 16px', fontWeight: 600 }}>Marriage Date</th>
                  <th style={{ padding: '12px 16px', fontWeight: 600 }}>Docs</th>
                  <th style={{ padding: '12px 16px', fontWeight: 600 }}>Status</th>
                  <th style={{ padding: '12px 16px', fontWeight: 600, textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {records.map((rec) => (
                  <tr key={rec._id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '14px 16px', fontWeight: 700, color: 'var(--accent)', fontSize: 12.5 }}>
                      {rec.marriageCertificateNumber || 'N/A'}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                        👰 {rec.brideName}
                      </div>
                      <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginTop: 2 }}>
                        🤵 {rec.groomName}
                      </div>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ fontWeight: 600 }}>{rec.churchName}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{rec.diocese || rec.parish}</div>
                    </td>
                    <td style={{ padding: '14px 16px', fontWeight: 600 }}>
                      {rec.marriageDate ? new Date(rec.marriageDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      {rec.documents && rec.documents.length > 0 ? (
                        <span style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6', padding: '2px 8px', borderRadius: 10, fontSize: 11, fontWeight: 700 }}>
                          {rec.documents.length} File(s)
                        </span>
                      ) : (
                        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>None</span>
                      )}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      {getStatusBadge(rec.marriageStatus)}
                    </td>
                    <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: 6 }}>
                        <button className="btn btn-outline btn-sm" onClick={() => openViewModal(rec)} title="View Details">
                          <Eye size={14} />
                        </button>
                        <button className="btn btn-outline btn-sm" onClick={() => openEditModal(rec)} title="Edit Record">
                          <Pencil size={14} />
                        </button>
                        <button
                          className="btn btn-outline btn-sm"
                          onClick={() => setDeleteConfirmId(rec._id)}
                          style={{ color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.3)' }}
                          title="Delete Record"
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
              Showing Page <strong>{page}</strong> of <strong>{totalPages}</strong> ({totalResults} records total)
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
            <h3 style={{ margin: '0 0 8px 0', fontSize: 18, color: '#ef4444' }}>Confirm Delete Record</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 20 }}>
              Are you sure you want to delete this marriage registration record? This action cannot be undone.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button className="btn btn-outline btn-sm" onClick={() => setDeleteConfirmId(null)}>Cancel</button>
              <button className="btn btn-primary btn-sm" style={{ background: '#ef4444', borderColor: '#ef4444' }} onClick={() => handleDeleteRecord(deleteConfirmId)}>
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit / View Record Modal */}
      {modalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'grid', placeItems: 'center', padding: 20, overflowY: 'auto' }}>
          <div className="card" style={{ maxWidth: 800, width: '100%', padding: 28, borderRadius: 12, margin: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: 14, marginBottom: 20 }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                <BookOpen size={22} style={{ color: 'var(--accent)' }} />
                {modalMode === 'add' ? 'Add Marriage Register Record' : modalMode === 'edit' ? 'Edit Marriage Record' : 'Marriage Certificate Details'}
              </h2>
              <button onClick={() => setModalOpen(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                <X size={20} />
              </button>
            </div>

            {modalMode === 'view' && currentRecord ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {/* Certificate Banner */}
                <div style={{ background: 'var(--bg-primary)', padding: 18, borderRadius: 10, border: '1px border var(--border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                      Certificate Number: <strong style={{ color: 'var(--accent)', fontSize: 15 }}>{currentRecord.marriageCertificateNumber}</strong>
                    </div>
                    <div>{getStatusBadge(currentRecord.marriageStatus)}</div>
                  </div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>
                    ⛪ {currentRecord.churchName}
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>
                    {currentRecord.churchAddress} {currentRecord.parish ? `(${currentRecord.parish} Parish)` : ''} - {currentRecord.diocese}
                  </div>
                </div>

                {/* Bride & Groom side by side */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div style={{ border: '1px solid var(--border)', padding: 16, borderRadius: 10 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--accent)', marginBottom: 8 }}>👰 Bride Details</div>
                    <div style={{ fontSize: 16, fontWeight: 700 }}>{currentRecord.brideName}</div>
                    <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>Mobile: {currentRecord.brideMobileNumber || 'N/A'}</div>
                    <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                      DOB: {currentRecord.brideDob ? new Date(currentRecord.brideDob).toLocaleDateString() : 'N/A'}
                    </div>
                  </div>
                  <div style={{ border: '1px solid var(--border)', padding: 16, borderRadius: 10 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--accent)', marginBottom: 8 }}>🤵 Groom Details</div>
                    <div style={{ fontSize: 16, fontWeight: 700 }}>{currentRecord.groomName}</div>
                    <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>Mobile: {currentRecord.groomMobileNumber || 'N/A'}</div>
                    <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                      DOB: {currentRecord.groomDob ? new Date(currentRecord.groomDob).toLocaleDateString() : 'N/A'}
                    </div>
                  </div>
                </div>

                {/* Officiating Info */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Marriage Date</span>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{new Date(currentRecord.marriageDate).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
                  </div>
                  <div>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Officiating Priest</span>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{currentRecord.priestName || 'N/A'}</div>
                  </div>
                </div>

                {/* Witnesses */}
                {currentRecord.witnesses && currentRecord.witnesses.length > 0 && (
                  <div>
                    <span style={{ fontSize: 13, fontWeight: 700, display: 'block', marginBottom: 8 }}>Witnesses</span>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 10 }}>
                      {currentRecord.witnesses.map((w, idx) => (
                        <div key={idx} style={{ background: 'var(--bg-primary)', padding: 10, borderRadius: 8, fontSize: 13 }}>
                          <strong>{w.name}</strong> ({w.relation})
                          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{w.mobileNumber}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Documents */}
                {currentRecord.documents && currentRecord.documents.length > 0 && (
                  <div>
                    <span style={{ fontSize: 13, fontWeight: 700, display: 'block', marginBottom: 8 }}>Attached Certificates & Documents</span>
                    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                      {currentRecord.documents.map((doc, idx) => (
                        <a
                          key={idx}
                          href={import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL.replace('/api', '')}${doc.fileUrl}` : doc.fileUrl}
                          target="_blank"
                          rel="noreferrer"
                          style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 12px', background: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: 8, textDecoration: 'none', color: 'var(--text-primary)', fontSize: 13 }}
                        >
                          <FileText size={16} style={{ color: 'var(--accent)' }} />
                          {doc.fileName || `Document #${idx + 1}`}
                          <Download size={14} style={{ color: 'var(--text-muted)' }} />
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 12 }}>
                  <button className="btn btn-outline btn-sm" onClick={() => setModalOpen(false)}>Close</button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmitRecord} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {/* Section 1: Bride & Groom */}
                <div>
                  <h4 style={{ fontSize: 14, fontWeight: 700, color: 'var(--accent)', borderBottom: '1px solid var(--border)', paddingBottom: 6, marginBottom: 14 }}>
                    1. Bride & Groom Information
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    {/* Bride side */}
                    <div style={{ background: 'var(--bg-primary)', padding: 14, borderRadius: 8 }}>
                      <label style={{ display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 8, color: 'var(--text-primary)' }}>👰 Bride Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="Full Bride Name"
                        className="form-input"
                        value={formData.brideName}
                        onChange={(e) => setFormData(prev => ({ ...prev, brideName: e.target.value }))}
                        style={{ width: '100%', padding: '8px 12px', marginBottom: 10 }}
                      />
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                        <div>
                          <label style={{ display: 'block', fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>Date of Birth</label>
                          <input
                            type="date"
                            className="form-input"
                            value={formData.brideDob}
                            onChange={(e) => setFormData(prev => ({ ...prev, brideDob: e.target.value }))}
                            style={{ width: '100%', padding: '6px 10px', fontSize: 12 }}
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>Mobile Number</label>
                          <input
                            type="text"
                            placeholder="+91..."
                            className="form-input"
                            value={formData.brideMobileNumber}
                            onChange={(e) => setFormData(prev => ({ ...prev, brideMobileNumber: e.target.value }))}
                            style={{ width: '100%', padding: '6px 10px', fontSize: 12 }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Groom side */}
                    <div style={{ background: 'var(--bg-primary)', padding: 14, borderRadius: 8 }}>
                      <label style={{ display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 8, color: 'var(--text-primary)' }}>🤵 Groom Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="Full Groom Name"
                        className="form-input"
                        value={formData.groomName}
                        onChange={(e) => setFormData(prev => ({ ...prev, groomName: e.target.value }))}
                        style={{ width: '100%', padding: '8px 12px', marginBottom: 10 }}
                      />
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                        <div>
                          <label style={{ display: 'block', fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>Date of Birth</label>
                          <input
                            type="date"
                            className="form-input"
                            value={formData.groomDob}
                            onChange={(e) => setFormData(prev => ({ ...prev, groomDob: e.target.value }))}
                            style={{ width: '100%', padding: '6px 10px', fontSize: 12 }}
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>Mobile Number</label>
                          <input
                            type="text"
                            placeholder="+91..."
                            className="form-input"
                            value={formData.groomMobileNumber}
                            onChange={(e) => setFormData(prev => ({ ...prev, groomMobileNumber: e.target.value }))}
                            style={{ width: '100%', padding: '6px 10px', fontSize: 12 }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section 2: Marriage & Ecclesiastical Details */}
                <div>
                  <h4 style={{ fontSize: 14, fontWeight: 700, color: 'var(--accent)', borderBottom: '1px solid var(--border)', paddingBottom: 6, marginBottom: 14 }}>
                    2. Church & Ecclesiastical Record Details
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14, marginBottom: 14 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>Marriage Date *</label>
                      <input
                        type="date"
                        required
                        className="form-input"
                        value={formData.marriageDate}
                        onChange={(e) => setFormData(prev => ({ ...prev, marriageDate: e.target.value }))}
                        style={{ width: '100%', padding: '8px 12px' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>Church Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. St. Joseph Church"
                        className="form-input"
                        value={formData.churchName}
                        onChange={(e) => setFormData(prev => ({ ...prev, churchName: e.target.value }))}
                        style={{ width: '100%', padding: '8px 12px' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>Certificate Number</label>
                      <input
                        type="text"
                        placeholder="e.g. MC-98421"
                        className="form-input"
                        value={formData.marriageCertificateNumber}
                        onChange={(e) => setFormData(prev => ({ ...prev, marriageCertificateNumber: e.target.value }))}
                        style={{ width: '100%', padding: '8px 12px' }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>Diocese</label>
                      <input
                        type="text"
                        placeholder="e.g. Diocese of Trichy"
                        className="form-input"
                        value={formData.diocese}
                        onChange={(e) => setFormData(prev => ({ ...prev, diocese: e.target.value }))}
                        style={{ width: '100%', padding: '8px 12px' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>Parish</label>
                      <input
                        type="text"
                        placeholder="e.g. Cathedral Parish"
                        className="form-input"
                        value={formData.parish}
                        onChange={(e) => setFormData(prev => ({ ...prev, parish: e.target.value }))}
                        style={{ width: '100%', padding: '8px 12px' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>Officiating Priest</label>
                      <input
                        type="text"
                        placeholder="Rev. Fr. John..."
                        className="form-input"
                        value={formData.priestName}
                        onChange={(e) => setFormData(prev => ({ ...prev, priestName: e.target.value }))}
                        style={{ width: '100%', padding: '8px 12px' }}
                      />
                    </div>
                  </div>
                </div>

                {/* Section 3: Witnesses */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: 6, marginBottom: 14 }}>
                    <h4 style={{ fontSize: 14, fontWeight: 700, color: 'var(--accent)', margin: 0 }}>
                      3. Witness Details
                    </h4>
                    <button type="button" className="btn btn-outline btn-sm" onClick={addWitnessRow} style={{ fontSize: 12 }}>
                      <PlusCircle size={12} /> Add Witness
                    </button>
                  </div>
                  {formData.witnesses.map((w, idx) => (
                    <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 40px', gap: 10, alignItems: 'center', marginBottom: 10 }}>
                      <input
                        type="text"
                        placeholder="Witness Name"
                        className="form-input"
                        value={w.name}
                        onChange={(e) => handleWitnessChange(idx, 'name', e.target.value)}
                        style={{ width: '100%', padding: '6px 10px', fontSize: 13 }}
                      />
                      <input
                        type="text"
                        placeholder="Mobile Number"
                        className="form-input"
                        value={w.mobileNumber}
                        onChange={(e) => handleWitnessChange(idx, 'mobileNumber', e.target.value)}
                        style={{ width: '100%', padding: '6px 10px', fontSize: 13 }}
                      />
                      <input
                        type="text"
                        placeholder="Relation (e.g. Brother)"
                        className="form-input"
                        value={w.relation}
                        onChange={(e) => handleWitnessChange(idx, 'relation', e.target.value)}
                        style={{ width: '100%', padding: '6px 10px', fontSize: 13 }}
                      />
                      <button
                        type="button"
                        onClick={() => removeWitnessRow(idx)}
                        disabled={formData.witnesses.length <= 1}
                        style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', opacity: formData.witnesses.length <= 1 ? 0.3 : 1 }}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Section 4: Document & Image Uploads */}
                <div>
                  <h4 style={{ fontSize: 14, fontWeight: 700, color: 'var(--accent)', borderBottom: '1px solid var(--border)', paddingBottom: 6, marginBottom: 14 }}>
                    4. Attach Marriage Certificates / Documents
                  </h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 12 }}>
                    <label className="btn btn-outline btn-sm" style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                      <Upload size={14} /> {uploadingDoc ? 'Uploading...' : 'Upload Certificate / Document'}
                      <input type="file" onChange={handleFileUpload} disabled={uploadingDoc} style={{ display: 'none' }} accept=".pdf,.png,.jpg,.jpeg,.doc,.docx" />
                    </label>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Accepted: PDF, JPG, PNG, DOCX (Max 10MB)</span>
                  </div>

                  {formData.documents.length > 0 && (
                    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                      {formData.documents.map((doc, idx) => (
                        <div key={idx} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 12px', background: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 13 }}>
                          <FileText size={14} style={{ color: 'var(--accent)' }} />
                          <span>{doc.fileName || `Doc #${idx + 1}`}</span>
                          <button type="button" onClick={() => removeDocument(idx)} style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: 0 }}>
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer Buttons */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 12, borderTop: '1px solid var(--border)', paddingTop: 16 }}>
                  <button type="button" className="btn btn-outline" onClick={() => setModalOpen(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={saving}>
                    {saving ? 'Saving...' : modalMode === 'add' ? 'Save Marriage Record' : 'Save Changes'}
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
