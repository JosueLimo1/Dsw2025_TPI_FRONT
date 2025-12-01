// CORRECCIÓN 1: Importar sin llaves {}
import api from '../../shared/api/axiosInstance';

export const createProduct = async (formData) => {
  // CORRECCIÓN 2: Usar 'api.post' y la ruta '/products'
  const response = await api.post('/products', {
    sku: formData.sku,
    internalCode: formData.cui, // Mapeamos 'cui' del form a 'internalCode' del back
    name: formData.name,
    description: formData.description,
    // CORRECCIÓN 3: Convertir a números
    currentUnitPrice: Number(formData.price),
    stockQuantity: Number(formData.stock),
    isActive: true // Asumimos que al crear está activo
  });
  
  return response.data;
};