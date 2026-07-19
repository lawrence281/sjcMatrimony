import axiosInstance from './axiosInstance';

const SearchAPI = {
  searchProfiles: (params) => axiosInstance.get('/search', { params }),
};

export default SearchAPI;
