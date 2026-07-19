import { useEffect, useState } from 'react';
import axiosInstance from '@/api/axiosInstance';
import InterestAPI from '@/api/interestAPI';

const Shortlist = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const fetchShortlist = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get('/shortlist');
      setItems(res.data?.data || []);
    } catch (err) {
      // Handle error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShortlist();
  }, []);

  const handleRemove = async (userId) => {
    try {
      await axiosInstance.delete(`/shortlist/${userId}`);
      fetchShortlist();
      setMessage('Profile removed from shortlist.');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to remove shortlist bookmark.');
    }
  };

  const handleSendInterest = async (receiverId) => {
    setMessage('');
    try {
      await InterestAPI.sendInterest(receiverId, { message: 'Hi, I have shortlisted you and would like to connect.' });
      setMessage('Interest connection sent successfully!');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to send invite.');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header">
        <h1 className="page-title text-2xl font-bold font-heading text-neutral-800">Your Shortlist 🌟</h1>
        <p className="page-subtitle text-neutral-400 text-sm">Bookmarks profiles you are interested in.</p>
      </div>

      {message && (
        <div className="p-4 bg-primary-50 border border-primary-100 text-primary-800 text-sm font-medium rounded-xl">
          {message}
        </div>
      )}

      {loading ? (
        <div className="text-center py-20 text-neutral-500 font-medium">Loading shortlist...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {items.map((item) => {
            const p = item.shortlistedUserId?.profile;
            if (!p) return null;
            return (
              <div key={item._id} className="bg-white rounded-2xl border border-neutral-100 overflow-hidden shadow-sm flex flex-col justify-between">
                <div className="aspect-[4/3] bg-neutral-100 relative overflow-hidden">
                  {p.profilePicture ? (
                    <img src={p.profilePicture} alt="Shortlist item" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl text-neutral-300">👤</div>
                  )}
                </div>
                <div className="p-5 space-y-4">
                  <div className="space-y-1">
                    <h3 className="font-heading font-bold text-base text-neutral-800">
                      {p.firstName} {p.lastName}
                    </h3>
                    <p className="text-xs text-neutral-500 font-medium">
                      {p.age} yrs • {p.gender} • {p.city || 'Location unknown'}
                    </p>
                  </div>
                  <div className="flex gap-2 pt-2 border-t border-neutral-50">
                    <button
                      onClick={() => handleSendInterest(item.shortlistedUserId._id)}
                      className="btn-primary text-xs py-2 px-3 rounded-lg flex-1 font-bold"
                    >
                      Invite
                    </button>
                    <button
                      onClick={() => handleRemove(item.shortlistedUserId._id)}
                      className="btn-ghost text-xs py-2 px-3 border border-red-100 hover:bg-red-50 text-red-600 rounded-lg font-bold"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
          {items.length === 0 && (
            <div className="col-span-full text-center py-20 text-neutral-400 text-sm">
              Your shortlist is empty. Start bookmarking matching profiles.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Shortlist;
