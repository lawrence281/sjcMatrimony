import { useEffect, useState } from 'react';
import AdminAPI from '@/api/adminAPI';

const Settings = () => {
  const [settings, setSettings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editKey, setEditKey] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await AdminAPI.getSettings();
      const data = res.data?.data;
      setSettings(Array.isArray(data) ? data : []);
    } catch {
      setSettings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSettings(); }, []);

  const startEdit = (setting) => {
    setEditKey(setting.key);
    setEditValue(String(setting.value));
    setMessage({ type: '', text: '' });
  };

  const cancelEdit = () => {
    setEditKey(null);
    setEditValue('');
  };

  const handleSave = async (key) => {
    setSaving(true);
    try {
      // Coerce type: booleans from string, numbers from string
      let coerced = editValue;
      if (editValue === 'true') coerced = true;
      else if (editValue === 'false') coerced = false;
      else if (!isNaN(editValue) && editValue.trim() !== '') coerced = Number(editValue);

      await AdminAPI.updateSetting(key, coerced);
      setMessage({ type: 'success', text: `Setting "${key}" updated successfully.` });
      setEditKey(null);
      fetchSettings();
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update setting.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold font-heading text-neutral-800">Platform Settings ⚙️</h1>
        <p className="text-neutral-400 text-sm">Configure system-wide settings for the platform.</p>
      </div>

      {message.text && (
        <div className={`p-4 rounded-xl text-sm font-medium border ${message.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-red-50 border-red-100 text-red-700'}`}>
          {message.text}
        </div>
      )}

      {loading ? (
        <div className="text-center py-20 text-neutral-500">Loading settings...</div>
      ) : (
        <div className="bg-white border rounded-2xl divide-y shadow-sm overflow-hidden">
          {settings.map((s) => (
            <div key={s.key} className="p-5 flex flex-col sm:flex-row sm:items-center gap-4 hover:bg-neutral-50/50">
              <div className="flex-1 space-y-0.5 min-w-0">
                <p className="font-mono font-bold text-xs text-primary-600">{s.key}</p>
                <p className="text-sm font-medium text-neutral-700">{s.description || s.key}</p>
              </div>

              {editKey === s.key ? (
                <div className="flex items-center gap-2 shrink-0">
                  <input
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="input text-sm py-2 px-3 w-44"
                    autoFocus
                  />
                  <button onClick={() => handleSave(s.key)} disabled={saving} className="btn-primary text-xs py-2 px-4 rounded-lg font-bold">
                    {saving ? '...' : 'Save'}
                  </button>
                  <button onClick={cancelEdit} className="btn-ghost text-xs py-2 px-3 border rounded-lg text-neutral-600">
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3 shrink-0">
                  <span className={`font-mono text-xs font-bold px-3 py-1.5 rounded-lg border ${
                    typeof s.value === 'boolean'
                      ? s.value ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-red-50 border-red-100 text-red-600'
                      : 'bg-neutral-50 border-neutral-200 text-neutral-700'
                  }`}>
                    {String(s.value)}
                  </span>
                  <button onClick={() => startEdit(s)} className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-600">
                    Edit
                  </button>
                </div>
              )}
            </div>
          ))}
          {settings.length === 0 && (
            <div className="text-center py-10 text-neutral-400">No settings found.</div>
          )}
        </div>
      )}
    </div>
  );
};

export default Settings;
