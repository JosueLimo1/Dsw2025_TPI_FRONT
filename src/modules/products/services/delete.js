import api from '../../shared/api/axiosInstance';

export const deleteProduct = async (id) => {
    // Asumimos que tu backend recibe el ID para borrar.
    // Si tu backend usa el SKU, cambia ${id} por ${sku}
    const response = await api.delete(`/products/${id}`);
    return response.data;
};