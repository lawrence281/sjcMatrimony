import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProfileAPI from '@/api/profileAPI';
import { ROUTES } from '@/constants/routes';

const MyProfile = () => {
  const [profile, setProfile] = useState(null);
  const [preferences, setPreferences] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const profileRes = await ProfileAPI.getMyProfile();
        setProfile(profileRes.data?.data?.profile);

        try {
          const prefRes = await ProfileAPI.getPartnerPreferences();
          setPreferences(prefRes.data?.data);
        } catch (prefError) {
          // Silent catch if preferences are not set yet
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load profile details.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  if (loading) {
    return <div className="text-center py-20 font-medium text-neutral-500">Loading your profile...</div>;
  }

  if (error || !profile) {
    return (
      <div className="text-center py-20">
        <p className="text-red-500 mb-4">{error || 'You have not created a profile yet.'}</p>
        <Link to={ROUTES.CLIENT.EDIT_PROFILE} className="btn btn-primary">
          Create Profile Now
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      {/* Header card */}
      <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-6 md:p-8 flex flex-col md:flex-row gap-6 items-center md:items-start">
        <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl overflow-hidden bg-neutral-100 flex items-center justify-center border border-neutral-200 shadow-sm shrink-0">
          {profile.profilePicture ? (
            <img
              src={profile.profilePicture}
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-4xl text-neutral-300">👤</span>
          )}
        </div>
        <div className="flex-1 text-center md:text-left space-y-2">
          <div className="flex flex-col md:flex-row md:items-center gap-2 justify-center md:justify-start">
            <h1 className="text-2xl font-bold font-heading text-neutral-800">
              {profile.firstName} {profile.lastName}
            </h1>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary-50 text-primary-700 w-fit mx-auto md:mx-0">
              {profile.profileId}
            </span>
            {profile.isVerified && (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 w-fit mx-auto md:mx-0">
                Verified
              </span>
            )}
          </div>
          <p className="text-neutral-500 text-sm max-w-lg leading-relaxed">
            {profile.aboutMe || 'No bio description provided yet.'}
          </p>
          <div className="pt-4 flex flex-wrap gap-3 justify-center md:justify-start">
            <Link to={ROUTES.CLIENT.EDIT_PROFILE} className="btn-primary px-5 py-2 rounded-lg text-sm font-semibold">
              Edit Profile
            </Link>
          </div>
        </div>
      </div>

      {/* Info grids */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Personal Details */}
        <div className="bg-white rounded-2xl border border-neutral-100 p-6 space-y-4">
          <h2 className="text-lg font-bold font-heading text-neutral-800 border-b pb-2">
            Personal & Demographics
          </h2>
          <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-sm">
            <span className="text-neutral-400">Gender</span>
            <span className="text-neutral-700 font-medium capitalize">{profile.gender}</span>

            <span className="text-neutral-400">Age / DOB</span>
            <span className="text-neutral-700 font-medium">
              {profile.age} yrs ({new Date(profile.dateOfBirth).toLocaleDateString()})
            </span>

            <span className="text-neutral-400">Marital Status</span>
            <span className="text-neutral-700 font-medium capitalize">{profile.maritalStatus}</span>

            <span className="text-neutral-400">Height / Weight</span>
            <span className="text-neutral-700 font-medium">
              {profile.height || 'N/A'} cm / {profile.weight || 'N/A'} kg
            </span>

            <span className="text-neutral-400">Complexion</span>
            <span className="text-neutral-700 font-medium capitalize">
              {profile.complexion?.replace('_', ' ') || 'N/A'}
            </span>
          </div>
        </div>

        {/* Professional & Location */}
        <div className="bg-white rounded-2xl border border-neutral-100 p-6 space-y-4">
          <h2 className="text-lg font-bold font-heading text-neutral-800 border-b pb-2">
            Education & Background
          </h2>
          <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-sm">
            <span className="text-neutral-400">Education</span>
            <span className="text-neutral-700 font-medium capitalize">
              {profile.education?.replace('_', ' ') || 'N/A'}
            </span>

            <span className="text-neutral-400">Occupation</span>
            <span className="text-neutral-700 font-medium capitalize">
              {profile.occupation?.replace('_', ' ') || 'N/A'}
            </span>

            <span className="text-neutral-400">Annual Income</span>
            <span className="text-neutral-700 font-medium">
              {profile.annualIncome ? `₹${profile.annualIncome.toLocaleString()}` : 'N/A'}
            </span>

            <span className="text-neutral-400">Religion / Caste</span>
            <span className="text-neutral-700 font-medium capitalize">
              {profile.religion || 'N/A'} {profile.caste ? `/ ${profile.caste}` : ''}
            </span>

            <span className="text-neutral-400">Location</span>
            <span className="text-neutral-700 font-medium">
              {[profile.city, profile.state, profile.country].filter(Boolean).join(', ') || 'N/A'}
            </span>
          </div>
        </div>
      </div>

      {/* Partner Preferences */}
      <div className="bg-white rounded-2xl border border-neutral-100 p-6 space-y-4">
        <h2 className="text-lg font-bold font-heading text-neutral-800 border-b pb-2">
          Partner Preferences
        </h2>
        {preferences ? (
          <div className="grid md:grid-cols-2 gap-y-3 gap-x-8 text-sm">
            <div className="flex justify-between border-b py-1">
              <span className="text-neutral-400">Age Range</span>
              <span className="text-neutral-700 font-medium">
                {preferences.ageMin} - {preferences.ageMax} yrs
              </span>
            </div>
            <div className="flex justify-between border-b py-1">
              <span className="text-neutral-400">Height</span>
              <span className="text-neutral-700 font-medium">
                {preferences.heightMin ? `${preferences.heightMin} cm` : 'Any'} -{' '}
                {preferences.heightMax ? `${preferences.heightMax} cm` : 'Any'}
              </span>
            </div>
            <div className="flex justify-between border-b py-1">
              <span className="text-neutral-400">Religion</span>
              <span className="text-neutral-700 font-medium capitalize">
                {preferences.religion?.join(', ') || 'Any'}
              </span>
            </div>
            <div className="flex justify-between border-b py-1">
              <span className="text-neutral-400">Marital Status</span>
              <span className="text-neutral-700 font-medium capitalize">
                {preferences.maritalStatus?.join(', ') || 'Any'}
              </span>
            </div>
          </div>
        ) : (
          <div className="text-center py-4 text-neutral-400 text-sm">
            You have not set partner preferences yet.{' '}
            <Link to={ROUTES.CLIENT.EDIT_PROFILE} className="text-primary-700 underline font-medium">
              Set preferences
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyProfile;
