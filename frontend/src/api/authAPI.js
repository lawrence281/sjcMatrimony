import axiosInstance from './axiosInstance';

/**
 * Auth API — all authentication-related HTTP calls.
 * Never call axios directly in components or pages.
 */
const AuthAPI = {
  register: (data) => axiosInstance.post('/auth/register', data),
  verifyOtp: (data) => axiosInstance.post('/auth/verify-otp', data),
  login: (data) => axiosInstance.post('/auth/login', data),
  logout: () => axiosInstance.post('/auth/logout'),
  refreshToken: () => axiosInstance.post('/auth/refresh-token'),
  forgotPassword: (data) => axiosInstance.post('/auth/forgot-password', data),
  resetPassword: (data) => axiosInstance.post('/auth/reset-password', data),
};

export default AuthAPI;
