import { useState } from 'react'
import { Users } from 'lucide-react'
import FormSection from '../form/FormSection'
import TextField from '../form/TextField'
import SelectField from '../form/SelectField'
import { updateProfileSection } from '../../services/profileService'
import { FAMILY_TYPES, FAMILY_STATUSES, FAMILY_VALUES, OCCUPATIONS } from '../../constants/masterData'
import toast from 'react-hot-toast'

const SIBLING_COUNTS = Array.from({ length: 11 }, (_, i) => String(i))

export default function EditFamily({ profile, onUpdate, profileId }) {
  const [form, setForm] = useState({
    fatherName: profile?.fatherName || '',
    fatherOccupation: profile?.fatherOccupation || '',
    motherName: profile?.motherName || '',
    motherOccupation: profile?.motherOccupation || '',
    brothers: String(profile?.brothers ?? 0),
    marriedBrothers: String(profile?.marriedBrothers ?? 0),
    sisters: String(profile?.sisters ?? 0),
    marriedSisters: String(profile?.marriedSisters ?? 0),
    familyType: profile?.familyType || '',
    familyStatus: profile?.familyStatus || '',
    familyValues: profile?.familyValues || '',
  })
  const [saving, setSaving] = useState(false)

  const set = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target ? e.target.value : e }))

  const handleSave = async () => {
    setSaving(true)
    try {
      const payload = {
        ...form,
        brothers: Number(form.brothers),
        marriedBrothers: Number(form.marriedBrothers),
        sisters: Number(form.sisters),
        marriedSisters: Number(form.marriedSisters),
      }
      const res = await updateProfileSection('family', payload, profileId)
      toast.success('Family details saved!')
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
      title="Family Details"
      icon={Users}
      onSave={handleSave}
      saving={saving}
      completionScore={profile?.completionBreakdown?.family}
    >
      {({ editing }) => (
        <div className="edit-section-grid">
          <TextField
            label="Father's Name"
            name="fatherName"
            value={form.fatherName}
            onChange={set('fatherName')}
            disabled={!editing}
            placeholder="Father's full name"
          />
          <SelectField
            label="Father's Occupation"
            name="fatherOccupation"
            options={[...OCCUPATIONS, 'Retired', 'Late']}
            value={form.fatherOccupation}
            onChange={set('fatherOccupation')}
            disabled={!editing}
            placeholder="Select occupation"
          />
          <TextField
            label="Mother's Name"
            name="motherName"
            value={form.motherName}
            onChange={set('motherName')}
            disabled={!editing}
            placeholder="Mother's full name"
          />
          <SelectField
            label="Mother's Occupation"
            name="motherOccupation"
            options={[...OCCUPATIONS, 'Home Maker', 'Retired', 'Late']}
            value={form.motherOccupation}
            onChange={set('motherOccupation')}
            disabled={!editing}
            placeholder="Select occupation"
          />
          <SelectField
            label="Brothers"
            name="brothers"
            options={SIBLING_COUNTS}
            value={form.brothers}
            onChange={set('brothers')}
            disabled={!editing}
          />
          <SelectField
            label="Married Brothers"
            name="marriedBrothers"
            options={SIBLING_COUNTS}
            value={form.marriedBrothers}
            onChange={set('marriedBrothers')}
            disabled={!editing}
          />
          <SelectField
            label="Sisters"
            name="sisters"
            options={SIBLING_COUNTS}
            value={form.sisters}
            onChange={set('sisters')}
            disabled={!editing}
          />
          <SelectField
            label="Married Sisters"
            name="marriedSisters"
            options={SIBLING_COUNTS}
            value={form.marriedSisters}
            onChange={set('marriedSisters')}
            disabled={!editing}
          />
          <SelectField
            label="Family Type"
            name="familyType"
            options={FAMILY_TYPES}
            value={form.familyType}
            onChange={set('familyType')}
            disabled={!editing}
          />
          <SelectField
            label="Family Status"
            name="familyStatus"
            options={FAMILY_STATUSES}
            value={form.familyStatus}
            onChange={set('familyStatus')}
            disabled={!editing}
          />
          <SelectField
            label="Family Values"
            name="familyValues"
            options={FAMILY_VALUES}
            value={form.familyValues}
            onChange={set('familyValues')}
            disabled={!editing}
          />
        </div>
      )}
    </FormSection>
  )
}
