import { useEffect, useState } from 'react';
import AdminAPI from '@/api/adminAPI';
import { ROLES } from '@/constants/roles';

const ADMIN_ROLES = [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MODERATOR];

const Users = () => {
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ email: '', phone: '', password: '', role: ROLES.ADMIN });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await AdminAPI.getUsers({ limit: 50 });
      const data = res.data?.data || [];
      setUsers(Array.isArray(data) ? data : []);
      setTotal(res.data?.meta?.total || data.length);
    } catch {
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });
    try {
      await AdminAPI.createAdminUser(form);
      setMessage({ type: 'success', text: 'Staff account created successfully.' });
      setShowModal(false);
      setForm({ email: '', phone: '', password: '', role: ROLES.ADMIN });
      fetchUsers();
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to create account.' });
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      await AdminAPI.toggleUserStatus(id);
      fetchUsers();
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to toggle status.' });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this staff account permanently?')) return;
    try {
      await AdminAPI.deleteUser(id);
      fetchUsers();
      setMessage({ type: 'success', text: 'Staff account deleted.' });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to delete account.' });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-heading text-neutral-800">Team Members 👥</h1>
          <p className="text-neutral-400 text-sm">Manage administrative staff accounts.</p>
        </div>
        <button onClick={() => { setShowModal(true); setMessage({ type: '', text: '' }); }} className="btn-primary px-5 py-2.5 rounded-xl text-sm font-bold">
          + Add Staff
        </button>
      </div>

      {message.text && (
        <div className={`p-4 rounded-xl text-sm font-medium border ${message.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-red-50 border-red-100 text-red-700'}`}>
          {message.text}
        </div>
      )}

      {loading ? (
        <div className="text-center py-20 text-neutral-500">Loading staff accounts...</div>
      ) : (
        <div className="bg-white border rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full text-sm text-left">
            <thead className="bg-neutral-50 border-b text-xs font-semibold text-neutral-500 uppercase">
              <tr>
                <th className="p-4">Email</th>
                <th className="p-4">Phone</th>
                <th className="p-4">Role</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y text-neutral-700">
              {users.map((u) => (
                <tr key={u._id} className="hover:bg-neutral-50/50">
                  <td className="p-4 font-medium">{u.email}</td>
                  <td className="p-4 text-neutral-500">{u.phone || '—'}</td>
                  <td className="p-4 capitalize">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary-50 text-primary-700">
                      {u.role?.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${u.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-neutral-100 text-neutral-400'}`}>
                      {u.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button onClick={() => handleToggleStatus(u._id)} className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-700">
                      {u.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                    <button onClick={() => handleDelete(u._id)} className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr><td colSpan="5" className="text-center py-10 text-neutral-400">No staff accounts found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Create Staff Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleCreate} className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl border animate-fade-in">
            <h3 className="text-lg font-bold font-heading text-neutral-800">Add Staff Account</h3>

            {message.text && showModal && (
              <div className={`p-3 rounded-lg text-xs font-medium ${message.type === 'error' ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700'}`}>
                {message.text}
              </div>
            )}

            <div className="space-y-4">
              <input required type="email" placeholder="Email address" value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })} className="input w-full" />
              <input required type="tel" placeholder="Phone number" value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })} className="input w-full" />
              <input required type="password" placeholder="Temporary password" value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })} className="input w-full" />
              <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="select w-full">
                {ADMIN_ROLES.map((r) => (
                  <option key={r} value={r}>{r.replace('_', ' ')}</option>
                ))}
              </select>
            </div>

            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={saving} className="btn-primary flex-1 py-2.5 rounded-xl font-bold text-sm">
                {saving ? 'Creating...' : 'Create Account'}
              </button>
              <button type="button" onClick={() => setShowModal(false)} className="btn-ghost flex-1 py-2.5 border rounded-xl font-bold text-sm text-neutral-600">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Users;
