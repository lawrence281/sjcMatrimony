import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, User, Church, Heart, GraduationCap, Briefcase, Users, MapPin, FileText, Target } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { getMyProfile } from '../services/profileService'
import ProfileSkeleton from '../components/profile/ProfileSkeleton'
import EditBasicInfo from '../components/profile/EditBasicInfo'
import EditReligious from '../components/profile/EditReligious'
import EditPersonal from '../components/profile/EditPersonal'
import EditEducation from '../components/profile/EditEducation'
import EditCareer from '../components/profile/EditCareer'
import EditFamily from '../components/profile/EditFamily'
import EditAddress from '../components/profile/EditAddress'
import EditChurch from '../components/profile/EditChurch'
import EditAbout from '../components/profile/EditAbout'
import EditPartnerPreference from '../components/profile/EditPartnerPreference'
import toast from 'react-hot-toast'

export default function EditProfile() {
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

  const handleUpdate = (updated) => {
    setProfile(updated)
  }

  if (!user) return null
  if (loading) return <ProfileSkeleton />

  return (
    <div className="matrimony-profile-page">
      <div className="matrimony-container">
        {/* Page Header */}
        <div className="edit-page-header">
          <Link to="/profile" className="back-link">
            <ArrowLeft size={18} />
            Back to Profile
          </Link>
          <div>
            <h1 className="edit-page-title">Edit Profile</h1>
            <p className="edit-page-sub">
              Update your information — click <strong>Edit</strong> on any section to make changes.
            </p>
          </div>
        </div>

        {/* Completion indicator */}
        <div className="edit-completion-banner">
          <div className="ecb-bar">
            <div className="ecb-fill" style={{ width: `${profile?.profileCompletion || 0}%` }} />
          </div>
          <span className="ecb-label">
            Profile {profile?.profileCompletion || 0}% complete
          </span>
        </div>

        {/* All Sections */}
        <div className="edit-sections-list" id="edit-sections">
          <div id="basic">
            <EditBasicInfo profile={profile} onUpdate={handleUpdate} />
          </div>
          <div id="religious">
            <EditReligious profile={profile} onUpdate={handleUpdate} />
          </div>
          <div id="personal">
            <EditPersonal profile={profile} onUpdate={handleUpdate} />
          </div>
          <div id="education">
            <EditEducation profile={profile} onUpdate={handleUpdate} />
          </div>
          <div id="career">
            <EditCareer profile={profile} onUpdate={handleUpdate} />
          </div>
          <div id="family">
            <EditFamily profile={profile} onUpdate={handleUpdate} />
          </div>
          <div id="address">
            <EditAddress profile={profile} onUpdate={handleUpdate} />
          </div>
          <div id="church">
            <EditChurch profile={profile} onUpdate={handleUpdate} />
          </div>
          <div id="about">
            <EditAbout profile={profile} onUpdate={handleUpdate} />
          </div>
          <div id="preference">
            <EditPartnerPreference profile={profile} onUpdate={handleUpdate} />
          </div>
        </div>
      </div>
    </div>
  )
}
