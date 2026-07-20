import { useEffect, useState, useCallback } from 'react';
import AdminAPI from '@/api/adminAPI';

// ── Constants ────────────────────────────────────────────────────────────────

const GENDER_OPTIONS = ['male', 'female', 'other'];
const MARITAL_OPTIONS = ['never_married', 'divorced', 'widowed', 'separated'];
const STATUS_OPTIONS = ['pending', 'approved', 'active', 'suspended', 'incomplete'];

const STATUS_STYLES = {
  approved: 'bg-emerald-50 text-emerald-700',
  active: 'bg-emerald-50 text-emerald-700',
  pending: 'bg-amber-50 text-amber-700',
  suspended: 'bg-red-50 text-red-600',
  incomplete: 'bg-neutral-100 text-neutral-500',
  deleted: 'bg-neutral-100 text-neutral-400',
};

const EMPTY_FORM = {
  // Account
  email: '', phone: '', password: '',
  // Profile — required
  firstName: '', lastName: '', dateOfBirth: '', gender: '', maritalStatus: '',
  // Profile — optional
  religion: '', caste: '', education: '', occupation: '',
  city: '', state: '', country: '', annualIncome: '',
  aboutMe: '', adminNotes: '',
};

// ── Sub-components ───────────────────────────────────────────────────────────

/** Small green/red/amber badge for notification outcomes */
const WhatsAppBadge = ({ queued }) => (
  <span
    title={queued ? 'WhatsApp onboarding message dispatched' : 'WhatsApp not sent'}
    className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
      queued ? 'bg-green-50 text-green-700' : 'bg-neutral-100 text-neutral-400'
    }`}
  >
    <span>💬</span>
    {queued ? 'WA Sent' : 'WA Skipped'}
  </span>
);

/** Reusable labelled form field wrapper */
const Field = ({ label, required, children }) => (
  <div className="space-y-1">
    <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wide">
      {label} {required && <span className="text-red-400">*</span>}
    </label>
    {children}
  </div>
);

/** Section header for the multi-step form */
const SectionHeader = ({ icon, title }) => (
  <div className="flex items-center gap-2 mb-4 pb-2 border-b border-neutral-100">
    <span className="text-lg">{icon}</span>
    <h4 className="text-sm font-bold text-neutral-700 uppercase tracking-wide">{title}</h4>
  </div>
);

// ── Pagination controls ──────────────────────────────────────────────────────

const Pagination = ({ page, totalPages, onPageChange }) => (
  <div className="flex items-center gap-2 mt-4 justify-center">
    <button
      onClick={() => onPageChange(page - 1)}
      disabled={page <= 1}
      className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-neutral-100 hover:bg-neutral-200 disabled:opacity-40 disabled:cursor-not-allowed"
    >
      ← Prev
    </button>
    <span className="text-xs text-neutral-500 font-medium">
      Page {page} of {totalPages || 1}
    </span>
    <button
      onClick={() => onPageChange(page + 1)}
      disabled={page >= totalPages}
      className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-neutral-100 hover:bg-neutral-200 disabled:opacity-40 disabled:cursor-not-allowed"
    >
      Next →
    </button>
  </div>
);

// ── Main page component ──────────────────────────────────────────────────────

const ClientProfiles = () => {
  // ── State ─────────────────────────────────────────────────────────────────
  const [profiles, setProfiles]     = useState([]);
  const [total, setTotal]           = useState(0);
  const [loading, setLoading]       = useState(true);
  const [filters, setFilters]       = useState({ page: 1, limit: 10, status: '', search: '', gender: '' });

  const [mode, setMode]             = useState(null); // 'create' | 'edit'
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [form, setForm]             = useState(EMPTY_FORM);
  const [saving, setSaving]         = useState(false);

  const [toast, setToast]           = useState({ type: '', text: '' });
  const [deleteConfirm, setDeleteConfirm] = useState(null); // profileId to delete
  const [lastWhatsApp, setLastWhatsApp] = useState(null); // { queued: bool }

  // ── Fetch ──────────────────────────────────────────────────────────────────
  const fetchProfiles = useCallback(async () => {
    setLoading(true);
    try {
      const res = await AdminAPI.getClientProfiles(filters);
      setProfiles(res.data?.data || []);
      setTotal(res.data?.meta?.total || 0);
    } catch {
      setProfiles([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { fetchProfiles(); }, [filters.page, filters.status, filters.gender]);

  // ── Toast helper ───────────────────────────────────────────────────────────
  const showToast = (type, text) => {
    setToast({ type, text });
    setTimeout(() => setToast({ type: '', text: '' }), 5000);
  };

  // ── Open Create modal ──────────────────────────────────────────────────────
  const openCreate = () => {
    setForm(EMPTY_FORM);
    setSelectedProfile(null);
    setLastWhatsApp(null);
    setMode('create');
  };

  // ── Open Edit modal ────────────────────────────────────────────────────────
  const openEdit = async (profile) => {
    setMode('edit');
    setSelectedProfile(profile);
    setLastWhatsApp(null);
    // Pre-fill form with existing values
    setForm({
      email:         profile.userId?.email || '',
      phone:         profile.userId?.phone || '',
      password:      '',
      firstName:     profile.firstName || '',
      lastName:      profile.lastName || '',
      dateOfBirth:   profile.dateOfBirth ? profile.dateOfBirth.substring(0, 10) : '',
      gender:        profile.gender || '',
      maritalStatus: profile.maritalStatus || '',
      religion:      profile.religion || '',
      caste:         profile.caste || '',
      education:     profile.education || '',
      occupation:    profile.occupation || '',
      city:          profile.city || '',
      state:         profile.state || '',
      country:       profile.country || '',
      annualIncome:  profile.annualIncome || '',
      aboutMe:       profile.aboutMe || '',
      adminNotes:    profile.adminNotes || '',
    });
  };

  // ── Handle form field change ───────────────────────────────────────────────
  const handleField = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  // ── Submit (create or edit) ────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (mode === 'create') {
        const payload = { ...form };
        if (payload.annualIncome) payload.annualIncome = Number(payload.annualIncome);
        const res = await AdminAPI.createClientProfile(payload);
        setLastWhatsApp(res.data?.meta?.whatsapp || null);
        showToast('success', '✅ Member profile created successfully!');
      } else {
        // For edit: only send changed fields, skip empty password
        const payload = { ...form };
        if (!payload.password) delete payload.password;
        if (payload.annualIncome) payload.annualIncome = Number(payload.annualIncome);
        await AdminAPI.updateClientProfile(selectedProfile._id, payload);
        showToast('success', '✅ Member profile updated successfully!');
      }
      setMode(null);
      fetchProfiles();
    } catch (err) {
      showToast('error', err.response?.data?.message || 'Operation failed. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // ── Delete ─────────────────────────────────────────────────────────────────
  const handleDelete = async () => {
    if (!deleteConfirm) return;
    try {
      await AdminAPI.deleteClientProfile(deleteConfirm);
      showToast('success', 'Member profile deleted successfully.');
      setDeleteConfirm(null);
      fetchProfiles();
    } catch (err) {
      showToast('error', err.response?.data?.message || 'Delete failed.');
      setDeleteConfirm(null);
    }
  };

  // ── Derived ────────────────────────────────────────────────────────────────
  const totalPages = Math.ceil(total / filters.limit);

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6 animate-fade-in">

      {/* ── Page Header ─────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-neutral-800">Members 💍</h1>
          <p className="text-neutral-400 text-sm mt-0.5">
            Create and manage matrimony member profiles.
            <span className="ml-2 text-neutral-300">({total} total)</span>
          </p>
        </div>
        <button
          id="btn-create-member"
          onClick={openCreate}
          className="btn-primary px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 shadow-glow"
        >
          <span>+</span> Add Member
        </button>
      </div>

      {/* ── Toast ───────────────────────────────────────────────────────── */}
      {toast.text && (
        <div
          className={`px-4 py-3 rounded-xl text-sm font-medium border flex items-center gap-2 ${
            toast.type === 'success'
              ? 'bg-emerald-50 border-emerald-100 text-emerald-700'
              : 'bg-red-50 border-red-100 text-red-700'
          }`}
        >
          {toast.text}
          {lastWhatsApp && <WhatsAppBadge queued={lastWhatsApp.queued} />}
        </div>
      )}

      {/* ── Filters ─────────────────────────────────────────────────────── */}
      <form
        onSubmit={(e) => { e.preventDefault(); setFilters((f) => ({ ...f, page: 1 })); fetchProfiles(); }}
        className="bg-white border rounded-2xl p-4 flex flex-col sm:flex-row gap-4 items-end shadow-sm"
      >
        <div className="flex-1 space-y-1">
          <label className="text-xs font-semibold text-neutral-500 uppercase">Search</label>
          <input
            type="text"
            value={filters.search}
            onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
            placeholder="Name, Profile ID..."
            className="input w-full"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-semibold text-neutral-500 uppercase">Status</label>
          <select
            value={filters.status}
            onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value, page: 1 }))}
            className="select"
          >
            <option value="">All Statuses</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
            ))}
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-xs font-semibold text-neutral-500 uppercase">Gender</label>
          <select
            value={filters.gender}
            onChange={(e) => setFilters((f) => ({ ...f, gender: e.target.value, page: 1 }))}
            className="select"
          >
            <option value="">All</option>
            {GENDER_OPTIONS.map((g) => (
              <option key={g} value={g}>{g.charAt(0).toUpperCase() + g.slice(1)}</option>
            ))}
          </select>
        </div>
        <button type="submit" className="btn-primary py-2.5 px-5 rounded-xl font-bold text-xs uppercase">
          Filter
        </button>
      </form>

      {/* ── Table ───────────────────────────────────────────────────────── */}
      {loading ? (
        <div className="text-center py-20 text-neutral-500 font-medium animate-pulse">
          Loading member profiles...
        </div>
      ) : (
        <div className="bg-white border rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-neutral-50 border-b text-xs font-semibold text-neutral-500 uppercase">
                <tr>
                  <th className="p-4">Profile ID</th>
                  <th className="p-4">Member</th>
                  <th className="p-4">Contact</th>
                  <th className="p-4">Gender / Age</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y text-neutral-700">
                {profiles.map((p) => (
                  <tr key={p._id} className="hover:bg-neutral-50/50 transition-colors">
                    <td className="p-4 font-mono font-bold text-primary-600 text-xs">
                      {p.profileId || '—'}
                    </td>
                    <td className="p-4">
                      <div className="font-semibold text-neutral-800">
                        {p.firstName} {p.lastName}
                      </div>
                      <div className="text-xs text-neutral-400 mt-0.5">
                        {p.religion ? `${p.religion}${p.caste ? ` • ${p.caste}` : ''}` : 'No religion specified'}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-xs text-neutral-600">{p.userId?.email || '—'}</div>
                      <div className="text-xs text-neutral-400 mt-0.5">{p.userId?.phone || '—'}</div>
                    </td>
                    <td className="p-4 capitalize text-sm">
                      {p.gender || '—'} {p.age ? `• ${p.age} yrs` : ''}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                          STATUS_STYLES[p.status] || 'bg-neutral-100 text-neutral-400'
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        id={`btn-edit-${p._id}`}
                        onClick={() => openEdit(p)}
                        className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-primary-50 hover:bg-primary-100 text-primary-700 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        id={`btn-delete-${p._id}`}
                        onClick={() => setDeleteConfirm(p._id)}
                        className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {profiles.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-center py-16 text-neutral-400 font-medium">
                      <div className="text-4xl mb-3">💍</div>
                      No member profiles found. Create the first one!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="border-t p-4">
              <Pagination
                page={filters.page}
                totalPages={totalPages}
                onPageChange={(p) => setFilters((f) => ({ ...f, page: p }))}
              />
            </div>
          )}
        </div>
      )}

      {/* ── Create / Edit Modal ──────────────────────────────────────────── */}
      {mode && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center p-4 overflow-y-auto">
          <form
            onSubmit={handleSubmit}
            id="form-client-profile"
            className="bg-white rounded-3xl w-full max-w-2xl my-8 shadow-2xl border animate-fade-in overflow-hidden"
          >
            {/* Modal header */}
            <div className="px-6 py-5 border-b bg-gradient-to-r from-primary-50 to-white flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold font-heading text-neutral-800">
                  {mode === 'create' ? '➕ Add New Member' : '✏️ Edit Member Profile'}
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  {mode === 'create'
                    ? 'A WhatsApp onboarding message will be sent after creation.'
                    : `Editing: ${selectedProfile?.profileId}`}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setMode(null)}
                className="text-neutral-400 hover:text-neutral-600 text-xl font-bold leading-none transition-colors"
              >
                ×
              </button>
            </div>

            <div className="p-6 space-y-8">
              {/* ── Section 1: Account Credentials ──────────────────────── */}
              <div>
                <SectionHeader icon="🔐" title="Account Credentials" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Email" required>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={handleField('email')}
                      placeholder="member@email.com"
                      className="input w-full"
                    />
                  </Field>
                  <Field label="Phone" required>
                    <input
                      type="tel"
                      required
                      value={form.phone}
                      onChange={handleField('phone')}
                      placeholder="10-digit Indian number"
                      maxLength={10}
                      className="input w-full"
                    />
                  </Field>
                  <Field label={mode === 'create' ? 'Password' : 'New Password (leave blank to keep)'} required={mode === 'create'}>
                    <input
                      type="password"
                      required={mode === 'create'}
                      value={form.password}
                      onChange={handleField('password')}
                      placeholder={mode === 'create' ? 'Min 8 chars, A-Z, 0-9, special' : 'Leave blank to keep current'}
                      className="input w-full"
                    />
                  </Field>
                </div>
              </div>

              {/* ── Section 2: Personal Details ──────────────────────────── */}
              <div>
                <SectionHeader icon="👤" title="Personal Details" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="First Name" required>
                    <input
                      type="text"
                      required
                      value={form.firstName}
                      onChange={handleField('firstName')}
                      placeholder="First name"
                      className="input w-full"
                    />
                  </Field>
                  <Field label="Last Name" required>
                    <input
                      type="text"
                      required
                      value={form.lastName}
                      onChange={handleField('lastName')}
                      placeholder="Last name"
                      className="input w-full"
                    />
                  </Field>
                  <Field label="Date of Birth" required>
                    <input
                      type="date"
                      required
                      value={form.dateOfBirth}
                      onChange={handleField('dateOfBirth')}
                      max={new Date().toISOString().split('T')[0]}
                      className="input w-full"
                    />
                  </Field>
                  <Field label="Gender" required>
                    <select
                      required
                      value={form.gender}
                      onChange={handleField('gender')}
                      className="select w-full"
                    >
                      <option value="">Select gender</option>
                      {GENDER_OPTIONS.map((g) => (
                        <option key={g} value={g}>{g.charAt(0).toUpperCase() + g.slice(1)}</option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Marital Status" required>
                    <select
                      required
                      value={form.maritalStatus}
                      onChange={handleField('maritalStatus')}
                      className="select w-full"
                    >
                      <option value="">Select status</option>
                      {MARITAL_OPTIONS.map((m) => (
                        <option key={m} value={m}>{m.replace('_', ' ')}</option>
                      ))}
                    </select>
                  </Field>
                </div>
              </div>

              {/* ── Section 3: Religion & Community ─────────────────────── */}
              <div>
                <SectionHeader icon="🛕" title="Religion & Community" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Religion">
                    <input
                      type="text"
                      value={form.religion}
                      onChange={handleField('religion')}
                      placeholder="e.g. Hindu, Christian..."
                      className="input w-full"
                    />
                  </Field>
                  <Field label="Caste">
                    <input
                      type="text"
                      value={form.caste}
                      onChange={handleField('caste')}
                      placeholder="Caste / Community"
                      className="input w-full"
                    />
                  </Field>
                </div>
              </div>

              {/* ── Section 4: Education & Career ────────────────────────── */}
              <div>
                <SectionHeader icon="🎓" title="Education & Career" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Education">
                    <input
                      type="text"
                      value={form.education}
                      onChange={handleField('education')}
                      placeholder="Highest education"
                      className="input w-full"
                    />
                  </Field>
                  <Field label="Occupation">
                    <input
                      type="text"
                      value={form.occupation}
                      onChange={handleField('occupation')}
                      placeholder="Job / Profession"
                      className="input w-full"
                    />
                  </Field>
                  <Field label="Annual Income (₹)">
                    <input
                      type="number"
                      min={0}
                      value={form.annualIncome}
                      onChange={handleField('annualIncome')}
                      placeholder="e.g. 500000"
                      className="input w-full"
                    />
                  </Field>
                </div>
              </div>

              {/* ── Section 5: Location ──────────────────────────────────── */}
              <div>
                <SectionHeader icon="📍" title="Location" />
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Field label="City">
                    <input type="text" value={form.city} onChange={handleField('city')} placeholder="City" className="input w-full" />
                  </Field>
                  <Field label="State">
                    <input type="text" value={form.state} onChange={handleField('state')} placeholder="State" className="input w-full" />
                  </Field>
                  <Field label="Country">
                    <input type="text" value={form.country} onChange={handleField('country')} placeholder="Country" className="input w-full" />
                  </Field>
                </div>
              </div>

              {/* ── Section 6: About & Notes ─────────────────────────────── */}
              <div>
                <SectionHeader icon="📝" title="About & Notes" />
                <div className="space-y-4">
                  <Field label="About Member">
                    <textarea
                      value={form.aboutMe}
                      onChange={handleField('aboutMe')}
                      placeholder="Brief description about the member..."
                      maxLength={1000}
                      rows={3}
                      className="textarea w-full"
                    />
                  </Field>
                  <Field label="Admin Notes (internal)">
                    <textarea
                      value={form.adminNotes}
                      onChange={handleField('adminNotes')}
                      placeholder="Internal notes visible only to admins..."
                      maxLength={500}
                      rows={2}
                      className="textarea w-full"
                    />
                  </Field>
                </div>
              </div>
            </div>

            {/* Modal footer */}
            <div className="px-6 py-4 border-t bg-neutral-50/50 flex gap-3">
              <button
                type="submit"
                id="btn-submit-profile"
                disabled={saving}
                className="btn-primary flex-1 py-3 rounded-xl font-bold text-sm disabled:opacity-60"
              >
                {saving
                  ? (mode === 'create' ? 'Creating...' : 'Saving...')
                  : (mode === 'create' ? '💍 Create Member Profile' : '✅ Save Changes')}
              </button>
              <button
                type="button"
                onClick={() => setMode(null)}
                className="btn-ghost flex-1 py-3 border rounded-xl font-bold text-sm text-neutral-600 hover:bg-neutral-100"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── Delete Confirmation Modal ────────────────────────────────────── */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-5 shadow-2xl border animate-fade-in text-center">
            <div className="text-5xl">⚠️</div>
            <div>
              <h3 className="text-lg font-bold text-neutral-800">Delete Member Profile?</h3>
              <p className="text-sm text-neutral-500 mt-1">
                This will soft-delete the profile and deactivate the user account.
                The data is retained for audit purposes.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                id="btn-confirm-delete"
                onClick={handleDelete}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 rounded-xl text-sm transition-colors"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-bold py-2.5 rounded-xl text-sm transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientProfiles;
