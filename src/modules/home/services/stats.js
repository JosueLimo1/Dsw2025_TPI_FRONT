// Importamos la instancia de axios configurada
import api from '../../shared/api/axiosInstance';

// Función para obtener el resumen de datos del dashboard
export const getDashboardStats = async () => {
  try {
    // 1. Consultamos el endpoint de productos.
    // Enviamos pageSize=1 porque solo necesitamos leer la propiedad 'total' de la respuesta,
    // no necesitamos descargar toda la lista de productos.
    const productsResponse = await api.get('/products/admin', {
      params: { 
        pageNumber: 1, 
        pageSize: 1 
      }
    });

    // 2. Extraemos el total. 
    // Tu backend devuelve un objeto { productItems: [...], total: N }
    const totalProducts = productsResponse.data?.total || 0;

    return {
      products: totalProducts,
      orders: 0, // Hardcodeado en 0 hasta que implementemos el módulo de órdenes
      error: null
    };

  } catch (error) {
    console.error("Error obteniendo estadísticas:", error);
    return { 
      products: 0, 
      orders: 0, 
      error: 'No se pudieron cargar las métricas.' 
    };
  }
};