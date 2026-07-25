import { useState, useEffect } from 'react'
import {
  Plus, Pencil, Trash2, Users as UsersIcon, Shield, Lock, Search, Filter, List,
  CheckCircle, XCircle, AlertTriangle, ShieldCheck, Eye
} from 'lucide-react'
import api from '../services/api'
import toast from 'react-hot-toast'
import AdminProfileCreateForm from '../components/profile/AdminProfileCreateForm'
import AdminProfileDetailView from '../components/profile/AdminProfileDetailView'
import VerificationModal from '../components/profile/VerificationModal'

export default function Users() {
  const [activeTab, setActiveTab] = useState('list') // 'list', 'edit', 'add'
  const [profiles, setProfiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [verificationFilter, setVerificationFilter] = useState('ALL')

  const [currentProfile, setCurrentProfile] = useState(null)

  // Quick Action Modal state
  const [modalOpen, setModalOpen] = useState(false)
  const [modalAction, setModalAction] = useState('approve')
  const [targetProfile, setTargetProfile] = useState(null)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const res = await api.get('/profile/all?limit=200')
      setProfiles(res.data.profiles || [])
    } catch (err) {
      toast.error('Failed to load user profiles')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (profile) => {
    setCurrentProfile(profile)
    setActiveTab('edit')
  }

  const handleQuickAction = (profile, action) => {
    setTargetProfile(profile)
    setModalAction(action)
    setModalOpen(true)
  }

  const handleConfirmQuickAction = async (action, remarks) => {
    if (!targetProfile) return
    try {
      const res = await api.patch(`/profile/${targetProfile._id}/verify`, {
        action,
        adminRemarks: remarks || targetProfile.adminRemarks,
      })
      setProfiles(prev => prev.map(p => p._id === targetProfile._id ? res.data.profile : p))
      toast.success(res.data.message || 'Status updated successfully')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update status')
    }
  }

  const handleProfileCreated = (newProfile) => {
    setProfiles(prev => [newProfile, ...prev])
    setActiveTab('list')
  }

  const handleProfileUpdated = (updatedProfile) => {
    setProfiles(prev => prev.map(p => p._id === updatedProfile._id ? updatedProfile : p))
    setCurrentProfile(updatedProfile)
  }

  // Filter logic
  const filteredProfiles = profiles.filter(p => {
    // Search Filter
    if (search) {
      const s = search.toLowerCase()
      const name = `${p.firstName} ${p.lastName}`.toLowerCase()
      const email = p.email?.toLowerCase() || p.userId?.email?.toLowerCase() || ''
      const phone = p.mobileNumber?.toLowerCase() || ''
      const match = name.includes(s) || email.includes(s) || phone.includes(s)
      if (!match) return false
    }

    // Status Filter
    if (statusFilter !== 'ALL' && p.profileStatus !== statusFilter) {
      return false
    }

    // Verification Filter
    if (verificationFilter !== 'ALL' && p.verificationStatus !== verificationFilter) {
      return false
    }

    return true
  })

  if (loading) return <div className="loading-spinner"><div className="spinner" /></div>

  return (
    <div>
      {/* PAGE HEADER */}
      <div className="page-header-row page-header">
        <div>
          <h1>Profile Management & Verification</h1>
          <p>
            {activeTab === 'list'
              ? `${profiles.length} Total User Profiles • Admin Management`
              : activeTab === 'edit'
              ? `Manage & Verify Profile: ${currentProfile?.firstName} ${currentProfile?.lastName}`
              : 'Create Complete User Profile (Single-Page Form)'}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {activeTab !== 'list' && (
            <button className="btn btn-outline" onClick={() => setActiveTab('list')}>
              <List size={16} /> Back to Profiles List
            </button>
          )}
          {activeTab === 'list' && (
            <button className="btn btn-primary" onClick={() => setActiveTab('add')}>
              <Plus size={16} /> Create Full Profile
            </button>
          )}
        </div>
      </div>

      {/* VIEW 1: SINGLE-PAGE ADMIN PROFILE CREATION */}
      {activeTab === 'add' && (
        <AdminProfileCreateForm
          onSuccess={handleProfileCreated}
          onCancel={() => setActiveTab('list')}
        />
      )}

      {/* VIEW 2: PROFILE DETAILS & VERIFICATION MANAGEMENT */}
      {activeTab === 'edit' && currentProfile && (
        <AdminProfileDetailView
          profile={currentProfile}
          onUpdateProfile={handleProfileUpdated}
          onBack={() => setActiveTab('list')}
        />
      )}

      {/* VIEW 3: PROFILES LISTING & VERIFICATION TOOLBAR TABLE */}
      {activeTab === 'list' && (
        <div className="card">
          {/* SEARCH & FILTERS */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 16 }}>
            <div className="form-group" style={{ margin: 0, position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: 14, top: 12, color: 'var(--text-muted)' }} />
              <input
                className="form-input"
                placeholder="Search profiles by Name, Email, or Mobile Number..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ paddingLeft: 40 }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
              {/* Profile Status Tabs */}
              <div className="filter-bar" style={{ margin: 0 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', alignSelf: 'center', marginRight: 4 }}>Status:</span>
                {['ALL', 'Active', 'Pending', 'Suspended', 'Rejected'].map(st => (
                  <button
                    key={st}
                    className={`filter-tab ${statusFilter === st ? 'active' : ''}`}
                    onClick={() => setStatusFilter(st)}
                  >
                    {st}
                  </button>
                ))}
              </div>

              {/* Verification Status Tabs */}
              <div className="filter-bar" style={{ margin: 0 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', alignSelf: 'center', marginRight: 4 }}>Verification:</span>
                {['ALL', 'Verified', 'Unverified', 'Rejected'].map(vf => (
                  <button
                    key={vf}
                    className={`filter-tab ${verificationFilter === vf ? 'active' : ''}`}
                    onClick={() => setVerificationFilter(vf)}
                  >
                    {vf}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* TABLE */}
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Candidate Profile</th>
                  <th>Contact & Bio</th>
                  <th>Profile Status</th>
                  <th>Verification</th>
                  <th>Membership</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProfiles.length > 0 ? (
                  filteredProfiles.map((p) => (
                    <tr key={p._id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <div style={{
                            width: 42, height: 42, borderRadius: '50%', background: 'var(--accent-glow)',
                            display: 'grid', placeItems: 'center', color: 'var(--accent-light)', fontWeight: 'bold', fontSize: 16
                          }}>
                            {p.firstName ? p.firstName[0] : (p.userId?.name?.[0] || 'U')}
                          </div>
                          <div>
                            <div style={{ fontWeight: 600, fontSize: 14 }}>
                              {p.firstName} {p.lastName}
                            </div>
                            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                              {p.gender || '-'} • {p.dateOfBirth ? `${new Date().getFullYear() - new Date(p.dateOfBirth).getFullYear()} Yrs` : '-'}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td>
                        <div style={{ fontSize: 13, fontWeight: 500 }}>{p.email || p.userId?.email || 'N/A'}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{p.mobileNumber || 'No phone'}</div>
                      </td>

                      <td>
                        <span className={`badge badge-${p.profileStatus === 'Active' ? 'success' : p.profileStatus === 'Pending' ? 'warning' : 'danger'}`}>
                          {p.profileStatus || 'Pending'}
                        </span>
                        {p.blocked && <span className="badge badge-cancelled" style={{ marginLeft: 4 }}>Blocked</span>}
                      </td>

                      <td>
                        <span className={`badge ${p.verificationStatus === 'Verified' ? 'badge-delivered' : 'badge-pending'}`}>
                          {p.verificationStatus || 'Unverified'}
                        </span>
                      </td>

                      <td>
                        <span className="badge badge-shipped">{p.membershipType || 'Free'}</span>
                      </td>

                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                          {p.verificationStatus !== 'Verified' && (
                            <button
                              className="btn btn-sm btn-primary"
                              onClick={() => handleQuickAction(p, 'approve')}
                              title="Approve & Verify Profile"
                            >
                              <CheckCircle size={13} /> Verify
                            </button>
                          )}
                          <button
                            className="btn btn-sm btn-outline"
                            onClick={() => handleEdit(p)}
                            title="Manage Profile Details"
                          >
                            <Pencil size={13} /> Manage
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
                      No profiles match the filter criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* QUICK ACTION VERIFICATION MODAL */}
      <VerificationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleConfirmQuickAction}
        actionType={modalAction}
        profileName={targetProfile ? `${targetProfile.firstName} ${targetProfile.lastName}` : ''}
      />
    </div>
  )
}
