import api from '../../shared/api/axiosInstance';

export const getPublicProducts = async () => {
  // Llamada al endpoint público
  const response = await api.get('/products');
  return response.data; 
};