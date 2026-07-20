import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SearchAPI from '@/api/searchAPI';
import InterestAPI from '@/api/interestAPI';
import axiosInstance from '@/api/axiosInstance';
import Icon from '@/components/common/Icon/Icon';

const ViewProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [sendingId, setSendingId] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await SearchAPI.getProfileById(id);
        setProfile(res.data?.data);
      } catch (err) {
        setMessage('Failed to load profile.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id]);

  const handleSendInterest = async () => {
    setSendingId(profile.userId);
    setMessage('');
    try {
      await InterestAPI.sendInterest(profile.userId, { message: 'I am interested in your profile.' });
      setMessage('Interest invitation sent successfully!');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to send interest invitation.');
    } finally {
      setSendingId(null);
    }
  };

  const handleShortlist = async () => {
    setMessage('');
    try {
      await axiosInstance.post('/shortlist', { shortlistedUserId: profile.userId });
      setMessage('Profile added to shortlist.');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to shortlist profile.');
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
      <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
      <p className="text-slate-500 font-medium animate-pulse">Loading profile details...</p>
    </div>
  );

  if (!profile) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
      <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
        <Icon name="x" size={32} />
      </div>
      <h2 className="text-2xl font-bold font-serif text-slate-900">Profile Not Found</h2>
      <p className="text-slate-500">The profile you are looking for does not exist or is private.</p>
      <button onClick={() => navigate(-1)} className="btn bg-primary-600 text-white hover:bg-primary-700 px-6 py-2.5 rounded-xl font-bold mt-4">Go Back</button>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in pb-12">
      
      {/* Header Profile Card */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-soft overflow-hidden relative">
        <div className="h-48 md:h-64 bg-gradient-to-r from-primary-600 to-accent-600 relative overflow-hidden">
           <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
           <button onClick={() => navigate(-1)} className="absolute top-6 left-6 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors">
             <Icon name="chevronLeft" size={20} />
           </button>
        </div>
        
        <div className="px-6 md:px-12 pb-10 relative">
          <div className="flex flex-col md:flex-row gap-6 md:gap-10">
            {/* Avatar */}
            <div className="-mt-20 md:-mt-24 relative z-10 shrink-0">
              <div className="w-40 h-40 md:w-48 md:h-48 rounded-[2rem] border-8 border-white shadow-xl overflow-hidden bg-slate-100">
                <img src={profile.avatar || profile.profilePicture || `https://ui-avatars.com/api/?name=${profile.firstName}+${profile.lastName}&background=14b8a6&color=fff&size=400`} alt={profile.firstName} className="w-full h-full object-cover" />
              </div>
            </div>
            
            {/* Basic Info */}
            <div className="pt-2 flex-1">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold font-serif text-slate-900 tracking-tight flex items-center gap-3">
                    {profile.firstName} {profile.lastName}
                    {profile.isVerified && <Icon name="shieldCheck" size={24} className="text-success-500" />}
                  </h1>
                  <p className="text-lg text-slate-500 mt-1 font-medium">{profile.profileId}</p>
                </div>
                <div className="flex gap-3">
                  <button onClick={handleShortlist} className="btn bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 px-6 py-3 rounded-xl font-bold shadow-sm flex items-center gap-2 transition-all">
                    <Icon name="star" size={18} className="text-slate-400" /> Shortlist
                  </button>
                  <button onClick={handleSendInterest} disabled={sendingId === profile.userId} className="btn bg-primary-600 hover:bg-primary-700 text-white shadow-glow border border-primary-500 px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-all">
                    <Icon name="heart" size={18} /> {sendingId === profile.userId ? 'Sending...' : 'Connect'}
                  </button>
                </div>
              </div>
              
              {message && (
                <div className="mb-6 p-4 bg-primary-50 text-primary-800 text-sm font-medium rounded-2xl inline-block">
                  {message}
                </div>
              )}
              
              <div className="flex flex-wrap gap-x-8 gap-y-4 text-slate-600 font-medium">
                <div className="flex items-center gap-2"><Icon name="calendar" size={18} className="text-slate-400" /> {profile.age} Years, {profile.height ? `${profile.height} cm` : ''}</div>
                <div className="flex items-center gap-2"><Icon name="mapPin" size={18} className="text-slate-400" /> {profile.city || 'Location N/A'}</div>
                <div className="flex items-center gap-2"><Icon name="briefcase" size={18} className="text-slate-400" /> {profile.occupation || 'Occupation N/A'}</div>
                <div className="flex items-center gap-2"><Icon name="graduationCap" size={18} className="text-slate-400" /> {profile.education || 'Education N/A'}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* About Me */}
          <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-soft">
            <h3 className="text-xl font-bold font-serif text-slate-900 mb-6 flex items-center gap-2">
              <Icon name="user" size={20} className="text-primary-500" /> About {profile.firstName}
            </h3>
            <p className="text-slate-600 leading-relaxed font-light text-lg">
              {profile.aboutMe || `${profile.firstName} has not provided an about me section yet.`}
            </p>
          </div>
          
          {/* Detailed Stats Grid */}
          <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-soft">
             <h3 className="text-xl font-bold font-serif text-slate-900 mb-6 flex items-center gap-2">
              <Icon name="image" size={20} className="text-primary-500" /> Background & Lifestyle
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
              {[
                { label: 'Religion', value: profile.religion },
                { label: 'Caste', value: profile.caste },
                { label: 'Mother Tongue', value: profile.motherTongue },
                { label: 'Marital Status', value: profile.maritalStatus },
                { label: 'Diet', value: profile.diet },
                { label: 'Annual Income', value: profile.income },
              ].map((item, i) => (
                <div key={i} className="flex flex-col">
                  <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-1">{item.label}</span>
                  <span className="text-slate-800 font-medium">{item.value || 'Not specified'}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Right Sidebar - Partner Preferences (Mock for UI) */}
        <div className="space-y-8">
          <div className="bg-slate-900 rounded-3xl p-8 shadow-xl border border-slate-800 text-white relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-primary-600/20 rounded-full blur-2xl"></div>
             <h3 className="text-xl font-bold font-serif mb-6 flex items-center gap-2 relative z-10">
              <Icon name="heart" size={20} className="text-primary-400" /> Partner Preferences
            </h3>
            
            <div className="space-y-5 relative z-10">
              <div className="flex justify-between border-b border-slate-700/50 pb-3">
                <span className="text-slate-400">Age</span>
                <span className="font-medium text-right">{profile.age - 3} to {profile.age + 3} Yrs</span>
              </div>
              <div className="flex justify-between border-b border-slate-700/50 pb-3">
                <span className="text-slate-400">Height</span>
                <span className="font-medium text-right">Any</span>
              </div>
              <div className="flex justify-between border-b border-slate-700/50 pb-3">
                <span className="text-slate-400">Marital Status</span>
                <span className="font-medium text-right">Never Married</span>
              </div>
              <div className="flex justify-between pb-1">
                <span className="text-slate-400">Religion</span>
                <span className="font-medium text-right">{profile.religion || 'Any'}</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-soft text-center">
            <div className="w-16 h-16 bg-success-50 text-success-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="shieldCheck" size={32} />
            </div>
            <h4 className="font-bold font-serif text-slate-900 mb-2">Verified Profile</h4>
            <p className="text-sm text-slate-500 leading-relaxed">
              This profile has been verified with a government ID.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewProfile;
