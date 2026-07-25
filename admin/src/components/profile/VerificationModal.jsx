import { useState } from 'react'
import { CheckCircle, XCircle, AlertTriangle, ShieldCheck, Lock, X } from 'lucide-react'

export default function VerificationModal({ isOpen, onClose, onConfirm, actionType, profileName }) {
  const [remarks, setRemarks] = useState('')
  const [loading, setLoading] = useState(false)

  if (!isOpen) return null

  const getActionDetails = () => {
    switch (actionType) {
      case 'approve':
        return {
          title: 'Approve & Verify Profile',
          subtitle: `Are you sure you want to approve and verify ${profileName || 'this profile'}? It will become active and visible in matches.`,
          icon: CheckCircle,
          iconColor: 'var(--success)',
          btnClass: 'btn-primary',
          btnText: 'Approve & Verify',
        }
      case 'reject':
        return {
          title: 'Reject Profile',
          subtitle: `Are you sure you want to reject ${profileName || 'this profile'}? The user will be notified of rejection.`,
          icon: XCircle,
          iconColor: 'var(--danger)',
          btnClass: 'btn-danger',
          btnText: 'Reject Profile',
        }
      case 'pending':
        return {
          title: 'Mark as Pending',
          subtitle: `Set ${profileName || 'this profile'} status back to Pending review.`,
          icon: AlertTriangle,
          iconColor: 'var(--warning)',
          btnClass: 'btn-outline',
          btnText: 'Mark Pending',
        }
      case 'block':
        return {
          title: 'Block User Account',
          subtitle: `Blocking will immediately suspend ${profileName || 'this user'} from logging in or receiving matches.`,
          icon: Lock,
          iconColor: 'var(--danger)',
          btnClass: 'btn-danger',
          btnText: 'Block Account',
        }
      case 'unblock':
        return {
          title: 'Unblock User Account',
          subtitle: `Unblock ${profileName || 'this user'} and restore active account access.`,
          icon: ShieldCheck,
          iconColor: 'var(--success)',
          btnClass: 'btn-primary',
          btnText: 'Unblock Account',
        }
      default:
        return {
          title: 'Update Profile Status',
          subtitle: `Confirm action for ${profileName || 'this profile'}.`,
          icon: ShieldCheck,
          iconColor: 'var(--accent)',
          btnClass: 'btn-primary',
          btnText: 'Confirm',
        }
    }
  }

  const details = getActionDetails()
  const IconComponent = details.icon

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await onConfirm(actionType, remarks)
      setRemarks('')
      onClose()
    } catch (err) {
      // handled by parent
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.7)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: 16
    }}>
      <div className="card fade-in" style={{ width: '100%', maxWidth: 480, padding: 24, position: 'relative' }}>
        <button 
          onClick={onClose} 
          style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
        >
          <X size={18} />
        </button>

        <div style={{ display: 'flex', gap: 14, marginBottom: 16 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 10,
            background: 'var(--bg-primary)', display: 'grid', placeItems: 'center', flexShrink: 0
          }}>
            <IconComponent size={24} color={details.iconColor} />
          </div>
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>{details.title}</h3>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4, lineHeight: 1.5 }}>{details.subtitle}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginTop: 16 }}>
            <label className="form-label">Verification Remarks / Admin Notes</label>
            <textarea
              className="form-textarea"
              rows={3}
              placeholder="Add optional notes (e.g. Document verified, ID proof checked)..."
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 20 }}>
            <button type="button" className="btn btn-outline" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className={`btn ${details.btnClass}`} disabled={loading}>
              {loading ? 'Processing...' : details.btnText}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
