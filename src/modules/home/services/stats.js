// Importamos la instancia de axios configurada
import api from '../../shared/api/axiosInstance';

// Función para obtener el resumen de datos del dashboard
export const getDashboardStats = async () => {
  try {
    // Ejecutamos las dos peticiones en paralelo para que sea más rápido
    const [productsResponse, ordersResponse] = await Promise.all([
      // 1. Petición de Productos (Usamos /products/admin que trae el total paginado)
      api.get('/products/admin', { params: { pageNumber: 1, pageSize: 1 } }),
      
      // 2. Petición de Órdenes (Trae todas las órdenes en un array)
      api.get('/orders')
    ]);

    // --- CÁLCULO DE PRODUCTOS ---
    // Tu backend de productos devuelve { productItems: [...], total: N }
    const totalProducts = productsResponse.data?.total || 0;

    // --- CÁLCULO DE ÓRDENES ---
    // Tu backend de órdenes devuelve un array directo [...]
    // Así que el total es simplemente la longitud del array (.length)
    const ordersData = ordersResponse.data;
    const totalOrders = Array.isArray(ordersData) ? ordersData.length : 0;

    return {
      products: totalProducts,
      orders: totalOrders,
      users: '-', // Dejamos usuarios pendiente o en guion
      error: null
    };

  } catch (error) {
    console.error("Error obteniendo estadísticas:", error);
    // Si falla, devolvemos 0 para no romper la pantalla
    return { 
      products: 0, 
      orders: 0, 
      users: '-',
      error: 'No se pudieron cargar las métricas.' 
    };
  }
};