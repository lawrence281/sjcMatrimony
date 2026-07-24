import { useState } from 'react'
import { Target } from 'lucide-react'
import FormSection from '../form/FormSection'
import SelectField from '../form/SelectField'
import MultiSelect from '../form/MultiSelect'
import { updateProfileSection } from '../../services/profileService'
import {
  AGE_OPTIONS, HEIGHTS, MARITAL_STATUSES, QUALIFICATIONS,
  OCCUPATIONS, DENOMINATIONS, STATES, TAMIL_NADU_DISTRICTS,
  KERALA_DISTRICTS, STATE_DISTRICTS,
} from '../../constants/masterData'
import toast from 'react-hot-toast'

const AGE_OPTS = AGE_OPTIONS.map(String)

export default function EditPartnerPreference({ profile, onUpdate, profileId }) {
  const [form, setForm] = useState({
    preferredAgeFrom: profile?.preferredAgeFrom ? String(profile.preferredAgeFrom) : '',
    preferredAgeTo: profile?.preferredAgeTo ? String(profile.preferredAgeTo) : '',
    preferredHeightFrom: profile?.preferredHeightFrom || '',
    preferredHeightTo: profile?.preferredHeightTo || '',
    preferredMaritalStatus: profile?.preferredMaritalStatus || [],
    preferredEducation: profile?.preferredEducation || [],
    preferredOccupation: profile?.preferredOccupation || [],
    preferredDenomination: profile?.preferredDenomination || [],
    preferredState: profile?.preferredState || [],
    preferredDistrict: profile?.preferredDistrict || [],
  })
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)

  const set = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target ? e.target.value : e }))
  const setArr = (field) => (val) => setForm((f) => ({ ...f, [field]: val }))

  const validate = () => {
    const err = {}
    if (form.preferredAgeFrom && form.preferredAgeTo) {
      if (Number(form.preferredAgeFrom) > Number(form.preferredAgeTo)) {
        err.preferredAgeFrom = 'Age From must be ≤ Age To'
      }
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
        preferredAgeFrom: form.preferredAgeFrom ? Number(form.preferredAgeFrom) : null,
        preferredAgeTo: form.preferredAgeTo ? Number(form.preferredAgeTo) : null,
      }
      const res = await updateProfileSection('preference', payload, profileId)
      toast.success('Partner preferences saved!')
      onUpdate && onUpdate(res.data.profile)
      return true
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save')
      return false
    } finally {
      setSaving(false)
    }
  }

  // Build flat district list for multi-select
  const allDistricts = [...TAMIL_NADU_DISTRICTS, ...KERALA_DISTRICTS]

  return (
    <FormSection
      title="Partner Preference"
      icon={Target}
      onSave={handleSave}
      saving={saving}
      completionScore={profile?.completionBreakdown?.preference}
    >
      {({ editing }) => (
        <div className="edit-section-grid">
          <SelectField
            label="Preferred Age From"
            name="preferredAgeFrom"
            options={AGE_OPTS}
            value={form.preferredAgeFrom}
            onChange={set('preferredAgeFrom')}
            disabled={!editing}
            placeholder="Min age"
            error={errors.preferredAgeFrom}
          />
          <SelectField
            label="Preferred Age To"
            name="preferredAgeTo"
            options={AGE_OPTS}
            value={form.preferredAgeTo}
            onChange={set('preferredAgeTo')}
            disabled={!editing}
            placeholder="Max age"
          />
          <SelectField
            label="Preferred Height From"
            name="preferredHeightFrom"
            options={HEIGHTS}
            value={form.preferredHeightFrom}
            onChange={set('preferredHeightFrom')}
            disabled={!editing}
            placeholder="Min height"
          />
          <SelectField
            label="Preferred Height To"
            name="preferredHeightTo"
            options={HEIGHTS}
            value={form.preferredHeightTo}
            onChange={set('preferredHeightTo')}
            disabled={!editing}
            placeholder="Max height"
          />
          <MultiSelect
            label="Preferred Marital Status"
            name="preferredMaritalStatus"
            options={MARITAL_STATUSES}
            value={form.preferredMaritalStatus}
            onChange={setArr('preferredMaritalStatus')}
            disabled={!editing}
            placeholder="Any marital status"
          />
          <MultiSelect
            label="Preferred Denomination"
            name="preferredDenomination"
            options={DENOMINATIONS}
            value={form.preferredDenomination}
            onChange={setArr('preferredDenomination')}
            disabled={!editing}
            placeholder="Any denomination"
          />
          <MultiSelect
            label="Preferred Education"
            name="preferredEducation"
            options={QUALIFICATIONS}
            value={form.preferredEducation}
            onChange={setArr('preferredEducation')}
            disabled={!editing}
            placeholder="Any education"
          />
          <MultiSelect
            label="Preferred Occupation"
            name="preferredOccupation"
            options={OCCUPATIONS}
            value={form.preferredOccupation}
            onChange={setArr('preferredOccupation')}
            disabled={!editing}
            placeholder="Any occupation"
          />
          <MultiSelect
            label="Preferred State"
            name="preferredState"
            options={STATES}
            value={form.preferredState}
            onChange={setArr('preferredState')}
            disabled={!editing}
            placeholder="Any state"
          />
          <MultiSelect
            label="Preferred District"
            name="preferredDistrict"
            options={allDistricts}
            value={form.preferredDistrict}
            onChange={setArr('preferredDistrict')}
            disabled={!editing}
            placeholder="Any district"
          />
        </div>
      )}
    </FormSection>
  )
}
