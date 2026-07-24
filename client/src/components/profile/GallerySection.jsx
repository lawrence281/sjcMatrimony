import { useState, useRef } from 'react'
import { Plus, Trash2, Image as ImageIcon, Loader } from 'lucide-react'
import { addGalleryPhoto, removeGalleryPhoto } from '../../services/profileService'
import toast from 'react-hot-toast'

const API_BASE = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3009'

function resolveUrl(url) {
  if (!url) return null
  if (url.startsWith('http')) return url
  return `${API_BASE}${url}`
}

export default function GallerySection({ profile, onUpdate }) {
  const photos = profile?.photos || []
  const inputRef = useRef(null)
  const [uploading, setUploading] = useState(false)
  const [removingId, setRemovingId] = useState(null)

  const handleAdd = async (file) => {
    if (!file) return
    // Validate
    const allowed = ['jpg', 'jpeg', 'png', 'webp']
    const ext = file.name.split('.').pop().toLowerCase()
    if (!allowed.includes(ext)) {
      toast.error('Only JPG, PNG, WebP allowed')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Max file size: 5 MB')
      return
    }
    if (photos.length >= 10) {
      toast.error('Gallery is full (max 10 photos)')
      return
    }

    setUploading(true)
    try {
      const res = await addGalleryPhoto(file, '')
      toast.success('Photo added to gallery!')
      onUpdate && onUpdate(res.data.profile)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed')
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  const handleRemove = async (photoId) => {
    if (!window.confirm('Remove this photo?')) return
    setRemovingId(photoId)
    try {
      const res = await removeGalleryPhoto(photoId)
      toast.success('Photo removed')
      onUpdate && onUpdate(res.data.profile)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to remove')
    } finally {
      setRemovingId(null)
    }
  }

  return (
    <div className="gallery-section">
      <div className="gallery-header">
        <div>
          <h3 className="gallery-title">Photo Gallery</h3>
          <p className="gallery-sub">{photos.length}/10 photos</p>
        </div>
        {photos.length < 10 && (
          <button
            className="btn-add-photo"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? <Loader size={16} className="spin" /> : <Plus size={16} />}
            {uploading ? 'Uploading…' : 'Add Photo'}
          </button>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          onChange={(e) => handleAdd(e.target.files[0])}
          className="file-input-hidden"
        />
      </div>

      {photos.length === 0 ? (
        <div className="gallery-empty">
          <ImageIcon size={48} strokeWidth={1} />
          <p>No photos yet</p>
          <button
            className="btn-add-photo outline"
            onClick={() => inputRef.current?.click()}
          >
            <Plus size={16} />
            Add Your First Photo
          </button>
        </div>
      ) : (
        <div className="gallery-grid">
          {photos.map((photo) => (
            <div key={photo._id} className="gallery-item">
              <img
                src={resolveUrl(photo.url)}
                alt={photo.caption || 'Gallery photo'}
                className="gallery-img"
                loading="lazy"
              />
              <div className="gallery-overlay">
                <button
                  className="gallery-remove-btn"
                  onClick={() => handleRemove(photo._id)}
                  disabled={removingId === photo._id}
                  title="Remove photo"
                >
                  {removingId === photo._id ? (
                    <Loader size={14} className="spin" />
                  ) : (
                    <Trash2 size={14} />
                  )}
                </button>
              </div>
              {photo.caption && (
                <p className="gallery-caption">{photo.caption}</p>
              )}
            </div>
          ))}
          {/* Add placeholder if < 10 */}
          {photos.length < 10 && (
            <div
              className="gallery-add-tile"
              onClick={() => inputRef.current?.click()}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
            >
              {uploading ? (
                <Loader size={24} className="spin" />
              ) : (
                <>
                  <Plus size={24} />
                  <span>Add Photo</span>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
