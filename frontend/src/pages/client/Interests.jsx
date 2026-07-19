import { useEffect, useState } from 'react';
import InterestAPI from '@/api/interestAPI';

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
      // Handle error
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
    <div className="space-y-6 animate-fade-in">
      <div className="page-header">
        <h1 className="page-title text-2xl font-bold font-heading text-neutral-800">Connection Requests 🤝</h1>
        <p className="page-subtitle text-neutral-400 text-sm">Manage connection invitations sent and received.</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-neutral-200">
        <button
          onClick={() => {
            setActiveTab('received');
            setMessage('');
          }}
          className={`px-6 py-3 text-sm font-semibold border-b-2 ${
            activeTab === 'received'
              ? 'border-primary-600 text-primary-700 font-bold'
              : 'border-transparent text-neutral-400 hover:text-neutral-600'
          }`}
        >
          Received Requests
        </button>
        <button
          onClick={() => {
            setActiveTab('sent');
            setMessage('');
          }}
          className={`px-6 py-3 text-sm font-semibold border-b-2 ${
            activeTab === 'sent'
              ? 'border-primary-600 text-primary-700 font-bold'
              : 'border-transparent text-neutral-400 hover:text-neutral-600'
          }`}
        >
          Sent Requests
        </button>
      </div>

      {message && (
        <div className="p-4 bg-primary-50 border border-primary-100 text-primary-800 text-sm font-medium rounded-xl">
          {message}
        </div>
      )}

      {loading ? (
        <div className="text-center py-20 text-neutral-500 font-medium">Loading requests list...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {items.map((item) => {
            const userRef = activeTab === 'received' ? item.senderId : item.receiverId;
            const p = userRef?.profile;
            if (!p) return null;
            return (
              <div key={item._id} className="bg-white rounded-2xl border border-neutral-100 overflow-hidden shadow-sm flex flex-col justify-between">
                <div className="aspect-[4/3] bg-neutral-100 relative overflow-hidden">
                  {p.profilePicture ? (
                    <img src={p.profilePicture} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl text-neutral-300">👤</div>
                  )}
                  <span className={`absolute top-3 left-3 text-[9px] font-extrabold px-2 py-0.5 rounded-full text-white shadow capitalize ${
                    item.status === 'pending'
                      ? 'bg-amber-500'
                      : item.status === 'accepted'
                      ? 'bg-emerald-500'
                      : 'bg-neutral-400'
                  }`}>
                    {item.status}
                  </span>
                </div>
                <div className="p-5 space-y-4">
                  <div className="space-y-1">
                    <h3 className="font-heading font-bold text-base text-neutral-800">
                      {p.firstName} {p.lastName}
                    </h3>
                    <p className="text-xs text-neutral-500 font-medium">
                      {p.age} yrs • {p.gender} • {p.city || 'Location unknown'}
                    </p>
                    {item.message && (
                      <p className="text-xs text-neutral-400 italic bg-neutral-50 p-2.5 rounded-lg border mt-2">
                        "{item.message}"
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2 pt-2 border-t border-neutral-50">
                    {activeTab === 'received' && item.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleAccept(item._id)}
                          className="btn-primary text-xs py-2 px-3 rounded-lg flex-1 font-bold"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleReject(item._id)}
                          className="btn-ghost text-xs py-2 px-3 border border-red-100 hover:bg-red-50 text-red-600 rounded-lg font-bold"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    {activeTab === 'sent' && item.status === 'pending' && (
                      <button
                        onClick={() => handleCancel(item._id)}
                        className="btn-ghost text-xs py-2 px-3 border border-neutral-200 text-neutral-600 hover:bg-neutral-50 rounded-lg w-full font-bold"
                      >
                        Cancel Invitation Request
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          {items.length === 0 && (
            <div className="col-span-full text-center py-20 text-neutral-400 text-sm">
              No connection requests found in this tab.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Interests;
