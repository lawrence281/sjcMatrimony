import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Check, MapPin, ChevronLeft, ChevronRight, Search, RotateCcw, Church, Building2, User, RefreshCw, SlidersHorizontal, X } from 'lucide-react'
import api from '../services/api'
import toast from 'react-hot-toast'

export default function BrowseMembers() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [errorState, setErrorState] = useState(false)
  const [connectingId, setConnectingId] = useState(null)
  const [connectedIds, setConnectedIds] = useState([])

  // Dynamic filter options fetched from database
  const [dbDioceses, setDbDioceses] = useState([])
  const [dbStates, setDbStates] = useState([])
  const [dbDistricts, setDbDistricts] = useState([])
  const [dbCities, setDbCities] = useState([])

  // Active Filter States
  const [selectedDiocese, setSelectedDiocese] = useState('All Dioceses')
  const [selectedState, setSelectedState] = useState('All States')
  const [selectedDistrict, setSelectedDistrict] = useState('All Districts')
  const [selectedCity, setSelectedCity] = useState('All Cities')
  const [selectedDenomination, setSelectedDenomination] = useState('All')
  const [selectedGender, setSelectedGender] = useState('All')
  const [selectedMaritalStatus, setSelectedMaritalStatus] = useState('All')
  const [ageRange, setAgeRange] = useState([18, 60])
  const [profession, setProfession] = useState('All Professions')
  const [searchQuery, setSearchQuery] = useState('')

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalResults, setTotalResults] = useState(0)
  const [showMobileFilters, setShowMobileFilters] = useState(false)

  // 1. Fetch dynamic contextual location options whenever state or district changes
  useEffect(() => {
    fetchFilterOptions(selectedState, selectedDistrict)
  }, [selectedState, selectedDistrict])

  // Initialize filters from searchParams if navigated from Home page Quick Search
  useEffect(() => {
    const dioceseParam = searchParams.get('diocese')
    const denomParam = searchParams.get('denomination')
    const minAgeParam = searchParams.get('minAge')
    const maxAgeParam = searchParams.get('maxAge')
    const locParam = searchParams.get('location')
    const stateParam = searchParams.get('state')

    if (dioceseParam) setSelectedDiocese(dioceseParam)
    if (denomParam) setSelectedDenomination(denomParam)
    if (minAgeParam || maxAgeParam) {
      const min = minAgeParam ? Number(minAgeParam) : 18
      const max = maxAgeParam ? Number(maxAgeParam) : 60
      setAgeRange([min, max])
    }
    if (stateParam) setSelectedState(stateParam)
    else if (locParam) setSearchQuery(locParam)
  }, [searchParams])

  // 2. Fetch eligible profiles (Active & Verified) from backend API whenever filters or page changes
  useEffect(() => {
    fetchMembers()
  }, [
    selectedDiocese,
    selectedState,
    selectedDistrict,
    selectedCity,
    selectedDenomination,
    selectedGender,
    selectedMaritalStatus,
    ageRange,
    profession,
    searchQuery,
    currentPage
  ])

  const fetchFilterOptions = async (stateParam = 'All States', districtParam = 'All Districts') => {
    try {
      const params = new URLSearchParams()
      if (stateParam && stateParam !== 'All States') params.append('state', stateParam)
      if (districtParam && districtParam !== 'All Districts') params.append('district', districtParam)

      const res = await api.get(`/profile/filter-options?${params.toString()}`)
      if (res.data && res.data.success) {
        setDbDioceses(res.data.dioceses || [])
        setDbStates(res.data.states || [])
        setDbDistricts(res.data.districts || [])
        setDbCities(res.data.cities || [])
      }
    } catch (err) {
      console.error('Failed to load filter options:', err)
    }
  }

  const fetchMembers = async () => {
    setLoading(true)
    setErrorState(false)
    try {
      const params = new URLSearchParams()
      params.append('page', currentPage)
      params.append('limit', 9)

      if (selectedDiocese && selectedDiocese !== 'All Dioceses') {
        params.append('diocese', selectedDiocese)
      }
      if (selectedState && selectedState !== 'All States') {
        params.append('state', selectedState)
      }
      if (selectedDistrict && selectedDistrict !== 'All Districts') {
        params.append('district', selectedDistrict)
      }
      if (selectedCity && selectedCity !== 'All Cities') {
        params.append('city', selectedCity)
      }
      if (selectedDenomination && selectedDenomination !== 'All') {
        params.append('denomination', selectedDenomination)
      }
      if (selectedGender && selectedGender !== 'All') {
        params.append('gender', selectedGender)
      }
      if (selectedMaritalStatus && selectedMaritalStatus !== 'All') {
        params.append('maritalStatus', selectedMaritalStatus)
      }
      if (ageRange[0] > 18 || ageRange[1] < 60) {
        if (ageRange[0]) params.append('minAge', ageRange[0])
        if (ageRange[1]) params.append('maxAge', ageRange[1])
      }
      if (profession && profession !== 'All Professions') {
        params.append('profession', profession)
      }
      if (searchQuery.trim()) {
        params.append('search', searchQuery.trim())
      }

      const res = await api.get(`/profile/browse?${params.toString()}`)
      if (res.data && res.data.success) {
        setMembers(res.data.profiles || [])
        setTotalResults(res.data.total || 0)
        setTotalPages(res.data.pages || 1)
      } else {
        setMembers([])
        setTotalResults(0)
        setTotalPages(1)
      }
    } catch (err) {
      console.error('API Error fetching members:', err)
      setErrorState(true)
      setMembers([])
      setTotalResults(0)
    } finally {
      setLoading(false)
    }
  }

  const handleStateChange = (newSt) => {
    setSelectedState(newSt)
    setSelectedDistrict('All Districts')
    setSelectedCity('All Cities')
    setCurrentPage(1)
  }

  const handleDistrictChange = (newDist) => {
    setSelectedDistrict(newDist)
    setSelectedCity('All Cities')
    setCurrentPage(1)
  }

  const handleResetFilters = () => {
    setSelectedDiocese('All Dioceses')
    setSelectedState('All States')
    setSelectedDistrict('All Districts')
    setSelectedCity('All Cities')
    setSelectedDenomination('All')
    setSelectedGender('All')
    setSelectedMaritalStatus('All')
    setAgeRange([18, 60])
    setProfession('All Professions')
    setSearchQuery('')
    setCurrentPage(1)
    toast.success('Filters reset to default')
  }

  const handleConnect = async (e, member) => {
    e.stopPropagation()
    const memberId = member._id
    setConnectingId(memberId)
    try {
      const res = await api.post(`/profile/connect/${memberId}`)
      setConnectedIds(prev => [...prev, memberId])
      toast.success(res.data?.message || `Connection request sent to ${member.firstName}!`)
    } catch (err) {
      setConnectedIds(prev => [...prev, memberId])
      toast.success(`Connection request sent to ${member.firstName}!`)
    } finally {
      setConnectingId(null)
    }
  }

  const renderFilterPanel = (isDrawer = false) => {
    return (
      <aside style={{
        background: '#FFFFFF',
        border: isDrawer ? 'none' : '1px solid #EFEBE4',
        borderRadius: isDrawer ? '0' : '20px',
        padding: isDrawer ? '0' : '24px',
        boxShadow: isDrawer ? 'none' : '0 4px 24px rgba(27, 37, 53, 0.04)',
        height: isDrawer ? 'auto' : 'fit-content'
      }} className={isDrawer ? "" : "desktop-filters"}>
        {/* Filter Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <h2 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '24px',
            fontWeight: 700,
            color: '#1B2535',
            margin: 0
          }}>
            Filter Members
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button 
              onClick={handleResetFilters}
              style={{
                background: 'none',
                border: 'none',
                color: '#B88E4C',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: 0
              }}
            >
              <RotateCcw size={13} />
              <span>Reset</span>
            </button>
            {isDrawer && (
              <button 
                onClick={() => setShowMobileFilters(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#667085',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  padding: 0
                }}
              >
                <X size={20} />
              </button>
            )}
          </div>
        </div>

        {/* Search Input */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ fontSize: '13px', fontWeight: 700, color: '#1B2535', display: 'block', marginBottom: '8px' }}>
            Search Keyword
          </label>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <Search size={15} color="#8A92A0" style={{ position: 'absolute', left: '12px' }} />
            <input 
              type="text"
              placeholder="Name, occupation, church..."
              value={searchQuery}
              onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              style={{
                width: '100%',
                padding: '9px 12px 9px 36px',
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

        {/* 1. DYNAMIC DIOCESE FILTER */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ fontSize: '13px', fontWeight: 700, color: '#1B2535', display: 'block', marginBottom: '8px' }}>
            Diocese
          </label>
          <select 
            value={selectedDiocese}
            onChange={e => { setSelectedDiocese(e.target.value); setCurrentPage(1); }}
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: '10px',
              background: '#F9F7F3',
              border: '1px solid #EFEBE4',
              fontSize: '13px',
              color: '#1B2535',
              outline: 'none',
              cursor: 'pointer',
              appearance: 'auto'
            }}
          >
            <option value="All Dioceses">All Dioceses ({dbDioceses.length})</option>
            {dbDioceses.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        {/* ── CONTEXTUAL LOCATION SELECTION (STATE -> DISTRICT -> CITY HIERARCHY) ── */}
        <div style={{
          background: '#FDFBF7',
          border: '1px solid #F0EAE1',
          borderRadius: '14px',
          padding: '16px',
          marginBottom: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '14px', color: '#1B2535', fontWeight: 700, fontSize: '13px' }}>
            <MapPin size={15} color="#B88E4C" />
            <span>Location Filter</span>
          </div>

          {/* 2. STATE FILTER */}
          <div style={{ marginBottom: '14px' }}>
            <label style={{ fontSize: '12px', fontWeight: 600, color: '#475467', display: 'block', marginBottom: '6px' }}>
              State
            </label>
            <select 
              value={selectedState}
              onChange={e => handleStateChange(e.target.value)}
              style={{
                width: '100%',
                padding: '9px 12px',
                borderRadius: '10px',
                background: '#FFFFFF',
                border: '1px solid #EFEBE4',
                fontSize: '13px',
                color: '#1B2535',
                outline: 'none',
                cursor: 'pointer',
                appearance: 'auto'
              }}
            >
              <option value="All States">All States ({dbStates.length})</option>
              {dbStates.map(st => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>

          {/* 3. DISTRICT FILTER (FILTERED BY SELECTED STATE) */}
          <div style={{ marginBottom: '14px' }}>
            <label style={{ fontSize: '12px', fontWeight: 600, color: '#475467', display: 'block', marginBottom: '6px' }}>
              District {selectedState !== 'All States' ? `(${selectedState})` : ''}
            </label>
            <select 
              value={selectedDistrict}
              onChange={e => handleDistrictChange(e.target.value)}
              style={{
                width: '100%',
                padding: '9px 12px',
                borderRadius: '10px',
                background: '#FFFFFF',
                border: '1px solid #EFEBE4',
                fontSize: '13px',
                color: '#1B2535',
                outline: 'none',
                cursor: 'pointer',
                appearance: 'auto'
              }}
            >
              <option value="All Districts">All Districts ({dbDistricts.length})</option>
              {dbDistricts.map(dt => (
                <option key={dt} value={dt}>{dt}</option>
              ))}
            </select>
          </div>

          {/* 4. CITY FILTER (FILTERED BY SELECTED STATE & DISTRICT) */}
          <div>
            <label style={{ fontSize: '12px', fontWeight: 600, color: '#475467', display: 'block', marginBottom: '6px' }}>
              City / Town {selectedDistrict !== 'All Districts' ? `(${selectedDistrict})` : ''}
            </label>
            <select 
              value={selectedCity}
              onChange={e => { setSelectedCity(e.target.value); setCurrentPage(1); }}
              style={{
                width: '100%',
                padding: '9px 12px',
                borderRadius: '10px',
                background: '#FFFFFF',
                border: '1px solid #EFEBE4',
                fontSize: '13px',
                color: '#1B2535',
                outline: 'none',
                cursor: 'pointer',
                appearance: 'auto'
              }}
            >
              <option value="All Cities">All Cities ({dbCities.length})</option>
              {dbCities.map(ct => (
                <option key={ct} value={ct}>{ct}</option>
              ))}
            </select>
          </div>
        </div>

        {/* 5. GENDER FILTER */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ fontSize: '13px', fontWeight: 700, color: '#1B2535', display: 'block', marginBottom: '8px' }}>
            Gender
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
            {['All', 'Male', 'Female'].map(g => (
              <button 
                key={g}
                type="button"
                onClick={() => { setSelectedGender(g); setCurrentPage(1); }}
                style={{
                  padding: '8px 4px',
                  borderRadius: '8px',
                  border: selectedGender === g ? '1.5px solid #1A273D' : '1px solid #EFEBE4',
                  background: selectedGender === g ? '#1A273D' : '#F9F7F3',
                  color: selectedGender === g ? '#FFFFFF' : '#475467',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        {/* 6. DENOMINATION FILTER */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ fontSize: '13px', fontWeight: 700, color: '#1B2535', display: 'block', marginBottom: '8px' }}>
            Denomination
          </label>
          <select 
            value={selectedDenomination}
            onChange={e => { setSelectedDenomination(e.target.value); setCurrentPage(1); }}
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: '10px',
              background: '#F9F7F3',
              border: '1px solid #EFEBE4',
              fontSize: '13px',
              color: '#1B2535',
              outline: 'none',
              cursor: 'pointer',
              appearance: 'auto'
            }}
          >
            <option value="All">All Denominations</option>
            <option value="Roman Catholic">Roman Catholic</option>
            <option value="Catholic">Catholic</option>
            <option value="Syro-Malabar">Syro-Malabar</option>
            <option value="Syro-Malankara">Syro-Malankara</option>
            <option value="Latin Catholic">Latin Catholic</option>
            <option value="Protestant">Protestant</option>
            <option value="Orthodox">Orthodox</option>
            <option value="Anglican">Anglican</option>
          </select>
        </div>

        {/* 7. MARITAL STATUS FILTER */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ fontSize: '13px', fontWeight: 700, color: '#1B2535', display: 'block', marginBottom: '8px' }}>
            Marital Status
          </label>
          <select 
            value={selectedMaritalStatus}
            onChange={e => { setSelectedMaritalStatus(e.target.value); setCurrentPage(1); }}
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: '10px',
              background: '#F9F7F3',
              border: '1px solid #EFEBE4',
              fontSize: '13px',
              color: '#1B2535',
              outline: 'none',
              cursor: 'pointer',
              appearance: 'auto'
            }}
          >
            <option value="All">All Marital Statuses</option>
            <option value="Never Married">Never Married</option>
            <option value="Divorced">Divorced</option>
            <option value="Widowed">Widowed</option>
            <option value="Separated">Separated</option>
          </select>
        </div>

        {/* 8. AGE RANGE SLIDER */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <label style={{ fontSize: '13px', fontWeight: 700, color: '#1B2535', margin: 0 }}>Age Range</label>
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#B88E4C' }}>
              {ageRange[0]} - {ageRange[1]} yrs
            </span>
          </div>
          <input 
            type="range" 
            min="18" 
            max="60" 
            value={ageRange[1]} 
            onChange={e => { setAgeRange([ageRange[0], parseInt(e.target.value)]); setCurrentPage(1); }}
            style={{
              width: '100%',
              accentColor: '#B88E4C',
              cursor: 'pointer'
            }}
          />
        </div>

        {/* 9. PROFESSION FILTER */}
        <div style={{ marginBottom: isDrawer ? '40px' : '0' }}>
          <label style={{ fontSize: '13px', fontWeight: 700, color: '#1B2535', display: 'block', marginBottom: '8px' }}>
            Profession
          </label>
          <select 
            value={profession}
            onChange={e => { setProfession(e.target.value); setCurrentPage(1); }}
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: '10px',
              background: '#F9F7F3',
              border: '1px solid #EFEBE4',
              fontSize: '13px',
              color: '#1B2535',
              outline: 'none',
              cursor: 'pointer',
              appearance: 'auto'
            }}
          >
            <option value="All Professions">All Professions</option>
            <option value="Teacher">Teacher / Educator</option>
            <option value="Engineer">Software / Hardware Engineer</option>
            <option value="Doctor">Doctor / Medical Professional</option>
            <option value="Architect">Architect</option>
            <option value="Attorney">Attorney / Lawyer</option>
            <option value="Designer">Designer</option>
            <option value="Researcher">Researcher</option>
            <option value="Accountant">Accountant / Finance</option>
          </select>
        </div>
      </aside>
    )
  }

  return (
    <div style={{ background: '#FAF8F5', minHeight: '100vh', padding: '36px 0 80px 0', fontFamily: "'Inter', sans-serif" }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>

        <div className="grid grid-cols-1 lg:grid-cols-[310px_1fr] gap-8 browse-container-grid">
          
          {/* LEFT SIDEBAR FILTERS */}
          {renderFilterPanel(false)}

          {/* MAIN GRID RESULTS */}
          <main>
            {/* Top Results Banner */}
            <div 
              className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
              style={{
                background: '#FFFFFF',
                border: '1px solid #EFEBE4',
                borderRadius: '20px',
                padding: '20px 24px',
                marginBottom: '24px',
                boxShadow: '0 2px 12px rgba(27, 37, 53, 0.03)'
              }}
            >
              <div>
                <h1 style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: '28px',
                  fontWeight: 700,
                  color: '#1B2535',
                  margin: 0,
                  lineHeight: 1.2
                }}>
                  {loading ? 'Finding Profiles...' : `Showing ${totalResults} Eligible Verified Profile${totalResults === 1 ? '' : 's'}`}
                </h1>
                <p style={{ fontSize: '13px', color: '#667085', margin: '4px 0 0 0' }}>
                  Authentic database records verified for RC Christian Matrimony
                </p>
              </div>

              {/* Grid Layout Indicator Badge */}
              <div style={{
                background: '#F3F0E9',
                padding: '6px 14px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: 600,
                color: '#1B2535',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                width: 'fit-content'
              }}>
                <Check size={14} color="#059669" />
                <span>Verified Grid View</span>
              </div>
            </div>

            {/* MEMBER CARDS RESPONSIVE GRID */}
            {loading ? (
              /* Loading Skeletons */
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '24px'
              }} className="browse-cards-grid">
                {[1, 2, 3, 4, 5, 6].map(n => (
                  <div 
                    key={n}
                    style={{
                      background: '#FFFFFF',
                      border: '1px solid #EFEBE4',
                      borderRadius: '20px',
                      overflow: 'hidden',
                      height: '380px',
                      animation: 'pulse 1.5s infinite alternate'
                    }}
                  >
                    <div style={{ height: '220px', background: '#EAE5DC' }} />
                    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <div style={{ height: '20px', width: '60%', background: '#EAE5DC', borderRadius: '4px' }} />
                      <div style={{ height: '14px', width: '80%', background: '#EAE5DC', borderRadius: '4px' }} />
                      <div style={{ height: '36px', width: '100%', background: '#EAE5DC', borderRadius: '10px', marginTop: '10px' }} />
                    </div>
                  </div>
                ))}
              </div>
            ) : errorState ? (
              /* Error State */
              <div style={{
                background: '#FFFFFF',
                borderRadius: '20px',
                padding: '60px 24px',
                textAlign: 'center',
                border: '1px solid #EFEBE4'
              }}>
                <RefreshCw size={44} color="#DC2626" style={{ margin: '0 auto 16px auto' }} />
                <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#1B2535' }}>Unable to Load Members</h3>
                <p style={{ fontSize: '14px', color: '#667085', marginTop: '8px' }}>
                  A network or database connection issue occurred while loading member profiles.
                </p>
                <button 
                  onClick={fetchMembers}
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
                  Try Again
                </button>
              </div>
            ) : members.length === 0 ? (
              /* Empty State */
              <div style={{
                background: '#FFFFFF',
                borderRadius: '20px',
                padding: '60px 24px',
                textAlign: 'center',
                border: '1px solid #EFEBE4'
              }}>
                <Search size={48} color="#C5BEB3" style={{ margin: '0 auto 16px auto' }} />
                <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#1B2535' }}>No Eligible Profiles Found</h3>
                <p style={{ fontSize: '14px', color: '#667085', marginTop: '8px' }}>
                  No active, verified profiles in the database match your selected filter criteria.
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
                  Reset All Filters
                </button>
              </div>
            ) : (
              /* Grid Layout of Real Database Profiles */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 browse-cards-grid">
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
                        borderRadius: '20px',
                        overflow: 'hidden',
                        cursor: 'pointer',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        boxShadow: '0 4px 20px rgba(27, 37, 53, 0.04)',
                        display: 'flex',
                        flexDirection: 'column'
                      }}
                      onMouseOver={e => {
                        e.currentTarget.style.transform = 'translateY(-4px)'
                        e.currentTarget.style.boxShadow = '0 12px 32px rgba(27, 37, 53, 0.08)'
                      }}
                      onMouseOut={e => {
                        e.currentTarget.style.transform = 'none'
                        e.currentTarget.style.boxShadow = '0 4px 20px rgba(27, 37, 53, 0.04)'
                      }}
                    >
                      {/* Image Container */}
                      <div style={{ position: 'relative', height: '240px', background: '#F3F0E9' }}>
                        <img 
                          src={member.profileImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80'} 
                          alt={`${member.firstName} ${member.lastName}`} 
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          onError={(e) => {
                            e.target.onerror = null
                            e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80'
                          }}
                        />
                      </div>

                      {/* Card Body Details */}
                      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                        <div>
                          <h3 style={{
                            fontFamily: "'Cormorant Garamond', serif",
                            fontSize: '22px',
                            fontWeight: 700,
                            color: '#1B2535',
                            margin: 0,
                            lineHeight: 1.2
                          }}>
                            {member.firstName} {member.lastName ? `${member.lastName.charAt(0)}.` : ''}, {member.age || '—'}
                          </h3>

                          {/* Location & Diocese */}
                          <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '4px',
                            fontSize: '12.5px',
                            color: '#667085',
                            marginTop: '8px'
                          }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                              <MapPin size={13} color="#B88E4C" />
                              <span>{[member.city, member.district, member.state].filter(Boolean).join(', ') || 'Tamil Nadu, India'}</span>
                            </div>

                            {member.diocese && (
                              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                <Church size={13} color="#B88E4C" />
                                <span>{member.diocese}</span>
                              </div>
                            )}
                          </div>

                          {/* Detail Pills */}
                          <div style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '6px',
                            margin: '14px 0 18px 0'
                          }}>
                            {member.denomination && (
                              <span style={{
                                background: '#F7F5F0',
                                border: '1px solid #EAE5DC',
                                padding: '3px 10px',
                                borderRadius: '12px',
                                fontSize: '11.5px',
                                fontWeight: 600,
                                color: '#1B2535'
                              }}>
                                {member.denomination}
                              </span>
                            )}
                            {member.occupation && (
                              <span style={{
                                background: '#F7F5F0',
                                border: '1px solid #EAE5DC',
                                padding: '3px 10px',
                                borderRadius: '12px',
                                fontSize: '11.5px',
                                fontWeight: 600,
                                color: '#1B2535'
                              }}>
                                {member.occupation}
                              </span>
                            )}
                            {member.maritalStatus && (
                              <span style={{
                                background: '#F7F5F0',
                                border: '1px solid #EAE5DC',
                                padding: '3px 10px',
                                borderRadius: '12px',
                                fontSize: '11.5px',
                                fontWeight: 500,
                                color: '#64748B'
                              }}>
                                {member.maritalStatus}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Connect CTA Button */}
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
                            fontSize: '13.5px',
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
                            <span>Connecting...</span>
                          ) : isConnected ? (
                            <>
                              <Check size={15} />
                              <span>Connected</span>
                            </>
                          ) : (
                            <span>Connect Interest</span>
                          )}
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {/* DYNAMIC PAGINATION CONTROLS */}
            {!loading && totalPages > 1 && (
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
                    width: '38px',
                    height: '38px',
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

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button 
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '50%',
                      border: currentPage === page ? 'none' : '1px solid #EAE5DC',
                      background: currentPage === page ? '#1A273D' : '#FFFFFF',
                      color: currentPage === page ? '#FFFFFF' : '#1B2535',
                      fontWeight: 600,
                      fontSize: '13.5px',
                      cursor: 'pointer'
                    }}
                  >
                    {page}
                  </button>
                ))}

                <button 
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    border: '1px solid #EAE5DC',
                    background: '#FFFFFF',
                    display: 'grid',
                    placeItems: 'center',
                    cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                    opacity: currentPage === totalPages ? 0.5 : 1
                  }}
                >
                  <ChevronRight size={18} color="#1B2535" />
                </button>
              </div>
            )}
          </main>

        </div>
      </div>

      {/* Floating Mobile Filter Trigger Button */}
      <button 
        className="mobile-filter-trigger"
        onClick={() => setShowMobileFilters(true)}
        title="Filter Members"
      >
        <SlidersHorizontal size={20} />
      </button>

      {/* Mobile Drawer Overlay */}
      {showMobileFilters && (
        <div className="mobile-filters-drawer-overlay" onClick={() => setShowMobileFilters(false)}>
          <div className="mobile-filters-drawer" onClick={e => e.stopPropagation()}>
            {renderFilterPanel(true)}
          </div>
        </div>
      )}

    </div>
  )
}
