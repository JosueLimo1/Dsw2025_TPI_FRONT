import api from '../../shared/api/axiosInstance';

export const getOrders = async (searchTerm = '', status = null, pageNumber = 1, pageSize = 10) => {
  try {
    // Construimos el objeto de parámetros dinámicamente
    const params = {
      pageNumber,
      pageSize
    };

    // Solo agregamos 'search' si tiene texto real
    if (searchTerm && searchTerm.trim() !== '') {
      params.search = searchTerm;
    }

    // Solo agregamos 'status' si es un número válido (evitamos enviar "all" o strings vacíos)
    if (status && status !== 'all' && status !== '') {
      params.status = Number(status);
    }

    const response = await api.get('/orders', { params });

    return { data: response.data, error: null };
  } catch (error) {
    console.error("Error al obtener órdenes:", error);
    return { data: null, error: error.response?.data || "Error de conexión" };
  }
};

export const updateOrderStatus = async (id, newStatusInt) => {
  try {
    const response = await api.put(`/orders/${id}/status`, {
      newStatus: Number(newStatusInt)
    });
    return { data: response.data, error: null };
  } catch (error) {
    console.error("Error al actualizar estado:", error);
    return { data: null, error: error.response?.data || "Error al actualizar" };
  }

  
};

export const getOrderById = async (id) => {
  try {
    const response = await api.get(`/orders/${id}`);
    return { data: response.data, error: null };
  } catch (error) {
    console.error("Error al obtener la orden:", error);
    return { data: null, error: error.response?.data || "Error al cargar la orden" };
  }
};