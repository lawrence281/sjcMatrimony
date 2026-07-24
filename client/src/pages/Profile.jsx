import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  User, Church, Heart, GraduationCap, Briefcase, Users,
  MapPin, FileText, Target, Images, BookOpen, LogOut, Pencil,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { getMyProfile } from '../services/profileService'
import ProfileHeader from '../components/profile/ProfileHeader'
import ProfileCompletion from '../components/profile/ProfileCompletion'
import ProfileSkeleton from '../components/profile/ProfileSkeleton'
import SectionCard from '../components/profile/SectionCard'
import toast from 'react-hot-toast'

const API_BASE = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3009'
function resolveUrl(url) {
  if (!url || url.startsWith('http')) return url
  return `${API_BASE}${url}`
}

export default function Profile() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) { navigate('/login'); return }
    fetchProfile()
  }, [user])

  const fetchProfile = async () => {
    try {
      const res = await getMyProfile()
      setProfile(res.data.profile)
    } catch (err) {
      toast.error('Failed to load profile')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    toast.success('Logged out successfully')
    navigate('/')
  }

  if (!user) return null
  if (loading) return <ProfileSkeleton />

  const p = profile || {}
  const breakdown = p.completionBreakdown || {}

  const isBasicEmpty = !p.firstName && !p.lastName
  const isReligiousEmpty = !p.denomination && !p.diocese
  const isPersonalEmpty = !p.maritalStatus && !p.height
  const isEducationEmpty = !p.highestQualification && !p.degree
  const isCareerEmpty = !p.occupation && !p.designation
  const isFamilyEmpty = !p.fatherName && !p.motherName
  const isAddressEmpty = !p.state && !p.city
  const isChurchEmpty = !p.baptized && !p.churchMinistry
  const isAboutEmpty = !p.aboutMe

  const editUrl = '/profile/edit'

  return (
    <div className="matrimony-profile-page">
      <div className="matrimony-container">
        {/* Profile Header */}
        <ProfileHeader profile={p} onProfileUpdate={setProfile} />

        {/* Quick Action Bar */}
        <div className="profile-action-bar">
          <Link to="/profile/edit" className="pab-btn primary">
            <Pencil size={16} />
            Edit Profile
          </Link>
          <Link to="/profile/preferences" className="pab-btn">
            <Target size={16} />
            Partner Preference
          </Link>
          <Link to="/profile/gallery" className="pab-btn">
            <Images size={16} />
            Gallery
          </Link>
          <Link to="/profile/documents" className="pab-btn">
            <BookOpen size={16} />
            Documents
          </Link>
          <button onClick={handleLogout} className="pab-btn danger">
            <LogOut size={16} />
            Sign Out
          </button>
        </div>

        {/* Main Grid */}
        <div className="matrimony-grid">
          {/* Sidebar — Completion */}
          <aside className="matrimony-sidebar">
            <ProfileCompletion
              completion={p.profileCompletion || 0}
              breakdown={breakdown}
            />
          </aside>

          {/* Main content — section cards */}
          <main className="matrimony-main">
            {/* Basic Info */}
            <SectionCard
              title="Basic Information"
              icon={User}
              isEmpty={isBasicEmpty}
              onEdit={() => navigate(editUrl + '#basic')}
            >
              <SectionCard.Row label="Profile For" value={p.profileFor} />
              <SectionCard.Row label="Name" value={[p.firstName, p.lastName].filter(Boolean).join(' ')} />
              <SectionCard.Row label="Gender" value={p.gender} />
              <SectionCard.Row label="Age" value={p.age ? `${p.age} years` : null} />
              <SectionCard.Row label="Date of Birth" value={p.dateOfBirth ? new Date(p.dateOfBirth).toLocaleDateString('en-IN') : null} />
              <SectionCard.Row label="Mobile" value={p.mobileNumber} />
              <SectionCard.Row label="Email" value={p.email} />
            </SectionCard>

            {/* Religious */}
            <SectionCard
              title="Religious Information"
              icon={Church}
              isEmpty={isReligiousEmpty}
              onEdit={() => navigate(editUrl + '#religious')}
            >
              <SectionCard.Row label="Religion" value={p.religion || 'Christian'} />
              <SectionCard.Row label="Denomination" value={p.denomination} />
              <SectionCard.Row label="Diocese" value={p.diocese} />
              <SectionCard.Row label="Parish" value={p.parish} />
              <SectionCard.Row label="Church" value={p.church} />
              <SectionCard.Row label="Baptism Name" value={p.baptismName} />
              <SectionCard.Row label="Confirmation Name" value={p.confirmationName} />
            </SectionCard>

            {/* Personal */}
            <SectionCard
              title="Personal Information"
              icon={Heart}
              isEmpty={isPersonalEmpty}
              onEdit={() => navigate(editUrl + '#personal')}
            >
              <SectionCard.Row label="Marital Status" value={p.maritalStatus} />
              <SectionCard.Row label="Mother Tongue" value={p.motherTongue} />
              <SectionCard.Row label="Languages Known" value={p.languagesKnown} />
              <SectionCard.Row label="Height" value={p.height} />
              <SectionCard.Row label="Weight" value={p.weight} />
              <SectionCard.Row label="Complexion" value={p.complexion} />
              <SectionCard.Row label="Body Type" value={p.bodyType} />
              <SectionCard.Row label="Blood Group" value={p.bloodGroup} />
              <SectionCard.Row label="Physical Status" value={p.physicalStatus} />
              <SectionCard.Row label="Diet" value={p.diet} />
              <SectionCard.Row label="Smoking" value={p.smoking} />
              <SectionCard.Row label="Drinking" value={p.drinking} />
            </SectionCard>

            {/* Education */}
            <SectionCard
              title="Education"
              icon={GraduationCap}
              isEmpty={isEducationEmpty}
              onEdit={() => navigate(editUrl + '#education')}
            >
              <SectionCard.Row label="Qualification" value={p.highestQualification} />
              <SectionCard.Row label="Degree" value={p.degree} />
              <SectionCard.Row label="Specialization" value={p.specialization} />
              <SectionCard.Row label="College" value={p.college} />
              <SectionCard.Row label="Graduation Year" value={p.graduationYear} />
            </SectionCard>

            {/* Career */}
            <SectionCard
              title="Career"
              icon={Briefcase}
              isEmpty={isCareerEmpty}
              onEdit={() => navigate(editUrl + '#career')}
            >
              <SectionCard.Row label="Occupation" value={p.occupation} />
              <SectionCard.Row label="Company" value={p.company} />
              <SectionCard.Row label="Designation" value={p.designation} />
              <SectionCard.Row label="Experience" value={p.experience} />
              <SectionCard.Row label="Annual Income" value={p.annualIncome} />
              <SectionCard.Row label="Work Location" value={p.workLocation} />
            </SectionCard>

            {/* Family */}
            <SectionCard
              title="Family Details"
              icon={Users}
              isEmpty={isFamilyEmpty}
              onEdit={() => navigate(editUrl + '#family')}
            >
              <SectionCard.Row label="Father's Name" value={p.fatherName} />
              <SectionCard.Row label="Father's Occupation" value={p.fatherOccupation} />
              <SectionCard.Row label="Mother's Name" value={p.motherName} />
              <SectionCard.Row label="Mother's Occupation" value={p.motherOccupation} />
              <SectionCard.Row label="Brothers" value={p.brothers !== undefined ? p.brothers : null} />
              <SectionCard.Row label="Married Brothers" value={p.marriedBrothers !== undefined ? p.marriedBrothers : null} />
              <SectionCard.Row label="Sisters" value={p.sisters !== undefined ? p.sisters : null} />
              <SectionCard.Row label="Married Sisters" value={p.marriedSisters !== undefined ? p.marriedSisters : null} />
              <SectionCard.Row label="Family Type" value={p.familyType} />
              <SectionCard.Row label="Family Status" value={p.familyStatus} />
              <SectionCard.Row label="Family Values" value={p.familyValues} />
            </SectionCard>

            {/* Address */}
            <SectionCard
              title="Address"
              icon={MapPin}
              isEmpty={isAddressEmpty}
              onEdit={() => navigate(editUrl + '#address')}
            >
              <SectionCard.Row label="Country" value={p.country} />
              <SectionCard.Row label="State" value={p.state} />
              <SectionCard.Row label="District" value={p.district} />
              <SectionCard.Row label="City" value={p.city} />
              <SectionCard.Row label="Native Place" value={p.nativePlace} />
              <SectionCard.Row label="Pincode" value={p.pincode} />
              <SectionCard.Row label="Full Address" value={p.address} fullWidth />
            </SectionCard>

            {/* Church */}
            <SectionCard
              title="Church Information"
              icon={Church}
              isEmpty={isChurchEmpty}
              onEdit={() => navigate(editUrl + '#church')}
            >
              <SectionCard.BoolRow label="Baptized" value={p.baptized} />
              <SectionCard.BoolRow label="Confirmed" value={p.confirmed} />
              <SectionCard.BoolRow label="First Holy Communion" value={p.firstHolyCommunion} />
              <SectionCard.BoolRow label="Active in Church" value={p.activeInChurch} />
              <SectionCard.Row label="Church Ministry" value={p.churchMinistry} />
            </SectionCard>

            {/* About */}
            <SectionCard
              title="About Me"
              icon={FileText}
              isEmpty={isAboutEmpty}
              onEdit={() => navigate(editUrl + '#about')}
            >
              <p className="about-me-display">{p.aboutMe}</p>
            </SectionCard>

            {/* Partner Preference */}
            <SectionCard
              title="Partner Preference"
              icon={Target}
              isEmpty={!p.preferredAgeFrom && !p.preferredDenomination?.length}
              onEdit={() => navigate('/profile/preferences')}
            >
              <SectionCard.Row label="Age Range" value={p.preferredAgeFrom ? `${p.preferredAgeFrom} – ${p.preferredAgeTo || '?'} years` : null} />
              <SectionCard.Row label="Height Range" value={p.preferredHeightFrom ? `${p.preferredHeightFrom} – ${p.preferredHeightTo || '?'}` : null} />
              <SectionCard.Row label="Marital Status" value={p.preferredMaritalStatus} />
              <SectionCard.Row label="Denomination" value={p.preferredDenomination} />
              <SectionCard.Row label="Education" value={p.preferredEducation} />
              <SectionCard.Row label="Occupation" value={p.preferredOccupation} />
              <SectionCard.Row label="State" value={p.preferredState} />
              <SectionCard.Row label="District" value={p.preferredDistrict} />
            </SectionCard>
          </main>
        </div>
      </div>
    </div>
  )
}
