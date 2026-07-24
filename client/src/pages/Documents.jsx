import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, BookOpen } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { getMyProfile } from '../services/profileService'
import DocumentsSection from '../components/profile/DocumentsSection'
import ProfileSkeleton from '../components/profile/ProfileSkeleton'
import toast from 'react-hot-toast'

export default function Documents() {
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
      <div className="matrimony-container" style={{ maxWidth: 800 }}>
        <div className="edit-page-header">
          <Link to="/profile" className="back-link">
            <ArrowLeft size={18} />
            Back to Profile
          </Link>
          <div>
            <h1 className="edit-page-title">
              <BookOpen size={22} style={{ display: 'inline', marginRight: 8 }} />
              Documents
            </h1>
            <p className="edit-page-sub">
              Upload identity proof and certificates to verify your profile.
            </p>
          </div>
        </div>

        <div className="section-card" style={{ marginTop: 24 }}>
          <div className="section-card-body">
            <DocumentsSection profile={profile} onUpdate={setProfile} />
          </div>
        </div>
      </div>
    </div>
  )
}
