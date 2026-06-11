import api from './api';

export const getNextLoadingNumber = async () => {
  const response = await api.get('/loadings/next-number');
  return response.data;
};

export const createLoading = async (loadingData) => {
  const response = await api.post('/loadings', loadingData);
  return response.data;
};

export const getLoadings = async () => {
  const response = await api.get('/loadings');
  return response.data;
};

export const getLoadingById = async (id) => {
  const response = await api.get(`/loadings/${id}`);
  return response.data;
};

export const updateLoading = async (id, loadingData) => {
  const response = await api.put(`/loadings/${id}`, loadingData);
  return response.data;
};
