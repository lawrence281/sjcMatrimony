import axiosInstance from './axiosInstance';

const ProfileAPI = {
  getMyProfile: () => axiosInstance.get('/profiles/me'),
  getProfileById: (id) => axiosInstance.get(`/profiles/${id}`),
  createProfile: (data) => axiosInstance.post('/profiles', data),
  updateMyProfile: (data) => axiosInstance.put('/profiles/me', data),
  getPartnerPreferences: () => axiosInstance.get('/profiles/me/preferences'),
  updatePartnerPreferences: (data) => axiosInstance.put('/profiles/me/preferences', data),
  uploadProfilePicture: (formData) =>
    axiosInstance.post('/profiles/me/picture', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
};

export default ProfileAPI;
