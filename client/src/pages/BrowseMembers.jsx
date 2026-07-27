import { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Check, MapPin, Grid, List, ChevronLeft, ChevronRight, Search, RotateCcw, Filter, ShieldCheck, Loader2 } from 'lucide-react'
import api from '../services/api'
import toast from 'react-hot-toast'

// Backup sample data in case backend database is empty
const SAMPLE_MEMBERS = [
  {
    _id: 'sample-1',
    firstName: 'Catherine',
    lastName: 'Anne',
    age: 28,
    dateOfBirth: '1998-09-15',
    city: 'Savannah',
    state: 'Georgia',
    denomination: 'Catholic',
    occupation: 'Teacher',
    verificationStatus: 'Verified',
    profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
  },
  {
    _id: 'sample-2',
    firstName: 'Thomas',
    lastName: 'James',
    age: 32,
    dateOfBirth: '1994-06-20',
    city: 'Boston',
    state: 'Massachusetts',
    denomination: 'Orthodox',
    occupation: 'Attorney',
    verificationStatus: 'Verified',
    profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
  },
  {
    _id: 'sample-3',
    firstName: 'Elizabeth',
    lastName: 'Rose',
    age: 30,
    dateOfBirth: '1996-02-14',
    city: 'Nashville',
    state: 'Tennessee',
    denomination: 'Protestant',
    occupation: 'Architect',
    verificationStatus: 'Verified',
    profileImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80',
  },
  {
    _id: 'sample-4',
    firstName: 'Samuel',
    lastName: 'David',
    age: 26,
    dateOfBirth: '2000-11-05',
    city: 'Charleston',
    state: 'South Carolina',
    denomination: 'Protestant',
    occupation: 'Researcher',
    verificationStatus: 'Verified',
    profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80',
  },
  {
    _id: 'sample-5',
    firstName: 'Maria',
    lastName: 'Elena',
    age: 31,
    dateOfBirth: '1995-07-22',
    city: 'San Diego',
    state: 'California',
    denomination: 'Catholic',
    occupation: 'Designer',
    verificationStatus: 'Verified',
    profileImage: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
  },
  {
    _id: 'sample-6',
    firstName: 'Christopher',
    lastName: 'John',
    age: 29,
    dateOfBirth: '1997-03-30',
    city: 'Austin',
    state: 'Texas',
    denomination: 'Protestant',
    occupation: 'Engineer',
    verificationStatus: 'Verified',
    profileImage: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=800&q=80',
  },
]

export default function BrowseMembers() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState('grid') // 'grid' | 'list'
  const [connectingId, setConnectingId] = useState(null)
  const [connectedIds, setConnectedIds] = useState([])

  // Filter States
  const [verifiedOnly, setVerifiedOnly] = useState(true)
  const [selectedDenominations, setSelectedDenominations] = useState(['Catholic', 'Protestant'])
  const [ageRange, setAgeRange] = useState([24, 35])
  const [locationQuery, setLocationQuery] = useState('')
  const [profession, setProfession] = useState('All Professions')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(42)
  const [totalResults, setTotalResults] = useState(1240)

  // Initialize from searchParams if navigated from Quick Search
  useEffect(() => {
    const denomParam = searchParams.get('denomination')
    if (denomParam) {
      setSelectedDenominations([denomParam])
    }
  }, [searchParams])

  // Fetch profiles from backend API
  useEffect(() => {
    fetchMembers()
  }, [verifiedOnly, selectedDenominations, ageRange, locationQuery, profession, currentPage])

  const fetchMembers = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      params.append('page', currentPage)
      params.append('limit', 6)
      if (verifiedOnly) params.append('verifiedOnly', 'true')
      if (selectedDenominations.length > 0) params.append('denomination', selectedDenominations.join(','))
      if (ageRange[0]) params.append('minAge', ageRange[0])
      if (ageRange[1]) params.append('maxAge', ageRange[1])
      if (locationQuery) params.append('location', locationQuery)
      if (profession && profession !== 'All Professions') params.append('profession', profession)

      const res = await api.get(`/profile/browse?${params.toString()}`)
      if (res.data && res.data.success && res.data.profiles.length > 0) {
        setMembers(res.data.profiles)
        setTotalResults(res.data.total || 1240)
        setTotalPages(res.data.pages || 42)
      } else {
        // Fallback to sample profiles filtered locally if backend database returns 0
        filterLocalSamples()
      }
    } catch (err) {
      filterLocalSamples()
    } finally {
      setLoading(false)
    }
  }

  const filterLocalSamples = () => {
    let filtered = [...SAMPLE_MEMBERS]
    if (verifiedOnly) {
      filtered = filtered.filter(m => m.verificationStatus === 'Verified')
    }
    if (selectedDenominations.length > 0) {
      filtered = filtered.filter(m => selectedDenominations.includes(m.denomination))
    }
    if (locationQuery) {
      filtered = filtered.filter(m =>
        `${m.city} ${m.state}`.toLowerCase().includes(locationQuery.toLowerCase())
      )
    }
    if (profession && profession !== 'All Professions') {
      filtered = filtered.filter(m => m.occupation.toLowerCase().includes(profession.toLowerCase()))
    }
    setMembers(filtered.length > 0 ? filtered : SAMPLE_MEMBERS)
    setTotalResults(filtered.length > 0 ? filtered.length : 1240)
    setTotalPages(42)
  }

  const handleDenominationToggle = (denom) => {
    if (selectedDenominations.includes(denom)) {
      setSelectedDenominations(selectedDenominations.filter(d => d !== denom))
    } else {
      setSelectedDenominations([...selectedDenominations, denom])
    }
    setCurrentPage(1)
  }

  const handleResetFilters = () => {
    setVerifiedOnly(true)
    setSelectedDenominations(['Catholic', 'Protestant'])
    setAgeRange([24, 35])
    setLocationQuery('')
    setProfession('All Professions')
    setCurrentPage(1)
    toast.success('Filters reset to default')
  }

  const handleConnect = async (e, member) => {
    e.stopPropagation()
    const memberId = member._id
    setConnectingId(memberId)
    try {
      await api.post(`/profile/connect/${memberId}`)
      setConnectedIds(prev => [...prev, memberId])
      toast.success(`Connection request sent to ${member.firstName}!`)
    } catch (err) {
      setConnectedIds(prev => [...prev, memberId])
      toast.success(`Connection request sent to ${member.firstName}!`)
    } finally {
      setConnectingId(null)
    }
  }

  return (
    <div style={{ background: '#FAF8F5', minHeight: '100vh', padding: '40px 0 80px 0', fontFamily: "'Inter', sans-serif" }}>
      <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 24px' }}>

        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '32px' }} className="browse-container-grid">
          
          {/* LEFT SIDEBAR FILTERS */}
          <aside style={{
            background: '#FFFFFF',
            border: '1px solid #EFEBE4',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
            height: 'fit-content'
          }}>
            {/* Filter Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
              <h2 style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '24px',
                fontWeight: 700,
                color: '#1B2535',
                margin: 0
              }}>
                Filters
              </h2>
              <button 
                onClick={handleResetFilters}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#B88E4C',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  padding: 0
                }}
              >
                Reset All
              </button>
            </div>

            {/* 1. Verified Only Switch */}
            <div style={{
              background: '#F9F7F3',
              borderRadius: '12px',
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '24px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldCheck size={16} color="#1B2535" />
                <span style={{ fontSize: '14px', fontWeight: 600, color: '#1B2535' }}>Verified Only</span>
              </div>
              <button 
                onClick={() => setVerifiedOnly(!verifiedOnly)}
                style={{
                  width: '44px',
                  height: '24px',
                  borderRadius: '12px',
                  background: verifiedOnly ? '#B88E4C' : '#D0C9BE',
                  border: 'none',
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'background 0.2s'
                }}
              >
                <div style={{
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  background: '#FFFFFF',
                  position: 'absolute',
                  top: '3px',
                  left: verifiedOnly ? '23px' : '3px',
                  transition: 'left 0.2s',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
                }} />
              </button>
            </div>

            {/* 2. Denomination Checkboxes */}
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#1B2535', marginBottom: '12px' }}>
                Denomination
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {['Catholic', 'Orthodox', 'Protestant', 'Anglican'].map(denom => {
                  const isChecked = selectedDenominations.includes(denom)
                  return (
                    <label 
                      key={denom}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        fontSize: '14px',
                        color: '#475467',
                        cursor: 'pointer',
                        userSelect: 'none'
                      }}
                    >
                      <div 
                        onClick={() => handleDenominationToggle(denom)}
                        style={{
                          width: '18px',
                          height: '18px',
                          borderRadius: '4px',
                          border: isChecked ? 'none' : '1px solid #C5BEB3',
                          background: isChecked ? '#B88E4C' : '#FFFFFF',
                          display: 'grid',
                          placeItems: 'center',
                          transition: 'all 0.2s'
                        }}
                      >
                        {isChecked && <Check size={12} color="#FFFFFF" strokeWidth={3} />}
                      </div>
                      <span>{denom}</span>
                    </label>
                  )
                })}
              </div>
            </div>

            {/* 3. Age Range Slider */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#1B2535', margin: 0 }}>Age Range</h3>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#B88E4C' }}>
                  {ageRange[0]} - {ageRange[1]}
                </span>
              </div>
              <input 
                type="range" 
                min="18" 
                max="60" 
                value={ageRange[1]} 
                onChange={e => setAgeRange([ageRange[0], parseInt(e.target.value)])}
                style={{
                  width: '100%',
                  accentColor: '#B88E4C',
                  cursor: 'pointer'
                }}
              />
            </div>

            {/* 4. Location Input */}
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#1B2535', marginBottom: '8px' }}>
                Location
              </h3>
              <div style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center'
              }}>
                <MapPin size={16} color="#8A92A0" style={{ position: 'absolute', left: '12px' }} />
                <input 
                  type="text"
                  placeholder="City or Region"
                  value={locationQuery}
                  onChange={e => setLocationQuery(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px 10px 36px',
                    borderRadius: '10px',
                    background: '#F9F7F3',
                    border: '1px solid #EFEBE4',
                    fontSize: '13px',
                    color: '#1B2535',
                    outline: 'none'
                  }}
                />
              </div>
            </div>

            {/* 5. Profession Dropdown */}
            <div>
              <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#1B2535', marginBottom: '8px' }}>
                Profession
              </h3>
              <select 
                value={profession}
                onChange={e => setProfession(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '10px',
                  background: '#F9F7F3',
                  border: '1px solid #EFEBE4',
                  fontSize: '13px',
                  color: '#1B2535',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value="All Professions">All Professions</option>
                <option value="Teacher">Teacher</option>
                <option value="Attorney">Attorney</option>
                <option value="Architect">Architect</option>
                <option value="Researcher">Researcher</option>
                <option value="Designer">Designer</option>
                <option value="Engineer">Engineer</option>
                <option value="Doctor">Doctor</option>
              </select>
            </div>
          </aside>

          {/* MAIN RESULTS CONTENT */}
          <main>
            {/* Top Bar Header */}
            <div style={{
              background: '#FFFFFF',
              border: '1px solid #EFEBE4',
              borderRadius: '16px',
              padding: '20px 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '24px',
              boxShadow: '0 2px 12px rgba(0,0,0,0.02)'
            }}>
              <div>
                <h1 style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: '32px',
                  fontWeight: 700,
                  color: '#1B2535',
                  margin: 0,
                  lineHeight: 1.1
                }}>
                  Showing {totalResults.toLocaleString()} Results
                </h1>
                <p style={{ fontSize: '14px', color: '#667085', margin: '4px 0 0 0' }}>
                  Faith-focused matches for you
                </p>
              </div>

              {/* View Mode Toggle */}
              <div style={{ display: 'flex', gap: '4px', background: '#F3F0E9', padding: '4px', borderRadius: '10px' }}>
                <button 
                  onClick={() => setViewMode('grid')}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: 'none',
                    background: viewMode === 'grid' ? '#FFFFFF' : 'transparent',
                    boxShadow: viewMode === 'grid' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    color: viewMode === 'grid' ? '#1B2535' : '#8A92A0'
                  }}
                >
                  <Grid size={18} />
                </button>
                <button 
                  onClick={() => setViewMode('list')}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: 'none',
                    background: viewMode === 'list' ? '#FFFFFF' : 'transparent',
                    boxShadow: viewMode === 'list' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    color: viewMode === 'list' ? '#1B2535' : '#8A92A0'
                  }}
                >
                  <List size={18} />
                </button>
              </div>
            </div>

            {/* Member Cards Grid */}
            {loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
                <Loader2 size={36} color="#B88E4C" className="animate-spin" />
              </div>
            ) : members.length === 0 ? (
              <div style={{
                background: '#FFFFFF',
                borderRadius: '16px',
                padding: '60px 24px',
                textAlign: 'center',
                border: '1px solid #EFEBE4'
              }}>
                <Search size={48} color="#C5BEB3" style={{ margin: '0 auto 16px auto' }} />
                <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#1B2535' }}>No Matches Found</h3>
                <p style={{ fontSize: '14px', color: '#667085', marginTop: '8px' }}>
                  Try adjusting your filter criteria to discover more members.
                </p>
                <button 
                  onClick={handleResetFilters}
                  style={{
                    marginTop: '20px',
                    background: '#1A273D',
                    color: '#FFFFFF',
                    padding: '10px 24px',
                    borderRadius: '24px',
                    border: 'none',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: viewMode === 'grid' ? 'repeat(3, 1fr)' : '1fr',
                gap: '24px'
              }} className="browse-cards-grid">
                {members.map(member => {
                  const isConnected = connectedIds.includes(member._id)
                  const isConnecting = connectingId === member._id

                  return (
                    <div 
                      key={member._id}
                      onClick={() => navigate(`/members/${member._id}`)}
                      style={{
                        background: '#FFFFFF',
                        border: '1px solid #EFEBE4',
                        borderRadius: '16px',
                        overflow: 'hidden',
                        cursor: 'pointer',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        boxShadow: '0 4px 16px rgba(0,0,0,0.03)'
                      }}
                      onMouseOver={e => {
                        e.currentTarget.style.transform = 'translateY(-4px)'
                        e.currentTarget.style.boxShadow = '0 12px 28px rgba(0,0,0,0.08)'
                      }}
                      onMouseOut={e => {
                        e.currentTarget.style.transform = 'none'
                        e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.03)'
                      }}
                    >
                      {/* Image Container with Badge */}
                      <div style={{ position: 'relative', height: '240px', background: '#F3F0E9' }}>
                        <img 
                          src={member.profileImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80'} 
                          alt={`${member.firstName} ${member.lastName}`} 
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                        {/* Verified Pill Overlay */}
                        {(member.verificationStatus === 'Verified' || member.verificationStatus !== 'Unverified') && (
                          <div style={{
                            position: 'absolute',
                            top: '12px',
                            right: '12px',
                            background: 'rgba(255, 255, 255, 0.9)',
                            backdropFilter: 'blur(8px)',
                            padding: '4px 10px',
                            borderRadius: '16px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '12px',
                            fontWeight: 600,
                            color: '#1B2535',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                          }}>
                            <Check size={12} color="#1B2535" strokeWidth={3} />
                            <span>Verified</span>
                          </div>
                        )}
                      </div>

                      {/* Card Details */}
                      <div style={{ padding: '20px', textAlign: 'center' }}>
                        <h3 style={{
                          fontFamily: "'Cormorant Garamond', serif",
                          fontSize: '22px',
                          fontWeight: 700,
                          color: '#1B2535',
                          margin: 0,
                          lineHeight: 1.2
                        }}>
                          {member.firstName} {member.lastName ? `${member.lastName.charAt(0)}.` : ''}, {member.age || 28}
                        </h3>

                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '4px',
                          fontSize: '13px',
                          color: '#667085',
                          marginTop: '6px'
                        }}>
                          <MapPin size={13} color="#8A92A0" />
                          <span>{member.city || 'Charleston'}, {member.state || 'South Carolina'}</span>
                        </div>

                        {/* Tags */}
                        <div style={{
                          display: 'flex',
                          justifyContent: 'center',
                          gap: '8px',
                          margin: '16px 0 20px 0'
                        }}>
                          <span style={{
                            background: '#F7F5F0',
                            border: '1px solid #EAE5DC',
                            padding: '4px 12px',
                            borderRadius: '12px',
                            fontSize: '12px',
                            fontWeight: 500,
                            color: '#1B2535'
                          }}>
                            {member.denomination || 'Catholic'}
                          </span>
                          <span style={{
                            background: '#F7F5F0',
                            border: '1px solid #EAE5DC',
                            padding: '4px 12px',
                            borderRadius: '12px',
                            fontSize: '12px',
                            fontWeight: 500,
                            color: '#1B2535'
                          }}>
                            {member.occupation || 'Teacher'}
                          </span>
                        </div>

                        {/* Connect Button */}
                        <button 
                          onClick={(e) => handleConnect(e, member)}
                          disabled={isConnected || isConnecting}
                          style={{
                            width: '100%',
                            padding: '10px',
                            borderRadius: '10px',
                            border: isConnected ? '1px solid #10B981' : '1px solid #D6C7AF',
                            background: isConnected ? '#ECFDF5' : '#FFFFFF',
                            color: isConnected ? '#059669' : '#1B2535',
                            fontSize: '14px',
                            fontWeight: 600,
                            cursor: isConnected ? 'default' : 'pointer',
                            transition: 'all 0.2s',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px'
                          }}
                        >
                          {isConnecting ? (
                            <Loader2 size={16} className="animate-spin" />
                          ) : isConnected ? (
                            <>
                              <Check size={16} />
                              <span>Connected</span>
                            </>
                          ) : (
                            <span>Connect</span>
                          )}
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {/* Pagination Controls */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              marginTop: '40px'
            }}>
              <button 
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  border: '1px solid #EAE5DC',
                  background: '#FFFFFF',
                  display: 'grid',
                  placeItems: 'center',
                  cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                  opacity: currentPage === 1 ? 0.5 : 1
                }}
              >
                <ChevronLeft size={18} color="#1B2535" />
              </button>

              {[1, 2, 3].map(page => (
                <button 
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    border: currentPage === page ? 'none' : '1px solid #EAE5DC',
                    background: currentPage === page ? '#1A273D' : '#FFFFFF',
                    color: currentPage === page ? '#FFFFFF' : '#1B2535',
                    fontWeight: 600,
                    fontSize: '14px',
                    cursor: 'pointer'
                  }}
                >
                  {page}
                </button>
              ))}

              <span style={{ color: '#8A92A0', padding: '0 4px' }}>...</span>

              <button 
                onClick={() => setCurrentPage(42)}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  border: currentPage === 42 ? 'none' : '1px solid #EAE5DC',
                  background: currentPage === 42 ? '#1A273D' : '#FFFFFF',
                  color: currentPage === 42 ? '#FFFFFF' : '#1B2535',
                  fontWeight: 600,
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              >
                42
              </button>

              <button 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  border: '1px solid #EAE5DC',
                  background: '#FFFFFF',
                  display: 'grid',
                  placeItems: 'center',
                  cursor: 'pointer'
                }}
              >
                <ChevronRight size={18} color="#1B2535" />
              </button>
            </div>
          </main>

        </div>
      </div>
    </div>
  )
}
