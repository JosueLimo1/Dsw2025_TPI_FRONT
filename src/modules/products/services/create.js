import api from '../../shared/api/axiosInstance';

export const createProduct = async (productData) => {
    // CORRECCIÓN: No mapeamos nada aquí. Enviamos el objeto 'productData' tal cual viene del formulario.
    // El formulario ya se encargó de poner los nombres correctos (sku, internalCode, currentUnitPrice, etc.)
    const response = await api.post('/products', productData);
    return response.data;
};