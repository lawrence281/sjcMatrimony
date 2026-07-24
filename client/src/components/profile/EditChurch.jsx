import { useState } from 'react'
import { Church } from 'lucide-react'
import FormSection from '../form/FormSection'
import TextField from '../form/TextField'
import SelectField from '../form/SelectField'
import { updateProfileSection } from '../../services/profileService'
import { CHURCH_MINISTRIES } from '../../constants/masterData'
import toast from 'react-hot-toast'

function BoolToggle({ label, name, value, onChange, disabled }) {
  return (
    <div className="form-field">
      <span className="form-label">{label}</span>
      <div className="bool-toggle-group">
        {['Yes', 'No'].map((opt) => (
          <button
            key={opt}
            type="button"
            className={`bool-toggle-btn ${value === (opt === 'Yes') ? 'active' : ''} ${disabled ? 'disabled' : ''}`}
            onClick={() => !disabled && onChange(opt === 'Yes')}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  )
}

export default function EditChurch({ profile, onUpdate, profileId }) {
  const [form, setForm] = useState({
    baptized: profile?.baptized ?? false,
    confirmed: profile?.confirmed ?? false,
    firstHolyCommunion: profile?.firstHolyCommunion ?? false,
    activeInChurch: profile?.activeInChurch ?? false,
    churchMinistry: profile?.churchMinistry || '',
  })
  const [saving, setSaving] = useState(false)

  const setBool = (field) => (val) => setForm((f) => ({ ...f, [field]: val }))
  const set = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target ? e.target.value : e }))

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await updateProfileSection('church', form, profileId)
      toast.success('Church information saved!')
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
      title="Church Information"
      icon={Church}
      onSave={handleSave}
      saving={saving}
    >
      {({ editing }) => (
        <div className="edit-section-grid">
          <BoolToggle
            label="Baptized"
            name="baptized"
            value={form.baptized}
            onChange={setBool('baptized')}
            disabled={!editing}
          />
          <BoolToggle
            label="Confirmed"
            name="confirmed"
            value={form.confirmed}
            onChange={setBool('confirmed')}
            disabled={!editing}
          />
          <BoolToggle
            label="First Holy Communion"
            name="firstHolyCommunion"
            value={form.firstHolyCommunion}
            onChange={setBool('firstHolyCommunion')}
            disabled={!editing}
          />
          <BoolToggle
            label="Active in Church"
            name="activeInChurch"
            value={form.activeInChurch}
            onChange={setBool('activeInChurch')}
            disabled={!editing}
          />
          <SelectField
            label="Church Ministry"
            name="churchMinistry"
            options={CHURCH_MINISTRIES}
            value={form.churchMinistry}
            onChange={set('churchMinistry')}
            disabled={!editing}
            placeholder="Select ministry"
            className="col-span-2"
          />
        </div>
      )}
    </FormSection>
  )
}
