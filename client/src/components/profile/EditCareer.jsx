import { useState } from 'react'
import { Briefcase } from 'lucide-react'
import FormSection from '../form/FormSection'
import TextField from '../form/TextField'
import SelectField from '../form/SelectField'
import { updateProfileSection } from '../../services/profileService'
import { OCCUPATIONS, ANNUAL_INCOMES, EXPERIENCE_OPTIONS, STATES } from '../../constants/masterData'
import toast from 'react-hot-toast'

export default function EditCareer({ profile, onUpdate, profileId }) {
  const [form, setForm] = useState({
    occupation: profile?.occupation || '',
    company: profile?.company || '',
    designation: profile?.designation || '',
    experience: profile?.experience || '',
    annualIncome: profile?.annualIncome || '',
    workLocation: profile?.workLocation || '',
  })
  const [saving, setSaving] = useState(false)

  const set = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target ? e.target.value : e }))

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await updateProfileSection('career', form, profileId)
      toast.success('Career information saved!')
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
      title="Career"
      icon={Briefcase}
      onSave={handleSave}
      saving={saving}
      completionScore={profile?.completionBreakdown?.career}
    >
      {({ editing }) => (
        <div className="edit-section-grid">
          <SelectField
            label="Occupation"
            name="occupation"
            options={OCCUPATIONS}
            value={form.occupation}
            onChange={set('occupation')}
            disabled={!editing}
            placeholder="Select occupation"
          />
          <TextField
            label="Company / Organisation"
            name="company"
            value={form.company}
            onChange={set('company')}
            disabled={!editing}
            placeholder="Company name"
          />
          <TextField
            label="Designation"
            name="designation"
            value={form.designation}
            onChange={set('designation')}
            disabled={!editing}
            placeholder="Your designation"
          />
          <SelectField
            label="Experience"
            name="experience"
            options={EXPERIENCE_OPTIONS}
            value={form.experience}
            onChange={set('experience')}
            disabled={!editing}
          />
          <SelectField
            label="Annual Income"
            name="annualIncome"
            options={ANNUAL_INCOMES}
            value={form.annualIncome}
            onChange={set('annualIncome')}
            disabled={!editing}
          />
          <TextField
            label="Work Location"
            name="workLocation"
            value={form.workLocation}
            onChange={set('workLocation')}
            disabled={!editing}
            placeholder="City where you work"
          />
        </div>
      )}
    </FormSection>
  )
}
