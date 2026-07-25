import { useState } from 'react'
import {
  ShieldCheck, CheckCircle, XCircle, AlertTriangle, Lock, Unlock,
  Crown, FileText, Upload, Trash2, Eye, ExternalLink, Save, RefreshCw
} from 'lucide-react'
import EditBasicInfo from '@client/components/profile/EditBasicInfo'
import EditAbout from '@client/components/profile/EditAbout'
import EditReligious from '@client/components/profile/EditReligious'
import EditPersonal from '@client/components/profile/EditPersonal'
import EditEducation from '@client/components/profile/EditEducation'
import EditCareer from '@client/components/profile/EditCareer'
import EditFamily from '@client/components/profile/EditFamily'
import EditAddress from '@client/components/profile/EditAddress'
import EditChurch from '@client/components/profile/EditChurch'
import VerificationModal from './VerificationModal'
import api from '../../services/api'
import toast from 'react-hot-toast'

export default function AdminProfileDetailView({ profile, onUpdateProfile, onBack }) {
  const [currentProfile, setCurrentProfile] = useState(profile)
  const [activeTab, setActiveTab] = useState('sections') // 'sections', 'documents', 'admin'
  const [modalOpen, setModalOpen] = useState(false)
  const [modalAction, setModalAction] = useState('approve')
  const [uploadingDoc, setUploadingDoc] = useState(false)
  const [docFile, setDocFile] = useState(null)
  const [docType, setDocType] = useState('idProof')
  const [docLabel, setDocLabel] = useState('')

  const [adminForm, setAdminForm] = useState({
    profileStatus: profile.profileStatus || 'Pending',
    verificationStatus: profile.verificationStatus || 'Unverified',
    membershipType: profile.membershipType || 'Free',
    premiumMember: profile.premiumMember || false,
    featuredProfile: profile.featuredProfile || false,
    blocked: profile.blocked || false,
    adminRemarks: profile.adminRemarks || '',
    password: '',
  })
  const [submittingAdmin, setSubmittingAdmin] = useState(false)

  const BACKEND_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3009'

  const handleVerificationAction = (action) => {
    setModalAction(action)
    setModalOpen(true)
  }

  const handleConfirmVerification = async (action, remarks) => {
    try {
      const res = await api.patch(`/profile/${currentProfile._id}/verify`, {
        action,
        adminRemarks: remarks || currentProfile.adminRemarks,
      })
      setCurrentProfile(res.data.profile)
      onUpdateProfile && onUpdateProfile(res.data.profile)
      toast.success(res.data.message || 'Status updated successfully')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update verification status')
    }
  }

  const handleAdminFormSubmit = async (e) => {
    e.preventDefault()
    setSubmittingAdmin(true)
    try {
      const payload = { ...adminForm }
      if (!payload.password) delete payload.password

      const res = await api.patch(`/profile/${currentProfile._id}/admin`, payload)
      setCurrentProfile(res.data.profile)
      onUpdateProfile && onUpdateProfile(res.data.profile)
      toast.success('Admin controls saved successfully')
      setAdminForm(p => ({ ...p, password: '' }))
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update admin controls')
    } finally {
      setSubmittingAdmin(false)
    }
  }

  const handleUploadDocument = async (e) => {
    e.preventDefault()
    if (!docFile) {
      toast.error('Please select a document file')
      return
    }
    setUploadingDoc(true)
    try {
      const formData = new FormData()
      formData.append('document', docFile)
      formData.append('docType', docType)
      formData.append('label', docLabel || 'Verification Document')

      const res = await api.post(`/profile/${currentProfile._id}/admin/documents`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      setCurrentProfile(res.data.profile)
      onUpdateProfile && onUpdateProfile(res.data.profile)
      toast.success('Document uploaded successfully')
      setDocFile(null)
      setDocLabel('')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Document upload failed')
    } finally {
      setUploadingDoc(false)
    }
  }

  const handleRemoveDocument = async (docId) => {
    if (!window.confirm('Are you sure you want to delete this document?')) return
    try {
      const res = await api.delete(`/profile/${currentProfile._id}/admin/documents/${docId}`)
      setCurrentProfile(res.data.profile)
      onUpdateProfile && onUpdateProfile(res.data.profile)
      toast.success('Document removed')
    } catch (err) {
      toast.error('Failed to remove document')
    }
  }

  const handleSectionUpdated = (updatedProf) => {
    setCurrentProfile(updatedProf)
    onUpdateProfile && onUpdateProfile(updatedProf)
  }

  return (
    <div>
      {/* TOP HEADER SUMMARY & VERIFICATION TOOLBAR */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <div style={{
              width: 64, height: 64, borderRadius: '50%', background: 'var(--accent-glow)',
              color: 'var(--accent-light)', display: 'grid', placeItems: 'center', fontWeight: 'bold', fontSize: 24, flexShrink: 0
            }}>
              {currentProfile.firstName ? currentProfile.firstName[0] : 'U'}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>
                  {currentProfile.firstName} {currentProfile.lastName}
                </h2>
                <span className={`badge badge-${currentProfile.profileStatus === 'Active' ? 'success' : currentProfile.profileStatus === 'Pending' ? 'warning' : 'danger'}`}>
                  {currentProfile.profileStatus || 'Pending'}
                </span>
                <span className={`badge ${currentProfile.verificationStatus === 'Verified' ? 'badge-delivered' : 'badge-pending'}`}>
                  {currentProfile.verificationStatus || 'Unverified'}
                </span>
                <span className="badge badge-shipped">{currentProfile.membershipType || 'Free'}</span>
                {currentProfile.blocked && <span className="badge badge-cancelled">BLOCKED</span>}
              </div>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>
                {currentProfile.email} • ID: {currentProfile.userId?._id || currentProfile.userId} • Created: {new Date(currentProfile.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {currentProfile.verificationStatus !== 'Verified' && (
              <button className="btn btn-primary" onClick={() => handleVerificationAction('approve')}>
                <CheckCircle size={15} /> Approve & Verify
              </button>
            )}
            {currentProfile.profileStatus !== 'Rejected' && (
              <button className="btn btn-danger" onClick={() => handleVerificationAction('reject')}>
                <XCircle size={15} /> Reject Profile
              </button>
            )}
            {currentProfile.profileStatus !== 'Pending' && (
              <button className="btn btn-outline" onClick={() => handleVerificationAction('pending')}>
                <AlertTriangle size={15} /> Mark Pending
              </button>
            )}
            {currentProfile.blocked ? (
              <button className="btn btn-outline" onClick={() => handleVerificationAction('unblock')}>
                <Unlock size={15} /> Unblock
              </button>
            ) : (
              <button className="btn btn-danger" onClick={() => handleVerificationAction('block')}>
                <Lock size={15} /> Block Account
              </button>
            )}
          </div>
        </div>
      </div>

      {/* TABS HEADER */}
      <div className="filter-bar" style={{ marginBottom: 20 }}>
        <button className={`filter-tab ${activeTab === 'sections' ? 'active' : ''}`} onClick={() => setActiveTab('sections')}>
          User Profile Sections
        </button>
        <button className={`filter-tab ${activeTab === 'documents' ? 'active' : ''}`} onClick={() => setActiveTab('documents')}>
          Verification Documents ({currentProfile.documents?.length || 0})
        </button>
        <button className={`filter-tab ${activeTab === 'admin' ? 'active' : ''}`} onClick={() => setActiveTab('admin')}>
          Admin Controls & Password Reset
        </button>
      </div>

      {/* TAB 1: ALL USER PROFILE SECTIONS */}
      {activeTab === 'sections' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <EditBasicInfo profile={currentProfile} onUpdate={handleSectionUpdated} profileId={currentProfile._id} />
          <EditAbout profile={currentProfile} onUpdate={handleSectionUpdated} profileId={currentProfile._id} />
          <EditReligious profile={currentProfile} onUpdate={handleSectionUpdated} profileId={currentProfile._id} />
          <EditChurch profile={currentProfile} onUpdate={handleSectionUpdated} profileId={currentProfile._id} />
          <EditPersonal profile={currentProfile} onUpdate={handleSectionUpdated} profileId={currentProfile._id} />
          <EditEducation profile={currentProfile} onUpdate={handleSectionUpdated} profileId={currentProfile._id} />
          <EditCareer profile={currentProfile} onUpdate={handleSectionUpdated} profileId={currentProfile._id} />
          <EditFamily profile={currentProfile} onUpdate={handleSectionUpdated} profileId={currentProfile._id} />
          <EditAddress profile={currentProfile} onUpdate={handleSectionUpdated} profileId={currentProfile._id} />
        </div>
      )}

      {/* TAB 2: VERIFICATION DOCUMENTS */}
      {activeTab === 'documents' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Upload New Document Card */}
          <div className="card">
            <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Upload size={18} color="var(--accent)" /> Upload Document on Behalf of User
            </div>
            <form onSubmit={handleUploadDocument} className="grid-3" style={{ gap: 16, alignItems: 'flex-end' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Document Type</label>
                <select className="form-select" value={docType} onChange={e => setDocType(e.target.value)}>
                  <option value="idProof">Aadhaar / ID Proof</option>
                  <option value="baptismCertificate">Baptism Certificate</option>
                  <option value="other">Other Document</option>
                </select>
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Document Label</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Govt ID Card"
                  value={docLabel}
                  onChange={e => setDocLabel(e.target.value)}
                />
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Select File (PDF / Image)</label>
                <input
                  type="file"
                  className="form-input"
                  accept="image/*,.pdf"
                  onChange={e => setDocFile(e.target.files[0])}
                  required
                />
              </div>
              <div style={{ gridColumn: 'span 3', display: 'flex', justifyContent: 'flex-end' }}>
                <button type="submit" className="btn btn-primary" disabled={uploadingDoc}>
                  {uploadingDoc ? 'Uploading...' : 'Upload Document'}
                </button>
              </div>
            </form>
          </div>

          {/* Document List */}
          <div className="card">
            <div className="card-title">Uploaded Verification Documents</div>
            {currentProfile.documents && currentProfile.documents.length > 0 ? (
              <div className="grid-2" style={{ gap: 16 }}>
                {currentProfile.documents.map((doc) => (
                  <div key={doc._id} style={{
                    background: 'var(--bg-primary)', border: '1px solid var(--border)',
                    borderRadius: 10, padding: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                  }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{doc.label || doc.type}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                        Type: {doc.type} • Uploaded: {new Date(doc.uploadedAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <a
                        href={`${BACKEND_URL}${doc.url}`}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-sm btn-outline"
                      >
                        <ExternalLink size={14} /> View
                      </a>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleRemoveDocument(doc._id)}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--text-muted)' }}>
                No verification documents uploaded yet.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: ADMIN CONTROLS & PASSWORD RESET */}
      {activeTab === 'admin' && (
        <div className="card">
          <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <ShieldCheck size={18} color="var(--accent)" /> Administrative Controls & Password Management
          </div>
          <form onSubmit={handleAdminFormSubmit}>
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

              <div className="form-group">
                <label className="form-label">Reset User Password (Admin-only)</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Enter new password (min 6 chars)..."
                  value={adminForm.password}
                  onChange={e => setAdminForm(p => ({ ...p, password: e.target.value }))}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: 24, marginTop: 16 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                <input type="checkbox" checked={adminForm.featuredProfile} onChange={e => setAdminForm(p => ({ ...p, featuredProfile: e.target.checked }))} />
                <span>Featured Profile</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                <input type="checkbox" checked={adminForm.premiumMember} onChange={e => setAdminForm(p => ({ ...p, premiumMember: e.target.checked }))} />
                <span>Premium Member</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                <input type="checkbox" checked={adminForm.blocked} onChange={e => setAdminForm(p => ({ ...p, blocked: e.target.checked }))} />
                <span style={{ color: 'var(--danger)', fontWeight: 600 }}>Block Account</span>
              </label>
            </div>

            <div className="form-group" style={{ marginTop: 16 }}>
              <label className="form-label">Admin Remarks / Verification Notes</label>
              <textarea
                className="form-textarea"
                rows={3}
                placeholder="Internal verification notes..."
                value={adminForm.adminRemarks}
                onChange={e => setAdminForm(p => ({ ...p, adminRemarks: e.target.value }))}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 24 }}>
              <button type="submit" className="btn btn-primary" disabled={submittingAdmin}>
                {submittingAdmin ? 'Saving...' : 'Save Admin Controls'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* VERIFICATION CONFIRMATION MODAL */}
      <VerificationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleConfirmVerification}
        actionType={modalAction}
        profileName={`${currentProfile.firstName} ${currentProfile.lastName}`}
      />
    </div>
  )
}
