import { useState } from 'react'
import { GraduationCap } from 'lucide-react'
import FormSection from '../form/FormSection'
import TextField from '../form/TextField'
import SelectField from '../form/SelectField'
import { updateProfileSection } from '../../services/profileService'
import { QUALIFICATIONS } from '../../constants/masterData'
import toast from 'react-hot-toast'

const currentYear = new Date().getFullYear()
const GRADUATION_YEARS = Array.from({ length: currentYear - 1969 }, (_, i) => String(currentYear - i))

export default function EditEducation({ profile, onUpdate, profileId }) {
  const [form, setForm] = useState({
    highestQualification: profile?.highestQualification || '',
    degree: profile?.degree || '',
    specialization: profile?.specialization || '',
    college: profile?.college || '',
    graduationYear: profile?.graduationYear ? String(profile.graduationYear) : '',
  })
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)

  const set = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target ? e.target.value : e }))

  const handleSave = async () => {
    setSaving(true)
    try {
      const payload = {
        ...form,
        graduationYear: form.graduationYear ? Number(form.graduationYear) : null,
      }
      const res = await updateProfileSection('education', payload, profileId)
      toast.success('Education information saved!')
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
      title="Education"
      icon={GraduationCap}
      onSave={handleSave}
      saving={saving}
      completionScore={profile?.completionBreakdown?.education}
    >
      {({ editing }) => (
        <div className="edit-section-grid">
          <SelectField
            label="Highest Qualification"
            name="highestQualification"
            options={QUALIFICATIONS}
            value={form.highestQualification}
            onChange={set('highestQualification')}
            disabled={!editing}
            placeholder="Select qualification"
          />
          <TextField
            label="Degree / Course"
            name="degree"
            value={form.degree}
            onChange={set('degree')}
            disabled={!editing}
            placeholder="e.g. B.Tech, MBBS"
            error={errors.degree}
          />
          <TextField
            label="Specialization"
            name="specialization"
            value={form.specialization}
            onChange={set('specialization')}
            disabled={!editing}
            placeholder="e.g. Computer Science"
          />
          <TextField
            label="College / University"
            name="college"
            value={form.college}
            onChange={set('college')}
            disabled={!editing}
            placeholder="College name"
          />
          <SelectField
            label="Graduation Year"
            name="graduationYear"
            options={GRADUATION_YEARS}
            value={form.graduationYear}
            onChange={set('graduationYear')}
            disabled={!editing}
            placeholder="Select year"
          />
        </div>
      )}
    </FormSection>
  )
}
