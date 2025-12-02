// Importamos hooks y dependencias
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../shared/components/Card'; // Usamos tu componente Card
import { getProducts } from '../services/list';
import { deleteProduct } from '../services/delete';

// Estados del filtro
const productStatus = {
  ALL: 'all',
  ENABLED: 'enabled',
  DISABLED: 'disabled',
};

function ListProductsPage() {
  const navigate = useNavigate();

  // Estados de control
  const [ searchTerm, setSearchTerm ] = useState('');
  const [ status, setStatus ] = useState(productStatus.ALL);
  const [ pageNumber, setPageNumber ] = useState(1);
  const [ pageSize, setPageSize ] = useState(10);

  // Estados de datos
  const [ total, setTotal ] = useState(0);
  const [ products, setProducts ] = useState([]); 
  const [ loading, setLoading] = useState(false);

  // Funcion principal de busqueda
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await getProducts(searchTerm, status, pageNumber, pageSize);

      if (error) throw error;

      // Manejo de respuesta segun formato del backend
      if (data && data.productItems) {
          setProducts(data.productItems);
          setTotal(data.total);
      } 
      else if (Array.isArray(data)) {
          setProducts(data);
          setTotal(data.length);
      } 
      else {
          setProducts([]);
          setTotal(0);
      }
    } catch (error) {
      console.error(error);
      setProducts([]); 
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  // Efecto que reacciona a cambios en filtros
  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, pageSize, pageNumber, searchTerm]); 

  // Funcion de borrado fisico
  const handleDelete = async (id, name) => {
    if (window.confirm(`¿Estás seguro de eliminar "${name}" permanentemente?`)) {
        try {
            setLoading(true);
            await deleteProduct(id);
            await fetchProducts(); 
        } catch (error) {
            console.error(error);
            alert("Error al eliminar.");
            setLoading(false);
        }
    }
  };

  const totalPages = Math.ceil(total / pageSize) || 1; 

  return (
    <div>
      <Card>
        {/* Encabezado y Boton Crear Estilizado */}
        <div className='flex justify-between items-center mb-6'>
          <h1 className='text-2xl font-bold text-gray-800'>Productos</h1>
          
          {/* Boton Crear Producto con estilo visual correcto (PDF Pág 16) */}
          <button
            className='bg-purple-100 text-purple-700 px-4 py-2 rounded-lg font-bold hover:bg-purple-200 transition shadow-sm border border-purple-200'
            onClick={() => navigate('/admin/products/create')}
          >
            + Crear Producto
          </button>
        </div>

        {/* Filtros */}
        <div className='flex flex-col sm:flex-row gap-4 mb-2'>
          <div className='flex items-center gap-2 w-full'>
            <input 
                value={searchTerm} 
                onChange={(evt) => {
                    setSearchTerm(evt.target.value);
                    setPageNumber(1); // Reset a pagina 1 al escribir
                }} 
                type="text" 
                placeholder='Buscar...' 
                className='w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none bg-gray-50' 
            />
          </div>
          
          <select 
            onChange={evt => {
                setStatus(evt.target.value);
                setPageNumber(1);
            }} 
            className='border border-gray-300 p-2.5 rounded-lg bg-white focus:ring-2 focus:ring-purple-500 outline-none min-w-[200px]'
          >
            <option value={productStatus.ALL}>Todos</option>
            <option value={productStatus.ENABLED}>Habilitados</option>
            <option value={productStatus.DISABLED}>Inhabilitados</option>
          </select>
        </div>
      </Card>

      {/* Lista de Resultados */}
      <div className='mt-6 flex flex-col gap-4'>
        {
          loading ? (
            <div className="text-center p-8 text-gray-500">Cargando catálogo...</div>
          ) : (
            products?.length > 0 ? (
                products.map(product => (
                <Card key={product.sku || product.id}>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        
                        {/* Info del Producto: Formato SKU - Nombre */}
                        <div className="w-full">
                            <h3 className="font-bold text-lg text-gray-900">
                                <span className="font-mono text-gray-600">{product.sku}</span> - {product.name}
                            </h3>
                            
                            <div className='text-sm text-gray-500 mt-2 flex flex-wrap gap-x-4 gap-y-1 items-center'>
                                <span className="bg-gray-100 px-2 py-0.5 rounded">Stock: <b>{product.stockQuantity}</b></span>
                                <span className="hidden sm:inline">|</span>
                                <span>Precio: <b className="text-gray-800">${product.currentUnitPrice}</b></span>
                                <span className="hidden sm:inline">|</span>
                                <span className={`font-medium ${product.isActive ? 'text-green-600' : 'text-red-500'}`}>
                                    {product.isActive ? 'Activado' : 'Desactivado'}
                                </span>
                            </div>
                        </div>

                        {/* Botones de Accion */}
                        <div className="flex gap-2 min-w-fit">
                            <button 
                                className="bg-amber-400 text-white px-4 py-1.5 rounded hover:bg-amber-500 transition font-medium text-sm shadow-sm"
                                onClick={() => navigate(`/admin/products/edit/${product.id}`)}
                            >
                                Editar
                            </button>
                            
                            <button 
                                className="bg-red-500 text-white px-4 py-1.5 rounded hover:bg-red-600 transition font-medium text-sm shadow-sm"
                                onClick={() => handleDelete(product.id, product.name)}
                            >
                                Eliminar
                            </button>
                        </div>
                    </div>
                </Card>
                ))
            ) : (
                <div className="text-center p-10 bg-white rounded-lg border border-gray-200 text-gray-500">
                    No se encontraron productos con los criterios de búsqueda.
                </div>
            )
          )
        }
      </div>

      {/* Paginador */}
      <div className='flex flex-col sm:flex-row justify-between items-center mt-8 gap-4 text-sm'>
        <div className="text-gray-500">
            Mostrando resultados del sistema
        </div>

        <div className="flex items-center gap-2">
            <button
              disabled={pageNumber === 1}
              onClick={() => setPageNumber(pageNumber - 1)}
              className='px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'
            >
              ← Atrás
            </button>
            
            <span className="font-medium px-2">
                {pageNumber} / {totalPages}
            </span>
            
            <button
              disabled={pageNumber >= totalPages}
              onClick={() => setPageNumber(pageNumber + 1)}
              className='px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'
            >
              Siguiente →
            </button>

            <select
              value={pageSize}
              onChange={evt => {
                setPageNumber(1);
                setPageSize(Number(evt.target.value));
              }}
              className='ml-2 border border-gray-300 p-1 rounded bg-white outline-none cursor-pointer'
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
            </select>
        </div>
      </div>
    </div>
  );
};

export default ListProductsPage;