// Importamos la instancia de API configurada (sin llaves, ya que es export default)
import api from '../../shared/api/axiosInstance';

// Definimos la funcion asincrona para obtener productos, recibiendo los filtros como argumentos
// Se establecen valores por defecto: search nulo, status nulo, pagina 1, tamaño 20
export const getProducts = async (search = null, status = null, pageNumber = 1, pageSize = 20) => {
  try {
    // CAMBIO CRITICO: Se modifica la ruta de '/products' a '/products/admin'.
    // El backend espera la peticion en '/api/products/admin' para aplicar los filtros.
    // La instancia 'api' ya incluye la base '/api', por lo que solo ponemos '/products/admin'.
    const response = await api.get('/products/admin', {
      // Configuramos los parametros que se enviaran en la URL (Query String)
      params: {
        search,     // Mapea al campo 'Search' del DTO FilterProduct en el Backend
        status,     // Mapea al campo 'Status' del DTO
        pageNumber, // Mapea al campo 'PageNumber' para la paginacion
        pageSize,   // Mapea al campo 'PageSize' para definir elementos por pagina
      },
    });

    // Si la peticion es exitosa, retornamos un objeto con los datos y error en null
    return { data: response.data, error: null };

  } catch (error) {
    // En caso de error, lo registramos en la consola para depuracion
    console.error("Error en getProducts:", error);
    
    // Retornamos un objeto con data nula y el mensaje de error procesado
    // Intentamos obtener el mensaje detallado del backend o un mensaje generico
    return { data: null, error: error.response?.data || error.message };
  }
};