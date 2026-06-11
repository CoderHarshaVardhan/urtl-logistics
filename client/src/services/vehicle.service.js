import api from './api';

export const createVehicle = async (vehicleData) => {
  const response = await api.post('/vehicles', vehicleData);
  return response.data;
};

export const searchVehicles = async (query = '') => {
  const response = await api.get(`/vehicles/search?query=${query}`);
  return response.data;
};
