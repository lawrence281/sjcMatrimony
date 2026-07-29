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
  const isReligiousEmpty = !p.denomination && !p.diocese && !p.churchAddress
  const isPersonalEmpty = !p.maritalStatus && !p.height
  const isEducationEmpty = !p.highestQualification && !p.degree
  const isCareerEmpty = !p.occupation && !p.designation
  const isFamilyEmpty = !p.fatherName && !p.motherName
  const isAddressEmpty = !p.state && !p.city
  const isChurchEmpty = !p.baptized && !p.churchMinistry
  const isAboutEmpty = !p.aboutMe

  const scrollToSection = (id) => {
    const el = document.getElementById(id)
    if (el) {
      const yOffset = -100
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset
      window.scrollTo({ top: y, behavior: 'smooth' })
    }
  }

  const sectionsNav = [
    { id: 'sec-basic', label: 'Basic Info', icon: User },
    { id: 'sec-religious', label: 'Religious & Church', icon: Church },
    { id: 'sec-personal', label: 'Personal Details', icon: Heart },
    { id: 'sec-education', label: 'Education', icon: GraduationCap },
    { id: 'sec-career', label: 'Career', icon: Briefcase },
    { id: 'sec-family', label: 'Family', icon: Users },
    { id: 'sec-address', label: 'Address', icon: MapPin },
    { id: 'sec-about', label: 'About Me', icon: FileText },
    { id: 'sec-preference', label: 'Partner Preference', icon: Target },
  ]

  return (
    <div className="matrimony-profile-page">
      <div className="matrimony-container">
        {/* Profile Hero Section */}
        <ProfileHeader profile={p} onProfileUpdate={setProfile} />

        {/* Quick Action Bar */}
        <div className="profile-action-bar">
          <Link to="/profile/edit" className="pab-btn primary">
            <Pencil size={15} />
            Edit Profile
          </Link>
          <Link to="/profile/preferences" className="pab-btn">
            <Target size={15} />
            Partner Preference
          </Link>
          <Link to="/profile/gallery" className="pab-btn">
            <Images size={15} />
            Gallery
          </Link>
          <button onClick={handleLogout} className="pab-btn danger">
            <LogOut size={15} />
            Sign Out
          </button>
        </div>

        {/* Sticky Section Navigation Tabs */}
        <div className="profile-nav-tabs">
          {sectionsNav.map(({ id, label, icon: NavIcon }) => (
            <button
              key={id}
              onClick={() => scrollToSection(id)}
              className="nav-tab-item"
            >
              <NavIcon size={14} />
              <span>{label}</span>
            </button>
          ))}
        </div>

        {/* Main Grid */}
        <div className="matrimony-grid">
          {/* Sidebar — Completion & Snapshot */}
          <aside className="matrimony-sidebar">
            <ProfileCompletion
              completion={p.profileCompletion || 0}
              breakdown={breakdown}
            />

            {/* Quick Info Snapshot Card */}
            <div className="quick-snapshot-card">
              <h3 className="snapshot-title">Quick Snapshot</h3>
              <div className="snapshot-list">
                <div className="snapshot-item">
                  <span className="snap-label">Gender / Age</span>
                  <span className="snap-val">{[p.gender, p.age ? `${p.age} Yrs` : null].filter(Boolean).join(', ') || '—'}</span>
                </div>
                <div className="snapshot-item">
                  <span className="snap-label">Marital Status</span>
                  <span className="snap-val">{p.maritalStatus || '—'}</span>
                </div>
                <div className="snapshot-item">
                  <span className="snap-label">Religion</span>
                  <span className="snap-val">{p.religion || 'Christian'}</span>
                </div>
                <div className="snapshot-item">
                  <span className="snap-label">Denomination</span>
                  <span className="snap-val">{p.denomination || '—'}</span>
                </div>
                <div className="snapshot-item">
                  <span className="snap-label">Occupation</span>
                  <span className="snap-val">{p.occupation || '—'}</span>
                </div>
                <div className="snapshot-item">
                  <span className="snap-label">Location</span>
                  <span className="snap-val">{[p.city || p.district, p.state].filter(Boolean).join(', ') || '—'}</span>
                </div>
              </div>
            </div>
          </aside>

          {/* Main content — Section Cards */}
          <main className="matrimony-main">
            {/* Basic Info */}
            <SectionCard
              id="sec-basic"
              title="Basic Information"
              icon={User}
              onEdit={() => navigate('/profile/edit')}
              isEmpty={isBasicEmpty}
            >
              <SectionCard.Row label="Profile Created For" value={p.profileFor} />
              <SectionCard.Row label="Full Name" value={[p.firstName, p.lastName].filter(Boolean).join(' ')} />
              <SectionCard.Row label="Gender" value={p.gender} />
              <SectionCard.Row label="Age" value={p.age ? `${p.age} years` : null} />
              <SectionCard.Row label="Date of Birth" value={p.dateOfBirth ? new Date(p.dateOfBirth).toLocaleDateString('en-IN') : null} />
              <SectionCard.Row label="Mobile Number" value={p.mobileNumber} />
              <SectionCard.Row label="Email Address" value={p.email} />
            </SectionCard>

            {/* Religious */}
            <SectionCard
              id="sec-religious"
              title="Religious Information"
              icon={Church}
              onEdit={() => navigate('/profile/edit')}
              isEmpty={isReligiousEmpty}
            >
              <SectionCard.Row label="Religion" value={p.religion || 'Christian'} />
              <SectionCard.Row label="Denomination" value={p.denomination} />
              <SectionCard.Row label="Diocese" value={p.diocese} />
              <SectionCard.Row label="Parish Church" value={p.church} />
              <SectionCard.Row label="Church Address" value={p.churchAddress} fullWidth />
            </SectionCard>

            {/* Personal */}
            <SectionCard
              id="sec-personal"
              title="Personal Information"
              icon={Heart}
              onEdit={() => navigate('/profile/edit')}
              isEmpty={isPersonalEmpty}
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
              <SectionCard.Row label="Diet Preference" value={p.diet} />
              <SectionCard.Row label="Smoking Habit" value={p.smoking} />
              <SectionCard.Row label="Drinking Habit" value={p.drinking} />
            </SectionCard>

            {/* Education */}
            <SectionCard
              id="sec-education"
              title="Education Qualification"
              icon={GraduationCap}
              onEdit={() => navigate('/profile/edit')}
              isEmpty={isEducationEmpty}
            >
              <SectionCard.Row label="Highest Qualification" value={p.highestQualification} />
              <SectionCard.Row label="Degree" value={p.degree} />
              <SectionCard.Row label="Specialization" value={p.specialization} />
              <SectionCard.Row label="College / Institution" value={p.college} />
              <SectionCard.Row label="University" value={p.university} />
              <SectionCard.Row label="Graduation Year" value={p.graduationYear} />
              <SectionCard.Row label="Additional Certifications" value={p.additionalCertifications} fullWidth />
            </SectionCard>

            {/* Career */}
            <SectionCard
              id="sec-career"
              title="Career & Profession"
              icon={Briefcase}
              onEdit={() => navigate('/profile/edit')}
              isEmpty={isCareerEmpty}
            >
              <SectionCard.Row label="Occupation" value={p.occupation} />
              <SectionCard.Row label="Organization / Company" value={p.company} />
              <SectionCard.Row label="Designation" value={p.designation} />
              <SectionCard.Row label="Work Experience" value={p.experience} />
              <SectionCard.Row label="Annual Income" value={p.annualIncome} />
              <SectionCard.Row label="Work Location" value={p.workLocation} />
            </SectionCard>

            {/* Family */}
            <SectionCard
              id="sec-family"
              title="Family Details"
              icon={Users}
              onEdit={() => navigate('/profile/edit')}
              isEmpty={isFamilyEmpty}
            >
              <SectionCard.Row label="Father's Name" value={p.fatherName} />
              <SectionCard.Row label="Father's Occupation" value={p.fatherOccupation} />
              <SectionCard.Row label="Mother's Name" value={p.motherName} />
              <SectionCard.Row label="Mother's Occupation" value={p.motherOccupation} />
              <SectionCard.Row label="No. of Brothers" value={p.brothers !== undefined ? p.brothers : null} />
              <SectionCard.Row label="Married Brothers" value={p.marriedBrothers !== undefined ? p.marriedBrothers : null} />
              <SectionCard.Row label="No. of Sisters" value={p.sisters !== undefined ? p.sisters : null} />
              <SectionCard.Row label="Married Sisters" value={p.marriedSisters !== undefined ? p.marriedSisters : null} />
              <SectionCard.Row label="Family Type" value={p.familyType} />
              <SectionCard.Row label="Family Status" value={p.familyStatus} />
              <SectionCard.Row label="Family Values" value={p.familyValues} />
            </SectionCard>

            {/* Address */}
            <SectionCard
              id="sec-address"
              title="Address & Contact Location"
              icon={MapPin}
              onEdit={() => navigate('/profile/edit')}
              isEmpty={isAddressEmpty}
            >
              <SectionCard.Row label="Country" value={p.country} />
              <SectionCard.Row label="State" value={p.state} />
              <SectionCard.Row label="District" value={p.district} />
              <SectionCard.Row label="City / Town" value={p.city} />
              <SectionCard.Row label="Native Place" value={p.nativePlace} />
              <SectionCard.Row label="Pincode" value={p.pincode} />
              <SectionCard.Row label="Residential Address" value={p.address} fullWidth />
            </SectionCard>

            {/* Church */}
            <SectionCard
              id="sec-church"
              title="Sacramental & Church Information"
              icon={Church}
              onEdit={() => navigate('/profile/edit')}
              isEmpty={isChurchEmpty}
            >
              <SectionCard.BoolRow label="Holy Baptism Received" value={p.baptized} />
              <SectionCard.BoolRow label="Holy Confirmation Received" value={p.confirmed} />
              <SectionCard.BoolRow label="First Holy Communion" value={p.firstHolyCommunion} />
              <SectionCard.BoolRow label="Active Member in Parish Church" value={p.activeInChurch} />
              <SectionCard.Row label="Church Ministry / Service" value={p.churchMinistry} />
            </SectionCard>

            {/* About */}
            <SectionCard
              id="sec-about"
              title="About Me"
              icon={FileText}
              onEdit={() => navigate('/profile/edit')}
              isEmpty={isAboutEmpty}
            >
              <p className="about-me-display">{p.aboutMe}</p>
            </SectionCard>

            {/* Partner Preference */}
            <SectionCard
              id="sec-preference"
              title="Partner Preference"
              icon={Target}
              onEdit={() => navigate('/profile/preferences')}
              isEmpty={!p.preferredAgeFrom && !p.preferredDenomination?.length}
            >
              <SectionCard.Row label="Preferred Age Range" value={p.preferredAgeFrom ? `${p.preferredAgeFrom} – ${p.preferredAgeTo || '?'} years` : null} />
              <SectionCard.Row label="Preferred Height Range" value={p.preferredHeightFrom ? `${p.preferredHeightFrom} – ${p.preferredHeightTo || '?'}` : null} />
              <SectionCard.Row label="Marital Status" value={p.preferredMaritalStatus} />
              <SectionCard.Row label="Denomination" value={p.preferredDenomination} />
              <SectionCard.Row label="Education Qualification" value={p.preferredEducation} />
              <SectionCard.Row label="Occupation / Profession" value={p.preferredOccupation} />
              <SectionCard.Row label="Preferred State" value={p.preferredState} />
              <SectionCard.Row label="Preferred District" value={p.preferredDistrict} />
            </SectionCard>
          </main>
        </div>
      </div>
    </div>
  )
}
