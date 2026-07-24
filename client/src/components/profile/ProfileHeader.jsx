import { Camera, Shield, Star } from 'lucide-react'
import { useState, useRef } from 'react'
import { uploadPhoto } from '../../services/profileService'
import toast from 'react-hot-toast'

const API_BASE = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3009'

function resolveUrl(url) {
  if (!url) return null
  if (url.startsWith('http')) return url
  return `${API_BASE}${url}`
}

export default function ProfileHeader({ profile, onProfileUpdate }) {
  const profileInputRef = useRef(null)
  const coverInputRef = useRef(null)
  const [uploadingProfile, setUploadingProfile] = useState(false)
  const [uploadingCover, setUploadingCover] = useState(false)

  const handlePhotoUpload = async (file, type) => {
    if (!file) return
    const setLoading = type === 'profile' ? setUploadingProfile : setUploadingCover
    setLoading(true)
    try {
      const res = await uploadPhoto(file, type)
      toast.success(`${type === 'profile' ? 'Profile' : 'Cover'} photo updated!`)
      onProfileUpdate && onProfileUpdate(res.data.profile)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed')
    } finally {
      setLoading(false)
    }
  }

  const fullName = profile?.fullName ||
    [profile?.firstName, profile?.lastName].filter(Boolean).join(' ') ||
    'Your Name'

  const profilePhoto = resolveUrl(profile?.profileImage)
  const coverPhoto = resolveUrl(profile?.coverImage)
  const completion = profile?.profileCompletion || 0

  const initials = fullName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <div className="profile-header-card">
      {/* Cover Photo */}
      <div className="profile-cover">
        {coverPhoto ? (
          <img src={coverPhoto} alt="Cover" className="cover-img" />
        ) : (
          <div className="cover-placeholder" />
        )}
        <button
          className="cover-upload-btn"
          onClick={() => coverInputRef.current?.click()}
          disabled={uploadingCover}
          title="Change cover photo"
        >
          {uploadingCover ? (
            <span className="upload-spinner" />
          ) : (
            <Camera size={16} />
          )}
          {uploadingCover ? '' : 'Change Cover'}
        </button>
        <input
          ref={coverInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          onChange={(e) => handlePhotoUpload(e.target.files[0], 'cover')}
          className="file-input-hidden"
        />
      </div>

      {/* Avatar + Info */}
      <div className="profile-header-body">
        <div className="profile-avatar-wrap">
          <div className="profile-avatar-ring">
            {profilePhoto ? (
              <img src={profilePhoto} alt={fullName} className="profile-avatar-img" />
            ) : (
              <div className="profile-avatar-initials">{initials}</div>
            )}
          </div>
          <button
            className="avatar-upload-btn"
            onClick={() => profileInputRef.current?.click()}
            disabled={uploadingProfile}
            title="Change profile photo"
          >
            {uploadingProfile ? <span className="upload-spinner sm" /> : <Camera size={14} />}
          </button>
          <input
            ref={profileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            onChange={(e) => handlePhotoUpload(e.target.files[0], 'profile')}
            className="file-input-hidden"
          />
        </div>

        <div className="profile-header-info">
          <div className="profile-name-row">
            <h1 className="profile-display-name">{fullName}</h1>
            {profile?.premiumMember && (
              <span className="premium-badge">
                <Star size={12} fill="currentColor" />
                Premium
              </span>
            )}
            {profile?.verificationStatus === 'Verified' && (
              <span className="verified-badge">
                <Shield size={12} />
                Verified
              </span>
            )}
          </div>
          <p className="profile-subline">
            {[
              profile?.age ? `${profile.age} yrs` : null,
              profile?.denomination,
              profile?.district,
              profile?.state,
            ]
              .filter(Boolean)
              .join(' · ')}
          </p>

          {/* Completion bar */}
          <div className="profile-completion-mini">
            <div className="completion-bar-track">
              <div
                className="completion-bar-fill"
                style={{ width: `${completion}%` }}
              />
            </div>
            <span className="completion-pct">{completion}% complete</span>
          </div>
        </div>

        {/* Membership badge */}
        {profile?.membershipType && profile.membershipType !== 'Free' && (
          <div className={`membership-pill membership-${profile.membershipType.toLowerCase()}`}>
            {profile.membershipType}
          </div>
        )}
      </div>
    </div>
  )
}
