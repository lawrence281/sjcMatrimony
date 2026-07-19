import { useEffect, useState } from 'react';
import AdminAPI from '@/api/adminAPI';

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [modalData, setModalData] = useState(null); // { reportId, status }
  const [adminNote, setAdminNote] = useState('');
  const [resolving, setResolving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const fetchReports = async () => {
    setLoading(true);
    try {
      const params = statusFilter ? { status: statusFilter } : {};
      const res = await AdminAPI.getReports(params);
      setReports(res.data?.data || []);
    } catch {
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchReports(); }, [statusFilter]);

  const handleResolveSubmit = async (e) => {
    e.preventDefault();
    if (!adminNote.trim()) return;
    setResolving(true);
    try {
      await AdminAPI.resolveReport(modalData.reportId, {
        status: modalData.status,
        adminNote: adminNote.trim(),
      });
      setMessage({ type: 'success', text: `Report ${modalData.status === 'resolved' ? 'resolved' : 'dismissed'} successfully.` });
      fetchReports();
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update report.' });
    } finally {
      setResolving(false);
      setModalData(null);
      setAdminNote('');
    }
  };

  const statusColors = {
    pending: 'bg-amber-50 text-amber-700',
    resolved: 'bg-emerald-50 text-emerald-700',
    dismissed: 'bg-neutral-100 text-neutral-500',
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-heading text-neutral-800">Abuse Reports 🚩</h1>
          <p className="text-neutral-400 text-sm">Review and moderate user-reported violations.</p>
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="select text-sm">
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="resolved">Resolved</option>
          <option value="dismissed">Dismissed</option>
        </select>
      </div>

      {message.text && (
        <div className={`p-4 rounded-xl text-sm font-medium border ${message.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-red-50 border-red-100 text-red-700'}`}>
          {message.text}
        </div>
      )}

      {loading ? (
        <div className="text-center py-20 text-neutral-500">Loading abuse reports...</div>
      ) : (
        <div className="bg-white border rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full text-sm text-left">
            <thead className="bg-neutral-50 border-b text-xs font-semibold text-neutral-500 uppercase">
              <tr>
                <th className="p-4">Reporter</th>
                <th className="p-4">Reported User</th>
                <th className="p-4">Reason</th>
                <th className="p-4">Status</th>
                <th className="p-4">Date</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y text-neutral-700">
              {reports.map((r) => (
                <tr key={r._id} className="hover:bg-neutral-50/50">
                  <td className="p-4 text-xs text-neutral-500">{r.reportedBy?.email || '—'}</td>
                  <td className="p-4 font-medium">{r.reportedUser?.email || '—'}</td>
                  <td className="p-4 capitalize text-neutral-600">{r.reason?.replace(/_/g, ' ')}</td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${statusColors[r.status] || 'bg-neutral-100 text-neutral-500'}`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="p-4 text-xs text-neutral-500">{new Date(r.createdAt).toLocaleDateString()}</td>
                  <td className="p-4 text-right space-x-2">
                    {r.status === 'pending' && (
                      <>
                        <button
                          onClick={() => { setModalData({ reportId: r._id, status: 'resolved' }); setMessage({ type: '', text: '' }); }}
                          className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700"
                        >
                          Resolve
                        </button>
                        <button
                          onClick={() => { setModalData({ reportId: r._id, status: 'dismissed' }); setMessage({ type: '', text: '' }); }}
                          className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-600"
                        >
                          Dismiss
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
              {reports.length === 0 && (
                <tr><td colSpan="6" className="text-center py-10 text-neutral-400">No reports found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Resolve / Dismiss Modal */}
      {modalData && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleResolveSubmit} className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-5 shadow-2xl border animate-fade-in">
            <h3 className="text-lg font-bold font-heading text-neutral-800 capitalize">
              {modalData.status === 'resolved' ? 'Resolve Report' : 'Dismiss Report'}
            </h3>
            <p className="text-sm text-neutral-500">Provide an admin note for audit logs.</p>
            <textarea
              required
              value={adminNote}
              onChange={(e) => setAdminNote(e.target.value)}
              placeholder="Enter your moderation note..."
              className="textarea w-full h-24"
            />
            <div className="flex gap-3">
              <button type="submit" disabled={resolving} className="btn-primary flex-1 py-2.5 rounded-xl font-bold text-sm">
                {resolving ? 'Saving...' : 'Confirm'}
              </button>
              <button type="button" onClick={() => { setModalData(null); setAdminNote(''); }} className="btn-ghost flex-1 py-2.5 border rounded-xl font-bold text-sm text-neutral-600">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Reports;
