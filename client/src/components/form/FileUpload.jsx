import { useRef, useState } from 'react'
import { UploadCloud, X, File as FileIcon } from 'lucide-react'

const ACCEPT_IMAGES = 'image/jpeg,image/jpg,image/png,image/webp'
const ACCEPT_DOCS = 'image/jpeg,image/jpg,image/png,image/webp,application/pdf'

const MAX_SIZE_MB = {
  photo: 5,
  document: 10,
}

/**
 * FileUpload — drag-and-drop / click to upload
 * @param {'photo'|'document'} mode
 */
export default function FileUpload({
  label,
  mode = 'photo',
  onFileSelect,
  onRemove,
  preview,         // existing URL to display
  error,
  disabled = false,
  className = '',
}) {
  const inputRef = useRef(null)
  const [dragOver, setDragOver] = useState(false)
  const [localPreview, setLocalPreview] = useState(null)
  const [fileError, setFileError] = useState('')

  const accept = mode === 'document' ? ACCEPT_DOCS : ACCEPT_IMAGES
  const maxMb = MAX_SIZE_MB[mode]

  const validate = (file) => {
    const allowedExts = mode === 'document'
      ? ['jpg', 'jpeg', 'png', 'webp', 'pdf']
      : ['jpg', 'jpeg', 'png', 'webp']
    const ext = file.name.split('.').pop().toLowerCase()
    if (!allowedExts.includes(ext)) {
      return `Invalid file type. Allowed: ${allowedExts.join(', ')}`
    }
    if (file.size > maxMb * 1024 * 1024) {
      return `File too large. Max size: ${maxMb} MB`
    }
    return null
  }

  const handleFile = (file) => {
    if (!file) return
    const err = validate(file)
    if (err) {
      setFileError(err)
      return
    }
    setFileError('')
    if (mode === 'photo') {
      const reader = new FileReader()
      reader.onload = (e) => setLocalPreview(e.target.result)
      reader.readAsDataURL(file)
    }
    onFileSelect(file)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    if (disabled) return
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  const handleRemove = () => {
    setLocalPreview(null)
    setFileError('')
    if (inputRef.current) inputRef.current.value = ''
    onRemove && onRemove()
  }

  const displayPreview = localPreview || preview

  return (
    <div className={`form-field ${className}`}>
      {label && <span className="form-label">{label}</span>}

      {displayPreview ? (
        <div className="file-preview-wrap">
          {mode === 'photo' ? (
            <img src={displayPreview} alt="Preview" className="file-photo-preview" />
          ) : (
            <div className="file-doc-preview">
              <FileIcon size={32} />
              <span>Document uploaded</span>
            </div>
          )}
          {!disabled && (
            <button type="button" onClick={handleRemove} className="file-remove-btn">
              <X size={16} />
              Remove
            </button>
          )}
        </div>
      ) : (
        <div
          className={`file-dropzone ${dragOver ? 'drag-over' : ''} ${disabled ? 'disabled' : ''}`}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => !disabled && inputRef.current?.click()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && !disabled && inputRef.current?.click()}
        >
          <UploadCloud size={36} className="dropzone-icon" />
          <p className="dropzone-text">
            Drag & drop or <span className="dropzone-link">browse</span>
          </p>
          <p className="dropzone-hint">
            {mode === 'document'
              ? `JPG, PNG, WebP, PDF — max ${maxMb} MB`
              : `JPG, PNG, WebP — max ${maxMb} MB`}
          </p>
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            onChange={(e) => handleFile(e.target.files[0])}
            className="file-input-hidden"
            disabled={disabled}
          />
        </div>
      )}

      {(error || fileError) && (
        <p className="form-error-msg">{error || fileError}</p>
      )}
    </div>
  )
}
