import { useEffect, useState } from 'react';
import SearchAPI from '@/api/searchAPI';
import InterestAPI from '@/api/interestAPI';
import axiosInstance from '@/api/axiosInstance';
import Icon from '@/components/common/Icon/Icon';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';

const Search = () => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState({
    minAge: '', maxAge: '', gender: '', religion: '', city: '', page: 1, limit: 12, sort: 'recent'
  });
  const [message, setMessage] = useState('');
  const [sendingId, setSendingId] = useState(null);
  const [shortlistingId, setShortlistingId] = useState(null);

  const fetchProfiles = async () => {
    setLoading(true);
    try {
      const res = await SearchAPI.searchProfiles(filters);
      setProfiles(res.data?.data || []);
      setTotal(res.data?.meta?.total || res.data?.data?.length || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, [filters.page, filters.sort]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value, page: 1 });
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchProfiles();
  };

  const handleSendInterest = async (receiverId) => {
    setSendingId(receiverId);
    setMessage('');
    try {
      await InterestAPI.sendInterest(receiverId, { message: 'I am interested in your profile.' });
      setMessage('Interest invitation sent successfully!');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to send interest invitation.');
    } finally {
      setSendingId(null);
    }
  };

  const handleShortlist = async (shortlistedUserId) => {
    setShortlistingId(shortlistedUserId);
    setMessage('');
    try {
      await axiosInstance.post('/shortlist', { shortlistedUserId });
      setMessage('Profile added to shortlist.');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to shortlist profile.');
    } finally {
      setShortlistingId(null);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header section with refined typography */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold font-serif text-slate-900 tracking-tight">Discover Matches</h1>
          <p className="text-slate-500 mt-2">Find your perfect partner from {total} verified profiles.</p>
        </div>
      </div>

      {/* Floating Filter Panel */}
      <form onSubmit={handleSearchSubmit} className="bg-white rounded-3xl p-6 shadow-card border border-slate-100 flex flex-wrap gap-4 items-end relative z-20">
        <div className="flex-1 min-w-[150px]">
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Looking For</label>
          <div className="relative">
            <select name="gender" value={filters.gender} onChange={handleFilterChange} className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors cursor-pointer">
              <option value="">Any Gender</option>
              <option value="male">Groom (Male)</option>
              <option value="female">Bride (Female)</option>
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
              <Icon name="chevronDown" size={16} />
            </div>
          </div>
        </div>
        
        <div className="flex-1 min-w-[100px]">
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Min Age</label>
          <input type="number" name="minAge" value={filters.minAge} onChange={handleFilterChange} placeholder="18" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors" />
        </div>
        
        <div className="flex-1 min-w-[100px]">
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Max Age</label>
          <input type="number" name="maxAge" value={filters.maxAge} onChange={handleFilterChange} placeholder="45" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors" />
        </div>

        <button type="submit" className="btn bg-primary-600 hover:bg-primary-700 text-white shadow-glow hover:shadow-lg border border-primary-500 px-8 py-3 rounded-xl flex items-center gap-2 h-[46px]">
          <Icon name="search" size={18} />
          <span>Search</span>
        </button>
      </form>

      {message && (
        <div className="p-4 bg-primary-50/50 backdrop-blur-sm border border-primary-100 text-primary-800 text-sm font-medium rounded-2xl flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600"><Icon name="check" size={16} /></div>
          {message}
        </div>
      )}

      {/* Grid of Profile Cards */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-soft">
              <div className="aspect-[4/5] shimmer"></div>
              <div className="p-5 space-y-3">
                <div className="h-5 bg-slate-100 rounded w-2/3 shimmer"></div>
                <div className="h-4 bg-slate-100 rounded w-1/2 shimmer"></div>
                <div className="pt-3 border-t border-slate-50 flex gap-2">
                  <div className="h-10 bg-slate-100 rounded-xl flex-1 shimmer"></div>
                  <div className="h-10 bg-slate-100 rounded-xl w-12 shimmer"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 relative z-10">
          {profiles.map((p) => (
            <div key={p._id} className="group bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-soft hover:shadow-card-hover transition-all duration-300 flex flex-col hover:-translate-y-1">
              
              <Link to={ROUTES.CLIENT.VIEW_PROFILE.replace(':id', p.profileId || p._id)} className="block aspect-[4/5] bg-slate-100 relative overflow-hidden">
                <img src={p.avatar || p.profilePicture || `https://ui-avatars.com/api/?name=${p.firstName}+${p.lastName}&background=14b8a6&color=fff&size=400`} alt={p.firstName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                
                {/* Overlay gradient for text readability */}
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
                
                {/* Badges */}
                <div className="absolute top-3 right-3 flex flex-col gap-2">
                  {p.isVerified && (
                    <span className="bg-success-light/90 backdrop-blur-md text-success-dark text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1 border border-success-light">
                      <Icon name="shieldCheck" size={12} /> Verified
                    </span>
                  )}
                  {p.isPremium && (
                    <span className="bg-accent-100/90 backdrop-blur-md text-accent-700 text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1 border border-accent-200">
                      <Icon name="star" size={12} /> Premium
                    </span>
                  )}
                </div>

                <div className="absolute bottom-3 left-3 text-white">
                  <h3 className="font-serif font-bold text-xl drop-shadow-md flex items-center gap-2">
                    {p.firstName} {p.lastName?.charAt(0)}.
                  </h3>
                  <p className="text-xs font-medium text-white/90 drop-shadow-md">
                    {p.age} Yrs • {p.height ? `${p.height}cm` : ''}
                  </p>
                </div>
              </Link>
              
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div className="space-y-2.5 mb-5">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Icon name="briefcase" size={14} className="text-slate-400" />
                    <span className="truncate">{p.occupation || 'Not specified'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Icon name="mapPin" size={14} className="text-slate-400" />
                    <span className="truncate">{p.city || 'Not specified'}</span>
                  </div>
                </div>
                
                <div className="flex gap-2 pt-4 border-t border-slate-100">
                  <button
                    onClick={() => handleSendInterest(p.userId)}
                    disabled={sendingId === p.userId}
                    className="flex-1 btn bg-primary-50 text-primary-700 hover:bg-primary-600 hover:text-white border border-primary-100 hover:border-primary-600 text-xs py-2 px-3 rounded-xl font-bold transition-all"
                  >
                    {sendingId === p.userId ? 'Sending...' : 'Connect'}
                  </button>
                  <button
                    onClick={() => handleShortlist(p.userId)}
                    disabled={shortlistingId === p.userId}
                    className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 text-slate-400 border border-slate-200 hover:text-accent-600 hover:bg-accent-50 hover:border-accent-200 transition-all"
                    aria-label="Shortlist"
                  >
                    <Icon name="heart" size={18} className={shortlistingId === p.userId ? 'animate-pulse' : ''} />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {profiles.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center py-24 text-center">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-4">
                <Icon name="search" size={32} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">No matches found</h3>
              <p className="text-slate-500 max-w-sm">We couldn't find any profiles matching your current filters. Try adjusting your search criteria.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Search;
