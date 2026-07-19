import { useEffect, useState } from 'react';
import AdminAPI from '@/api/adminAPI';

const Subscriptions = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  const fetchSubscriptions = async () => {
    setLoading(true);
    try {
      const params = statusFilter ? { status: statusFilter } : {};
      const res = await AdminAPI.getSubscriptions(params);
      setSubscriptions(res.data?.data || []);
      setTotal(res.data?.meta?.total || res.data?.data?.length || 0);
    } catch {
      setSubscriptions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSubscriptions(); }, [statusFilter]);

  const statusColors = {
    active: 'bg-emerald-50 text-emerald-700',
    expired: 'bg-neutral-100 text-neutral-500',
    cancelled: 'bg-red-50 text-red-600',
    pending: 'bg-amber-50 text-amber-700',
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-heading text-neutral-800">Subscriptions 💳</h1>
          <p className="text-neutral-400 text-sm">Track all user membership subscriptions.</p>
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="select text-sm">
          <option value="">All Statuses</option>
          <option value="active">Active</option>
          <option value="expired">Expired</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {loading ? (
        <div className="text-center py-20 text-neutral-500">Loading subscriptions...</div>
      ) : (
        <div className="bg-white border rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full text-sm text-left">
            <thead className="bg-neutral-50 border-b text-xs font-semibold text-neutral-500 uppercase">
              <tr>
                <th className="p-4">User</th>
                <th className="p-4">Plan</th>
                <th className="p-4">Status</th>
                <th className="p-4">Start Date</th>
                <th className="p-4">End Date</th>
              </tr>
            </thead>
            <tbody className="divide-y text-neutral-700">
              {subscriptions.map((sub) => (
                <tr key={sub._id} className="hover:bg-neutral-50/50">
                  <td className="p-4">
                    <p className="font-medium">{sub.userId?.email || '—'}</p>
                    <p className="text-xs text-neutral-400">{sub.userId?.phone || ''}</p>
                  </td>
                  <td className="p-4">
                    <p className="font-semibold text-neutral-800 capitalize">{sub.planId?.name || '—'}</p>
                    <p className="text-xs text-neutral-400">
                      {sub.planId?.price != null ? `₹${sub.planId.price}` : ''} · {sub.planId?.durationDays} days
                    </p>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${statusColors[sub.status] || 'bg-neutral-100 text-neutral-500'}`}>
                      {sub.status}
                    </span>
                  </td>
                  <td className="p-4 text-neutral-500 text-xs">
                    {sub.startDate ? new Date(sub.startDate).toLocaleDateString() : '—'}
                  </td>
                  <td className="p-4 text-neutral-500 text-xs">
                    {sub.endDate ? new Date(sub.endDate).toLocaleDateString() : '—'}
                  </td>
                </tr>
              ))}
              {subscriptions.length === 0 && (
                <tr><td colSpan="5" className="text-center py-10 text-neutral-400">No subscription records found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Subscriptions;
