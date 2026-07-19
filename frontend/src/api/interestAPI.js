import axiosInstance from './axiosInstance';

const InterestAPI = {
  sendInterest: (receiverId, data) => axiosInstance.post(`/interests`, { receiverId, ...data }),
  getSentInterests: (params) => axiosInstance.get('/interests/sent', { params }),
  getReceivedInterests: (params) => axiosInstance.get('/interests/received', { params }),
  acceptInterest: (id) => axiosInstance.patch(`/interests/${id}/accept`),
  rejectInterest: (id, data) => axiosInstance.patch(`/interests/${id}/reject`, data),
  cancelInterest: (id) => axiosInstance.delete(`/interests/${id}`),
};

export default InterestAPI;
