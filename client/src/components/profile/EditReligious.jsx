import { useState } from 'react'
import { Church } from 'lucide-react'
import FormSection from '../form/FormSection'
import TextField from '../form/TextField'
import SelectField from '../form/SelectField'
import { updateProfileSection } from '../../services/profileService'
import { DENOMINATIONS, DIOCESES } from '../../constants/masterData'
import toast from 'react-hot-toast'

export default function EditReligious({ profile, onUpdate, profileId }) {
  const [form, setForm] = useState({
    religion: profile?.religion || 'Christian',
    denomination: profile?.denomination || '',
    diocese: profile?.diocese || '',
    parish: profile?.parish || '',
    church: profile?.church || '',
    baptismName: profile?.baptismName || '',
    confirmationName: profile?.confirmationName || '',
  })
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)

  const set = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target ? e.target.value : e }))

  const handleSave = async () => {
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
            label="Parish"
            name="parish"
            value={form.parish}
            onChange={set('parish')}
            disabled={!editing}
            placeholder="Your parish name"
          />
          <TextField
            label="Church"
            name="church"
            value={form.church}
            onChange={set('church')}
            disabled={!editing}
            placeholder="Your church name"
          />
          <TextField
            label="Baptism Name"
            name="baptismName"
            value={form.baptismName}
            onChange={set('baptismName')}
            disabled={!editing}
            placeholder="Saint's name at Baptism"
          />
          <TextField
            label="Confirmation Name"
            name="confirmationName"
            value={form.confirmationName}
            onChange={set('confirmationName')}
            disabled={!editing}
            placeholder="Saint's name at Confirmation"
          />
        </div>
      )}
    </FormSection>
  )
}
