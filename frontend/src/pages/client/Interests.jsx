import { useEffect, useState } from 'react';
import InterestAPI from '@/api/interestAPI';
import Icon from '@/components/common/Icon/Icon';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';

const Interests = () => {
  const [activeTab, setActiveTab] = useState('received'); // received | sent
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const fetchInterests = async () => {
    setLoading(true);
    try {
      let res;
      if (activeTab === 'received') {
        res = await InterestAPI.getReceivedInterests();
      } else {
        res = await InterestAPI.getSentInterests();
      }
      setItems(res.data?.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInterests();
  }, [activeTab]);

  const handleAccept = async (id) => {
    try {
      await InterestAPI.acceptInterest(id);
      fetchInterests();
      setMessage('Interest invitation accepted successfully.');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to accept invitation.');
    }
  };

  const handleReject = async (id) => {
    try {
      await InterestAPI.rejectInterest(id, { rejectionReason: 'No matching preferences.' });
      fetchInterests();
      setMessage('Interest invitation rejected.');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to reject invitation.');
    }
  };

  const handleCancel = async (id) => {
    try {
      await InterestAPI.cancelInterest(id);
      fetchInterests();
      setMessage('Interest request cancelled.');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to cancel invitation request.');
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold font-serif text-slate-900 tracking-tight">Connections</h1>
          <p className="text-slate-500 mt-2">Manage your connection invitations and interests.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => { setActiveTab('received'); setMessage(''); }}
          className={`px-8 py-4 text-sm font-semibold border-b-2 transition-all ${
            activeTab === 'received'
              ? 'border-primary-600 text-primary-700 bg-primary-50/50'
              : 'border-transparent text-slate-400 hover:text-slate-700 hover:bg-slate-50'
          }`}
        >
          Received Requests
        </button>
        <button
          onClick={() => { setActiveTab('sent'); setMessage(''); }}
          className={`px-8 py-4 text-sm font-semibold border-b-2 transition-all ${
            activeTab === 'sent'
              ? 'border-primary-600 text-primary-700 bg-primary-50/50'
              : 'border-transparent text-slate-400 hover:text-slate-700 hover:bg-slate-50'
          }`}
        >
          Sent Requests
        </button>
      </div>

      {message && (
        <div className="p-4 bg-primary-50/50 backdrop-blur-sm border border-primary-100 text-primary-800 text-sm font-medium rounded-2xl flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600"><Icon name="check" size={16} /></div>
          {message}
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
           {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-soft">
              <div className="aspect-[4/5] shimmer"></div>
              <div className="p-5 space-y-3">
                <div className="h-5 bg-slate-100 rounded w-2/3 shimmer"></div>
                <div className="h-4 bg-slate-100 rounded w-1/2 shimmer"></div>
                <div className="pt-3 border-t border-slate-50 flex gap-2">
                  <div className="h-10 bg-slate-100 rounded-xl flex-1 shimmer"></div>
                  <div className="h-10 bg-slate-100 rounded-xl flex-1 shimmer"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map((item) => {
            const userRef = activeTab === 'received' ? item.senderId : item.receiverId;
            const p = userRef?.profile;
            if (!p) return null;
            
            return (
              <div key={item._id} className="group bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-soft hover:shadow-card-hover transition-all duration-300 flex flex-col hover:-translate-y-1">
                <Link to={ROUTES.CLIENT.VIEW_PROFILE.replace(':id', p.profileId || userRef._id)} className="block aspect-[4/5] bg-slate-100 relative overflow-hidden">
                  <img src={p.avatar || p.profilePicture || `https://ui-avatars.com/api/?name=${p.firstName}+${p.lastName}&background=14b8a6&color=fff&size=400`} alt="Avatar" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  
                  <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
                  
                  <span className={`absolute top-3 left-3 text-[10px] font-bold px-3 py-1 rounded-full shadow-sm capitalize backdrop-blur-md border ${
                    item.status === 'pending'
                      ? 'bg-amber-100/90 text-amber-700 border-amber-200'
                      : item.status === 'accepted'
                      ? 'bg-success-100/90 text-success-700 border-success-200'
                      : 'bg-slate-100/90 text-slate-700 border-slate-200'
                  }`}>
                    {item.status}
                  </span>
                  
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="font-serif font-bold text-xl drop-shadow-md">
                      {p.firstName} {p.lastName}
                    </h3>
                    <p className="text-xs font-medium text-white/90 drop-shadow-md">
                      {p.age} Yrs • {p.city || 'Location unknown'}
                    </p>
                  </div>
                </Link>
                
                <div className="p-5 flex-1 flex flex-col justify-between">
                  {item.message && (
                    <div className="mb-4 text-sm text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100 italic relative">
                      <Icon name="message" size={14} className="absolute top-3 right-3 text-slate-300" />
                      "{item.message}"
                    </div>
                  )}
                  
                  <div className="flex gap-2 pt-2 border-t border-slate-100">
                    {activeTab === 'received' && item.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleAccept(item._id)}
                          className="btn flex-1 bg-primary-600 text-white hover:bg-primary-700 text-sm py-2.5 rounded-xl font-bold transition-all shadow-sm"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleReject(item._id)}
                          className="btn flex-1 bg-danger-50 text-danger-700 hover:bg-danger-100 hover:text-danger-800 text-sm py-2.5 rounded-xl font-bold transition-all border border-danger/20"
                        >
                          Decline
                        </button>
                      </>
                    )}
                    {activeTab === 'sent' && item.status === 'pending' && (
                      <button
                        onClick={() => handleCancel(item._id)}
                        className="btn w-full bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-800 border border-slate-200 text-sm py-2.5 rounded-xl font-bold transition-all"
                      >
                        Cancel Request
                      </button>
                    )}
                    {item.status !== 'pending' && (
                      <div className="w-full text-center text-sm font-medium text-slate-400 py-2.5">
                        No actions available
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          {items.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center py-24 text-center">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-4">
                <Icon name="message" size={32} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">No requests found</h3>
              <p className="text-slate-500 max-w-sm">You haven't {activeTab === 'received' ? 'received' : 'sent'} any connection requests yet.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Interests;
