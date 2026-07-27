import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Phone, Mail, MapPin, Church, Briefcase, ShieldCheck, CheckCircle2,
  Clock, ArrowRight, UserCheck, Search, Loader2, Sparkles, Building2, Copy, Check
} from 'lucide-react'
import api from '../services/api'
import toast from 'react-hot-toast'

export default function ApprovedContactRequests() {
  const navigate = useNavigate()
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [copiedId, setCopiedId] = useState(null)

  useEffect(() => {
    fetchApprovedRequests()
  }, [])

  const fetchApprovedRequests = async () => {
    setLoading(true)
    try {
      const res = await api.get('/contact-requests/my-requests?status=Approved')
      if (res.data && res.data.success) {
        setRequests(res.data.requests || [])
      }
    } catch (err) {
      console.error('Failed to load approved contact requests:', err)
      toast.error('Failed to load approved contact requests')
    } finally {
      setLoading(false)
    }
  }

  const handleCopyText = (text, label, id) => {
    if (!text || text === 'Not provided') return
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    toast.success(`${label} copied to clipboard!`)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <div style={{ background: '#FAF8F5', minHeight: '100vh', padding: '40px 24px 80px 24px', fontFamily: "'Inter', sans-serif" }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        
        {/* Page Header */}
        <div style={{ marginBottom: '36px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: '#ECFDF5',
            border: '1px solid #A7F3D0',
            padding: '6px 16px',
            borderRadius: '20px',
            fontSize: '12.5px',
            fontWeight: 600,
            color: '#047857',
            marginBottom: '14px'
          }}>
            <ShieldCheck size={15} />
            <span>Admin Verified Contact Sharing</span>
          </div>

          <h1 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '38px',
            fontWeight: 700,
            color: '#1B2535',
            margin: '0 0 8px 0',
            lineHeight: 1.15
          }}>
            My Approved Contact Requests
          </h1>

          <p style={{ fontSize: '15px', color: '#667085', margin: 0, maxWidth: '680px', lineHeight: 1.6 }}>
            Here are the members whose private contact details have been reviewed and approved for you by the SJC Matrimony administrative team.
          </p>
        </div>

        {/* Loading State */}
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(480px, 1fr))', gap: '24px' }}>
            {[1, 2].map(n => (
              <div key={n} style={{ background: '#FFFFFF', border: '1px solid #EFEBE4', borderRadius: '20px', padding: '28px', height: '320px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Loader2 size={32} color="#B88E4C" className="animate-spin" />
              </div>
            ))}
          </div>
        ) : requests.length === 0 ? (
          /* Empty State */
          <div style={{
            background: '#FFFFFF',
            border: '1px solid #EFEBE4',
            borderRadius: '24px',
            padding: '60px 24px',
            textAlign: 'center',
            boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: '#F3F0E9',
              display: 'grid',
              placeItems: 'center',
              margin: '0 auto 20px auto',
              color: '#8A92A0'
            }}>
              <Phone size={28} />
            </div>

            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '26px', fontWeight: 700, color: '#1B2535', margin: '0 0 10px 0' }}>
              No Approved Contact Requests Yet
            </h3>

            <p style={{ fontSize: '14px', color: '#667085', maxWidth: '480px', margin: '0 auto 28px auto', lineHeight: 1.6 }}>
              You haven't been granted access to any member contact details yet. Browse member profiles and click "Request Contact Details" to submit a request for admin approval.
            </p>

            <Link
              to="/browse"
              style={{
                background: 'linear-gradient(135deg, #1A273D 0%, #2A3B56 100%)',
                color: '#FFFFFF',
                padding: '12px 28px',
                borderRadius: '30px',
                fontSize: '14px',
                fontWeight: 600,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 16px rgba(26, 39, 61, 0.2)'
              }}
            >
              <span>Browse Eligible Profiles</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          /* Approved Contact Cards Grid */
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(480px, 1fr))', gap: '24px' }}>
            {requests.map(reqItem => {
              const profile = reqItem.requestedProfile || {}
              const profileName = [profile.firstName, profile.lastName].filter(Boolean).join(' ') || 'Member Profile'

              return (
                <div
                  key={reqItem._id}
                  style={{
                    background: '#FFFFFF',
                    border: '1px solid #EFEBE4',
                    borderRadius: '24px',
                    padding: '28px',
                    boxShadow: '0 6px 24px rgba(27, 37, 53, 0.04)',
                    display: 'flex',
                    flexDirection: 'column',
                    justify: 'space-between',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  {/* Top Badge */}
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    background: 'linear-gradient(135deg, #059669 0%, #10B981 100%)',
                    color: '#FFFFFF',
                    fontSize: '11px',
                    fontWeight: 700,
                    padding: '4px 16px 4px 16px',
                    borderBottomLeftRadius: '14px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <CheckCircle2 size={12} />
                    <span>Approved Access</span>
                  </div>

                  <div>
                    {/* Header: Photo & Name */}
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '24px' }}>
                      <img 
                        src={profile.profileImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'} 
                        alt={profileName}
                        style={{
                          width: '76px',
                          height: '76px',
                          borderRadius: '50%',
                          objectFit: 'cover',
                          border: '2px solid #C59B4E',
                          boxShadow: '0 4px 12px rgba(197, 155, 78, 0.2)'
                        }}
                      />

                      <div>
                        <h2 style={{
                          fontFamily: "'Cormorant Garamond', serif",
                          fontSize: '26px',
                          fontWeight: 700,
                          color: '#1B2535',
                          margin: '0 0 4px 0',
                          lineHeight: 1.15
                        }}>
                          {profileName}
                        </h2>

                        <p style={{ fontSize: '13px', color: '#667085', margin: '0 0 6px 0' }}>
                          {[profile.denomination, profile.diocese].filter(Boolean).join(' • ') || 'RC Christian Member'}
                        </p>

                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                          {profile.occupation && (
                            <span style={{ background: '#FAF8F5', border: '1px solid #EAE5DC', padding: '2px 10px', borderRadius: '12px', fontSize: '11.5px', fontWeight: 600, color: '#1B2535' }}>
                              {profile.occupation}
                            </span>
                          )}
                          {profile.workLocation && (
                            <span style={{ background: '#FAF8F5', border: '1px solid #EAE5DC', padding: '2px 10px', borderRadius: '12px', fontSize: '11.5px', fontWeight: 600, color: '#667085' }}>
                              📍 {profile.workLocation}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Contact Details List */}
                    <div style={{
                      background: '#FAF8F5',
                      border: '1px solid #EAE5DC',
                      borderRadius: '16px',
                      padding: '20px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '14px',
                      marginBottom: '20px'
                    }}>
                      
                      {/* Mobile Number */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#1A273D', display: 'grid', placeItems: 'center', color: '#FFFFFF' }}>
                            <Phone size={15} />
                          </div>
                          <div>
                            <span style={{ fontSize: '11px', color: '#8A92A0', display: 'block', textTransform: 'uppercase', fontWeight: 700 }}>Mobile Number</span>
                            <a href={`tel:${profile.mobileNumber}`} style={{ fontSize: '14px', fontWeight: 700, color: '#1B2535', textDecoration: 'none' }}>
                              {profile.mobileNumber || 'Not provided'}
                            </a>
                          </div>
                        </div>

                        {profile.mobileNumber && (
                          <button 
                            onClick={() => handleCopyText(profile.mobileNumber, 'Mobile number', `phone-${reqItem._id}`)}
                            style={{ background: '#FFFFFF', border: '1px solid #EAE5DC', borderRadius: '8px', padding: '6px 10px', fontSize: '12px', color: '#1B2535', fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                          >
                            {copiedId === `phone-${reqItem._id}` ? <Check size={13} color="#059669" /> : <Copy size={13} />}
                            <span>{copiedId === `phone-${reqItem._id}` ? 'Copied' : 'Copy'}</span>
                          </button>
                        )}
                      </div>

                      {/* Email Address */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#C59B4E', display: 'grid', placeItems: 'center', color: '#FFFFFF' }}>
                            <Mail size={15} />
                          </div>
                          <div>
                            <span style={{ fontSize: '11px', color: '#8A92A0', display: 'block', textTransform: 'uppercase', fontWeight: 700 }}>Email Address</span>
                            <a href={`mailto:${profile.email}`} style={{ fontSize: '14px', fontWeight: 600, color: '#1B2535', textDecoration: 'none' }}>
                              {profile.email || 'Not provided'}
                            </a>
                          </div>
                        </div>

                        {profile.email && (
                          <button 
                            onClick={() => handleCopyText(profile.email, 'Email address', `email-${reqItem._id}`)}
                            style={{ background: '#FFFFFF', border: '1px solid #EAE5DC', borderRadius: '8px', padding: '6px 10px', fontSize: '12px', color: '#1B2535', fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                          >
                            {copiedId === `email-${reqItem._id}` ? <Check size={13} color="#059669" /> : <Copy size={13} />}
                            <span>{copiedId === `email-${reqItem._id}` ? 'Copied' : 'Copy'}</span>
                          </button>
                        )}
                      </div>

                      {/* Residential Address */}
                      {profile.address && (
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', paddingTop: '10px', borderTop: '1px border-dashed #EAE5DC' }}>
                          <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#F3F0E9', display: 'grid', placeItems: 'center', color: '#1B2535', flexShrink: 0 }}>
                            <MapPin size={15} />
                          </div>
                          <div>
                            <span style={{ fontSize: '11px', color: '#8A92A0', display: 'block', textTransform: 'uppercase', fontWeight: 700 }}>Residential Address</span>
                            <span style={{ fontSize: '13px', fontWeight: 500, color: '#1B2535', lineHeight: 1.5 }}>
                              {profile.address}
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Church Address */}
                      {profile.churchAddress && (
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', paddingTop: '10px', borderTop: '1px border-dashed #EAE5DC' }}>
                          <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#F3F0E9', display: 'grid', placeItems: 'center', color: '#B88E4C', flexShrink: 0 }}>
                            <Church size={15} />
                          </div>
                          <div>
                            <span style={{ fontSize: '11px', color: '#8A92A0', display: 'block', textTransform: 'uppercase', fontWeight: 700 }}>Parish / Church Address</span>
                            <span style={{ fontSize: '13px', fontWeight: 500, color: '#1B2535', lineHeight: 1.5 }}>
                              {profile.churchAddress}
                            </span>
                          </div>
                        </div>
                      )}

                    </div>
                  </div>

                  {/* Card Bottom Footer */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid #F3F0E9' }}>
                    <span style={{ fontSize: '12px', color: '#8A92A0' }}>
                      Approved on: {new Date(reqItem.approvalDate || reqItem.updatedAt).toLocaleDateString()}
                    </span>

                    <button 
                      onClick={() => navigate(`/members/${profile._id}`)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#B88E4C',
                        fontSize: '13px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <span>Full Profile</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}

      </div>
    </div>
  )
}
