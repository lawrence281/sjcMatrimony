import axiosInstance from './axiosInstance';

const AdminAPI = {
  // Dashboard
  getDashboardStats: () => axiosInstance.get('/admin/dashboard'),

  // Users
  getUsers: (params) => axiosInstance.get('/admin/users', { params }),
  getUserById: (id) => axiosInstance.get(`/admin/users/${id}`),
  createAdminUser: (data) => axiosInstance.post('/admin/users', data),
  updateUser: (id, data) => axiosInstance.patch(`/admin/users/${id}`, data),
  deleteUser: (id) => axiosInstance.delete(`/admin/users/${id}`),
  toggleUserStatus: (id) => axiosInstance.patch(`/admin/users/${id}/toggle-status`),

  // Profiles (moderation — approve/reject/suspend)
  getProfiles: (params) => axiosInstance.get('/admin/profiles', { params }),
  approveProfile: (id) => axiosInstance.patch(`/admin/profiles/${id}/approve`),
  rejectProfile: (id, data) => axiosInstance.patch(`/admin/profiles/${id}/reject`, data),
  suspendProfile: (id, data) => axiosInstance.patch(`/admin/profiles/${id}/suspend`, data),

  // Client Profiles (full CRUD — admin-created matrimony member profiles)
  getClientProfiles: (params) => axiosInstance.get('/admin/client-profiles', { params }),
  getClientProfileById: (id) => axiosInstance.get(`/admin/client-profiles/${id}`),
  createClientProfile: (data) => axiosInstance.post('/admin/client-profiles', data),
  updateClientProfile: (id, data) => axiosInstance.patch(`/admin/client-profiles/${id}`, data),
  deleteClientProfile: (id) => axiosInstance.delete(`/admin/client-profiles/${id}`),

  // Payments
  getPayments: (params) => axiosInstance.get('/admin/payments', { params }),

  // Reports
  getReports: (params) => axiosInstance.get('/admin/reports', { params }),
  resolveReport: (id, data) => axiosInstance.patch(`/admin/reports/${id}/resolve`, data),

  // Subscriptions
  getSubscriptions: (params) => axiosInstance.get('/admin/subscriptions', { params }),

  // Settings
  getSettings: () => axiosInstance.get('/admin/settings'),
  updateSetting: (key, value) => axiosInstance.put(`/admin/settings/${key}`, { value }),
};

export default AdminAPI;
