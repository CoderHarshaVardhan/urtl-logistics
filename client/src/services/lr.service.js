import api from './api';

export const getNextLRNumber = async () => {
  const response = await api.get('/lrs/next-number');
  return response.data;
};

export const createLR = async (lrData) => {
  const response = await api.post('/lrs', lrData);
  return response.data;
};

export const getLRs = async () => {
  const response = await api.get('/lrs');
  return response.data;
};

export const getAvailableLRs = async () => {
  const response = await api.get('/lrs/available');
  return response.data;
};

export const getLRById = async (id) => {
  const response = await api.get(`/lrs/${id}`);
  return response.data;
};

export const updateLR = async (id, lrData) => {
  const response = await api.put(`/lrs/${id}`, lrData);
  return response.data;
};

export const trackLR = async (lrNumber) => {
  const response = await api.get(`/lrs/track/${lrNumber}`);
  return response.data;
};
