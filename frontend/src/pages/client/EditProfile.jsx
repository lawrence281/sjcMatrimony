import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProfileAPI from '@/api/profileAPI';
import axiosInstance from '@/api/axiosInstance';
import { ROUTES } from '@/constants/routes';

const EditProfile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('bio'); // bio | preferences | gallery
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: 'male',
    maritalStatus: 'never_married',
    height: '',
    weight: '',
    religion: 'christian',
    caste: '',
    aboutMe: '',
    education: 'bachelors',
    occupation: 'software_professional',
    annualIncome: '',
    city: '',
    state: '',
    country: 'India',
  });

  const [preferences, setPreferences] = useState({
    ageMin: 18,
    ageMax: 45,
    heightMin: '',
    heightMax: '',
    maritalStatus: [],
    religion: [],
    caste: [],
    education: [],
    occupation: [],
    aboutPartner: '',
  });

  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    const loadData = async () => {
      try {
        const profileRes = await ProfileAPI.getMyProfile();
        if (profileRes.data?.data?.profile) {
          const prof = profileRes.data.data.profile;
          if (prof.dateOfBirth) {
            prof.dateOfBirth = new Date(prof.dateOfBirth).toISOString().split('T')[0];
          }
          setProfile((prev) => ({ ...prev, ...prof }));
        }

        const prefRes = await ProfileAPI.getPartnerPreferences();
        if (prefRes.data?.data) {
          setPreferences((prev) => ({ ...prev, ...prefRes.data.data }));
        }

        const galleryRes = await axiosInstance.get('/gallery');
        if (galleryRes.data?.data) {
          setGallery(galleryRes.data.data);
        }
      } catch (err) {
        // Safe to ignore if profile doesn't exist yet
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });
    try {
      let response;
      const profileRes = await ProfileAPI.getMyProfile().catch(() => null);
      if (profileRes?.data?.data?.profile) {
        response = await ProfileAPI.updateMyProfile(profile);
      } else {
        response = await ProfileAPI.createProfile(profile);
      }
      setMessage({ type: 'success', text: 'Profile details saved successfully.' });
      setProfile((prev) => ({ ...prev, ...response.data?.data?.profile }));
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to save profile.' });
    } finally {
      setSaving(false);
    }
  };

  const handlePreferencesSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });
    try {
      await ProfileAPI.updatePartnerPreferences(preferences);
      setMessage({ type: 'success', text: 'Partner preferences saved successfully.' });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to save preferences.' });
    } finally {
      setSaving(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);
    formData.append('isPrimary', gallery.length === 0);

    setUploading(true);
    setMessage({ type: '', text: '' });
    try {
      await axiosInstance.post('/gallery', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const galleryRes = await axiosInstance.get('/gallery');
      setGallery(galleryRes.data?.data || []);
      setMessage({ type: 'success', text: 'Image uploaded successfully.' });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Upload failed.' });
    } finally {
      setUploading(false);
    }
  };

  const handleSetPrimary = async (imageId) => {
    setLoading(true);
    try {
      await axiosInstance.patch(`/gallery/${imageId}/primary`);
      const galleryRes = await axiosInstance.get('/gallery');
      setGallery(galleryRes.data?.data || []);
      setMessage({ type: 'success', text: 'Primary image updated.' });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update primary.' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteImage = async (imageId) => {
    setLoading(true);
    try {
      await axiosInstance.delete(`/gallery/${imageId}`);
      const galleryRes = await axiosInstance.get('/gallery');
      setGallery(galleryRes.data?.data || []);
      setMessage({ type: 'success', text: 'Image deleted successfully.' });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Delete failed.' });
    } finally {
      setLoading(false);
    }
  };

  if (loading && gallery.length === 0) {
    return <div className="text-center py-20 text-neutral-500 font-medium">Loading form details...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold font-heading text-neutral-800">Manage Profile</h1>
        <button
          onClick={() => navigate(ROUTES.CLIENT.MY_PROFILE)}
          className="btn-ghost text-sm font-semibold text-neutral-500 hover:text-neutral-700"
        >
          View Profile ➔
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-neutral-200">
        {[
          { id: 'bio', label: 'Edit Personal Info' },
          { id: 'preferences', label: 'Partner Preferences' },
          { id: 'gallery', label: 'Photo Gallery' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              setMessage({ type: '', text: '' });
            }}
            className={`px-6 py-3 text-sm font-semibold transition-all border-b-2 ${
              activeTab === tab.id
                ? 'border-primary-600 text-primary-700 font-bold'
                : 'border-transparent text-neutral-400 hover:text-neutral-600'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Message alerts */}
      {message.text && (
        <div
          className={`p-4 rounded-xl text-sm font-medium ${
            message.type === 'success'
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
              : 'bg-red-50 text-red-700 border border-red-100'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Tab: Edit Info */}
      {activeTab === 'bio' && (
        <form onSubmit={handleProfileSubmit} className="bg-white border rounded-2xl p-6 md:p-8 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-neutral-500 uppercase">First Name</label>
              <input
                type="text"
                required
                value={profile.firstName}
                onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                className="input w-full"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-neutral-500 uppercase">Last Name</label>
              <input
                type="text"
                required
                value={profile.lastName}
                onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                className="input w-full"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-neutral-500 uppercase">Date of Birth</label>
              <input
                type="date"
                required
                value={profile.dateOfBirth}
                onChange={(e) => setProfile({ ...profile, dateOfBirth: e.target.value })}
                className="input w-full"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-neutral-500 uppercase">Gender</label>
              <select
                value={profile.gender}
                onChange={(e) => setProfile({ ...profile, gender: e.target.value })}
                className="select w-full"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-neutral-500 uppercase">Marital Status</label>
              <select
                value={profile.maritalStatus}
                onChange={(e) => setProfile({ ...profile, maritalStatus: e.target.value })}
                className="select w-full"
              >
                <option value="never_married">Never Married</option>
                <option value="divorced">Divorced</option>
                <option value="widowed">Widowed</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-neutral-500 uppercase">Height (cm)</label>
              <input
                type="number"
                value={profile.height}
                onChange={(e) => setProfile({ ...profile, height: e.target.value })}
                className="input w-full"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-neutral-500 uppercase">About Me</label>
            <textarea
              value={profile.aboutMe}
              onChange={(e) => setProfile({ ...profile, aboutMe: e.target.value })}
              className="textarea w-full h-24"
              placeholder="Tell other members about yourself..."
            />
          </div>

          <button type="submit" disabled={saving} className="btn-primary w-full py-3 rounded-xl font-bold">
            {saving ? 'Saving Details...' : 'Save Profile details'}
          </button>
        </form>
      )}

      {/* Tab: Partner Preferences */}
      {activeTab === 'preferences' && (
        <form onSubmit={handlePreferencesSubmit} className="bg-white border rounded-2xl p-6 md:p-8 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-neutral-500 uppercase">Desired Age (Min)</label>
              <input
                type="number"
                value={preferences.ageMin}
                onChange={(e) => setPreferences({ ...preferences, ageMin: e.target.value })}
                className="input w-full"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-neutral-500 uppercase">Desired Age (Max)</label>
              <input
                type="number"
                value={preferences.ageMax}
                onChange={(e) => setPreferences({ ...preferences, ageMax: e.target.value })}
                className="input w-full"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-neutral-500 uppercase">About Partner</label>
            <textarea
              value={preferences.aboutPartner}
              onChange={(e) => setPreferences({ ...preferences, aboutPartner: e.target.value })}
              className="textarea w-full h-24"
              placeholder="Describe your ideal companion..."
            />
          </div>

          <button type="submit" disabled={saving} className="btn-primary w-full py-3 rounded-xl font-bold">
            {saving ? 'Saving Preferences...' : 'Save Partner Preferences'}
          </button>
        </form>
      )}

      {/* Tab: Gallery */}
      {activeTab === 'gallery' && (
        <div className="bg-white border rounded-2xl p-6 md:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
            <div>
              <h2 className="text-base font-bold text-neutral-800">Your Gallery Photos</h2>
              <p className="text-xs text-neutral-400">First photo uploaded defaults to your primary profile image.</p>
            </div>
            <label className="btn btn-secondary cursor-pointer shrink-0">
              {uploading ? 'Uploading Photo...' : 'Upload Photo'}
              <input type="file" onChange={handleFileUpload} accept="image/*" className="hidden" disabled={uploading} />
            </label>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {gallery.map((img) => (
              <div key={img._id} className="relative group border rounded-xl overflow-hidden bg-neutral-50 aspect-square">
                <img src={img.imageUrl} alt="Gallery item" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col justify-end p-2 gap-1.5 transition-all duration-150">
                  {!img.isPrimary && (
                    <button
                      onClick={() => handleSetPrimary(img._id)}
                      className="bg-white/95 text-neutral-800 text-[10px] py-1 rounded font-bold hover:bg-white"
                    >
                      Make Primary
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteImage(img._id)}
                    className="bg-red-600 text-white text-[10px] py-1 rounded font-bold hover:bg-red-700"
                  >
                    Delete Photo
                  </button>
                </div>
                {img.isPrimary && (
                  <span className="absolute top-2 left-2 bg-primary-600 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded shadow">
                    Primary
                  </span>
                )}
              </div>
            ))}
            {gallery.length === 0 && (
              <div className="col-span-full text-center py-10 text-neutral-400 text-sm">
                No gallery photos uploaded yet. Upload your first image.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EditProfile;
