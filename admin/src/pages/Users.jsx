import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, Users as UsersIcon, Shield, Lock, Search, Filter, List } from 'lucide-react'
import api from '../services/api'
import toast from 'react-hot-toast'

// Import client profile components to reuse their exact logic and fields
import EditBasicInfo from '@client/components/profile/EditBasicInfo'
import EditAbout from '@client/components/profile/EditAbout'
import EditReligious from '@client/components/profile/EditReligious'
import EditPersonal from '@client/components/profile/EditPersonal'
import EditEducation from '@client/components/profile/EditEducation'
import EditCareer from '@client/components/profile/EditCareer'
import EditFamily from '@client/components/profile/EditFamily'
import EditAddress from '@client/components/profile/EditAddress'
import EditPartnerPreference from '@client/components/profile/EditPartnerPreference'
import EditChurch from '@client/components/profile/EditChurch'

export default function Users() {
  const [activeTab, setActiveTab] = useState('list') // 'list', 'edit', 'add'
  const [profiles, setProfiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [search, setSearch] = useState('')

  const [currentProfile, setCurrentProfile] = useState(null)
  
  // Admin-only fields form state
  const [adminForm, setAdminForm] = useState({})

  // Add user form state
  const [addForm, setAddForm] = useState({ name: '', email: '', password: '', mobileNumber: '' })

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const res = await api.get('/profile/all?limit=100')
      setProfiles(res.data.profiles || [])
    } catch (err) {
      toast.error('Failed to load user profiles')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (profile) => {
    setCurrentProfile(profile)
    setAdminForm({
      password: '', // blank by default
      profileStatus: profile.profileStatus || 'Pending',
      verificationStatus: profile.verificationStatus || 'Unverified',
      membershipType: profile.membershipType || 'Free',
      blocked: profile.blocked || false,
      deleted: profile.deleted || false,
      adminRemarks: profile.adminRemarks || '',
    })
    setActiveTab('edit')
  }

  const handleAdminUpdate = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const submitData = { ...adminForm }
      if (!submitData.password) {
        delete submitData.password
      }
      const res = await api.patch(`/profile/${currentProfile._id}/admin`, submitData)
      setProfiles(prev => prev.map(p => p._id === currentProfile._id ? res.data.profile : p))
      setCurrentProfile(res.data.profile)
      toast.success('Admin controls updated successfully')
      setAdminForm(p => ({ ...p, password: '' }))
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update admin controls')
    } finally {
      setSubmitting(false)
    }
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const res = await api.post('/profile/admin/create', addForm)
      setProfiles(prev => [res.data.profile, ...prev])
      toast.success('User profile created successfully')
      setActiveTab('list')
      setAddForm({ name: '', email: '', password: '', mobileNumber: '' })
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create user')
    } finally {
      setSubmitting(false)
    }
  }

  const handleProfileSectionUpdate = (updatedProfile) => {
    setProfiles(prev => prev.map(p => p._id === updatedProfile._id ? updatedProfile : p))
    setCurrentProfile(updatedProfile)
  }

  const filteredProfiles = profiles.filter(p => {
    if (!search) return true
    const s = search.toLowerCase()
    const name = `${p.firstName} ${p.lastName}`.toLowerCase()
    const email = p.email?.toLowerCase() || p.userId?.email?.toLowerCase() || ''
    const phone = p.mobileNumber?.toLowerCase() || ''
    return name.includes(s) || email.includes(s) || phone.includes(s)
  })

  if (loading) return <div className="loading-spinner"><div className="spinner" /></div>

  return (
    <div>
      <div className="page-header-row page-header">
        <div>
          <h1>Profile Management</h1>
          <p>{activeTab === 'list' ? `${profiles.length} total profiles` : activeTab === 'edit' ? 'Editing profile and admin controls' : 'Create a new user profile'}</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {activeTab !== 'list' && (
            <button className="btn btn-outline" onClick={() => setActiveTab('list')}>
              <List size={16} /> Back to Users
            </button>
          )}
          {activeTab === 'list' && (
            <button className="btn btn-primary" onClick={() => setActiveTab('add')}>
              <Plus size={16} /> Add User
            </button>
          )}
        </div>
      </div>

      {activeTab === 'add' && (
        <div className="card" style={{ maxWidth: 600, margin: '0 auto' }}>
          <div className="card-title">Create New User Profile</div>
          <form onSubmit={handleCreate} className="fade-in">
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input className="form-input" required value={addForm.name} onChange={e => setAddForm(p => ({ ...p, name: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Email Address *</label>
              <input type="email" className="form-input" required value={addForm.email} onChange={e => setAddForm(p => ({ ...p, email: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Mobile Number</label>
              <input className="form-input" value={addForm.mobileNumber} onChange={e => setAddForm(p => ({ ...p, mobileNumber: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Temporary Password *</label>
              <input type="password" minLength={6} className="form-input" required value={addForm.password} onChange={e => setAddForm(p => ({ ...p, password: e.target.value }))} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 24 }}>
              <button type="button" className="btn btn-outline" onClick={() => setActiveTab('list')} disabled={submitting}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? 'Creating...' : 'Create User'}
              </button>
            </div>
          </form>
        </div>
      )}

      {activeTab === 'list' && (
        <div className="card">
          <div className="card-header" style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
            <div className="form-group" style={{ flex: 1, margin: 0, position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: 12, top: 12, color: 'var(--text-muted)' }} />
              <input 
                className="form-input" 
                placeholder="Search profiles by name, email, or phone..." 
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ paddingLeft: 40 }}
              />
            </div>
          </div>
          
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Profile</th>
                  <th>Details</th>
                  <th>Status</th>
                  <th>Membership</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProfiles.length > 0 ? filteredProfiles.map(p => (
                  <tr key={p._id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ width: 40, height: 40, borderRadius: '50%', backgroundColor: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', fontWeight: 'bold' }}>
                          {p.firstName ? p.firstName[0] : (p.userId?.name?.[0] || 'U')}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600 }}>{p.firstName} {p.lastName}</div>
                          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>ID: {p.userId?._id?.slice(-6)}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ fontSize: 13 }}>{p.email || p.userId?.email || 'N/A'}</div>
                      <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                        {p.gender || '-'} • {p.dateOfBirth ? `${new Date().getFullYear() - new Date(p.dateOfBirth).getFullYear()} Yrs` : '-'}
                      </div>
                    </td>
                    <td>
                      <span className={`badge badge-${p.profileStatus === 'Active' ? 'success' : p.profileStatus === 'Pending' ? 'warning' : 'danger'}`}>
                        {p.profileStatus || 'Pending'}
                      </span>
                      {p.verificationStatus === 'Verified' && <span className="badge badge-info" style={{ marginLeft: 4 }}>Verified</span>}
                    </td>
                    <td>
                      <span className="badge badge-primary">{p.membershipType || 'Free'}</span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button className="btn btn-sm btn-outline" onClick={() => handleEdit(p)} title="Manage Profile">
                          <Pencil size={14} /> Manage
                        </button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '32px 0', color: 'var(--text-muted)' }}>
                      No profiles found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'edit' && currentProfile && (
        <div className="grid-2 fade-in" style={{ gap: 24, alignItems: 'start' }}>
          
          {/* LEFT COLUMN: Shared Client Profile Components */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-secondary)' }}>User Profile Data</h3>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 8 }}>These sections share the exact same UI and validation logic as the client app.</p>
            
            <EditBasicInfo profile={currentProfile} onUpdate={handleProfileSectionUpdate} profileId={currentProfile._id} />
            <EditAbout profile={currentProfile} onUpdate={handleProfileSectionUpdate} profileId={currentProfile._id} />
            <EditReligious profile={currentProfile} onUpdate={handleProfileSectionUpdate} profileId={currentProfile._id} />
            <EditChurch profile={currentProfile} onUpdate={handleProfileSectionUpdate} profileId={currentProfile._id} />
            <EditPersonal profile={currentProfile} onUpdate={handleProfileSectionUpdate} profileId={currentProfile._id} />
            <EditEducation profile={currentProfile} onUpdate={handleProfileSectionUpdate} profileId={currentProfile._id} />
            <EditCareer profile={currentProfile} onUpdate={handleProfileSectionUpdate} profileId={currentProfile._id} />
            <EditFamily profile={currentProfile} onUpdate={handleProfileSectionUpdate} profileId={currentProfile._id} />
            <EditAddress profile={currentProfile} onUpdate={handleProfileSectionUpdate} profileId={currentProfile._id} />
            <EditPartnerPreference profile={currentProfile} onUpdate={handleProfileSectionUpdate} profileId={currentProfile._id} />
          </div>

          {/* RIGHT COLUMN: Admin-only Controls */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
             <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-secondary)' }}>Administration Controls</h3>
             <form onSubmit={handleAdminUpdate}>
               <div className="card">
                <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Shield size={18} /> Admin Controls
                </div>
                <div className="grid-2" style={{ gap: 16 }}>
                  <div className="form-group">
                    <label className="form-label">Profile Status</label>
                    <select className="form-select" value={adminForm.profileStatus} onChange={e => setAdminForm(p => ({ ...p, profileStatus: e.target.value }))}>
                      <option value="Pending">Pending</option>
                      <option value="Active">Active</option>
                      <option value="Suspended">Suspended</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Verification Status</label>
                    <select className="form-select" value={adminForm.verificationStatus} onChange={e => setAdminForm(p => ({ ...p, verificationStatus: e.target.value }))}>
                      <option value="Unverified">Unverified</option>
                      <option value="Verified">Verified</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Membership Type</label>
                    <select className="form-select" value={adminForm.membershipType} onChange={e => setAdminForm(p => ({ ...p, membershipType: e.target.value }))}>
                      <option value="Free">Free</option>
                      <option value="Silver">Silver</option>
                      <option value="Gold">Gold</option>
                      <option value="Platinum">Platinum</option>
                    </select>
                  </div>
                  <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 24 }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                      <input type="checkbox" checked={adminForm.blocked} onChange={e => setAdminForm(p => ({ ...p, blocked: e.target.checked }))} />
                      <span style={{ color: 'var(--danger)', fontWeight: 500 }}>Block Account</span>
                    </label>
                  </div>
                </div>
                <div className="form-group" style={{ marginTop: 16 }}>
                  <label className="form-label">Admin Remarks (Internal)</label>
                  <textarea className="form-textarea" placeholder="Add notes about this user..." value={adminForm.adminRemarks} onChange={e => setAdminForm(p => ({ ...p, adminRemarks: e.target.value }))} rows={3} />
                </div>
              </div>

              <div className="card" style={{ borderLeft: '4px solid var(--danger)', marginTop: 24 }}>
                <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--danger)' }}>
                  <Lock size={18} /> Credentials & Password
                </div>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16 }}>
                  As an admin, you can manually reset the user's password here. Leave blank to keep the current password. This field is completely hidden from the user.
                </p>
                <div className="form-group">
                  <label className="form-label">Admin-only Password Reset</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="Enter new password (min 6 chars)..." 
                    value={adminForm.password}
                    onChange={e => setAdminForm(p => ({ ...p, password: e.target.value }))}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
                 <button type="submit" className="btn btn-primary" disabled={submitting}>
                    {submitting ? 'Saving...' : 'Save Admin Controls'}
                 </button>
              </div>
             </form>
          </div>

        </div>
      )}
    </div>
  )
}
