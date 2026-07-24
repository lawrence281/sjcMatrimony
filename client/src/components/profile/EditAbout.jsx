import { useState } from 'react'
import { FileText } from 'lucide-react'
import FormSection from '../form/FormSection'
import Textarea from '../form/Textarea'
import { updateProfileSection } from '../../services/profileService'
import toast from 'react-hot-toast'

export default function EditAbout({ profile, onUpdate, profileId }) {
  const [aboutMe, setAboutMe] = useState(profile?.aboutMe || '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const validate = () => {
    if (aboutMe.trim().length > 0 && aboutMe.trim().length < 20) {
      return 'Please write at least 20 characters, or leave it empty.'
    }
    return ''
  }

  const handleSave = async () => {
    const err = validate()
    if (err) { setError(err); return false }
    setError('')
    setSaving(true)
    try {
      const res = await updateProfileSection('about', { aboutMe }, profileId)
      toast.success('About Me saved!')
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
      title="About Me"
      icon={FileText}
      onSave={handleSave}
      saving={saving}
      completionScore={profile?.completionBreakdown?.about}
    >
      {({ editing }) => (
        <div>
          {!editing && aboutMe ? (
            <p className="about-me-display">{aboutMe}</p>
          ) : !editing ? (
            <p className="about-me-empty">
              Tell potential matches about yourself — your interests, values, and what makes you unique.
            </p>
          ) : null}
          {editing && (
            <Textarea
              name="aboutMe"
              value={aboutMe}
              onChange={(e) => { setAboutMe(e.target.value); setError('') }}
              placeholder="Write a few lines about yourself, your family background, hobbies, interests, and what you are looking for in a life partner…"
              rows={6}
              maxLength={2000}
              error={error}
            />
          )}
        </div>
      )}
    </FormSection>
  )
}
