// Importamos hooks y dependencias
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../shared/components/Button'; // Tu componente Button reutilizable
import Card from '../../shared/components/Card';
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
  }, [status, pageSize, pageNumber]); 

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

  const handleSearch = async () => {
    await fetchProducts();
  };

  return (
    <div>
      <Card>
        {/* Encabezado y Boton Crear */}
        <div className='flex justify-between items-center mb-6'>
          <h1 className='text-2xl font-bold text-gray-800'>Productos</h1>
          
          {/* Botón Crear con tu componente Button (Estilo Default Morado) */}
          <Button
            className='hidden sm:block px-4 py-2 font-bold text-purple-700 rounded-lg shadow-sm'
            onClick={() => navigate('/admin/products/create')}
          >
            + Crear Producto
          </Button>
          
          {/* Version Mobile */}
          <Button className='h-10 w-10 rounded-full sm:hidden flex items-center justify-center text-xl'>+</Button>
        </div>

        {/* Filtros */}
        <div className='flex flex-col sm:flex-row gap-4 mb-2'>
          <div className='flex items-center gap-2 w-full'>
            <input 
                value={searchTerm} 
                onChange={(evt) => setSearchTerm(evt.target.value)} 
                type="text" 
                placeholder='Buscar...' 
                className='w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none bg-gray-50' 
            />
            <Button className='h-11 w-11 rounded-lg flex items-center justify-center' onClick={handleSearch}>
              🔍
            </Button>
          </div>
          
          <select 
            onChange={evt => setStatus(evt.target.value)} 
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
                        
                        {/* Info del Producto */}
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

                        {/* --- AQUI ESTAN LOS BOTONES NEUTROS --- */}
                        <div className="flex gap-2 min-w-fit">
                            {/* Botón Editar: Blanco con Borde Gris (Estilo Neutro) */}
                            <Button 
                                className="!bg-white border border-gray-300 !text-gray-700 hover:!bg-gray-50 px-4 py-1.5 rounded font-medium text-sm shadow-sm transition-colors"
                                onClick={() => navigate(`/admin/products/edit/${product.id}`)}
                            >
                                Editar
                            </Button>
                            
                            {/* Botón Eliminar: Gris muy suave con texto Rojo (Estilo Peligro Sutil) */}
                            <Button 
                                className="!bg-gray-50 border border-gray-200 !text-red-600 hover:!bg-red-50 hover:border-red-200 px-4 py-1.5 rounded font-medium text-sm shadow-sm transition-colors"
                                onClick={() => handleDelete(product.id, product.name)}
                            >
                                Eliminar
                            </Button>
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

      {/* Paginador (Estilo mejorado) */}
      <div className='flex flex-col sm:flex-row justify-between items-center mt-8 gap-4 text-sm text-gray-600'>
        <div>Mostrando resultados del sistema</div>

        <div className="flex items-center gap-2">
            <button
              disabled={pageNumber === 1}
              onClick={() => setPageNumber(pageNumber - 1)}
              className='px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition'
            >
              ← Atrás
            </button>
            
            <span className="font-medium px-2 bg-gray-100 rounded py-1">
                {pageNumber} / {totalPages}
            </span>
            
            <button
              disabled={pageNumber >= totalPages}
              onClick={() => setPageNumber(pageNumber + 1)}
              className='px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition'
            >
              Siguiente →
            </button>

            <select
              value={pageSize}
              onChange={evt => {
                setPageNumber(1);
                setPageSize(Number(evt.target.value));
              }}
              className='ml-2 border border-gray-300 p-1 rounded bg-white outline-none cursor-pointer hover:border-gray-400 transition'
            >
              <option value="5">5 por pág</option>
              <option value="10">10 por pág</option>
              <option value="20">20 por pág</option>
            </select>
        </div>
      </div>
    </div>
  );
};

export default ListProductsPage;