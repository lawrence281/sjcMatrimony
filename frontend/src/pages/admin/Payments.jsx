import { useEffect, useState } from 'react';
import AdminAPI from '@/api/adminAPI';

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const params = statusFilter ? { status: statusFilter } : {};
      const res = await AdminAPI.getPayments(params);
      setPayments(res.data?.data || []);
      setTotal(res.data?.meta?.total || res.data?.data?.length || 0);
    } catch {
      setPayments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPayments(); }, [statusFilter]);

  const statusColors = {
    success: 'bg-emerald-50 text-emerald-700',
    failed: 'bg-red-50 text-red-600',
    pending: 'bg-amber-50 text-amber-700',
    refunded: 'bg-neutral-100 text-neutral-500',
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-heading text-neutral-800">Payments 💰</h1>
          <p className="text-neutral-400 text-sm">Transaction audit ledger for all platform payments.</p>
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="select text-sm">
          <option value="">All Statuses</option>
          <option value="success">Success</option>
          <option value="failed">Failed</option>
          <option value="pending">Pending</option>
        </select>
      </div>

      {loading ? (
        <div className="text-center py-20 text-neutral-500">Loading payment records...</div>
      ) : (
        <div className="bg-white border rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full text-sm text-left">
            <thead className="bg-neutral-50 border-b text-xs font-semibold text-neutral-500 uppercase">
              <tr>
                <th className="p-4">User</th>
                <th className="p-4">Plan</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Gateway Order ID</th>
                <th className="p-4">Status</th>
                <th className="p-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y text-neutral-700">
              {payments.map((p) => (
                <tr key={p._id} className="hover:bg-neutral-50/50">
                  <td className="p-4">
                    <p className="font-medium">{p.userId?.email || '—'}</p>
                    <p className="text-xs text-neutral-400">{p.userId?.phone || ''}</p>
                  </td>
                  <td className="p-4 font-medium capitalize">{p.planId?.name || '—'}</td>
                  <td className="p-4 font-bold text-neutral-800">
                    {p.amount != null ? `₹${p.amount.toLocaleString()}` : '—'}
                  </td>
                  <td className="p-4 font-mono text-xs text-neutral-500 truncate max-w-[160px]">
                    {p.gatewayOrderId || '—'}
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${statusColors[p.status] || 'bg-neutral-100 text-neutral-500'}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="p-4 text-neutral-500 text-xs">
                    {new Date(p.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
              {payments.length === 0 && (
                <tr><td colSpan="6" className="text-center py-10 text-neutral-400">No payment records found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Payments;
