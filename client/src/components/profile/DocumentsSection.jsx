import { useState, useRef } from 'react'
import { Upload, Trash2, FileText, Image as ImageIcon, Loader, ExternalLink } from 'lucide-react'
import { uploadDocument, removeDocument } from '../../services/profileService'
import toast from 'react-hot-toast'

const API_BASE = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3009'

function resolveUrl(url) {
  if (!url) return null
  if (url.startsWith('http')) return url
  return `${API_BASE}${url}`
}

const DOC_TYPES = [
  { value: 'idProof', label: 'ID Proof (Aadhaar / PAN / Passport)' },
  { value: 'baptismCertificate', label: 'Baptism Certificate' },
  { value: 'other', label: 'Other Document' },
]

const DOC_ICONS = {
  idProof: '🪪',
  baptismCertificate: '✝️',
  other: '📄',
}

export default function DocumentsSection({ profile, onUpdate }) {
  const documents = profile?.documents || []
  const inputRef = useRef(null)
  const [selectedType, setSelectedType] = useState('idProof')
  const [label, setLabel] = useState('')
  const [uploading, setUploading] = useState(false)
  const [removingId, setRemovingId] = useState(null)
  const [showForm, setShowForm] = useState(false)

  const handleUpload = async (file) => {
    if (!file) return
    const allowed = ['jpg', 'jpeg', 'png', 'webp', 'pdf']
    const ext = file.name.split('.').pop().toLowerCase()
    if (!allowed.includes(ext)) {
      toast.error('Only JPG, PNG, WebP, PDF allowed')
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Max file size: 10 MB')
      return
    }

    setUploading(true)
    try {
      const res = await uploadDocument(file, selectedType, label)
      toast.success('Document uploaded successfully!')
      onUpdate && onUpdate(res.data.profile)
      setShowForm(false)
      setLabel('')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed')
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  const handleRemove = async (docId) => {
    if (!window.confirm('Remove this document?')) return
    setRemovingId(docId)
    try {
      const res = await removeDocument(docId)
      toast.success('Document removed')
      onUpdate && onUpdate(res.data.profile)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to remove')
    } finally {
      setRemovingId(null)
    }
  }

  const isPdf = (url) => url?.toLowerCase().endsWith('.pdf')

  return (
    <div className="documents-section">
      <div className="docs-header">
        <div>
          <h3 className="docs-title">Documents</h3>
          <p className="docs-sub">Upload ID proof, baptism certificate, and other documents</p>
        </div>
        <button
          className="btn-add-doc"
          onClick={() => setShowForm((s) => !s)}
        >
          <Upload size={16} />
          Upload Document
        </button>
      </div>

      {/* Upload form */}
      {showForm && (
        <div className="docs-upload-form">
          <div className="docs-form-row">
            <div className="form-field">
              <label className="form-label">Document Type</label>
              <div className="form-select-wrap">
                <select
                  className="form-select"
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                >
                  {DOC_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
                <span className="form-select-arrow">▾</span>
              </div>
            </div>
            <div className="form-field">
              <label className="form-label">Label (optional)</label>
              <input
                type="text"
                className="form-input"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="e.g. Aadhaar Card"
              />
            </div>
          </div>
          <div
            className={`file-dropzone ${uploading ? 'disabled' : ''}`}
            onClick={() => !uploading && inputRef.current?.click()}
            role="button"
            tabIndex={0}
          >
            <Upload size={32} className="dropzone-icon" />
            <p className="dropzone-text">
              {uploading ? 'Uploading…' : 'Click or drag file here'}
            </p>
            <p className="dropzone-hint">JPG, PNG, WebP, PDF — max 10 MB</p>
            <input
              ref={inputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp,application/pdf"
              onChange={(e) => handleUpload(e.target.files[0])}
              className="file-input-hidden"
              disabled={uploading}
            />
          </div>
        </div>
      )}

      {/* Documents list */}
      {documents.length === 0 && !showForm ? (
        <div className="docs-empty">
          <FileText size={40} strokeWidth={1} />
          <p>No documents uploaded yet</p>
          <p className="docs-empty-sub">
            Upload your ID proof and baptism certificate to verify your profile.
          </p>
        </div>
      ) : (
        <div className="docs-list">
          {documents.map((doc) => (
            <div key={doc._id} className="doc-item">
              <div className="doc-icon">
                <span>{DOC_ICONS[doc.type] || '📄'}</span>
              </div>
              <div className="doc-info">
                <p className="doc-label">{doc.label || DOC_TYPES.find((t) => t.value === doc.type)?.label}</p>
                <p className="doc-type-tag">{DOC_TYPES.find((t) => t.value === doc.type)?.label}</p>
                <p className="doc-date">
                  Uploaded: {new Date(doc.uploadedAt).toLocaleDateString('en-IN')}
                </p>
              </div>
              <div className="doc-actions">
                <a
                  href={resolveUrl(doc.url)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-view-doc"
                  title="View document"
                >
                  <ExternalLink size={15} />
                  View
                </a>
                <button
                  className="btn-remove-doc"
                  onClick={() => handleRemove(doc._id)}
                  disabled={removingId === doc._id}
                  title="Remove"
                >
                  {removingId === doc._id ? (
                    <Loader size={15} className="spin" />
                  ) : (
                    <Trash2 size={15} />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
