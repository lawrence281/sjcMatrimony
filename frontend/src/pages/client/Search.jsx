import { useEffect, useState } from 'react';
import SearchAPI from '@/api/searchAPI';
import InterestAPI from '@/api/interestAPI';
import axiosInstance from '@/api/axiosInstance';

const Search = () => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState({
    minAge: '',
    maxAge: '',
    gender: '',
    religion: '',
    caste: '',
    city: '',
    page: 1,
    limit: 12,
    sort: 'recent',
  });

  const [message, setMessage] = useState('');
  const [sendingId, setSendingId] = useState(null);

  const fetchProfiles = async () => {
    setLoading(true);
    try {
      const res = await SearchAPI.searchProfiles(filters);
      setProfiles(res.data?.data || []);
      setTotal(res.data?.meta?.total || res.data?.data?.length || 0);
    } catch (err) {
      // Handle error gracefully
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
    setMessage('');
    try {
      await axiosInstance.post('/shortlist', { shortlistedUserId });
      setMessage('Profile added to shortlist.');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to shortlist profile.');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header">
        <h1 className="page-title text-2xl font-bold font-heading text-neutral-800">Find Matches 🔍</h1>
        <p className="page-subtitle text-neutral-400 text-sm">Discover profiles matching your criteria.</p>
      </div>

      {/* Filter panel */}
      <form onSubmit={handleSearchSubmit} className="bg-white border rounded-2xl p-5 grid grid-cols-2 md:grid-cols-4 gap-4 items-end">
        <div className="space-y-1">
          <label className="text-xs font-bold text-neutral-500 uppercase">Gender</label>
          <select name="gender" value={filters.gender} onChange={handleFilterChange} className="select w-full">
            <option value="">Any</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold text-neutral-500 uppercase">Min Age</label>
          <input
            type="number"
            name="minAge"
            value={filters.minAge}
            onChange={handleFilterChange}
            placeholder="18"
            className="input w-full"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold text-neutral-500 uppercase">Max Age</label>
          <input
            type="number"
            name="maxAge"
            value={filters.maxAge}
            onChange={handleFilterChange}
            placeholder="45"
            className="input w-full"
          />
        </div>
        <button type="submit" className="btn-primary w-full py-3 rounded-xl font-bold">
          Search Matches
        </button>
      </form>

      {message && (
        <div className="p-4 bg-primary-50 border border-primary-100 text-primary-800 text-sm font-medium rounded-xl">
          {message}
        </div>
      )}

      {/* Profile grid */}
      {loading ? (
        <div className="text-center py-20 text-neutral-500 font-medium">Searching profiles...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {profiles.map((p) => (
            <div key={p._id} className="bg-white rounded-2xl border border-neutral-100 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col">
              <div className="aspect-[4/3] bg-neutral-100 relative overflow-hidden">
                {p.profilePicture ? (
                  <img src={p.profilePicture} alt="Profile avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl text-neutral-300">👤</div>
                )}
                <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-neutral-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-neutral-200">
                  {p.profileId}
                </span>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-1">
                  <h3 className="font-heading font-bold text-base text-neutral-800">
                    {p.firstName} {p.lastName}
                  </h3>
                  <p className="text-xs text-neutral-500 font-medium">
                    {p.age} yrs • {p.religion} • {p.city || 'Location unknown'}
                  </p>
                </div>
                <div className="flex gap-2 pt-2 border-t border-neutral-50">
                  <button
                    onClick={() => handleSendInterest(p.userId)}
                    disabled={sendingId === p.userId}
                    className="btn-primary text-xs py-2 px-3 rounded-lg flex-1 font-bold"
                  >
                    {sendingId === p.userId ? 'Sending...' : 'Invite'}
                  </button>
                  <button
                    onClick={() => handleShortlist(p.userId)}
                    className="btn-ghost text-xs py-2 px-3 border rounded-lg text-neutral-600 hover:bg-neutral-50 font-bold"
                  >
                    Shortlist
                  </button>
                </div>
              </div>
            </div>
          ))}
          {profiles.length === 0 && (
            <div className="col-span-full text-center py-20 text-neutral-400 text-sm">
              No matching profiles found matching your search.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Search;
