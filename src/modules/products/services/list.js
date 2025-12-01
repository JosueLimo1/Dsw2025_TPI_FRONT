// 1. CORRECCIÓN: Importamos sin llaves {} porque es un export default.
// Le ponemos el nombre 'api' para usarlo abajo.
import api from '../../shared/api/axiosInstance';

export const getProducts = async (search = null, status = null, pageNumber = 1, pageSize = 20) => {
  try {
    // 2. CORRECCIÓN: Usamos 'api.get'.
    // Axios maneja los parámetros (query string) automáticamente con la propiedad 'params'.
    // Ajusté la ruta a '/products' asumiendo que tu baseURL ya incluye '/api'.
    const response = await api.get('/products', {
      params: {
        search,
        status,
        pageNumber,
        pageSize,
      },
    });

    // Retornamos los datos con la estructura que tu componente espera
    return { data: response.data, error: null };

  } catch (error) {
    console.error("Error en getProducts:", error);
    // Retornamos el error controlado para que tu componente no explote
    return { data: null, error: error.response?.data || error.message };
  }
};