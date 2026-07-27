import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, User, Church, Heart, GraduationCap, Briefcase, Users, MapPin, FileText, Target, Save, CheckCircle2, Loader2, Sparkles, Award, Check } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { getMyProfile, updateMyFullProfile } from '../services/profileService'
import ProfileSkeleton from '../components/profile/ProfileSkeleton'
import toast from 'react-hot-toast'

export default function EditProfile() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    profileFor: 'Self',
    firstName: '',
    lastName: '',
    gender: '',
    dateOfBirth: '',
    mobileNumber: '',
    religion: 'Christian',
    denomination: '',
    diocese: '',
    church: '',
    churchAddress: '',
    maritalStatus: '',
    motherTongue: '',
    languagesKnown: [],
    height: '',
    weight: '',
    complexion: '',
    bodyType: '',
    bloodGroup: '',
    physicalStatus: '',
    diet: '',
    smoking: '',
    drinking: '',
    highestQualification: '',
    degree: '',
    specialization: '',
    college: '',
    university: '',
    graduationYear: '',
    additionalCertifications: '',
    occupation: '',
    company: '',
    designation: '',
    experience: '',
    annualIncome: '',
    workLocation: '',
    fatherName: '',
    fatherOccupation: '',
    motherName: '',
    motherOccupation: '',
    brothers: 0,
    marriedBrothers: 0,
    sisters: 0,
    marriedSisters: 0,
    familyType: '',
    familyStatus: '',
    familyValues: '',
    country: 'India',
    state: '',
    district: '',
    city: '',
    nativePlace: '',
    address: '',
    pincode: '',
    baptized: false,
    confirmed: false,
    firstHolyCommunion: false,
    activeInChurch: false,
    churchMinistry: '',
    aboutMe: '',
    preferredAgeFrom: 18,
    preferredAgeTo: 60,
    preferredHeightFrom: '',
    preferredHeightTo: '',
    preferredMaritalStatus: [],
    preferredEducation: [],
    preferredOccupation: [],
    preferredDenomination: [],
    preferredState: [],
    preferredDistrict: []
  })

  useEffect(() => {
    if (!user) { navigate('/login'); return }
    fetchProfile()
  }, [user])

  const fetchProfile = async () => {
    try {
      const res = await getMyProfile()
      if (res.data && res.data.profile) {
        const p = res.data.profile
        setFormData({
          ...p,
          dateOfBirth: p.dateOfBirth ? p.dateOfBirth.split('T')[0] : '',
          languagesKnown: Array.isArray(p.languagesKnown) ? p.languagesKnown : [],
          preferredMaritalStatus: Array.isArray(p.preferredMaritalStatus) ? p.preferredMaritalStatus : [],
          preferredEducation: Array.isArray(p.preferredEducation) ? p.preferredEducation : [],
          preferredOccupation: Array.isArray(p.preferredOccupation) ? p.preferredOccupation : [],
          preferredDenomination: Array.isArray(p.preferredDenomination) ? p.preferredDenomination : [],
          preferredState: Array.isArray(p.preferredState) ? p.preferredState : [],
          preferredDistrict: Array.isArray(p.preferredDistrict) ? p.preferredDistrict : []
        })
      }
    } catch (err) {
      toast.error('Failed to load profile details')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await updateMyFullProfile(formData)
      if (res.data && res.data.success) {
        toast.success('All profile changes saved successfully!')
        navigate('/profile')
      } else {
        toast.error(res.data?.message || 'Failed to save profile')
      }
    } catch (err) {
      console.error(err)
      toast.error(err.response?.data?.message || 'Error saving profile changes')
    } finally {
      setSaving(false)
    }
  }

  if (!user) return null
  if (loading) return <ProfileSkeleton />

  const inputStyle = {
    width: '100%',
    padding: '11px 14px',
    borderRadius: '10px',
    border: '1px solid #EAE5DC',
    background: '#FAF8F5',
    fontSize: '14px',
    color: '#1B2535',
    outline: 'none',
    boxSizing: 'border-box'
  }

  const labelStyle = {
    fontSize: '12.5px',
    fontWeight: 600,
    color: '#475467',
    display: 'block',
    marginBottom: '6px',
    textTransform: 'uppercase',
    letterSpacing: '0.02em'
  }

  const sectionCardStyle = {
    background: '#FFFFFF',
    borderRadius: '18px',
    border: '1px solid #EFEBE4',
    padding: '28px',
    marginBottom: '28px',
    boxShadow: '0 4px 16px rgba(0,0,0,0.02)'
  }

  const sectionHeaderStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    borderBottom: '1px solid #F3F0E9',
    paddingBottom: '14px',
    marginBottom: '22px'
  }

  return (
    <div style={{ background: '#FAF8F5', minHeight: '100vh', padding: '36px 24px 100px 24px', fontFamily: "'Inter', sans-serif" }}>
      <div style={{ maxWidth: '940px', margin: '0 auto' }}>

        {/* Page Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <Link to="/profile" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#B88E4C', textDecoration: 'none', fontSize: '13px', fontWeight: 600, marginBottom: '8px' }}>
              <ArrowLeft size={16} />
              <span>Back to Profile</span>
            </Link>
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '36px', fontWeight: 700, color: '#1B2535', margin: 0 }}>
              Edit My Complete Profile
            </h1>
            <p style={{ fontSize: '14px', color: '#667085', margin: '4px 0 0 0' }}>
              Update your details across all sections in one single unified form.
            </p>
          </div>

          <button
            onClick={handleSubmit}
            disabled={saving}
            style={{
              background: 'linear-gradient(135deg, #1A273D 0%, #2A3B59 100%)',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '12px',
              padding: '14px 28px',
              fontWeight: 700,
              fontSize: '14.5px',
              cursor: saving ? 'wait' : 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 16px rgba(26, 39, 61, 0.25)'
            }}
          >
            {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            <span>{saving ? 'Saving All Changes...' : 'Save All Changes'}</span>
          </button>
        </div>

        {/* Unified Form Container */}
        <form onSubmit={handleSubmit}>

          {/* 1. BASIC INFORMATION */}
          <div style={sectionCardStyle}>
            <div style={sectionHeaderStyle}>
              <User size={22} color="#B88E4C" />
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '24px', fontWeight: 700, color: '#1B2535', margin: 0 }}>
                1. Basic Information
              </h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '18px' }} className="edit-form-grid">
              <div>
                <label style={labelStyle}>Profile For</label>
                <select name="profileFor" value={formData.profileFor} onChange={handleChange} style={inputStyle}>
                  <option value="Self">Self</option>
                  <option value="Son">Son</option>
                  <option value="Daughter">Daughter</option>
                  <option value="Brother">Brother</option>
                  <option value="Sister">Sister</option>
                  <option value="Friend">Friend</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>First Name</label>
                <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} style={inputStyle} placeholder="First name" required />
              </div>
              <div>
                <label style={labelStyle}>Last Name</label>
                <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} style={inputStyle} placeholder="Last name" />
              </div>
              <div>
                <label style={labelStyle}>Gender</label>
                <select name="gender" value={formData.gender} onChange={handleChange} style={inputStyle}>
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Date of Birth</label>
                <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Mobile Number</label>
                <input type="tel" name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} style={inputStyle} placeholder="Mobile number" />
              </div>
            </div>
          </div>

          {/* 2. RELIGIOUS INFORMATION */}
          <div style={sectionCardStyle}>
            <div style={sectionHeaderStyle}>
              <Church size={22} color="#B88E4C" />
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '24px', fontWeight: 700, color: '#1B2535', margin: 0 }}>
                2. Religious Information
              </h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '18px' }} className="edit-form-grid">
              <div>
                <label style={labelStyle}>Religion</label>
                <input type="text" name="religion" value={formData.religion} onChange={handleChange} style={inputStyle} placeholder="Religion" />
              </div>
              <div>
                <label style={labelStyle}>Denomination</label>
                <input type="text" name="denomination" value={formData.denomination} onChange={handleChange} style={inputStyle} placeholder="e.g. Roman Catholic, Latin Catholic, Syro Malabar" />
              </div>
              <div>
                <label style={labelStyle}>Diocese</label>
                <input type="text" name="diocese" value={formData.diocese} onChange={handleChange} style={inputStyle} placeholder="Diocese name" />
              </div>
              <div>
                <label style={labelStyle}>Local Church Name</label>
                <input type="text" name="church" value={formData.church} onChange={handleChange} style={inputStyle} placeholder="Church name" />
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <label style={labelStyle}>Church Address</label>
                <input type="text" name="churchAddress" value={formData.churchAddress} onChange={handleChange} style={inputStyle} placeholder="Full address of local church" />
              </div>
            </div>

            {/* Sacraments & Church Activities Checkboxes */}
            <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px dashed #EAE5DC' }}>
              <label style={{ ...labelStyle, marginBottom: '12px' }}>Sacraments & Parish Involvement</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }} className="edit-form-grid">
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13.5px', color: '#1B2535' }}>
                  <input type="checkbox" name="baptized" checked={formData.baptized} onChange={handleChange} style={{ width: '16px', height: '16px' }} />
                  <span>Baptized</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13.5px', color: '#1B2535' }}>
                  <input type="checkbox" name="confirmed" checked={formData.confirmed} onChange={handleChange} style={{ width: '16px', height: '16px' }} />
                  <span>Confirmed</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13.5px', color: '#1B2535' }}>
                  <input type="checkbox" name="firstHolyCommunion" checked={formData.firstHolyCommunion} onChange={handleChange} style={{ width: '16px', height: '16px' }} />
                  <span>First Holy Communion</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13.5px', color: '#1B2535' }}>
                  <input type="checkbox" name="activeInChurch" checked={formData.activeInChurch} onChange={handleChange} style={{ width: '16px', height: '16px' }} />
                  <span>Active in Church</span>
                </label>
              </div>
              <div style={{ marginTop: '14px' }}>
                <label style={labelStyle}>Church Ministry / Choir Involvement</label>
                <input type="text" name="churchMinistry" value={formData.churchMinistry} onChange={handleChange} style={inputStyle} placeholder="e.g. Choir member, Catechism teacher, Youth leader" />
              </div>
            </div>
          </div>

          {/* 3. PERSONAL & PHYSICAL ATTRIBUTES */}
          <div style={sectionCardStyle}>
            <div style={sectionHeaderStyle}>
              <Award size={22} color="#B88E4C" />
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '24px', fontWeight: 700, color: '#1B2535', margin: 0 }}>
                3. Personal & Physical Attributes
              </h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '18px' }} className="edit-form-grid">
              <div>
                <label style={labelStyle}>Marital Status</label>
                <select name="maritalStatus" value={formData.maritalStatus} onChange={handleChange} style={inputStyle}>
                  <option value="">Select Status</option>
                  <option value="Never Married">Never Married</option>
                  <option value="Divorced">Divorced</option>
                  <option value="Widowed">Widowed</option>
                  <option value="Separated">Separated</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Mother Tongue</label>
                <input type="text" name="motherTongue" value={formData.motherTongue} onChange={handleChange} style={inputStyle} placeholder="e.g. Tamil, Malayalam, English" />
              </div>
              <div>
                <label style={labelStyle}>Height</label>
                <input type="text" name="height" value={formData.height} onChange={handleChange} style={inputStyle} placeholder="e.g. 5ft 8in / 172cm" />
              </div>
              <div>
                <label style={labelStyle}>Weight</label>
                <input type="text" name="weight" value={formData.weight} onChange={handleChange} style={inputStyle} placeholder="e.g. 68 kg" />
              </div>
              <div>
                <label style={labelStyle}>Complexion</label>
                <select name="complexion" value={formData.complexion} onChange={handleChange} style={inputStyle}>
                  <option value="">Select Complexion</option>
                  <option value="Very Fair">Very Fair</option>
                  <option value="Fair">Fair</option>
                  <option value="Wheatish">Wheatish</option>
                  <option value="Wheatish Brown">Wheatish Brown</option>
                  <option value="Dark">Dark</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Body Type</label>
                <select name="bodyType" value={formData.bodyType} onChange={handleChange} style={inputStyle}>
                  <option value="">Select Body Type</option>
                  <option value="Slim">Slim</option>
                  <option value="Athletic">Athletic</option>
                  <option value="Average">Average</option>
                  <option value="Heavy">Heavy</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Blood Group</label>
                <select name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} style={inputStyle}>
                  <option value="">Select Blood Group</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Physical Status</label>
                <select name="physicalStatus" value={formData.physicalStatus} onChange={handleChange} style={inputStyle}>
                  <option value="">Select Physical Status</option>
                  <option value="Normal">Normal</option>
                  <option value="Physically Challenged">Physically Challenged</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Diet Habits</label>
                <select name="diet" value={formData.diet} onChange={handleChange} style={inputStyle}>
                  <option value="">Select Diet</option>
                  <option value="Vegetarian">Vegetarian</option>
                  <option value="Non Vegetarian">Non Vegetarian</option>
                  <option value="Eggetarian">Eggetarian</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Smoking</label>
                <select name="smoking" value={formData.smoking} onChange={handleChange} style={inputStyle}>
                  <option value="">Select Option</option>
                  <option value="No">No</option>
                  <option value="Occasionally">Occasionally</option>
                  <option value="Yes">Yes</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Drinking</label>
                <select name="drinking" value={formData.drinking} onChange={handleChange} style={inputStyle}>
                  <option value="">Select Option</option>
                  <option value="No">No</option>
                  <option value="Occasionally">Occasionally</option>
                  <option value="Yes">Yes</option>
                </select>
              </div>
            </div>
          </div>

          {/* 4. EDUCATION DETAILS */}
          <div style={sectionCardStyle}>
            <div style={sectionHeaderStyle}>
              <GraduationCap size={22} color="#B88E4C" />
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '24px', fontWeight: 700, color: '#1B2535', margin: 0 }}>
                4. Education Details
              </h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '18px' }} className="edit-form-grid">
              <div>
                <label style={labelStyle}>Highest Qualification</label>
                <input type="text" name="highestQualification" value={formData.highestQualification} onChange={handleChange} style={inputStyle} placeholder="e.g. Master's, Bachelor's" />
              </div>
              <div>
                <label style={labelStyle}>Degree</label>
                <input type="text" name="degree" value={formData.degree} onChange={handleChange} style={inputStyle} placeholder="e.g. B.Tech, MBA, M.Arch" />
              </div>
              <div>
                <label style={labelStyle}>Specialization</label>
                <input type="text" name="specialization" value={formData.specialization} onChange={handleChange} style={inputStyle} placeholder="e.g. Computer Science, Finance" />
              </div>
              <div>
                <label style={labelStyle}>College Name</label>
                <input type="text" name="college" value={formData.college} onChange={handleChange} style={inputStyle} placeholder="College name" />
              </div>
              <div>
                <label style={labelStyle}>University Name</label>
                <input type="text" name="university" value={formData.university} onChange={handleChange} style={inputStyle} placeholder="University name" />
              </div>
              <div>
                <label style={labelStyle}>Graduation Year</label>
                <input type="number" name="graduationYear" value={formData.graduationYear || ''} onChange={handleChange} style={inputStyle} placeholder="Year (e.g. 2020)" />
              </div>
              <div style={{ gridColumn: 'span 3' }}>
                <label style={labelStyle}>Additional Certifications</label>
                <input type="text" name="additionalCertifications" value={formData.additionalCertifications} onChange={handleChange} style={inputStyle} placeholder="Certifications, diplomas, training" />
              </div>
            </div>
          </div>

          {/* 5. CAREER & OCCUPATION */}
          <div style={sectionCardStyle}>
            <div style={sectionHeaderStyle}>
              <Briefcase size={22} color="#B88E4C" />
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '24px', fontWeight: 700, color: '#1B2535', margin: 0 }}>
                5. Career & Occupation
              </h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '18px' }} className="edit-form-grid">
              <div>
                <label style={labelStyle}>Occupation / Field</label>
                <input type="text" name="occupation" value={formData.occupation} onChange={handleChange} style={inputStyle} placeholder="e.g. Software Engineer, Doctor" />
              </div>
              <div>
                <label style={labelStyle}>Company Name</label>
                <input type="text" name="company" value={formData.company} onChange={handleChange} style={inputStyle} placeholder="Company or organization" />
              </div>
              <div>
                <label style={labelStyle}>Designation</label>
                <input type="text" name="designation" value={formData.designation} onChange={handleChange} style={inputStyle} placeholder="e.g. Senior Manager, Consultant" />
              </div>
              <div>
                <label style={labelStyle}>Work Experience</label>
                <input type="text" name="experience" value={formData.experience} onChange={handleChange} style={inputStyle} placeholder="e.g. 5 Years" />
              </div>
              <div>
                <label style={labelStyle}>Annual Income</label>
                <input type="text" name="annualIncome" value={formData.annualIncome} onChange={handleChange} style={inputStyle} placeholder="e.g. 8 - 12 LPA" />
              </div>
              <div>
                <label style={labelStyle}>Work Location</label>
                <input type="text" name="workLocation" value={formData.workLocation} onChange={handleChange} style={inputStyle} placeholder="City / Country of work" />
              </div>
            </div>
          </div>

          {/* 6. FAMILY DETAILS */}
          <div style={sectionCardStyle}>
            <div style={sectionHeaderStyle}>
              <Users size={22} color="#B88E4C" />
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '24px', fontWeight: 700, color: '#1B2535', margin: 0 }}>
                6. Family Background
              </h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '18px' }} className="edit-form-grid">
              <div>
                <label style={labelStyle}>Father's Name</label>
                <input type="text" name="fatherName" value={formData.fatherName} onChange={handleChange} style={inputStyle} placeholder="Father's full name" />
              </div>
              <div>
                <label style={labelStyle}>Father's Occupation</label>
                <input type="text" name="fatherOccupation" value={formData.fatherOccupation} onChange={handleChange} style={inputStyle} placeholder="Father's occupation" />
              </div>
              <div>
                <label style={labelStyle}>Mother's Name</label>
                <input type="text" name="motherName" value={formData.motherName} onChange={handleChange} style={inputStyle} placeholder="Mother's full name" />
              </div>
              <div>
                <label style={labelStyle}>Mother's Occupation</label>
                <input type="text" name="motherOccupation" value={formData.motherOccupation} onChange={handleChange} style={inputStyle} placeholder="Mother's occupation" />
              </div>
              <div>
                <label style={labelStyle}>Family Type</label>
                <select name="familyType" value={formData.familyType} onChange={handleChange} style={inputStyle}>
                  <option value="">Select Family Type</option>
                  <option value="Nuclear">Nuclear</option>
                  <option value="Joint">Joint</option>
                  <option value="Extended">Extended</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Family Status</label>
                <select name="familyStatus" value={formData.familyStatus} onChange={handleChange} style={inputStyle}>
                  <option value="">Select Family Status</option>
                  <option value="Middle Class">Middle Class</option>
                  <option value="Upper Middle Class">Upper Middle Class</option>
                  <option value="Rich">Rich</option>
                  <option value="Affluent">Affluent</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Family Values</label>
                <select name="familyValues" value={formData.familyValues} onChange={handleChange} style={inputStyle}>
                  <option value="">Select Family Values</option>
                  <option value="Traditional">Traditional</option>
                  <option value="Moderate">Moderate</option>
                  <option value="Liberal">Liberal</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginTop: '16px', paddingTop: '16px', borderTop: '1px dashed #EAE5DC' }} className="edit-form-grid">
              <div>
                <label style={labelStyle}>No. of Brothers</label>
                <input type="number" name="brothers" min="0" value={formData.brothers} onChange={handleChange} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Married Brothers</label>
                <input type="number" name="marriedBrothers" min="0" value={formData.marriedBrothers} onChange={handleChange} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>No. of Sisters</label>
                <input type="number" name="sisters" min="0" value={formData.sisters} onChange={handleChange} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Married Sisters</label>
                <input type="number" name="marriedSisters" min="0" value={formData.marriedSisters} onChange={handleChange} style={inputStyle} />
              </div>
            </div>
          </div>

          {/* 7. ADDRESS & LOCATION */}
          <div style={sectionCardStyle}>
            <div style={sectionHeaderStyle}>
              <MapPin size={22} color="#B88E4C" />
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '24px', fontWeight: 700, color: '#1B2535', margin: 0 }}>
                7. Address & Location
              </h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '18px' }} className="edit-form-grid">
              <div>
                <label style={labelStyle}>Country</label>
                <input type="text" name="country" value={formData.country} onChange={handleChange} style={inputStyle} placeholder="Country" />
              </div>
              <div>
                <label style={labelStyle}>State</label>
                <input type="text" name="state" value={formData.state} onChange={handleChange} style={inputStyle} placeholder="State (e.g. Tamil Nadu, Kerala)" />
              </div>
              <div>
                <label style={labelStyle}>District</label>
                <input type="text" name="district" value={formData.district} onChange={handleChange} style={inputStyle} placeholder="District" />
              </div>
              <div>
                <label style={labelStyle}>City / Town</label>
                <input type="text" name="city" value={formData.city} onChange={handleChange} style={inputStyle} placeholder="City / Town name" />
              </div>
              <div>
                <label style={labelStyle}>Native Place</label>
                <input type="text" name="nativePlace" value={formData.nativePlace} onChange={handleChange} style={inputStyle} placeholder="Ancestral native place" />
              </div>
              <div>
                <label style={labelStyle}>Pincode</label>
                <input type="text" name="pincode" value={formData.pincode} onChange={handleChange} style={inputStyle} placeholder="Postal pincode" />
              </div>
              <div style={{ gridColumn: 'span 3' }}>
                <label style={labelStyle}>Residential Address</label>
                <textarea name="address" rows="2" value={formData.address} onChange={handleChange} style={{ ...inputStyle, resize: 'vertical' }} placeholder="Full street address" />
              </div>
            </div>
          </div>

          {/* 8. ABOUT ME BIOGRAPHY */}
          <div style={sectionCardStyle}>
            <div style={sectionHeaderStyle}>
              <FileText size={22} color="#B88E4C" />
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '24px', fontWeight: 700, color: '#1B2535', margin: 0 }}>
                8. About Me
              </h2>
            </div>
            <div>
              <label style={labelStyle}>Personal Biography</label>
              <textarea
                name="aboutMe"
                rows="5"
                value={formData.aboutMe}
                onChange={handleChange}
                style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }}
                placeholder="Write a brief introduction about yourself, your faith journey, lifestyle, values, and what you are seeking in a marriage partner..."
              />
            </div>
          </div>

          {/* 9. PARTNER PREFERENCES */}
          <div style={sectionCardStyle}>
            <div style={sectionHeaderStyle}>
              <Heart size={22} color="#B88E4C" />
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '24px', fontWeight: 700, color: '#1B2535', margin: 0 }}>
                9. Partner Preferences
              </h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '18px' }} className="edit-form-grid">
              <div>
                <label style={labelStyle}>Preferred Age From</label>
                <input type="number" name="preferredAgeFrom" min="18" max="70" value={formData.preferredAgeFrom || 18} onChange={handleChange} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Preferred Age To</label>
                <input type="number" name="preferredAgeTo" min="18" max="70" value={formData.preferredAgeTo || 60} onChange={handleChange} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Preferred Height From</label>
                <input type="text" name="preferredHeightFrom" value={formData.preferredHeightFrom} onChange={handleChange} style={inputStyle} placeholder="e.g. 5ft 2in" />
              </div>
              <div>
                <label style={labelStyle}>Preferred Height To</label>
                <input type="text" name="preferredHeightTo" value={formData.preferredHeightTo} onChange={handleChange} style={inputStyle} placeholder="e.g. 6ft 2in" />
              </div>
            </div>
          </div>

          {/* UNIFIED SAVE ALL BUTTON */}
          <div style={{
            position: 'sticky',
            bottom: '24px',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(12px)',
            border: '1px solid #EFEBE4',
            borderRadius: '20px',
            padding: '16px 28px',
            boxShadow: '0 12px 40px rgba(0,0,0,0.12)',
            display: 'flex',
            justify: 'space-between',
            alignItems: 'center',
            zIndex: 100
          }}>
            <div>
              <span style={{ fontSize: '14px', fontWeight: 700, color: '#1B2535', display: 'block' }}>Ready to update your profile?</span>
              <span style={{ fontSize: '12px', color: '#667085' }}>One click saves all 9 sections to your account.</span>
            </div>

            <button
              type="submit"
              disabled={saving}
              style={{
                background: 'linear-gradient(135deg, #C59B4E 0%, #E2B96D 100%)',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '30px',
                padding: '14px 36px',
                fontWeight: 700,
                fontSize: '15px',
                cursor: saving ? 'wait' : 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                boxShadow: '0 6px 20px rgba(197, 155, 78, 0.35)',
                transition: 'transform 0.2s, box-shadow 0.2s'
              }}
            >
              {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
              <span>{saving ? 'Saving All Changes...' : 'Save Complete Profile'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  )
}
