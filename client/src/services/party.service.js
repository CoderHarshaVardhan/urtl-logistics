import api from './api';

// Consignors
export const searchConsignors = async (query) => {
  const response = await api.get(`/parties/consignors/search?query=${encodeURIComponent(query)}`);
  return response.data;
};

export const createConsignor = async (data) => {
  const response = await api.post('/parties/consignors', data);
  return response.data;
};

export const updateConsignor = async (id, data) => {
  const response = await api.put(`/parties/consignors/${id}`, data);
  return response.data;
};

// Consignees
export const searchConsignees = async (query) => {
  const response = await api.get(`/parties/consignees/search?query=${encodeURIComponent(query)}`);
  return response.data;
};

export const createConsignee = async (data) => {
  const response = await api.post('/parties/consignees', data);
  return response.data;
};

export const updateConsignee = async (id, data) => {
  const response = await api.put(`/parties/consignees/${id}`, data);
  return response.data;
};
