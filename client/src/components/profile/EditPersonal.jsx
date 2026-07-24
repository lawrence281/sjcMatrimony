import { useState } from 'react'
import { Heart } from 'lucide-react'
import FormSection from '../form/FormSection'
import SelectField from '../form/SelectField'
import MultiSelect from '../form/MultiSelect'
import { updateProfileSection } from '../../services/profileService'
import {
  MARITAL_STATUSES, MOTHER_TONGUES, LANGUAGES, HEIGHTS, WEIGHT_OPTIONS,
  COMPLEXIONS, BODY_TYPES, BLOOD_GROUPS, PHYSICAL_STATUSES,
  DIETS, SMOKING_OPTIONS, DRINKING_OPTIONS,
} from '../../constants/masterData'
import toast from 'react-hot-toast'

export default function EditPersonal({ profile, onUpdate, profileId }) {
  const [form, setForm] = useState({
    maritalStatus: profile?.maritalStatus || '',
    motherTongue: profile?.motherTongue || '',
    languagesKnown: profile?.languagesKnown || [],
    height: profile?.height || '',
    weight: profile?.weight || '',
    complexion: profile?.complexion || '',
    bodyType: profile?.bodyType || '',
    bloodGroup: profile?.bloodGroup || '',
    physicalStatus: profile?.physicalStatus || '',
    diet: profile?.diet || '',
    smoking: profile?.smoking || '',
    drinking: profile?.drinking || '',
  })
  const [saving, setSaving] = useState(false)

  const set = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target ? e.target.value : e }))

  const setDirect = (field) => (val) =>
    setForm((f) => ({ ...f, [field]: val }))

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await updateProfileSection('personal', form, profileId)
      toast.success('Personal information saved!')
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
      title="Personal Information"
      icon={Heart}
      onSave={handleSave}
      saving={saving}
    >
      {({ editing }) => (
        <div className="edit-section-grid">
          <SelectField
            label="Marital Status"
            name="maritalStatus"
            options={MARITAL_STATUSES}
            value={form.maritalStatus}
            onChange={set('maritalStatus')}
            disabled={!editing}
          />
          <SelectField
            label="Mother Tongue"
            name="motherTongue"
            options={MOTHER_TONGUES}
            value={form.motherTongue}
            onChange={set('motherTongue')}
            disabled={!editing}
          />
          <MultiSelect
            label="Languages Known"
            name="languagesKnown"
            options={LANGUAGES}
            value={form.languagesKnown}
            onChange={setDirect('languagesKnown')}
            disabled={!editing}
            placeholder="Select languages…"
          />
          <SelectField
            label="Height"
            name="height"
            options={HEIGHTS}
            value={form.height}
            onChange={set('height')}
            disabled={!editing}
          />
          <SelectField
            label="Weight"
            name="weight"
            options={WEIGHT_OPTIONS}
            value={form.weight}
            onChange={set('weight')}
            disabled={!editing}
          />
          <SelectField
            label="Complexion"
            name="complexion"
            options={COMPLEXIONS}
            value={form.complexion}
            onChange={set('complexion')}
            disabled={!editing}
          />
          <SelectField
            label="Body Type"
            name="bodyType"
            options={BODY_TYPES}
            value={form.bodyType}
            onChange={set('bodyType')}
            disabled={!editing}
          />
          <SelectField
            label="Blood Group"
            name="bloodGroup"
            options={BLOOD_GROUPS}
            value={form.bloodGroup}
            onChange={set('bloodGroup')}
            disabled={!editing}
          />
          <SelectField
            label="Physical Status"
            name="physicalStatus"
            options={PHYSICAL_STATUSES}
            value={form.physicalStatus}
            onChange={set('physicalStatus')}
            disabled={!editing}
          />
          <SelectField
            label="Diet"
            name="diet"
            options={DIETS}
            value={form.diet}
            onChange={set('diet')}
            disabled={!editing}
          />
          <SelectField
            label="Smoking"
            name="smoking"
            options={SMOKING_OPTIONS}
            value={form.smoking}
            onChange={set('smoking')}
            disabled={!editing}
          />
          <SelectField
            label="Drinking"
            name="drinking"
            options={DRINKING_OPTIONS}
            value={form.drinking}
            onChange={set('drinking')}
            disabled={!editing}
          />
        </div>
      )}
    </FormSection>
  )
}
