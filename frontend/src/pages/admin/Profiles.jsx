import { useEffect, useState } from 'react';
import AdminAPI from '@/api/adminAPI';

const AdminProfiles = () => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    status: '',
    search: '',
  });

  const [modalData, setModalData] = useState(null); // { type: 'reject'|'suspend', profileId: string }
  const [reasonText, setReasonText] = useState('');
  const [message, setMessage] = useState('');

  const fetchProfiles = async () => {
    setLoading(true);
    try {
      const res = await AdminAPI.getProfiles(filters);
      setProfiles(res.data?.data || []);
      setTotal(res.data?.meta?.total || res.data?.data?.length || 0);
    } catch (err) {
      // Handle error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, [filters.page, filters.status]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setFilters((prev) => ({ ...prev, page: 1 }));
    fetchProfiles();
  };

  const handleApprove = async (id) => {
    setMessage('');
    try {
      await AdminAPI.approveProfile(id);
      setMessage('Profile approved successfully.');
      fetchProfiles();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Approval failed.');
    }
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    if (!reasonText.trim()) return;

    setMessage('');
    try {
      if (modalData.type === 'reject') {
        await AdminAPI.rejectProfile(modalData.profileId, { reason: reasonText.trim() });
        setMessage('Profile rejected successfully.');
      } else {
        await AdminAPI.suspendProfile(modalData.profileId, { reason: reasonText.trim() });
        setMessage('Profile suspended successfully.');
      }
      fetchProfiles();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Operation failed.');
    } finally {
      setModalData(null);
      setReasonText('');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-heading text-neutral-800">Profile Moderation ⚖️</h1>
          <p className="text-neutral-400 text-sm">Verify and moderate registry profiles.</p>
        </div>
      </div>

      {message && (
        <div className="p-4 bg-primary-50 border border-primary-100 text-primary-800 text-sm font-medium rounded-xl">
          {message}
        </div>
      )}

      {/* Filter search bar */}
      <form onSubmit={handleSearchSubmit} className="bg-white border rounded-2xl p-4 flex flex-col sm:flex-row gap-4 items-end">
        <div className="flex-1 space-y-1">
          <label className="text-xs font-semibold text-neutral-500 uppercase">Search by Name / ID</label>
          <input
            type="text"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            placeholder="Search details..."
            className="input w-full"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-semibold text-neutral-500 uppercase">Status</label>
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}
            className="select"
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="suspended">Suspended</option>
            <option value="incomplete">Incomplete</option>
          </select>
        </div>
        <button type="submit" className="btn-primary py-3 px-6 rounded-xl font-bold text-xs uppercase">
          Filter
        </button>
      </form>

      {/* Profiles list table */}
      {loading ? (
        <div className="text-center py-20 text-neutral-500 font-medium">Loading platform profiles...</div>
      ) : (
        <div className="bg-white border rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-neutral-50 border-b text-neutral-500 font-semibold text-xs uppercase">
                <th className="p-4">Display ID</th>
                <th className="p-4">User</th>
                <th className="p-4">Gender / Age</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y text-neutral-700">
              {profiles.map((p) => (
                <tr key={p._id} className="hover:bg-neutral-50/50">
                  <td className="p-4 font-mono font-bold text-neutral-800">{p.profileId}</td>
                  <td className="p-4">
                    <div className="font-bold">
                      {p.firstName} {p.lastName}
                    </div>
                    <div className="text-xs text-neutral-400">{p.userId?.email || 'No email'}</div>
                  </td>
                  <td className="p-4 capitalize">
                    {p.gender} • {p.age} yrs
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                      p.status === 'approved'
                        ? 'bg-emerald-50 text-emerald-700'
                        : p.status === 'pending'
                        ? 'bg-amber-50 text-amber-700'
                        : 'bg-neutral-100 text-neutral-500'
                    }`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    {p.status !== 'approved' && (
                      <button
                        onClick={() => handleApprove(p._id)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs py-1.5 px-3 rounded-lg"
                      >
                        Approve
                      </button>
                    )}
                    {p.status !== 'incomplete' && (
                      <button
                        onClick={() => setModalData({ type: 'reject', profileId: p._id })}
                        className="bg-amber-500 hover:bg-amber-600 text-white font-semibold text-xs py-1.5 px-3 rounded-lg"
                      >
                        Reject
                      </button>
                    )}
                    {p.status !== 'suspended' && (
                      <button
                        onClick={() => setModalData({ type: 'suspend', profileId: p._id })}
                        className="bg-red-600 hover:bg-red-700 text-white font-semibold text-xs py-1.5 px-3 rounded-lg"
                      >
                        Suspend
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {profiles.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-10 text-neutral-400">
                    No registry profiles found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Reason overlay modal */}
      {modalData && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleModalSubmit} className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-6 shadow-2xl animate-fade-in border">
            <div className="text-center space-y-2">
              <h3 className="text-lg font-bold font-heading text-neutral-800 capitalize">
                {modalData.type} Profile
              </h3>
              <p className="text-xs text-neutral-400">Specify details for the member profile audit logs.</p>
            </div>
            <textarea
              required
              value={reasonText}
              onChange={(e) => setReasonText(e.target.value)}
              placeholder={`Enter reason for profile ${modalData.type}...`}
              className="textarea w-full h-24"
            />
            <div className="flex gap-2">
              <button type="submit" className="btn-primary text-xs py-2.5 rounded-xl flex-1 font-bold">
                Confirm
              </button>
              <button
                type="button"
                onClick={() => {
                  setModalData(null);
                  setReasonText('');
                }}
                className="btn-ghost text-xs py-2.5 border rounded-xl flex-1 font-bold text-neutral-600 hover:bg-neutral-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminProfiles;
