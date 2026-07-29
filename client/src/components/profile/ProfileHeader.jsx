import { Camera, ShieldCheck, Star, MapPin, Briefcase, Church, UserCheck } from 'lucide-react'
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
  const [uploadingProfile, setUploadingProfile] = useState(false)

  const handlePhotoUpload = async (file) => {
    if (!file) return
    setUploadingProfile(true)
    try {
      const res = await uploadPhoto(file, 'profile')
      toast.success('Profile photo updated!')
      onProfileUpdate && onProfileUpdate(res.data.profile)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed')
    } finally {
      setUploadingProfile(false)
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

  const defaultCover = 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1600&q=80'

  return (
    <div className="profile-hero-card">
      {/* Hero Cover Image */}
      <div className="profile-hero-cover">
        <img
          src={coverPhoto || defaultCover}
          alt="Christian Matrimony Banner"
          className="hero-cover-img"
        />
        <div className="hero-cover-overlay" />
      </div>

      {/* Hero Main Body */}
      <div className="profile-hero-body">
        {/* Avatar Ring */}
        <div className="profile-avatar-wrapper">
          <div className="profile-avatar-ring">
            {profilePhoto ? (
              <img src={profilePhoto} alt={fullName} className="profile-avatar-img" />
            ) : (
              <div className="profile-avatar-initials">{initials}</div>
            )}
          </div>
          <button
            className="avatar-upload-trigger"
            onClick={() => profileInputRef.current?.click()}
            disabled={uploadingProfile}
            title="Update Profile Photo"
          >
            {uploadingProfile ? <span className="upload-spinner sm" /> : <Camera size={15} />}
          </button>
          <input
            ref={profileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            onChange={(e) => handlePhotoUpload(e.target.files[0])}
            className="file-input-hidden"
          />
        </div>

        {/* Main Details & Badges */}
        <div className="profile-hero-details">
          <div className="profile-title-bar">
            <h1 className="profile-hero-name">{fullName}</h1>
            <div className="profile-badges-row">
              {profile?.verificationStatus === 'Verified' && (
                <span className="hero-badge badge-verified">
                  <ShieldCheck size={13} />
                  Verified Profile
                </span>
              )}
              {profile?.premiumMember && (
                <span className="hero-badge badge-premium">
                  <Star size={13} fill="currentColor" />
                  Premium Member
                </span>
              )}
              {profile?.membershipType && profile.membershipType !== 'Free' && (
                <span className={`hero-badge badge-membership membership-${profile.membershipType.toLowerCase()}`}>
                  {profile.membershipType} Plan
                </span>
              )}
            </div>
          </div>

          {/* Quick Metadata Pills */}
          <div className="profile-metadata-pills">
            {profile?.age && (
              <span className="meta-pill">
                <UserCheck size={13} className="pill-icon" />
                {profile.age} Yrs, {profile.gender || 'Member'}
              </span>
            )}
            {(profile?.diocese || profile?.denomination) && (
              <span className="meta-pill">
                <Church size={13} className="pill-icon" />
                {[profile.denomination, profile.diocese].filter(Boolean).join(' · ')}
              </span>
            )}
            {(profile?.occupation || profile?.designation) && (
              <span className="meta-pill">
                <Briefcase size={13} className="pill-icon" />
                {[profile.designation || profile.occupation, profile.company].filter(Boolean).join(' at ')}
              </span>
            )}
            {(profile?.city || profile?.district || profile?.state) && (
              <span className="meta-pill">
                <MapPin size={13} className="pill-icon" />
                {[profile.city || profile.district, profile.state].filter(Boolean).join(', ')}
              </span>
            )}
          </div>

          {/* Completion Progress Bar */}
          <div className="hero-completion-wrapper">
            <div className="hero-completion-text">
              <span>Profile Strength</span>
              <strong>{completion}% Complete</strong>
            </div>
            <div className="hero-completion-track">
              <div
                className="hero-completion-fill"
                style={{ width: `${completion}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
