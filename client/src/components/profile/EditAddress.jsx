import { useState } from 'react'
import { MapPin } from 'lucide-react'
import FormSection from '../form/FormSection'
import TextField from '../form/TextField'
import SelectField from '../form/SelectField'
import Textarea from '../form/Textarea'
import { updateProfileSection } from '../../services/profileService'
import { COUNTRIES, STATES, STATE_DISTRICTS, TAMIL_NADU_DISTRICTS } from '../../constants/masterData'
import toast from 'react-hot-toast'

export default function EditAddress({ profile, onUpdate, profileId }) {
  const [form, setForm] = useState({
    country: profile?.country || 'India',
    state: profile?.state || '',
    district: profile?.district || '',
    city: profile?.city || '',
    nativePlace: profile?.nativePlace || '',
    address: profile?.address || '',
    pincode: profile?.pincode || '',
  })
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState({})

  const set = (field) => (e) => {
    const val = e.target ? e.target.value : e
    setForm((f) => {
      const next = { ...f, [field]: val }
      // Reset district when state changes
      if (field === 'state') next.district = ''
      return next
    })
  }

  const validate = () => {
    const err = {}
    if (form.pincode && !/^[0-9]{4,10}$/.test(form.pincode)) {
      err.pincode = 'Pincode must be 4–10 digits'
    }
    return err
  }

  const handleSave = async () => {
    const err = validate()
    if (Object.keys(err).length > 0) { setErrors(err); return false }

    setSaving(true)
    try {
      const res = await updateProfileSection('address', form, profileId)
      toast.success('Address saved!')
      onUpdate && onUpdate(res.data.profile)
      return true
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save')
      return false
    } finally {
      setSaving(false)
    }
  }

  const availableDistricts = STATE_DISTRICTS[form.state] || []

  return (
    <FormSection
      title="Address"
      icon={MapPin}
      onSave={handleSave}
      saving={saving}
      completionScore={profile?.completionBreakdown?.address}
    >
      {({ editing }) => (
        <div className="edit-section-grid">
          <SelectField
            label="Country"
            name="country"
            options={COUNTRIES}
            value={form.country}
            onChange={set('country')}
            disabled={!editing}
          />
          <SelectField
            label="State"
            name="state"
            options={STATES}
            value={form.state}
            onChange={set('state')}
            disabled={!editing}
            placeholder="Select state"
          />
          {availableDistricts.length > 0 ? (
            <SelectField
              label="District"
              name="district"
              options={availableDistricts}
              value={form.district}
              onChange={set('district')}
              disabled={!editing}
              placeholder="Select district"
            />
          ) : (
            <TextField
              label="District"
              name="district"
              value={form.district}
              onChange={set('district')}
              disabled={!editing}
              placeholder="Enter district"
            />
          )}
          <TextField
            label="City"
            name="city"
            value={form.city}
            onChange={set('city')}
            disabled={!editing}
            placeholder="City / Town"
          />
          <TextField
            label="Native Place"
            name="nativePlace"
            value={form.nativePlace}
            onChange={set('nativePlace')}
            disabled={!editing}
            placeholder="Native place / village"
          />
          <TextField
            label="Pincode"
            name="pincode"
            value={form.pincode}
            onChange={set('pincode')}
            disabled={!editing}
            placeholder="6-digit pincode"
            error={errors.pincode}
          />
          <Textarea
            label="Full Address"
            name="address"
            value={form.address}
            onChange={set('address')}
            disabled={!editing}
            placeholder="House no., street, area…"
            rows={3}
            maxLength={300}
            className="col-span-2"
          />
        </div>
      )}
    </FormSection>
  )
}
