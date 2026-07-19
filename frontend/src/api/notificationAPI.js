import axiosInstance from './axiosInstance';

const NotificationAPI = {
  getNotifications: (params) => axiosInstance.get('/notifications', { params }),
  markAsRead: (id) => axiosInstance.patch(`/notifications/${id}/read`),
  markAllAsRead: () => axiosInstance.patch('/notifications/mark-all-read'),
  deleteNotification: (id) => axiosInstance.delete(`/notifications/${id}`),
  getUnreadCount: () => axiosInstance.get('/notifications/unread-count'),
};

export default NotificationAPI;
