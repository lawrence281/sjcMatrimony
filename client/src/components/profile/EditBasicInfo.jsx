import { useState } from 'react'
import { User } from 'lucide-react'
import FormSection from '../form/FormSection'
import TextField from '../form/TextField'
import SelectField from '../form/SelectField'
import DatePicker from '../form/DatePicker'
import PhoneInput from '../form/PhoneInput'
import { updateProfileSection } from '../../services/profileService'
import { PROFILE_FOR_OPTIONS, GENDERS } from '../../constants/masterData'
import toast from 'react-hot-toast'

export default function EditBasicInfo({ profile, onUpdate, profileId }) {
  const [form, setForm] = useState({
    profileFor: profile?.profileFor || 'Self',
    firstName: profile?.firstName || '',
    lastName: profile?.lastName || '',
    gender: profile?.gender || '',
    dateOfBirth: profile?.dateOfBirth
      ? new Date(profile.dateOfBirth).toISOString().split('T')[0]
      : '',
    mobileNumber: profile?.mobileNumber?.replace(/^\+91/, '') || '',
    email: profile?.email || '',
  })
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)

  const set = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target ? e.target.value : e }))
    setErrors((er) => ({ ...er, [field]: '' }))
  }

  const validate = () => {
    const err = {}
    if (!form.firstName.trim()) err.firstName = 'First name is required'
    if (form.firstName.trim().length < 2) err.firstName = 'At least 2 characters'
    if (!form.lastName.trim()) err.lastName = 'Last name is required'
    if (!form.gender) err.gender = 'Gender is required'
    if (!form.dateOfBirth) err.dateOfBirth = 'Date of birth is required'
    if (form.mobileNumber && !/^[0-9]{10}$/.test(form.mobileNumber)) {
      err.mobileNumber = '10-digit mobile number required'
    }
    if (form.email && !/\S+@\S+\.\S+/.test(form.email)) {
      err.email = 'Valid email required'
    }
    return err
  }

  const handleSave = async () => {
    const err = validate()
    if (Object.keys(err).length > 0) { setErrors(err); return false }

    setSaving(true)
    try {
      const payload = {
        ...form,
        mobileNumber: form.mobileNumber ? `+91${form.mobileNumber}` : '',
        dateOfBirth: form.dateOfBirth || null,
      }
      const res = await updateProfileSection('basic', payload, profileId)
      toast.success('Basic information saved!')
      onUpdate && onUpdate(res.data.profile)
      return true
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save')
      return false
    } finally {
      setSaving(false)
    }
  }

  return (
    <FormSection
      title="Basic Information"
      icon={User}
      onSave={handleSave}
      saving={saving}
      defaultExpanded
      completionScore={profile?.completionBreakdown?.basic}
    >
      {({ editing }) => (
        <div className="edit-section-grid">
          <SelectField
            label="Profile For"
            name="profileFor"
            options={PROFILE_FOR_OPTIONS}
            value={form.profileFor}
            onChange={set('profileFor')}
            disabled={!editing}
            error={errors.profileFor}
          />
          <div />
          <TextField
            label="First Name"
            name="firstName"
            value={form.firstName}
            onChange={set('firstName')}
            disabled={!editing}
            error={errors.firstName}
            required
            placeholder="Enter first name"
          />
          <TextField
            label="Last Name"
            name="lastName"
            value={form.lastName}
            onChange={set('lastName')}
            disabled={!editing}
            error={errors.lastName}
            required
            placeholder="Enter last name"
          />
          <SelectField
            label="Gender"
            name="gender"
            options={GENDERS}
            value={form.gender}
            onChange={set('gender')}
            disabled={!editing}
            error={errors.gender}
            required
          />
          <DatePicker
            label="Date of Birth"
            name="dateOfBirth"
            value={form.dateOfBirth}
            onChange={set('dateOfBirth')}
            disabled={!editing}
            error={errors.dateOfBirth}
            required
          />
          <PhoneInput
            label="Mobile Number"
            name="mobileNumber"
            value={form.mobileNumber}
            onChange={set('mobileNumber')}
            disabled={!editing}
            error={errors.mobileNumber}
          />
          <TextField
            label="Email Address"
            name="email"
            type="email"
            value={form.email}
            onChange={set('email')}
            disabled={!editing}
            error={errors.email}
            placeholder="your@email.com"
          />
        </div>
      )}
    </FormSection>
  )
}
