import { useState, useEffect } from 'react'
import {
  Search, Filter, CheckCircle2, XCircle, Clock, Eye,
  RefreshCw, Check, X, User, PhoneCall, ShieldCheck, Mail, MapPin, Building2
} from 'lucide-react'
import api from '../services/api'
import toast from 'react-hot-toast'

export default function ContactRequests() {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All') // 'All', 'Pending', 'Approved', 'Rejected'
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalResults, setTotalResults] = useState(0)

  // Selected Request for View / Action Modal
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [actionType, setActionType] = useState(null) // 'view', 'approve', 'reject'
  const [adminRemarks, setAdminRemarks] = useState('')
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => {
    fetchRequests()
  }, [statusFilter, page])

  const fetchRequests = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page,
        limit: 15,
        status: statusFilter,
        ...(search ? { search } : {})
      })
      const res = await api.get(`/contact-requests/admin/all?${params.toString()}`)
      if (res.data && res.data.success) {
        setRequests(res.data.requests || [])
        setTotalPages(res.data.totalPages || 1)
        setTotalResults(res.data.totalResults || 0)
      }
    } catch (err) {
      console.error('Failed to load contact requests:', err)
      toast.error(err.response?.data?.message || 'Failed to fetch contact requests')
    } finally {
      setLoading(false)
    }
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    setPage(1)
    fetchRequests()
  }

  const openActionModal = (request, type) => {
    setSelectedRequest(request)
    setActionType(type)
    setAdminRemarks(request.adminRemarks || '')
  }

  const closeActionModal = () => {
    setSelectedRequest(null)
    setActionType(null)
    setAdminRemarks('')
  }

  const handleApprove = async () => {
    if (!selectedRequest) return
    setActionLoading(true)
    try {
      const res = await api.patch(`/contact-requests/admin/${selectedRequest._id}/approve`, {
        adminRemarks
      })
      toast.success('Contact request approved successfully!')
      setRequests(prev => prev.map(r => r._id === selectedRequest._id ? res.data.request : r))
      closeActionModal()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to approve request')
    } finally {
      setActionLoading(false)
    }
  }

  const handleReject = async () => {
    if (!selectedRequest) return
    setActionLoading(true)
    try {
      const res = await api.patch(`/contact-requests/admin/${selectedRequest._id}/reject`, {
        adminRemarks: adminRemarks || 'Request rejected by administrative security.'
      })
      toast.success('Contact request rejected.')
      setRequests(prev => prev.map(r => r._id === selectedRequest._id ? res.data.request : r))
      closeActionModal()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reject request')
    } finally {
      setActionLoading(false)
    }
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Approved':
        return (
          <span className="badge badge-success" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            <CheckCircle2 size={13} /> Approved
          </span>
        )
      case 'Rejected':
        return (
          <span className="badge badge-danger" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            <XCircle size={13} /> Rejected
          </span>
        )
      case 'Pending':
      default:
        return (
          <span className="badge badge-warning" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            <Clock size={13} /> Pending Review
          </span>
        )
    }
  }

  return (
    <div className="contact-requests-page" style={{ padding: '24px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: 700, margin: '0 0 6px 0', color: 'var(--text-primary)' }}>
            Contact Requests Management
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', margin: 0 }}>
            Review, approve, or reject member contact information requests for RC Christian Matrimony.
          </p>
        </div>

        <button 
          className="btn btn-outline btn-sm" 
          onClick={fetchRequests} 
          disabled={loading}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '16px 20px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        
        {/* Status Filter Tabs */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {['All', 'Pending', 'Approved', 'Rejected'].map(status => (
            <button
              key={status}
              onClick={() => { setStatusFilter(status); setPage(1); }}
              className={`btn btn-sm ${statusFilter === status ? 'btn-primary' : 'btn-ghost'}`}
              style={{ borderRadius: '20px', padding: '6px 16px', fontSize: '13px', fontWeight: 600 }}
            >
              {status} Requests
            </button>
          ))}
        </div>

        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '8px', width: '320px', maxWidth: '100%' }}>
          <div style={{ position: 'relative', width: '100%' }}>
            <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text"
              placeholder="Search by user or profile name..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="form-control"
              style={{ paddingLeft: '36px', height: '38px', borderRadius: '10px', fontSize: '13px' }}
            />
          </div>
          <button type="submit" className="btn btn-sm btn-primary" style={{ borderRadius: '10px', padding: '0 16px' }}>
            Search
          </button>
        </form>
      </div>

      {/* Requests Data Table */}
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
        
        {loading ? (
          <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <RefreshCw size={32} className="animate-spin" style={{ margin: '0 auto 12px auto', color: 'var(--accent)' }} />
            <p style={{ margin: 0, fontSize: '14px' }}>Loading contact requests...</p>
          </div>
        ) : requests.length === 0 ? (
          <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <PhoneCall size={40} style={{ margin: '0 auto 12px auto', opacity: 0.4 }} />
            <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 6px 0' }}>
              No Contact Requests Found
            </h3>
            <p style={{ fontSize: '13px', margin: 0 }}>
              {statusFilter !== 'All' ? `There are currently no ${statusFilter.toLowerCase()} contact requests.` : 'No contact requests match your criteria.'}
            </p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table" style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)', textAlign: 'left' }}>
                  <th style={{ padding: '14px 20px', fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Request ID</th>
                  <th style={{ padding: '14px 20px', fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Requested By (User)</th>
                  <th style={{ padding: '14px 20px', fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Requested Profile</th>
                  <th style={{ padding: '14px 20px', fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Request Date</th>
                  <th style={{ padding: '14px 20px', fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Status</th>
                  <th style={{ padding: '14px 20px', fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests.map(reqItem => {
                  const reqUser = reqItem.requestedBy || {}
                  const reqProfile = reqItem.requestedProfile || {}
                  const profileName = [reqProfile.firstName, reqProfile.lastName].filter(Boolean).join(' ') || 'Member Profile'

                  return (
                    <tr key={reqItem._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      {/* ID */}
                      <td style={{ padding: '14px 20px', fontSize: '13px', fontWeight: 600, fontFamily: 'monospace', color: 'var(--text-muted)' }}>
                        #{reqItem._id.substring(reqItem._id.length - 6).toUpperCase()}
                      </td>

                      {/* User */}
                      <td style={{ padding: '14px 20px' }}>
                        <div style={{ fontWeight: 600, fontSize: '14px', color: 'var(--text-primary)' }}>
                          {reqUser.name || 'User'}
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                          {reqUser.email || '—'}
                        </div>
                      </td>

                      {/* Target Profile */}
                      <td style={{ padding: '14px 20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <img 
                            src={reqProfile.profileImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'} 
                            alt={profileName}
                            style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--border-color)' }}
                          />
                          <div>
                            <div style={{ fontWeight: 600, fontSize: '14px', color: 'var(--text-primary)' }}>
                              {profileName}
                            </div>
                            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                              {[reqProfile.denomination, reqProfile.diocese].filter(Boolean).join(' • ') || 'RC Member'}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Date */}
                      <td style={{ padding: '14px 20px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                        {new Date(reqItem.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </td>

                      {/* Status */}
                      <td style={{ padding: '14px 20px' }}>
                        {getStatusBadge(reqItem.status)}
                      </td>

                      {/* Actions */}
                      <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                          
                          <button 
                            className="btn btn-sm btn-ghost" 
                            title="View Details"
                            onClick={() => openActionModal(reqItem, 'view')}
                          >
                            <Eye size={15} />
                          </button>

                          {reqItem.status !== 'Approved' && (
                            <button 
                              className="btn btn-sm btn-success" 
                              title="Approve Request"
                              onClick={() => openActionModal(reqItem, 'approve')}
                              style={{ padding: '4px 10px', fontSize: '12px', borderRadius: '6px' }}
                            >
                              <Check size={14} /> Approve
                            </button>
                          )}

                          {reqItem.status !== 'Rejected' && (
                            <button 
                              className="btn btn-sm btn-danger" 
                              title="Reject Request"
                              onClick={() => openActionModal(reqItem, 'reject')}
                              style={{ padding: '4px 10px', fontSize: '12px', borderRadius: '6px' }}
                            >
                              <X size={14} /> Reject
                            </button>
                          )}

                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div style={{ padding: '16px 20px', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              Showing Page {page} of {totalPages} ({totalResults} Total Requests)
            </span>
            <div style={{ display: 'flex', gap: '6px' }}>
              <button 
                className="btn btn-sm btn-outline" 
                disabled={page <= 1}
                onClick={() => setPage(p => Math.max(1, p - 1))}
              >
                Previous
              </button>
              <button 
                className="btn btn-sm btn-outline" 
                disabled={page >= totalPages}
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Action / Details Modal */}
      {selectedRequest && (
        <div className="modal-overlay" style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(4px)',
          display: 'grid',
          placeItems: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div className="modal-container" style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: '20px',
            width: '100%',
            maxWidth: '520px',
            boxShadow: '0 20px 50px rgba(0,0,0,0.2)',
            overflow: 'hidden'
          }}>
            {/* Modal Header */}
            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>
                {actionType === 'view' && 'Contact Request Details'}
                {actionType === 'approve' && 'Approve Contact Request'}
                {actionType === 'reject' && 'Reject Contact Request'}
              </h3>
              <button onClick={closeActionModal} className="btn btn-ghost btn-sm" style={{ padding: 4 }}>
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '24px' }}>
              
              {/* Profile Overview Card */}
              <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '16px', marginBottom: '20px' }}>
                <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                  <img 
                    src={selectedRequest.requestedProfile?.profileImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'} 
                    alt="Target Profile"
                    style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <div>
                    <h4 style={{ margin: '0 0 2px 0', fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {[selectedRequest.requestedProfile?.firstName, selectedRequest.requestedProfile?.lastName].filter(Boolean).join(' ') || 'Member Profile'}
                    </h4>
                    <p style={{ margin: 0, fontSize: '12.5px', color: 'var(--text-muted)' }}>
                      {[selectedRequest.requestedProfile?.denomination, selectedRequest.requestedProfile?.diocese].filter(Boolean).join(' • ') || 'RC Member'}
                    </p>
                    <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: 'var(--accent)', fontWeight: 600 }}>
                      Requested by: {selectedRequest.requestedBy?.name} ({selectedRequest.requestedBy?.email})
                    </p>
                  </div>
                </div>
              </div>

              {/* View Mode Extra Information */}
              {actionType === 'view' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13.5px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Request ID</span>
                    <span style={{ fontWeight: 600, fontFamily: 'monospace' }}>{selectedRequest._id}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Current Status</span>
                    <span>{getStatusBadge(selectedRequest.status)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Date Requested</span>
                    <span style={{ fontWeight: 600 }}>{new Date(selectedRequest.createdAt).toLocaleString()}</span>
                  </div>
                  {selectedRequest.approvalDate && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Approval Date</span>
                      <span style={{ fontWeight: 600 }}>{new Date(selectedRequest.approvalDate).toLocaleString()}</span>
                    </div>
                  )}
                  {selectedRequest.adminRemarks && (
                    <div style={{ marginTop: '8px', background: 'var(--bg-secondary)', padding: '12px', borderRadius: '8px' }}>
                      <strong style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>Admin Remarks:</strong>
                      <span style={{ color: 'var(--text-primary)' }}>{selectedRequest.adminRemarks}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Approve / Reject Form Mode */}
              {(actionType === 'approve' || actionType === 'reject') && (
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
                    Admin Remarks / Reason ({actionType === 'reject' ? 'Required for Rejection' : 'Optional'})
                  </label>
                  <textarea 
                    rows="3"
                    className="form-control"
                    placeholder={actionType === 'reject' ? 'e.g., Target member requested privacy or verification incomplete.' : 'e.g., Identity verified, approved for contact sharing.'}
                    value={adminRemarks}
                    onChange={e => setAdminRemarks(e.target.value)}
                    style={{ width: '100%', fontSize: '13px', padding: '10px', borderRadius: '8px', marginBottom: '20px' }}
                  />

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                    <button onClick={closeActionModal} className="btn btn-outline" disabled={actionLoading}>
                      Cancel
                    </button>
                    {actionType === 'approve' ? (
                      <button onClick={handleApprove} className="btn btn-success" disabled={actionLoading}>
                        {actionLoading ? 'Approving...' : 'Confirm Approval'}
                      </button>
                    ) : (
                      <button onClick={handleReject} className="btn btn-danger" disabled={actionLoading}>
                        {actionLoading ? 'Rejecting...' : 'Confirm Rejection'}
                      </button>
                    )}
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

    </div>
  )
}
