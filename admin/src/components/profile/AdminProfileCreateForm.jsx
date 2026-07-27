import { useState, useMemo } from 'react'
import {
  User, Lock, ShieldCheck, Heart, Church, GraduationCap, Briefcase,
  Users, MapPin, Info, Save, AlertCircle, Sparkles, Check
} from 'lucide-react'
import {
  DENOMINATIONS, DIOCESES, MOTHER_TONGUES, LANGUAGES, MARITAL_STATUSES,
  BLOOD_GROUPS, COMPLEXIONS, BODY_TYPES, PHYSICAL_STATUSES, DIETS,
  SMOKING_OPTIONS, DRINKING_OPTIONS, FAMILY_TYPES, FAMILY_STATUSES,
  FAMILY_VALUES, PROFILE_FOR_OPTIONS, GENDERS, OCCUPATIONS, QUALIFICATIONS,
  ANNUAL_INCOMES, HEIGHTS, WEIGHT_OPTIONS, EXPERIENCE_OPTIONS, COUNTRIES,
  STATES, STATE_DISTRICTS, CHURCH_MINISTRIES, MEMBERSHIP_TYPES,
  PROFILE_STATUSES, VERIFICATION_STATUSES
} from '@client/constants/masterData'
import api from '../../services/api'
import toast from 'react-hot-toast'

export default function AdminProfileCreateForm({ onSuccess, onCancel }) {
  const [submitting, setSubmitting] = useState(false)
  const [activeSection, setActiveSection] = useState('account')
  const [errors, setErrors] = useState({})

  // Form State containing all sections
  const [formData, setFormData] = useState({
    // Account Credentials & Admin Controls
    email: '',
    password: '',
    confirmPassword: '',
    profileStatus: 'Active',
    verificationStatus: 'Verified',
    membershipType: 'Free',
    premiumMember: false,
    featuredProfile: false,
    blocked: false,
    adminRemarks: '',

    // Basic Info
    basic: {
      profileFor: 'Self',
      firstName: '',
      lastName: '',
      gender: '',
      dateOfBirth: '',
      mobileNumber: '',
      email: '',
    },

    // Religious Info
    religious: {
      religion: 'Christian',
      denomination: 'Roman Catholic',
      diocese: '',
      church: '',
      churchAddress: '',
    },

    // Personal Info
    personal: {
      maritalStatus: 'Never Married',
      motherTongue: 'Tamil',
      languagesKnown: ['Tamil', 'English'],
      height: '',
      weight: '',
      complexion: '',
      bodyType: '',
      bloodGroup: '',
      physicalStatus: 'Normal',
      diet: 'Non Vegetarian',
      smoking: 'No',
      drinking: 'No',
    },

    // Education
    education: {
      highestQualification: '',
      degree: '',
      specialization: '',
      college: '',
      university: '',
      graduationYear: '',
      additionalCertifications: '',
    },

    // Career
    career: {
      occupation: '',
      company: '',
      designation: '',
      experience: '',
      annualIncome: '',
      workLocation: '',
    },

    // Family Details
    family: {
      fatherName: '',
      fatherOccupation: '',
      motherName: '',
      motherOccupation: '',
      brothers: 0,
      marriedBrothers: 0,
      sisters: 0,
      marriedSisters: 0,
      familyType: 'Nuclear',
      familyStatus: 'Middle Class',
      familyValues: 'Moderate',
    },

    // Address
    address: {
      country: 'India',
      state: 'Tamil Nadu',
      district: '',
      city: '',
      nativePlace: '',
      address: '',
      pincode: '',
    },

    // Church Information
    church: {
      baptized: true,
      confirmed: true,
      firstHolyCommunion: true,
      activeInChurch: false,
      churchMinistry: 'None',
    },

    // About Me
    about: {
      aboutMe: '',
    },

    // Partner Preference
    preference: {
      preferredAgeFrom: 21,
      preferredAgeTo: 30,
      preferredHeightFrom: '',
      preferredHeightTo: '',
      preferredMaritalStatus: ['Never Married'],
      preferredEducation: [],
      preferredOccupation: [],
      preferredDenomination: [],
      preferredState: [],
      preferredDistrict: [],
    },
  })

  // Live calculated age
  const calculatedAge = useMemo(() => {
    const dob = formData.basic.dateOfBirth
    if (!dob) return null
    const birthDate = new Date(dob)
    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age >= 0 ? age : null
  }, [formData.basic.dateOfBirth])

  // Helper set functions for deep form state
  const setAccountField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (field === 'email') setFormData(prev => ({ ...prev, basic: { ...prev.basic, email: value } }))
    setErrors(prev => ({ ...prev, [field]: '' }))
  }

  const setSectionField = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }))
    setErrors(prev => ({ ...prev, [`${section}.${field}`]: '' }))
  }

  const toggleArrayItem = (section, field, item) => {
    setFormData(prev => {
      const current = prev[section][field] || []
      const updated = current.includes(item)
        ? current.filter(i => i !== item)
        : [...current, item]
      return {
        ...prev,
        [section]: { ...prev[section], [field]: updated },
      }
    })
  }

  // Frontend Comprehensive Validation
  const validateForm = () => {
    const newErrors = {}

    // Account & Credentials
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Valid Email Address is required'
    }
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }
    if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    // Basic Info
    if (!formData.basic.firstName.trim() || formData.basic.firstName.trim().length < 2) {
      newErrors['basic.firstName'] = 'First Name (at least 2 characters) is required'
    }
    if (!formData.basic.lastName.trim()) {
      newErrors['basic.lastName'] = 'Last Name is required'
    }
    if (!formData.basic.gender) {
      newErrors['basic.gender'] = 'Gender selection is required'
    }
    if (!formData.basic.dateOfBirth) {
      newErrors['basic.dateOfBirth'] = 'Date of Birth is required'
    } else if (calculatedAge !== null && calculatedAge < 18) {
      newErrors['basic.dateOfBirth'] = 'Candidate must be at least 18 years old'
    }
    if (formData.basic.mobileNumber && !/^[0-9]{10}$/.test(formData.basic.mobileNumber.replace(/^\+91/, ''))) {
      newErrors['basic.mobileNumber'] = '10-digit mobile number required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) {
      toast.error('Please fix the validation errors before submitting')
      // Jump to first error section
      if (errors.email || errors.password || errors.confirmPassword) setActiveSection('account')
      else if (Object.keys(errors).some(k => k.startsWith('basic.'))) setActiveSection('basic')
      return
    }

    setSubmitting(true)
    try {
      const payload = {
        ...formData,
        basic: {
          ...formData.basic,
          mobileNumber: formData.basic.mobileNumber ? `+91${formData.basic.mobileNumber.replace(/^\+91/, '')}` : '',
        },
      }

      const res = await api.post('/profile/admin/create-full', payload)
      toast.success('User Profile created successfully!')
      onSuccess && onSuccess(res.data.profile)
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to create profile'
      toast.error(msg)
    } finally {
      setSubmitting(false)
    }
  }

  const sectionsList = [
    { id: 'account', label: '1. Account & Admin Controls', icon: ShieldCheck },
    { id: 'basic', label: '2. Basic Information', icon: User },
    { id: 'religious', label: '3. Religious Details', icon: Church },
    { id: 'personal', label: '4. Personal Info & Lifestyle', icon: Heart },
    { id: 'education', label: '5. Education', icon: GraduationCap },
    { id: 'career', label: '6. Career & Work', icon: Briefcase },
    { id: 'family', label: '7. Family Details', icon: Users },
    { id: 'address', label: '8. Address & Location', icon: MapPin },
    { id: 'church', label: '9. Church Activity', icon: Info },
    { id: 'about', label: '10. About Me (Bio)', icon: Info },
  ]

  const districtsForState = STATE_DISTRICTS[formData.address.state] || []

  return (
    <div style={{ paddingBottom: 80 }}>
      {/* REQUIRED FIELDS ANNOUNCEMENT BANNER */}
      <div style={{
        background: 'rgba(239, 68, 68, 0.08)',
        border: '1px solid rgba(239, 68, 68, 0.2)',
        borderRadius: 10,
        padding: '12px 16px',
        marginBottom: 20,
        display: 'flex',
        alignItems: 'center',
        gap: 12,
      }}>
        <AlertCircle size={18} color="var(--danger)" style={{ flexShrink: 0 }} />
        <div style={{ fontSize: 13, color: 'var(--text-primary)' }}>
          <strong style={{ color: 'var(--danger)' }}>Mandatory Fields Notice:</strong> Fields marked with a red asterisk (<span style={{ color: 'var(--danger)', fontWeight: 'bold' }}>*</span>) are required to create the profile.
        </div>
      </div>

      {/* Navigation Quick Tabs */}
      <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 12, marginBottom: 24, borderBottom: '1px solid var(--border)' }}>
        {sectionsList.map(sec => {
          const Icon = sec.icon
          const isActive = activeSection === sec.id
          const hasRequired = sec.id === 'account' || sec.id === 'basic'
          return (
            <button
              key={sec.id}
              type="button"
              className={`filter-tab ${isActive ? 'active' : ''}`}
              onClick={() => setActiveSection(sec.id)}
              style={{ whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 6 }}
            >
              <Icon size={14} /> {sec.label}
              {hasRequired && <span style={{ color: 'var(--danger)', fontWeight: 'bold' }}>*</span>}
            </button>
          )
        })}
      </div>

      <form onSubmit={handleSubmit}>
        {/* ── 1. ACCOUNT & ADMIN CONTROLS ── */}
        <div className="card" style={{ marginBottom: 24, display: activeSection === 'account' ? 'block' : 'none' }}>
          <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <ShieldCheck size={18} color="var(--accent)" /> 1. Account Credentials & Administration
          </div>

          <div className="grid-2" style={{ gap: 16 }}>
            <div className="form-group">
              <label className="form-label">
                Email Address (Login ID) <span style={{ color: 'var(--danger)', fontWeight: 'bold' }}>*</span>
              </label>
              <input
                type="email"
                className="form-input"
                placeholder="user@example.com"
                value={formData.email}
                onChange={e => setAccountField('email', e.target.value)}
                required
              />
              {errors.email && <div style={{ color: 'var(--danger)', fontSize: 12, marginTop: 4 }}>{errors.email}</div>}
            </div>

            <div className="form-group">
              <label className="form-label">
                Password <span style={{ color: 'var(--danger)', fontWeight: 'bold' }}>*</span>
              </label>
              <input
                type="password"
                className="form-input"
                placeholder="Min 6 characters..."
                value={formData.password}
                onChange={e => setAccountField('password', e.target.value)}
                required
              />
              {errors.password && <div style={{ color: 'var(--danger)', fontSize: 12, marginTop: 4 }}>{errors.password}</div>}
            </div>

            <div className="form-group">
              <label className="form-label">
                Confirm Password <span style={{ color: 'var(--danger)', fontWeight: 'bold' }}>*</span>
              </label>
              <input
                type="password"
                className="form-input"
                placeholder="Re-enter password..."
                value={formData.confirmPassword}
                onChange={e => setAccountField('confirmPassword', e.target.value)}
                required
              />
              {errors.confirmPassword && <div style={{ color: 'var(--danger)', fontSize: 12, marginTop: 4 }}>{errors.confirmPassword}</div>}
            </div>

            <div className="form-group">
              <label className="form-label">Profile Status</label>
              <select className="form-select" value={formData.profileStatus} onChange={e => setAccountField('profileStatus', e.target.value)}>
                {PROFILE_STATUSES.map(st => <option key={st} value={st}>{st}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Verification Status</label>
              <select className="form-select" value={formData.verificationStatus} onChange={e => setAccountField('verificationStatus', e.target.value)}>
                {VERIFICATION_STATUSES.map(st => <option key={st} value={st}>{st}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Membership Type</label>
              <select className="form-select" value={formData.membershipType} onChange={e => setAccountField('membershipType', e.target.value)}>
                {MEMBERSHIP_TYPES.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 24, marginTop: 16, flexWrap: 'wrap' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13 }}>
              <input type="checkbox" checked={formData.featuredProfile} onChange={e => setAccountField('featuredProfile', e.target.checked)} />
              <span>Featured Profile Badge</span>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13 }}>
              <input type="checkbox" checked={formData.premiumMember} onChange={e => setAccountField('premiumMember', e.target.checked)} />
              <span>Premium Membership Badge</span>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13 }}>
              <input type="checkbox" checked={formData.blocked} onChange={e => setAccountField('blocked', e.target.checked)} />
              <span style={{ color: 'var(--danger)', fontWeight: 600 }}>Block Account Immediately</span>
            </label>
          </div>

          <div className="form-group" style={{ marginTop: 16 }}>
            <label className="form-label">Internal Admin Remarks / Notes</label>
            <textarea
              className="form-textarea"
              placeholder="Internal notes about user verification, family background checks, etc..."
              value={formData.adminRemarks}
              onChange={e => setAccountField('adminRemarks', e.target.value)}
              rows={2}
            />
          </div>
        </div>

        {/* ── 2. BASIC INFORMATION ── */}
        <div className="card" style={{ marginBottom: 24, display: activeSection === 'basic' ? 'block' : 'none' }}>
          <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <User size={18} color="var(--accent)" /> 2. Basic Information
          </div>

          <div className="grid-2" style={{ gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Profile For</label>
              <select className="form-select" value={formData.basic.profileFor} onChange={e => setSectionField('basic', 'profileFor', e.target.value)}>
                {PROFILE_FOR_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">
                Gender <span style={{ color: 'var(--danger)', fontWeight: 'bold' }}>*</span>
              </label>
              <select className="form-select" value={formData.basic.gender} onChange={e => setSectionField('basic', 'gender', e.target.value)} required>
                <option value="">Select Gender</option>
                {GENDERS.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
              {errors['basic.gender'] && <div style={{ color: 'var(--danger)', fontSize: 12, marginTop: 4 }}>{errors['basic.gender']}</div>}
            </div>

            <div className="form-group">
              <label className="form-label">
                First Name <span style={{ color: 'var(--danger)', fontWeight: 'bold' }}>*</span>
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="John"
                value={formData.basic.firstName}
                onChange={e => setSectionField('basic', 'firstName', e.target.value)}
                required
              />
              {errors['basic.firstName'] && <div style={{ color: 'var(--danger)', fontSize: 12, marginTop: 4 }}>{errors['basic.firstName']}</div>}
            </div>

            <div className="form-group">
              <label className="form-label">
                Last Name <span style={{ color: 'var(--danger)', fontWeight: 'bold' }}>*</span>
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="Paul"
                value={formData.basic.lastName}
                onChange={e => setSectionField('basic', 'lastName', e.target.value)}
                required
              />
              {errors['basic.lastName'] && <div style={{ color: 'var(--danger)', fontSize: 12, marginTop: 4 }}>{errors['basic.lastName']}</div>}
            </div>

            <div className="form-group">
              <label className="form-label">
                Date of Birth <span style={{ color: 'var(--danger)', fontWeight: 'bold' }}>*</span> {calculatedAge !== null && <span style={{ color: 'var(--accent-light)', fontWeight: 'bold' }}>({calculatedAge} Years Old)</span>}
              </label>
              <input
                type="date"
                className="form-input"
                value={formData.basic.dateOfBirth}
                onChange={e => setSectionField('basic', 'dateOfBirth', e.target.value)}
                required
              />
              {errors['basic.dateOfBirth'] && <div style={{ color: 'var(--danger)', fontSize: 12, marginTop: 4 }}>{errors['basic.dateOfBirth']}</div>}
            </div>

            <div className="form-group">
              <label className="form-label">Mobile Number</label>
              <div style={{ display: 'flex', gap: 8 }}>
                <span className="form-input" style={{ width: 60, textAlign: 'center', background: 'var(--bg-secondary)' }}>+91</span>
                <input
                  type="text"
                  className="form-input"
                  placeholder="9876543210"
                  maxLength={10}
                  value={formData.basic.mobileNumber}
                  onChange={e => setSectionField('basic', 'mobileNumber', e.target.value)}
                />
              </div>
              {errors['basic.mobileNumber'] && <div style={{ color: 'var(--danger)', fontSize: 12, marginTop: 4 }}>{errors['basic.mobileNumber']}</div>}
            </div>
          </div>
        </div>

        {/* ── 3. RELIGIOUS DETAILS ── */}
        <div className="card" style={{ marginBottom: 24, display: activeSection === 'religious' ? 'block' : 'none' }}>
          <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Church size={18} color="var(--accent)" /> 3. Religious Information
          </div>

          <div className="grid-2" style={{ gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Denomination</label>
              <select className="form-select" value={formData.religious.denomination} onChange={e => setSectionField('religious', 'denomination', e.target.value)}>
                <option value="">Select Denomination</option>
                {DENOMINATIONS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Diocese</label>
              <select className="form-select" value={formData.religious.diocese} onChange={e => setSectionField('religious', 'diocese', e.target.value)}>
                <option value="">Select Diocese</option>
                {DIOCESES.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Church Name</label>
              <input
                type="text"
                className="form-input"
                placeholder="St. Mary Cathedral"
                value={formData.religious.church}
                onChange={e => setSectionField('religious', 'church', e.target.value)}
              />
            </div>

            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label">
                Church Address <span style={{ color: 'var(--danger)', fontWeight: 'bold' }}>*</span>
              </label>
              <textarea
                className="form-textarea"
                rows={3}
                placeholder="Complete address of the local church..."
                value={formData.religious.churchAddress}
                onChange={e => setSectionField('religious', 'churchAddress', e.target.value)}
                required
              />
              {errors['religious.churchAddress'] && <div style={{ color: 'var(--danger)', fontSize: 12, marginTop: 4 }}>{errors['religious.churchAddress']}</div>}
            </div>
          </div>
        </div>

        {/* ── 4. PERSONAL INFO & LIFESTYLE ── */}
        <div className="card" style={{ marginBottom: 24, display: activeSection === 'personal' ? 'block' : 'none' }}>
          <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Heart size={18} color="var(--accent)" /> 4. Personal Information & Lifestyle
          </div>

          <div className="grid-3" style={{ gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Marital Status</label>
              <select className="form-select" value={formData.personal.maritalStatus} onChange={e => setSectionField('personal', 'maritalStatus', e.target.value)}>
                {MARITAL_STATUSES.map(ms => <option key={ms} value={ms}>{ms}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Mother Tongue</label>
              <select className="form-select" value={formData.personal.motherTongue} onChange={e => setSectionField('personal', 'motherTongue', e.target.value)}>
                {MOTHER_TONGUES.map(mt => <option key={mt} value={mt}>{mt}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Height</label>
              <select className="form-select" value={formData.personal.height} onChange={e => setSectionField('personal', 'height', e.target.value)}>
                <option value="">Select Height</option>
                {HEIGHTS.map(h => <option key={h} value={h}>{h}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Weight</label>
              <select className="form-select" value={formData.personal.weight} onChange={e => setSectionField('personal', 'weight', e.target.value)}>
                <option value="">Select Weight</option>
                {WEIGHT_OPTIONS.map(w => <option key={w} value={w}>{w}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Complexion</label>
              <select className="form-select" value={formData.personal.complexion} onChange={e => setSectionField('personal', 'complexion', e.target.value)}>
                <option value="">Select Complexion</option>
                {COMPLEXIONS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Body Type</label>
              <select className="form-select" value={formData.personal.bodyType} onChange={e => setSectionField('personal', 'bodyType', e.target.value)}>
                <option value="">Select Body Type</option>
                {BODY_TYPES.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Blood Group</label>
              <select className="form-select" value={formData.personal.bloodGroup} onChange={e => setSectionField('personal', 'bloodGroup', e.target.value)}>
                <option value="">Select Blood Group</option>
                {BLOOD_GROUPS.map(bg => <option key={bg} value={bg}>{bg}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Physical Status</label>
              <select className="form-select" value={formData.personal.physicalStatus} onChange={e => setSectionField('personal', 'physicalStatus', e.target.value)}>
                {PHYSICAL_STATUSES.map(ps => <option key={ps} value={ps}>{ps}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Diet</label>
              <select className="form-select" value={formData.personal.diet} onChange={e => setSectionField('personal', 'diet', e.target.value)}>
                {DIETS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Smoking Habits</label>
              <select className="form-select" value={formData.personal.smoking} onChange={e => setSectionField('personal', 'smoking', e.target.value)}>
                {SMOKING_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Drinking Habits</label>
              <select className="form-select" value={formData.personal.drinking} onChange={e => setSectionField('personal', 'drinking', e.target.value)}>
                {DRINKING_OPTIONS.map(dr => <option key={dr} value={dr}>{dr}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* ── 5. EDUCATION ── */}
        <div className="card" style={{ marginBottom: 24, display: activeSection === 'education' ? 'block' : 'none' }}>
          <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <GraduationCap size={18} color="var(--accent)" /> 5. Education Qualification
          </div>

          <div className="grid-2" style={{ gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Highest Qualification</label>
              <select className="form-select" value={formData.education.highestQualification} onChange={e => setSectionField('education', 'highestQualification', e.target.value)}>
                <option value="">Select Qualification</option>
                {QUALIFICATIONS.map(q => <option key={q} value={q}>{q}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Degree Name</label>
              <input
                type="text"
                className="form-input"
                placeholder="B.E. Computer Science"
                value={formData.education.degree}
                onChange={e => setSectionField('education', 'degree', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Specialization / Branch</label>
              <input
                type="text"
                className="form-input"
                placeholder="Artificial Intelligence / IT"
                value={formData.education.specialization}
                onChange={e => setSectionField('education', 'specialization', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Institution / College Name</label>
              <input
                type="text"
                className="form-input"
                placeholder="Loyola College, Chennai"
                value={formData.education.college}
                onChange={e => setSectionField('education', 'college', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">University (if applicable)</label>
              <input
                type="text"
                className="form-input"
                placeholder="Anna University"
                value={formData.education.university}
                onChange={e => setSectionField('education', 'university', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Graduation Year</label>
              <input
                type="number"
                className="form-input"
                placeholder="2020"
                min={1970}
                max={new Date().getFullYear()}
                value={formData.education.graduationYear}
                onChange={e => setSectionField('education', 'graduationYear', e.target.value)}
              />
            </div>

            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label">Additional Certifications (Optional)</label>
              <textarea
                className="form-textarea"
                rows={2}
                placeholder="List any additional certifications, diplomas, or achievements..."
                value={formData.education.additionalCertifications}
                onChange={e => setSectionField('education', 'additionalCertifications', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* ── 6. CAREER & WORK ── */}
        <div className="card" style={{ marginBottom: 24, display: activeSection === 'career' ? 'block' : 'none' }}>
          <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Briefcase size={18} color="var(--accent)" /> 6. Career & Occupation
          </div>

          <div className="grid-2" style={{ gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Occupation</label>
              <select className="form-select" value={formData.career.occupation} onChange={e => setSectionField('career', 'occupation', e.target.value)}>
                <option value="">Select Occupation</option>
                {OCCUPATIONS.map(occ => <option key={occ} value={occ}>{occ}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Designation / Role</label>
              <input
                type="text"
                className="form-input"
                placeholder="Senior Software Engineer"
                value={formData.career.designation}
                onChange={e => setSectionField('career', 'designation', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Company Name</label>
              <input
                type="text"
                className="form-input"
                placeholder="TCS / Cognizant / Infosys"
                value={formData.career.company}
                onChange={e => setSectionField('career', 'company', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Total Work Experience</label>
              <select className="form-select" value={formData.career.experience} onChange={e => setSectionField('career', 'experience', e.target.value)}>
                <option value="">Select Experience</option>
                {EXPERIENCE_OPTIONS.map(exp => <option key={exp} value={exp}>{exp}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Annual Income</label>
              <select className="form-select" value={formData.career.annualIncome} onChange={e => setSectionField('career', 'annualIncome', e.target.value)}>
                <option value="">Select Annual Income</option>
                {ANNUAL_INCOMES.map(inc => <option key={inc} value={inc}>{inc}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Work Location</label>
              <input
                type="text"
                className="form-input"
                placeholder="Chennai, Tamil Nadu"
                value={formData.career.workLocation}
                onChange={e => setSectionField('career', 'workLocation', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* ── 7. FAMILY DETAILS ── */}
        <div className="card" style={{ marginBottom: 24, display: activeSection === 'family' ? 'block' : 'none' }}>
          <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Users size={18} color="var(--accent)" /> 7. Family Details
          </div>

          <div className="grid-2" style={{ gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Father's Name</label>
              <input
                type="text"
                className="form-input"
                placeholder="Father full name"
                value={formData.family.fatherName}
                onChange={e => setSectionField('family', 'fatherName', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Father's Occupation</label>
              <input
                type="text"
                className="form-input"
                placeholder="Business / Retired"
                value={formData.family.fatherOccupation}
                onChange={e => setSectionField('family', 'fatherOccupation', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Mother's Name</label>
              <input
                type="text"
                className="form-input"
                placeholder="Mother full name"
                value={formData.family.motherName}
                onChange={e => setSectionField('family', 'motherName', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Mother's Occupation</label>
              <input
                type="text"
                className="form-input"
                placeholder="Homemaker / Teacher"
                value={formData.family.motherOccupation}
                onChange={e => setSectionField('family', 'motherOccupation', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Family Type</label>
              <select className="form-select" value={formData.family.familyType} onChange={e => setSectionField('family', 'familyType', e.target.value)}>
                {FAMILY_TYPES.map(ft => <option key={ft} value={ft}>{ft}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Family Status</label>
              <select className="form-select" value={formData.family.familyStatus} onChange={e => setSectionField('family', 'familyStatus', e.target.value)}>
                {FAMILY_STATUSES.map(fs => <option key={fs} value={fs}>{fs}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Family Values</label>
              <select className="form-select" value={formData.family.familyValues} onChange={e => setSectionField('family', 'familyValues', e.target.value)}>
                {FAMILY_VALUES.map(fv => <option key={fv} value={fv}>{fv}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* ── 8. ADDRESS & LOCATION ── */}
        <div className="card" style={{ marginBottom: 24, display: activeSection === 'address' ? 'block' : 'none' }}>
          <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <MapPin size={18} color="var(--accent)" /> 8. Address & Residence Location
          </div>

          <div className="grid-2" style={{ gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Country</label>
              <select className="form-select" value={formData.address.country} onChange={e => setSectionField('address', 'country', e.target.value)}>
                {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">State</label>
              <select className="form-select" value={formData.address.state} onChange={e => setSectionField('address', 'state', e.target.value)}>
                <option value="">Select State</option>
                {STATES.map(st => <option key={st} value={st}>{st}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">District</label>
              <select className="form-select" value={formData.address.district} onChange={e => setSectionField('address', 'district', e.target.value)}>
                <option value="">Select District</option>
                {districtsForState.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">City / Town</label>
              <input
                type="text"
                className="form-input"
                placeholder="City name"
                value={formData.address.city}
                onChange={e => setSectionField('address', 'city', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Native Place</label>
              <input
                type="text"
                className="form-input"
                placeholder="Native village or town"
                value={formData.address.nativePlace}
                onChange={e => setSectionField('address', 'nativePlace', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Pincode</label>
              <input
                type="text"
                className="form-input"
                placeholder="600001"
                maxLength={6}
                value={formData.address.pincode}
                onChange={e => setSectionField('address', 'pincode', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* ── 9. CHURCH ACTIVITY ── */}
        <div className="card" style={{ marginBottom: 24, display: activeSection === 'church' ? 'block' : 'none' }}>
          <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Info size={18} color="var(--accent)" /> 9. Church Activity & Sacraments
          </div>

          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', marginBottom: 20 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13 }}>
              <input type="checkbox" checked={formData.church.baptized} onChange={e => setSectionField('church', 'baptized', e.target.checked)} />
              <span>Baptized</span>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13 }}>
              <input type="checkbox" checked={formData.church.confirmed} onChange={e => setSectionField('church', 'confirmed', e.target.checked)} />
              <span>Confirmed Sacrament</span>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13 }}>
              <input type="checkbox" checked={formData.church.firstHolyCommunion} onChange={e => setSectionField('church', 'firstHolyCommunion', e.target.checked)} />
              <span>First Holy Communion</span>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13 }}>
              <input type="checkbox" checked={formData.church.activeInChurch} onChange={e => setSectionField('church', 'activeInChurch', e.target.checked)} />
              <span>Active in Church Activities</span>
            </label>
          </div>

          <div className="form-group">
            <label className="form-label">Church Ministry / Group Involvement</label>
            <select className="form-select" value={formData.church.churchMinistry} onChange={e => setSectionField('church', 'churchMinistry', e.target.value)}>
              {CHURCH_MINISTRIES.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
        </div>

        {/* ── 10. ABOUT ME ── */}
        <div className="card" style={{ marginBottom: 24, display: activeSection === 'about' ? 'block' : 'none' }}>
          <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Info size={18} color="var(--accent)" /> 10. About Me (Bio)
          </div>

          <div className="form-group">
            <label className="form-label">About Candidate (Min 20 characters recommended)</label>
            <textarea
              className="form-textarea"
              rows={5}
              placeholder="Write a brief intro about the candidate's personality, values, hobbies, family background..."
              value={formData.about.aboutMe}
              onChange={e => setSectionField('about', 'aboutMe', e.target.value)}
            />
          </div>
        </div>



        {/* STICKY BOTTOM ACTION BAR WITH STEP WIZARD NAVIGATION */}
        {(() => {
          const currentIndex = sectionsList.findIndex(s => s.id === activeSection)
          const isFirstStep = currentIndex === 0
          const isLastStep = currentIndex === sectionsList.length - 1

          const handleNext = () => {
            if (activeSection === 'account') {
              // Validate account section required fields
              const errs = {}
              if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) errs.email = 'Valid Email is required'
              if (!formData.password) errs.password = 'Password is required'
              else if (formData.password.length < 6) errs.password = 'Password must be min 6 chars'
              if (formData.confirmPassword !== formData.password) errs.confirmPassword = 'Passwords do not match'

              if (Object.keys(errs).length > 0) {
                setErrors(errs)
                toast.error('Please complete required account credentials')
                return
              }
            } else if (activeSection === 'basic') {
              // Validate basic info required fields
              const errs = {}
              if (!formData.basic.firstName.trim()) errs['basic.firstName'] = 'First name required'
              if (!formData.basic.lastName.trim()) errs['basic.lastName'] = 'Last name required'
              if (!formData.basic.gender) errs['basic.gender'] = 'Gender required'
              if (!formData.basic.dateOfBirth) errs['basic.dateOfBirth'] = 'Date of birth required'
              else if (calculatedAge !== null && calculatedAge < 18) errs['basic.dateOfBirth'] = 'Must be 18+ years'

              if (Object.keys(errs).length > 0) {
                setErrors(errs)
                toast.error('Please fill required basic information')
                return
              }
            }

            if (currentIndex < sectionsList.length - 1) {
              setActiveSection(sectionsList[currentIndex + 1].id)
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }
          }

          const handlePrev = () => {
            if (currentIndex > 0) {
              setActiveSection(sectionsList[currentIndex - 1].id)
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }
          }

          return (
            <div style={{
              position: 'fixed',
              bottom: 0,
              right: 0,
              left: 'var(--sidebar-width)',
              backgroundColor: 'var(--bg-secondary)',
              borderTop: '1px solid var(--border)',
              padding: '12px 28px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              zIndex: 99,
              boxShadow: '0 -4px 20px rgba(0,0,0,0.2)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                  Step <strong>{currentIndex + 1}</strong> of <strong>{sectionsList.length}</strong>: <strong style={{ color: 'var(--text-primary)' }}>{sectionsList[currentIndex]?.label}</strong>
                </span>
                <div style={{ width: 100, height: 6, borderRadius: 3, background: 'var(--bg-primary)', overflow: 'hidden' }}>
                  <div style={{
                    height: '100%',
                    width: `${((currentIndex + 1) / sectionsList.length) * 100}%`,
                    background: 'var(--accent)',
                    transition: 'width 0.3s'
                  }} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: 12 }}>
                <button type="button" className="btn btn-outline" onClick={onCancel} disabled={submitting}>
                  Cancel
                </button>

                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={handlePrev}
                  disabled={isFirstStep || submitting}
                  style={{ opacity: isFirstStep ? 0.5 : 1 }}
                >
                  ← Previous
                </button>

                {!isLastStep ? (
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleNext}
                    style={{ padding: '10px 24px', fontSize: 14 }}
                  >
                    Next Section →
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="btn btn-primary"
                    style={{ padding: '10px 24px', fontSize: 14, backgroundColor: 'var(--success)' }}
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <span className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }} /> Creating Profile...
                      </>
                    ) : (
                      <>
                        <Check size={16} /> Create Profile Now
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          )
        })()}
      </form>
    </div>
  )
}
