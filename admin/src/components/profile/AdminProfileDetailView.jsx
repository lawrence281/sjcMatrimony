import { useState } from 'react'
import {
  ShieldCheck, CheckCircle, XCircle, AlertTriangle, Lock, Unlock,
  Crown, FileText, Upload, Trash2, ExternalLink, ArrowLeft, Mail, Phone,
  MapPin, Briefcase, Calendar, User, Sparkles, Heart, Church, GraduationCap,
  Users, Info, Star, Check
} from 'lucide-react'
import VerificationModal from './VerificationModal'
import api from '../../services/api'
import toast from 'react-hot-toast'

/**
 * Reusable Read-Only Detail Card Component
 * Displays clean Key-Value pairs without any input fields.
 */
function ReadOnlyCard({ title, icon: Icon, items = [], badge }) {
  return (
    <div className="card" style={{ marginBottom: 16 }}>
      <div style={{
        display: 'flex',
        justify: 'space-between',
        alignItems: 'center',
        paddingBottom: 12,
        marginBottom: 16,
        borderBottom: '1px solid var(--border)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>
          {Icon && <Icon size={18} color="var(--accent-light)" />}
          <span>{title}</span>
        </div>
        {badge && <span className="badge badge-primary">{badge}</span>}
      </div>

      <div className="grid-3" style={{ gap: '16px 24px' }}>
        {items.map((item, idx) => (
          <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              {item.label}
            </span>
            <span style={{ fontSize: 13.5, fontWeight: 600, color: item.value ? 'var(--text-primary)' : 'var(--text-muted)' }}>
              {item.value || 'Not Specified'}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function AdminProfileDetailView({ profile, onUpdateProfile, onBack }) {
  const [currentProfile, setCurrentProfile] = useState(profile)
  const [activeTab, setActiveTab] = useState('sections') // 'sections', 'documents', 'gallery', 'admin'
  const [modalOpen, setModalOpen] = useState(false)
  const [modalAction, setModalAction] = useState('approve')

  // Document Upload State
  const [uploadingDoc, setUploadingDoc] = useState(false)
  const [docFile, setDocFile] = useState(null)
  const [docType, setDocType] = useState('idProof')
  const [docLabel, setDocLabel] = useState('')

  // Gallery Upload State
  const [uploadingGallery, setUploadingGallery] = useState(false)
  const [galleryFile, setGalleryFile] = useState(null)
  const [galleryCaption, setGalleryCaption] = useState('')

  // Admin Controls State
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

  const resolveMediaUrl = (url) => {
    if (!url) return ''
    if (url.startsWith('http://') || url.startsWith('https://')) return url
    return `${BACKEND_URL}${url}`
  }

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

  const handleUploadGalleryPhoto = async (e) => {
    e.preventDefault()
    if (!galleryFile) {
      toast.error('Please select an image file')
      return
    }
    setUploadingGallery(true)
    try {
      const formData = new FormData()
      formData.append('photo', galleryFile)
      formData.append('caption', galleryCaption || '')

      const res = await api.post(`/profile/${currentProfile._id}/admin/gallery`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      setCurrentProfile(res.data.profile)
      onUpdateProfile && onUpdateProfile(res.data.profile)
      toast.success('Gallery photo added!')
      setGalleryFile(null)
      setGalleryCaption('')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to upload photo')
    } finally {
      setUploadingGallery(false)
    }
  }

  const candidateAge = currentProfile.dateOfBirth
    ? new Date().getFullYear() - new Date(currentProfile.dateOfBirth).getFullYear()
    : null

  const completionScore = currentProfile.profileCompletion || 0

  // Format Date Helper
  const formatDate = (dateStr) => {
    if (!dateStr) return null
    return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  }

  return (
    <div className="fade-in" style={{ paddingBottom: 40 }}>
      {/* ── TOP BACK NAVIGATION BAR ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <button className="btn btn-outline" onClick={onBack} style={{ gap: 8 }}>
          <ArrowLeft size={16} /> Back to User Profiles
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Profile Completion:</span>
          <div style={{ width: 120, height: 8, borderRadius: 4, background: 'var(--bg-card)', border: '1px solid var(--border)', overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              width: `${completionScore}%`,
              background: completionScore >= 80 ? 'var(--success)' : completionScore >= 50 ? 'var(--warning)' : 'var(--accent)',
              transition: 'width 0.4s'
            }} />
          </div>
          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--accent-light)' }}>{completionScore}%</span>
        </div>
      </div>

      {/* ── MASTER PROFILE HERO CARD ── */}
      <div className="profile-hero-card">
        {/* Cover Banner */}
        <div className="profile-hero-cover">
          {currentProfile.coverImage ? (
            <img src={resolveMediaUrl(currentProfile.coverImage)} alt="Cover" className="profile-hero-cover-img" />
          ) : (
            <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, rgba(255, 77, 0, 0.3), rgba(108, 99, 255, 0.2))' }} />
          )}
        </div>

        {/* Hero Body */}
        <div className="profile-hero-body">
          <div className="profile-hero-header-row">
            {/* Avatar & Fallback */}
            <div className="profile-hero-avatar-wrap">
              {currentProfile.profileImage ? (
                <img src={resolveMediaUrl(currentProfile.profileImage)} alt="Profile" className="profile-hero-avatar-img" />
              ) : (
                <div className="profile-hero-avatar-fallback">
                  {currentProfile.firstName ? currentProfile.firstName[0] : 'U'}
                </div>
              )}
            </div>

            {/* Quick Actions Toolbar */}
            <div className="profile-quick-actions-bar">
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
                  <Unlock size={15} /> Unblock Account
                </button>
              ) : (
                <button className="btn btn-danger" onClick={() => handleVerificationAction('block')}>
                  <Lock size={15} /> Block Account
                </button>
              )}
            </div>
          </div>

          {/* Profile Name & Status Badges */}
          <div className="profile-hero-info">
            <div className="profile-hero-name">
              {currentProfile.firstName} {currentProfile.lastName}
              
              {/* Status Badges */}
              <span className={`badge badge-${currentProfile.profileStatus === 'Active' ? 'success' : currentProfile.profileStatus === 'Pending' ? 'warning' : 'danger'}`}>
                {currentProfile.profileStatus || 'Pending'}
              </span>
              
              <span className={`badge ${currentProfile.verificationStatus === 'Verified' ? 'badge-delivered' : 'badge-pending'}`}>
                <ShieldCheck size={12} /> {currentProfile.verificationStatus || 'Unverified'}
              </span>

              <span className="badge badge-shipped">
                <Crown size={12} /> {currentProfile.membershipType || 'Free'}
              </span>

              {currentProfile.featuredProfile && <span className="badge badge-warning"><Star size={11} fill="currentColor" /> Featured</span>}
              {currentProfile.premiumMember && <span className="badge badge-primary"><Sparkles size={11} /> Premium</span>}
              {currentProfile.blocked && <span className="badge badge-cancelled">BLOCKED</span>}
            </div>

            <div className="profile-hero-meta">
              <span><Mail size={14} color="var(--accent-light)" /> {currentProfile.email || 'No Email'}</span>
              <span><Phone size={14} color="var(--success)" /> {currentProfile.mobileNumber || 'No Phone'}</span>
              {currentProfile.city && <span><MapPin size={14} color="var(--info)" /> {currentProfile.city}, {currentProfile.state || 'India'}</span>}
              {currentProfile.occupation && <span><Briefcase size={14} color="var(--warning)" /> {currentProfile.occupation}</span>}
              <span><Calendar size={14} color="var(--text-muted)" /> Registered: {new Date(currentProfile.createdAt).toLocaleDateString()}</span>
            </div>
          </div>

          {/* Key Attributes Stat Boxes */}
          <div className="profile-key-stats-row">
            <div className="profile-stat-box">
              <div className="profile-stat-box-label">Age & Gender</div>
              <div className="profile-stat-box-value">{candidateAge ? `${candidateAge} Yrs` : '-'} • {currentProfile.gender || '-'}</div>
            </div>
            <div className="profile-stat-box">
              <div className="profile-stat-box-label">Marital Status</div>
              <div className="profile-stat-box-value">{currentProfile.maritalStatus || '-'}</div>
            </div>
            <div className="profile-stat-box">
              <div className="profile-stat-box-label">Denomination</div>
              <div className="profile-stat-box-value">{currentProfile.denomination || 'Christian'}</div>
            </div>
            <div className="profile-stat-box">
              <div className="profile-stat-box-label">Height / Weight</div>
              <div className="profile-stat-box-value">{currentProfile.height || '-'} / {currentProfile.weight || '-'}</div>
            </div>
            <div className="profile-stat-box">
              <div className="profile-stat-box-label">Highest Degree</div>
              <div className="profile-stat-box-value">{currentProfile.highestQualification || currentProfile.degree || '-'}</div>
            </div>
            <div className="profile-stat-box">
              <div className="profile-stat-box-label">Annual Income</div>
              <div className="profile-stat-box-value">{currentProfile.annualIncome || 'Not Disclosed'}</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── SEGMENTED NAVIGATION TABS ── */}
      <div className="filter-bar" style={{ marginBottom: 24, gap: 10 }}>
        <button
          className={`filter-tab ${activeTab === 'sections' ? 'active' : ''}`}
          onClick={() => setActiveTab('sections')}
          style={{ display: 'flex', alignItems: 'center', gap: 6 }}
        >
          <User size={15} /> Candidate Details View
        </button>

        <button
          className={`filter-tab ${activeTab === 'documents' ? 'active' : ''}`}
          onClick={() => setActiveTab('documents')}
          style={{ display: 'flex', alignItems: 'center', gap: 6 }}
        >
          <FileText size={15} /> Verification Documents ({currentProfile.documents?.length || 0})
        </button>

        <button
          className={`filter-tab ${activeTab === 'gallery' ? 'active' : ''}`}
          onClick={() => setActiveTab('gallery')}
          style={{ display: 'flex', alignItems: 'center', gap: 6 }}
        >
          <FileText size={15} /> Photo Gallery ({currentProfile.photos?.length || 0})
        </button>

        <button
          className={`filter-tab ${activeTab === 'admin' ? 'active' : ''}`}
          onClick={() => setActiveTab('admin')}
          style={{ display: 'flex', alignItems: 'center', gap: 6 }}
        >
          <ShieldCheck size={15} /> Admin Controls & Password Reset
        </button>
      </div>

      {/* ── TAB 1: READ-ONLY CANDIDATE DETAILS VIEW (NO INPUT FIELDS) ── */}
      {activeTab === 'sections' && (
        <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 24, alignItems: 'start' }}>
          {/* Left Overview Sidebar Card */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, position: 'sticky', top: 20 }}>
            {/* Completion Breakdown Card */}
            <div className="card">
              <div className="card-title" style={{ fontSize: 14 }}>Profile Completion Breakdown</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 12 }}>
                {[
                  { label: 'Basic Info', key: 'basic' },
                  { label: 'Religion', key: 'religion' },
                  { label: 'Education', key: 'education' },
                  { label: 'Career', key: 'career' },
                  { label: 'Family', key: 'family' },
                  { label: 'Address', key: 'address' },
                  { label: 'About Me', key: 'about' },
                ].map(sec => {
                  const score = currentProfile.completionBreakdown?.[sec.key] || 0
                  return (
                    <div key={sec.key} style={{ fontSize: 12 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                        <span style={{ color: 'var(--text-secondary)' }}>{sec.label}</span>
                        <span style={{ color: score > 0 ? 'var(--success)' : 'var(--text-muted)', fontWeight: 600 }}>{score > 0 ? 'Completed' : 'Empty'}</span>
                      </div>
                      <div style={{ height: 4, borderRadius: 2, background: 'var(--bg-primary)' }}>
                        <div style={{ height: '100%', borderRadius: 2, width: score > 0 ? '100%' : '0%', background: 'var(--accent)' }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Admin Verification Remarks Note */}
            {currentProfile.adminRemarks && (
              <div className="card" style={{ borderLeft: '4px solid var(--accent)' }}>
                <div className="card-title" style={{ fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <ShieldCheck size={14} color="var(--accent-light)" /> Admin Verification Remarks
                </div>
                <p style={{ fontSize: 12.5, color: 'var(--text-secondary)', lineHeight: 1.5, marginTop: 6 }}>
                  "{currentProfile.adminRemarks}"
                </p>
              </div>
            )}
          </div>

          {/* Right Main Column: READ-ONLY INFORMATION CARDS (NO EDIT INPUTS) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {/* 1. Basic Information */}
            <ReadOnlyCard
              title="1. Basic Information"
              icon={User}
              items={[
                { label: 'Profile Created For', value: currentProfile.profileFor || 'Self' },
                { label: 'First Name', value: currentProfile.firstName },
                { label: 'Last Name', value: currentProfile.lastName },
                { label: 'Gender', value: currentProfile.gender },
                { label: 'Date of Birth', value: formatDate(currentProfile.dateOfBirth) },
                { label: 'Calculated Age', value: candidateAge ? `${candidateAge} Years Old` : null },
                { label: 'Mobile Number', value: currentProfile.mobileNumber },
                { label: 'Email Address', value: currentProfile.email },
              ]}
            />

            {/* 2. About Candidate */}
            {currentProfile.aboutMe && (
              <div className="card" style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 15, fontWeight: 700, marginBottom: 12, paddingBottom: 10, borderBottom: '1px solid var(--border)' }}>
                  <Info size={18} color="var(--accent-light)" />
                  <span>2. About Candidate (Bio)</span>
                </div>
                <p style={{ fontSize: 13.5, color: 'var(--text-primary)', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                  {currentProfile.aboutMe}
                </p>
              </div>
            )}

            {/* 3. Religious Information */}
            <ReadOnlyCard
              title="3. Religious Information"
              icon={Church}
              items={[
                { label: 'Religion', value: currentProfile.religion || 'Christian' },
                { label: 'Denomination', value: currentProfile.denomination },
                { label: 'Diocese', value: currentProfile.diocese },
                { label: 'Church Name', value: currentProfile.church },
                { label: 'Church Address', value: currentProfile.churchAddress },
              ]}
            />

            {/* 4. Church Sacraments & Activity */}
            <ReadOnlyCard
              title="4. Church Sacraments & Activity"
              icon={Church}
              items={[
                { label: 'Baptized', value: currentProfile.baptized ? 'Yes ✓' : 'No' },
                { label: 'Confirmed Sacrament', value: currentProfile.confirmed ? 'Yes ✓' : 'No' },
                { label: 'First Holy Communion', value: currentProfile.firstHolyCommunion ? 'Yes ✓' : 'No' },
                { label: 'Active in Church', value: currentProfile.activeInChurch ? 'Yes ✓' : 'No' },
                { label: 'Church Ministry / Group', value: currentProfile.churchMinistry || 'None' },
              ]}
            />

            {/* 5. Personal Information & Lifestyle */}
            <ReadOnlyCard
              title="5. Personal Information & Lifestyle"
              icon={Heart}
              items={[
                { label: 'Marital Status', value: currentProfile.maritalStatus },
                { label: 'Mother Tongue', value: currentProfile.motherTongue },
                { label: 'Languages Known', value: Array.isArray(currentProfile.languagesKnown) ? currentProfile.languagesKnown.join(', ') : currentProfile.languagesKnown },
                { label: 'Height', value: currentProfile.height },
                { label: 'Weight', value: currentProfile.weight },
                { label: 'Complexion', value: currentProfile.complexion },
                { label: 'Body Type', value: currentProfile.bodyType },
                { label: 'Blood Group', value: currentProfile.bloodGroup },
                { label: 'Physical Status', value: currentProfile.physicalStatus || 'Normal' },
                { label: 'Diet', value: currentProfile.diet },
                { label: 'Smoking Habits', value: currentProfile.smoking },
                { label: 'Drinking Habits', value: currentProfile.drinking },
              ]}
            />

            {/* 6. Education Qualification */}
            <ReadOnlyCard
              title="6. Education Qualification"
              icon={GraduationCap}
              items={[
                { label: 'Highest Qualification', value: currentProfile.highestQualification },
                { label: 'Degree Name', value: currentProfile.degree },
                { label: 'Specialization', value: currentProfile.specialization },
                { label: 'Institution / College', value: currentProfile.college },
                { label: 'University', value: currentProfile.university },
                { label: 'Graduation Year', value: currentProfile.graduationYear },
                { label: 'Additional Certifications', value: currentProfile.additionalCertifications },
              ]}
            />

            {/* 7. Career & Work */}
            <ReadOnlyCard
              title="7. Career & Occupation"
              icon={Briefcase}
              items={[
                { label: 'Occupation', value: currentProfile.occupation },
                { label: 'Designation / Role', value: currentProfile.designation },
                { label: 'Company Name', value: currentProfile.company },
                { label: 'Work Experience', value: currentProfile.experience },
                { label: 'Annual Income', value: currentProfile.annualIncome },
                { label: 'Work Location', value: currentProfile.workLocation },
              ]}
            />

            {/* 8. Family Details */}
            <ReadOnlyCard
              title="8. Family Details"
              icon={Users}
              items={[
                { label: "Father's Name", value: currentProfile.fatherName },
                { label: "Father's Occupation", value: currentProfile.fatherOccupation },
                { label: "Mother's Name", value: currentProfile.motherName },
                { label: "Mother's Occupation", value: currentProfile.motherOccupation },
                { label: 'Brothers', value: currentProfile.brothers !== undefined ? `${currentProfile.brothers} (${currentProfile.marriedBrothers || 0} Married)` : null },
                { label: 'Sisters', value: currentProfile.sisters !== undefined ? `${currentProfile.sisters} (${currentProfile.marriedSisters || 0} Married)` : null },
                { label: 'Family Type', value: currentProfile.familyType },
                { label: 'Family Status', value: currentProfile.familyStatus },
                { label: 'Family Values', value: currentProfile.familyValues },
              ]}
            />

            {/* 9. Address & Location */}
            <ReadOnlyCard
              title="9. Address & Residence Location"
              icon={MapPin}
              items={[
                { label: 'Country', value: currentProfile.country || 'India' },
                { label: 'State', value: currentProfile.state },
                { label: 'District', value: currentProfile.district },
                { label: 'City / Town', value: currentProfile.city },
                { label: 'Native Place', value: currentProfile.nativePlace },
                { label: 'Full Address', value: currentProfile.address },
                { label: 'Pincode', value: currentProfile.pincode },
              ]}
            />
          </div>
        </div>
      )}

      {/* ── TAB 2: VERIFICATION DOCUMENTS ── */}
      {activeTab === 'documents' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Upload New Document Card */}
          <div className="card">
            <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Upload size={18} color="var(--accent)" /> Upload Verification Document (Admin Override)
            </div>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16 }}>
              Upload government ID proof, baptism certificate, or identity documents directly for verification.
            </p>
            
            <form onSubmit={handleUploadDocument} className="grid-3" style={{ gap: 16, alignItems: 'flex-end' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Document Type</label>
                <select className="form-select" value={docType} onChange={e => setDocType(e.target.value)}>
                  <option value="idProof">Aadhaar / Passport / ID Proof</option>
                  <option value="baptismCertificate">Baptism Certificate</option>
                  <option value="other">Other Document</option>
                </select>
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Document Label / Description</label>
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

              <div style={{ gridColumn: 'span 3', display: 'flex', justifyContent: 'flex-end', marginTop: 12 }}>
                <button type="submit" className="btn btn-primary" disabled={uploadingDoc}>
                  {uploadingDoc ? 'Uploading...' : 'Upload Verification Document'}
                </button>
              </div>
            </form>
          </div>

          {/* Documents Grid List */}
          <div className="card">
            <div className="card-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Uploaded Verification Documents</span>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{currentProfile.documents?.length || 0} Total Files</span>
            </div>

            {currentProfile.documents && currentProfile.documents.length > 0 ? (
              <div className="doc-card-grid" style={{ marginTop: 16 }}>
                {currentProfile.documents.map((doc) => (
                  <div key={doc._id} className="doc-card">
                    <div className="doc-card-header">
                      <div className="doc-icon-box">
                        <FileText size={20} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div className="doc-card-title">{doc.label || doc.type}</div>
                        <div className="doc-card-sub">Type: {doc.type} • {new Date(doc.uploadedAt).toLocaleDateString()}</div>
                      </div>
                    </div>

                    <div className="doc-card-footer">
                      <span className="badge badge-success" style={{ fontSize: 10 }}>Uploaded</span>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <a
                          href={`${BACKEND_URL}${doc.url}`}
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn-sm btn-outline"
                          title="View / Download File"
                        >
                          <ExternalLink size={13} /> View File
                        </a>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleRemoveDocument(doc._id)}
                          title="Delete Document"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state" style={{ padding: '48px 20px' }}>
                <FileText size={36} color="var(--text-muted)" />
                <p>No verification documents uploaded for this candidate yet.</p>
                <small style={{ color: 'var(--text-muted)', marginTop: 4 }}>You can upload ID proofs or parish certificates using the form above.</small>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── TAB 3: PHOTO GALLERY ── */}
      {activeTab === 'gallery' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Upload Gallery Photo Card */}
          <div className="card">
            <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Upload size={18} color="var(--accent)" /> Add Photo to User's Gallery
            </div>
            <form onSubmit={handleUploadGalleryPhoto} className="grid-2" style={{ gap: 16, alignItems: 'flex-end' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Caption / Description</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Recent Photo"
                  value={galleryCaption}
                  onChange={e => setGalleryCaption(e.target.value)}
                />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Select Image File</label>
                <input
                  type="file"
                  className="form-input"
                  accept="image/*"
                  onChange={e => setGalleryFile(e.target.files[0])}
                  required
                />
              </div>

              <div style={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'flex-end', marginTop: 12 }}>
                <button type="submit" className="btn btn-primary" disabled={uploadingGallery}>
                  {uploadingGallery ? 'Uploading...' : 'Add Gallery Photo'}
                </button>
              </div>
            </form>
          </div>

          {/* Photo Gallery Grid */}
          <div className="card">
            <div className="card-title">Candidate Gallery Photos ({currentProfile.photos?.length || 0})</div>
            {currentProfile.photos && currentProfile.photos.length > 0 ? (
              <div className="preview-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 16, marginTop: 16 }}>
                {currentProfile.photos.map((photo, index) => (
                  <div key={photo._id || index} className="preview-item" style={{ aspectRatio: '1', borderRadius: 12, overflow: 'hidden' }}>
                    <img src={resolveMediaUrl(photo.url)} alt={photo.caption || 'Gallery'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state" style={{ padding: '48px 20px' }}>
                <p>No gallery photos uploaded yet.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── TAB 4: ADMIN CONTROLS & PASSWORD RESET ── */}
      {activeTab === 'admin' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Admin Status & Badges Controls */}
          <div className="card">
            <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <ShieldCheck size={18} color="var(--accent)" /> Profile Status & Verification Controls
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
                  <label className="form-label">Membership Type Tier</label>
                  <select className="form-select" value={adminForm.membershipType} onChange={e => setAdminForm(p => ({ ...p, membershipType: e.target.value }))}>
                    <option value="Free">Free</option>
                    <option value="Silver">Silver</option>
                    <option value="Gold">Gold</option>
                    <option value="Platinum">Platinum</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Admin Password Reset (Optional)</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Enter new password (min 6 chars)..."
                    value={adminForm.password}
                    onChange={e => setAdminForm(p => ({ ...p, password: e.target.value }))}
                  />
                  <small style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4, display: 'block' }}>Leave blank to keep existing password.</small>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 24, marginTop: 20, flexWrap: 'wrap' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13 }}>
                  <input type="checkbox" checked={adminForm.featuredProfile} onChange={e => setAdminForm(p => ({ ...p, featuredProfile: e.target.checked }))} />
                  <span>Featured Profile Badge</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13 }}>
                  <input type="checkbox" checked={adminForm.premiumMember} onChange={e => setAdminForm(p => ({ ...p, premiumMember: e.target.checked }))} />
                  <span>Premium Member Badge</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13 }}>
                  <input type="checkbox" checked={adminForm.blocked} onChange={e => setAdminForm(p => ({ ...p, blocked: e.target.checked }))} />
                  <span style={{ color: 'var(--danger)', fontWeight: 600 }}>Block Account Immediately</span>
                </label>
              </div>

              <div className="form-group" style={{ marginTop: 20 }}>
                <label className="form-label">Internal Admin Verification Remarks</label>
                <textarea
                  className="form-textarea"
                  rows={3}
                  placeholder="Internal notes about background check, verification status..."
                  value={adminForm.adminRemarks}
                  onChange={e => setAdminForm(p => ({ ...p, adminRemarks: e.target.value }))}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 24 }}>
                <button type="submit" className="btn btn-primary" style={{ padding: '10px 24px' }} disabled={submittingAdmin}>
                  {submittingAdmin ? 'Saving...' : 'Save Admin Controls'}
                </button>
              </div>
            </form>
          </div>
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
