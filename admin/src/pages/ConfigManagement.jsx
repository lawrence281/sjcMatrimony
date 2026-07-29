import { useState, useEffect } from 'react'
import {
  Settings, Save, RotateCcw, ChevronRight, Upload, Globe,
  Shield, Bell, Image as ImageIcon, CreditCard, Heart,
  CheckCircle2, RefreshCw, X, AlertCircle
} from 'lucide-react'
import api from '../services/api'
import toast from 'react-hot-toast'

export default function ConfigManagement() {
  const [activeTab, setActiveTab] = useState('general')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [resetModalOpen, setResetModalOpen] = useState(false)
  const [uploadingLogo, setUploadingLogo] = useState(false)
  const [uploadingFavicon, setUploadingFavicon] = useState(false)

  const [config, setConfig] = useState({
    // General Settings
    appName: 'SJC Matrimony',
    appLogo: '',
    appFavicon: '',
    contactEmail: 'admin@sjcmatrimony.org',
    contactNumber: '+91 9876543210',
    address: 'St. Joseph Church Complex, Main Road',

    // Matrimony Settings
    enableNewRegistration: true,
    enableContactRequests: true,
    enableProfileVerification: true,
    defaultMembershipType: 'free',
    defaultProfileVisibility: 'registered',
    profileApprovalRequired: false,
    maxGalleryImages: 6,
    allowedDocumentTypes: ['pdf', 'jpg', 'png', 'webp'],

    // Subscription Settings
    defaultSubscriptionPlan: 'free',
    subscriptionRenewalReminderDays: 7,
    trialPeriodDays: 14,
    enableTrial: false,

    // Notification Settings
    enableEmailNotifications: true,
    enableSmsNotifications: false,
    enableWhatsappNotifications: true,
    adminAlertEmail: 'alerts@sjcmatrimony.org',

    // Media Settings
    maxImageSizeMB: 5,
    maxDocumentSizeMB: 10,
    allowedImageFormats: ['jpeg', 'jpg', 'png', 'webp'],
    allowedDocumentFormats: ['pdf', 'jpeg', 'jpg', 'png', 'doc', 'docx'],

    // Security Settings
    passwordMinLength: 8,
    requirePasswordSpecialChar: true,
    sessionTimeoutMinutes: 120,
    loginAttemptLimit: 5,
    accountLockDurationMinutes: 30,
  })

  useEffect(() => {
    fetchConfig()
  }, [])

  const fetchConfig = async () => {
    setLoading(true)
    try {
      const res = await api.get('/config')
      if (res.data && res.data.config) {
        setConfig(res.data.config)
      }
    } catch (err) {
      console.error('Failed to load system config:', err)
      toast.error(err.response?.data?.message || 'Failed to fetch configuration settings')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field, value) => {
    setConfig(prev => ({ ...prev, [field]: value }))
  }

  const handleSaveConfig = async (e) => {
    if (e) e.preventDefault()
    setSaving(true)
    try {
      const res = await api.put('/config', config)
      if (res.data && res.data.success) {
        toast.success('Configuration saved successfully!')
        setConfig(res.data.config)
      }
    } catch (err) {
      console.error('Failed to save config:', err)
      toast.error(err.response?.data?.message || 'Failed to save configuration settings')
    } finally {
      setSaving(false)
    }
  }

  const handleResetDefaults = async () => {
    setSaving(true)
    try {
      const res = await api.post('/config/reset')
      if (res.data && res.data.config) {
        setConfig(res.data.config)
        toast.success('Configuration reset to defaults')
        setResetModalOpen(false)
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reset settings')
    } finally {
      setSaving(false)
    }
  }

  const handleFileUpload = async (e, type) => {
    const file = e.target.files[0]
    if (!file) return

    const data = new FormData()
    data.append('media', file)

    if (type === 'logo') setUploadingLogo(true)
    if (type === 'favicon') setUploadingFavicon(true)

    try {
      const res = await api.post('/config/upload', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      if (res.data && res.data.fileUrl) {
        if (type === 'logo') setConfig(prev => ({ ...prev, appLogo: res.data.fileUrl }))
        if (type === 'favicon') setConfig(prev => ({ ...prev, appFavicon: res.data.fileUrl }))
        toast.success(`${type === 'logo' ? 'Logo' : 'Favicon'} uploaded successfully`)
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to upload asset')
    } finally {
      if (type === 'logo') setUploadingLogo(false)
      if (type === 'favicon') setUploadingFavicon(false)
    }
  }

  const tabs = [
    { id: 'general', label: 'General Settings', icon: Globe },
    { id: 'matrimony', label: 'Matrimony Rules', icon: Heart },
    { id: 'subscription', label: 'Subscriptions', icon: CreditCard },
    { id: 'notification', label: 'Notifications', icon: Bell },
    { id: 'media', label: 'Media & Uploads', icon: ImageIcon },
    { id: 'security', label: 'Security & Access', icon: Shield },
  ]

  return (
    <div className="config-management-page" style={{ paddingBottom: 60 }}>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-muted)', marginBottom: 16 }}>
        <span>Admin Dashboard</span>
        <ChevronRight size={14} />
        <span style={{ color: 'var(--accent)', fontWeight: 600 }}>Configuration Management</span>
      </div>

      {/* Title Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
            <Settings style={{ color: 'var(--accent)' }} size={28} />
            System Configuration
          </h1>
          <p style={{ color: 'var(--text-muted)', marginTop: 4, fontSize: 14 }}>
            Centralized portal to control matrimony application rules, branding, security policies, and limits.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-outline" onClick={() => setResetModalOpen(true)} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <RotateCcw size={15} /> Reset to Defaults
          </button>
          <button className="btn btn-primary" onClick={handleSaveConfig} disabled={saving} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <Save size={15} /> {saving ? 'Saving...' : 'Save Configuration'}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="card" style={{ padding: 50, textAlign: 'center', color: 'var(--text-muted)' }}>
          <RefreshCw className="spin" size={24} style={{ marginBottom: 12, color: 'var(--accent)' }} />
          <div>Loading configuration settings...</div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: 24 }}>
          {/* Navigation Tabs (Left Menu) */}
          <div className="card" style={{ padding: 12, height: 'fit-content' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', padding: '8px 12px', letterSpacing: 0.5 }}>
              Categories
            </div>
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '10px 12px',
                    borderRadius: 8,
                    border: 'none',
                    background: isActive ? 'var(--accent-glow)' : 'transparent',
                    color: isActive ? 'var(--accent-light)' : 'var(--text-secondary)',
                    fontWeight: isActive ? 700 : 500,
                    fontSize: 13.5,
                    cursor: 'pointer',
                    textAlign: 'left',
                    marginBottom: 4,
                    transition: 'all 0.15s'
                  }}
                >
                  <Icon size={16} />
                  {tab.label}
                </button>
              )
            })}
          </div>

          {/* Form Content Area */}
          <div className="card" style={{ padding: 28 }}>
            <form onSubmit={handleSaveConfig}>
              {/* 1. GENERAL SETTINGS */}
              {activeTab === 'general' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  <h3 style={{ fontSize: 18, fontWeight: 700, margin: 0, borderBottom: '1px solid var(--border)', paddingBottom: 10, color: 'var(--text-primary)' }}>
                    General Application Settings
                  </h3>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Application Name</label>
                      <input
                        type="text"
                        className="form-input"
                        value={config.appName}
                        onChange={(e) => handleChange('appName', e.target.value)}
                        style={{ width: '100%', padding: '8px 12px' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Contact Email</label>
                      <input
                        type="email"
                        className="form-input"
                        value={config.contactEmail}
                        onChange={(e) => handleChange('contactEmail', e.target.value)}
                        style={{ width: '100%', padding: '8px 12px' }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Contact Phone / Helpline</label>
                      <input
                        type="text"
                        className="form-input"
                        value={config.contactNumber}
                        onChange={(e) => handleChange('contactNumber', e.target.value)}
                        style={{ width: '100%', padding: '8px 12px' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Office / Church Address</label>
                      <input
                        type="text"
                        className="form-input"
                        value={config.address}
                        onChange={(e) => handleChange('address', e.target.value)}
                        style={{ width: '100%', padding: '8px 12px' }}
                      />
                    </div>
                  </div>

                  {/* Logo & Favicon Uploaders */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, borderTop: '1px solid var(--border)', paddingTop: 16 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Application Logo</label>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        {config.appLogo ? (
                          <img src={config.appLogo} alt="Logo" style={{ height: 40, borderRadius: 6, border: '1px solid var(--border)' }} />
                        ) : (
                          <div style={{ width: 40, height: 40, background: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: 6, display: 'grid', placeItems: 'center', color: 'var(--text-muted)' }}>
                            <ImageIcon size={18} />
                          </div>
                        )}
                        <label className="btn btn-outline btn-sm" style={{ cursor: 'pointer' }}>
                          <Upload size={14} /> {uploadingLogo ? 'Uploading...' : 'Upload Logo'}
                          <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'logo')} disabled={uploadingLogo} style={{ display: 'none' }} />
                        </label>
                      </div>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Favicon Icon</label>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        {config.appFavicon ? (
                          <img src={config.appFavicon} alt="Favicon" style={{ width: 32, height: 32, borderRadius: 6, border: '1px solid var(--border)' }} />
                        ) : (
                          <div style={{ width: 32, height: 32, background: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: 6, display: 'grid', placeItems: 'center', color: 'var(--text-muted)' }}>
                            <Globe size={16} />
                          </div>
                        )}
                        <label className="btn btn-outline btn-sm" style={{ cursor: 'pointer' }}>
                          <Upload size={14} /> {uploadingFavicon ? 'Uploading...' : 'Upload Favicon'}
                          <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'favicon')} disabled={uploadingFavicon} style={{ display: 'none' }} />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 2. MATRIMONY SETTINGS */}
              {activeTab === 'matrimony' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  <h3 style={{ fontSize: 18, fontWeight: 700, margin: 0, borderBottom: '1px solid var(--border)', paddingBottom: 10, color: 'var(--text-primary)' }}>
                    Matrimony Portal Rules & Controls
                  </h3>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div style={{ background: 'var(--bg-primary)', padding: 14, borderRadius: 8, border: '1px solid var(--border)' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontWeight: 600, fontSize: 13.5 }}>
                        <input
                          type="checkbox"
                          checked={config.enableNewRegistration}
                          onChange={(e) => handleChange('enableNewRegistration', e.target.checked)}
                        />
                        Enable New Profile Registrations
                      </label>
                      <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '4px 0 0 24px' }}>
                        Allow new members to register profiles on the public website.
                      </p>
                    </div>

                    <div style={{ background: 'var(--bg-primary)', padding: 14, borderRadius: 8, border: '1px solid var(--border)' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontWeight: 600, fontSize: 13.5 }}>
                        <input
                          type="checkbox"
                          checked={config.enableContactRequests}
                          onChange={(e) => handleChange('enableContactRequests', e.target.checked)}
                        />
                        Enable Contact Requests Feature
                      </label>
                      <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '4px 0 0 24px' }}>
                        Allow verified users to send contact information request calls.
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div style={{ background: 'var(--bg-primary)', padding: 14, borderRadius: 8, border: '1px solid var(--border)' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontWeight: 600, fontSize: 13.5 }}>
                        <input
                          type="checkbox"
                          checked={config.enableProfileVerification}
                          onChange={(e) => handleChange('enableProfileVerification', e.target.checked)}
                        />
                        Require Identity & Parish Verification
                      </label>
                      <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '4px 0 0 24px' }}>
                        Profiles must upload parish letter or ID before full access.
                      </p>
                    </div>

                    <div style={{ background: 'var(--bg-primary)', padding: 14, borderRadius: 8, border: '1px solid var(--border)' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontWeight: 600, fontSize: 13.5 }}>
                        <input
                          type="checkbox"
                          checked={config.profileApprovalRequired}
                          onChange={(e) => handleChange('profileApprovalRequired', e.target.checked)}
                        />
                        Mandatory Admin Profile Approval
                      </label>
                      <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '4px 0 0 24px' }}>
                        Newly edited profiles remain hidden until approved by Admin.
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, borderTop: '1px solid var(--border)', paddingTop: 16 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Default Membership Type</label>
                      <select
                        className="form-select"
                        value={config.defaultMembershipType}
                        onChange={(e) => handleChange('defaultMembershipType', e.target.value)}
                        style={{ width: '100%', padding: '8px 12px' }}
                      >
                        <option value="free">Free</option>
                        <option value="basic">Basic</option>
                        <option value="standard">Standard</option>
                        <option value="premium">Premium</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Default Profile Visibility</label>
                      <select
                        className="form-select"
                        value={config.defaultProfileVisibility}
                        onChange={(e) => handleChange('defaultProfileVisibility', e.target.value)}
                        style={{ width: '100%', padding: '8px 12px' }}
                      >
                        <option value="all">Public (Everyone)</option>
                        <option value="registered">Registered Members Only</option>
                        <option value="verified">Verified Members Only</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Max Gallery Images Limit</label>
                      <input
                        type="number"
                        className="form-input"
                        value={config.maxGalleryImages}
                        onChange={(e) => handleChange('maxGalleryImages', Number(e.target.value))}
                        style={{ width: '100%', padding: '8px 12px' }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* 3. SUBSCRIPTION SETTINGS */}
              {activeTab === 'subscription' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  <h3 style={{ fontSize: 18, fontWeight: 700, margin: 0, borderBottom: '1px solid var(--border)', paddingBottom: 10, color: 'var(--text-primary)' }}>
                    Subscription & Billing Rules
                  </h3>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Default Signup Plan</label>
                      <select
                        className="form-select"
                        value={config.defaultSubscriptionPlan}
                        onChange={(e) => handleChange('defaultSubscriptionPlan', e.target.value)}
                        style={{ width: '100%', padding: '8px 12px' }}
                      >
                        <option value="free">Free Membership</option>
                        <option value="basic">Basic Plan</option>
                        <option value="standard">Standard Plan</option>
                        <option value="premium">Premium VIP Plan</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Renewal Reminder Notice (Days before expiry)</label>
                      <input
                        type="number"
                        className="form-input"
                        value={config.subscriptionRenewalReminderDays}
                        onChange={(e) => handleChange('subscriptionRenewalReminderDays', Number(e.target.value))}
                        style={{ width: '100%', padding: '8px 12px' }}
                      />
                    </div>
                  </div>

                  <div style={{ background: 'var(--bg-primary)', padding: 16, borderRadius: 8, border: '1px solid var(--border)', marginTop: 10 }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontWeight: 600, fontSize: 13.5, marginBottom: 10 }}>
                      <input
                        type="checkbox"
                        checked={config.enableTrial}
                        onChange={(e) => handleChange('enableTrial', e.target.checked)}
                      />
                      Enable Promotional Trial Period for New Users
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 12 }}>
                      <div>
                        <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>Trial Period Duration (Days)</label>
                        <input
                          type="number"
                          disabled={!config.enableTrial}
                          className="form-input"
                          value={config.trialPeriodDays}
                          onChange={(e) => handleChange('trialPeriodDays', Number(e.target.value))}
                          style={{ width: '100%', padding: '8px 12px' }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 4. NOTIFICATION SETTINGS */}
              {activeTab === 'notification' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  <h3 style={{ fontSize: 18, fontWeight: 700, margin: 0, borderBottom: '1px solid var(--border)', paddingBottom: 10, color: 'var(--text-primary)' }}>
                    Communication & Alert Channels
                  </h3>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
                    <div style={{ background: 'var(--bg-primary)', padding: 14, borderRadius: 8, border: '1px solid var(--border)' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontWeight: 600, fontSize: 13 }}>
                        <input
                          type="checkbox"
                          checked={config.enableEmailNotifications}
                          onChange={(e) => handleChange('enableEmailNotifications', e.target.checked)}
                        />
                        Email Alerts
                      </label>
                    </div>

                    <div style={{ background: 'var(--bg-primary)', padding: 14, borderRadius: 8, border: '1px solid var(--border)' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontWeight: 600, fontSize: 13 }}>
                        <input
                          type="checkbox"
                          checked={config.enableSmsNotifications}
                          onChange={(e) => handleChange('enableSmsNotifications', e.target.checked)}
                        />
                        SMS Gateway
                      </label>
                    </div>

                    <div style={{ background: 'var(--bg-primary)', padding: 14, borderRadius: 8, border: '1px solid var(--border)' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontWeight: 600, fontSize: 13 }}>
                        <input
                          type="checkbox"
                          checked={config.enableWhatsappNotifications}
                          onChange={(e) => handleChange('enableWhatsappNotifications', e.target.checked)}
                        />
                        WhatsApp Webhooks
                      </label>
                    </div>
                  </div>

                  <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16 }}>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Admin Security Alert Email Address</label>
                    <input
                      type="email"
                      className="form-input"
                      value={config.adminAlertEmail}
                      onChange={(e) => handleChange('adminAlertEmail', e.target.value)}
                      style={{ width: '100%', padding: '8px 12px' }}
                    />
                  </div>
                </div>
              )}

              {/* 5. MEDIA SETTINGS */}
              {activeTab === 'media' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  <h3 style={{ fontSize: 18, fontWeight: 700, margin: 0, borderBottom: '1px solid var(--border)', paddingBottom: 10, color: 'var(--text-primary)' }}>
                    Media Upload Constraints
                  </h3>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Max Photo Upload Size (MB)</label>
                      <input
                        type="number"
                        className="form-input"
                        value={config.maxImageSizeMB}
                        onChange={(e) => handleChange('maxImageSizeMB', Number(e.target.value))}
                        style={{ width: '100%', padding: '8px 12px' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Max Document Upload Size (MB)</label>
                      <input
                        type="number"
                        className="form-input"
                        value={config.maxDocumentSizeMB}
                        onChange={(e) => handleChange('maxDocumentSizeMB', Number(e.target.value))}
                        style={{ width: '100%', padding: '8px 12px' }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* 6. SECURITY SETTINGS */}
              {activeTab === 'security' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  <h3 style={{ fontSize: 18, fontWeight: 700, margin: 0, borderBottom: '1px solid var(--border)', paddingBottom: 10, color: 'var(--text-primary)' }}>
                    Security Policies & Session Timeouts
                  </h3>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Minimum Password Length</label>
                      <input
                        type="number"
                        className="form-input"
                        value={config.passwordMinLength}
                        onChange={(e) => handleChange('passwordMinLength', Number(e.target.value))}
                        style={{ width: '100%', padding: '8px 12px' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Admin Session Timeout (Minutes)</label>
                      <input
                        type="number"
                        className="form-input"
                        value={config.sessionTimeoutMinutes}
                        onChange={(e) => handleChange('sessionTimeoutMinutes', Number(e.target.value))}
                        style={{ width: '100%', padding: '8px 12px' }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Failed Login Attempt Limit</label>
                      <input
                        type="number"
                        className="form-input"
                        value={config.loginAttemptLimit}
                        onChange={(e) => handleChange('loginAttemptLimit', Number(e.target.value))}
                        style={{ width: '100%', padding: '8px 12px' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Account Lock Duration (Minutes)</label>
                      <input
                        type="number"
                        className="form-input"
                        value={config.accountLockDurationMinutes}
                        onChange={(e) => handleChange('accountLockDurationMinutes', Number(e.target.value))}
                        style={{ width: '100%', padding: '8px 12px' }}
                      />
                    </div>
                  </div>

                  <div style={{ background: 'var(--bg-primary)', padding: 14, borderRadius: 8, border: '1px solid var(--border)' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontWeight: 600, fontSize: 13.5 }}>
                      <input
                        type="checkbox"
                        checked={config.requirePasswordSpecialChar}
                        onChange={(e) => handleChange('requirePasswordSpecialChar', e.target.checked)}
                      />
                      Enforce Special Characters & Numbers in Passwords
                    </label>
                  </div>
                </div>
              )}

              {/* Bottom Sticky Action Bar */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 32, paddingTop: 20, borderTop: '1px solid var(--border)' }}>
                <button type="button" className="btn btn-outline" onClick={() => setResetModalOpen(true)}>
                  <RotateCcw size={15} /> Reset
                </button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  <Save size={15} /> {saving ? 'Saving Changes...' : 'Save Configuration'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reset Confirmation Modal */}
      {resetModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'grid', placeItems: 'center', padding: 20 }}>
          <div className="card" style={{ maxWidth: 440, width: '100%', padding: 24, borderRadius: 12 }}>
            <h3 style={{ margin: '0 0 8px 0', fontSize: 18, color: '#ef4444', display: 'flex', alignItems: 'center', gap: 8 }}>
              <AlertCircle size={20} /> Reset Configuration Defaults?
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 20 }}>
              Are you sure you want to reset all portal rules, branding details, and limits back to factory defaults? Any custom settings will be overwritten.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button className="btn btn-outline btn-sm" onClick={() => setResetModalOpen(false)}>Cancel</button>
              <button className="btn btn-primary btn-sm" style={{ background: '#ef4444', borderColor: '#ef4444' }} onClick={handleResetDefaults}>
                Yes, Reset All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
