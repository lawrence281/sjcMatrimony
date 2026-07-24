import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Images } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { getMyProfile } from '../services/profileService'
import GallerySection from '../components/profile/GallerySection'
import ProfileSkeleton from '../components/profile/ProfileSkeleton'
import toast from 'react-hot-toast'

export default function Gallery() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) { navigate('/login'); return }
    getMyProfile()
      .then((res) => setProfile(res.data.profile))
      .catch(() => toast.error('Failed to load profile'))
      .finally(() => setLoading(false))
  }, [user])

  if (!user) return null
  if (loading) return <ProfileSkeleton />

  return (
    <div className="matrimony-profile-page">
      <div className="matrimony-container" style={{ maxWidth: 900 }}>
        <div className="edit-page-header">
          <Link to="/profile" className="back-link">
            <ArrowLeft size={18} />
            Back to Profile
          </Link>
          <div>
            <h1 className="edit-page-title">
              <Images size={22} style={{ display: 'inline', marginRight: 8 }} />
              Photo Gallery
            </h1>
            <p className="edit-page-sub">
              Add up to 10 photos to showcase your personality and lifestyle.
            </p>
          </div>
        </div>

        <div className="section-card" style={{ marginTop: 24 }}>
          <div className="section-card-body">
            <GallerySection profile={profile} onUpdate={setProfile} />
          </div>
        </div>
      </div>
    </div>
  )
}
