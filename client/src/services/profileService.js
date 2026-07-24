import api from './api'

// ─────────────────────────────────────────────
// Profile API Service
// Base: /api/profile
// ─────────────────────────────────────────────

/**
 * Fetch the current user's own profile.
 * Creates an empty one server-side if it doesn't exist.
 */
export const getMyProfile = () => api.get('/profile/me')

/**
 * Update a specific section of the profile.
 * If profileId is provided, it targets /api/profile/:id/admin (for Admin Panel usage)
 * Otherwise, it targets /api/profile/me/:section (for Client usage)
 */
export const updateProfileSection = (section, data, profileId = null) => {
  if (profileId) {
    return api.patch(`/profile/${profileId}/admin`, data)
  }
  return api.patch(`/profile/me/${section}`, data)
}

/**
 * Upload a profile photo or cover photo.
 * @param {File}   file  - image file
 * @param {'profile'|'cover'} type
 * @param {function} onUploadProgress - optional progress callback
 */
export const uploadPhoto = (file, type = 'profile', onUploadProgress) => {
  const formData = new FormData()
  formData.append('photo', file)
  formData.append('type', type)
  return api.post('/profile/me/photo', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress,
  })
}

/**
 * Add a photo to the gallery.
 * @param {File}   file    - image file
 * @param {string} caption - optional caption
 * @param {function} onUploadProgress
 */
export const addGalleryPhoto = (file, caption = '', onUploadProgress) => {
  const formData = new FormData()
  formData.append('photo', file)
  formData.append('caption', caption)
  return api.post('/profile/me/gallery', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress,
  })
}

/**
 * Remove a photo from the gallery.
 * @param {string} photoId - MongoDB subdoc _id
 */
export const removeGalleryPhoto = (photoId) =>
  api.delete(`/profile/me/gallery/${photoId}`)

/**
 * Upload a document.
 * @param {File}   file    - PDF or image
 * @param {string} docType - idProof | baptismCertificate | other
 * @param {string} label   - human-readable label
 * @param {function} onUploadProgress
 */
export const uploadDocument = (file, docType = 'other', label = '', onUploadProgress) => {
  const formData = new FormData()
  formData.append('document', file)
  formData.append('docType', docType)
  formData.append('label', label)
  return api.post('/profile/me/documents', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress,
  })
}

/**
 * Remove a document.
 * @param {string} docId - MongoDB subdoc _id
 */
export const removeDocument = (docId) =>
  api.delete(`/profile/me/documents/${docId}`)

/**
 * Get profile completion breakdown.
 */
export const getProfileCompletion = () => api.get('/profile/me/completion')

/**
 * Admin: get all profiles (paginated).
 */
export const getAllProfiles = (params = {}) =>
  api.get('/profile/all', { params })

/**
 * Admin: update admin-only fields for a profile.
 */
export const adminUpdateProfile = (profileId, data) =>
  api.patch(`/profile/${profileId}/admin`, data)
