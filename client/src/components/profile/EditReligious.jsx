import { useState } from 'react'
import { Church } from 'lucide-react'
import FormSection from '../form/FormSection'
import TextField from '../form/TextField'
import SelectField from '../form/SelectField'
import Textarea from '../form/Textarea'
import { updateProfileSection } from '../../services/profileService'
import { DENOMINATIONS, DIOCESES } from '../../constants/masterData'
import toast from 'react-hot-toast'

export default function EditReligious({ profile, onUpdate, profileId }) {
  const [form, setForm] = useState({
    religion: profile?.religion || 'Christian',
    denomination: profile?.denomination || '',
    diocese: profile?.diocese || '',
    church: profile?.church || '',
    churchAddress: profile?.churchAddress || '',
  })
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)

  const set = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target ? e.target.value : e }))

  const handleSave = async () => {
    if (!form.churchAddress?.trim()) {
      setErrors({ churchAddress: 'Church address is required' })
      toast.error('Please enter the church address')
      return false
    }
    setErrors({})
    setSaving(true)
    try {
      const res = await updateProfileSection('religious', form, profileId)
      toast.success('Religious information saved!')
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
      title="Religious Information"
      icon={Church}
      onSave={handleSave}
      saving={saving}
      completionScore={profile?.completionBreakdown?.religion}
    >
      {({ editing }) => (
        <div className="edit-section-grid">
          <TextField
            label="Religion"
            name="religion"
            value={form.religion}
            disabled
          />
          <SelectField
            label="Denomination"
            name="denomination"
            options={DENOMINATIONS}
            value={form.denomination}
            onChange={set('denomination')}
            disabled={!editing}
            placeholder="Select denomination"
          />
          <SelectField
            label="Diocese"
            name="diocese"
            options={DIOCESES}
            value={form.diocese}
            onChange={set('diocese')}
            disabled={!editing}
            placeholder="Select diocese"
          />
          <TextField
            label="Church Name"
            name="church"
            value={form.church}
            onChange={set('church')}
            disabled={!editing}
            placeholder="Your church name"
          />
          <div style={{ gridColumn: '1 / -1' }}>
            <Textarea
              label="Church Address"
              name="churchAddress"
              value={form.churchAddress}
              onChange={set('churchAddress')}
              disabled={!editing}
              required
              rows={3}
              placeholder="Full address of your church (Street, Area, City, Pin...)"
              error={errors.churchAddress}
            />
          </div>
        </div>
      )}
    </FormSection>
  )
}

