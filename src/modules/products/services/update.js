import api from '../../shared/api/axiosInstance';

// 1. Traer un producto por ID (Para rellenar el formulario)
export const getProductById = async (id) => {
  const response = await api.get(`/products/${id}`);
  return response.data;
};

// 2. Actualizar el producto (Guardar cambios)
export const updateProduct = async (id, productData) => {
  const response = await api.put(`/products/${id}`, productData);
  return response.data;
};