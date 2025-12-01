import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../shared/components/Button';
import Card from '../../shared/components/Card';
import { getProducts } from '../services/list';

const productStatus = {
  ALL: 'all',
  ENABLED: 'enabled',
  DISABLED: 'disabled',
};

function ListProductsPage() {
  const navigate = useNavigate();

  const [ searchTerm, setSearchTerm ] = useState('');
  const [ status, setStatus ] = useState(productStatus.ALL);
  const [ pageNumber, setPageNumber ] = useState(1);
  const [ pageSize, setPageSize ] = useState(10);

  const [ total, setTotal ] = useState(0);
  // INICIALIZAMOS COMO ARRAY VACÍO SIEMPRE
  const [ products, setProducts ] = useState([]); 

  const [loading, setLoading] = useState(false);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await getProducts(searchTerm, status, pageNumber, pageSize);

      if (error) throw error;

      // --- CORRECCIÓN CLAVE AQUÍ ---
      // Verificamos si 'data' es un array directo (Backend actual)
      if (Array.isArray(data)) {
          setProducts(data);
          setTotal(data.length);
      } 
      // O si viene paginado como esperabas antes
      else if (data && data.productItems) {
          setProducts(data.productItems);
          setTotal(data.total);
      } 
      else {
          // Si no llega nada, array vacío para que no explote el .map
          setProducts([]);
          setTotal(0);
      }

    } catch (error) {
      console.error(error);
      setProducts([]); // En caso de error, limpiamos para evitar pantalla blanca
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [status, pageSize, pageNumber]);

  const totalPages = Math.ceil(total / pageSize) || 1; // Evitar división por cero

  const handleSearch = async () => {
    await fetchProducts();
  };

  return (
    <div>
      <Card>
        <div className='flex justify-between items-center mb-3'>
          <h1 className='text-3xl'>Productos</h1>
          
          {/* Botón Mobile */}
          <Button className='h-11 w-11 rounded-2xl sm:hidden'>
            +
          </Button>

          {/* Botón Desktop */}
          <Button
            className='hidden sm:block'
            onClick={() => navigate('/admin/products/create')}
          >
            Crear Producto
          </Button>
        </div>

        <div className='flex flex-col sm:flex-row gap-4'>
          <div className='flex items-center gap-3'>
            <input 
                value={searchTerm} 
                onChange={(evt) => setSearchTerm(evt.target.value)} 
                type="text" 
                placeholder='Buscar' 
                className='text-[1.3rem] w-full border p-2 rounded' 
            />
            <Button className='h-11 w-11' onClick={handleSearch}>
              🔍
            </Button>
          </div>
          <select 
            onChange={evt => setStatus(evt.target.value)} 
            className='text-[1.3rem] border p-2 rounded'
          >
            <option value={productStatus.ALL}>Todos</option>
            <option value={productStatus.ENABLED}>Habilitados</option>
            <option value={productStatus.DISABLED}>Inhabilitados</option>
          </select>
        </div>
      </Card>

      <div className='mt-4 flex flex-col gap-4'>
        {
          loading ? (
            <span>Buscando datos...</span>
          ) : (
            // PROTECCIÓN EXTRA: products?.map
            products?.length > 0 ? (
                products.map(product => (
                <Card key={product.sku || product.id}>
                    <h1>{product.sku} - {product.name}</h1>
                    <p className='text-base'>
                        Stock: {product.stockQuantity} - 
                        Price: ${product.currentUnitPrice} - 
                        {product.isActive ? 'Activado' : 'Desactivado'}
                    </p>
                </Card>
                ))
            ) : (
                <p>No se encontraron productos.</p>
            )
          )
        }
      </div>

      <div className='flex justify-center items-center mt-3'>
        <button
          disabled={pageNumber === 1}
          onClick={() => setPageNumber(pageNumber - 1)}
          className='bg-gray-200 disabled:bg-gray-100 p-2 rounded mr-2'
        >
          Atrás
        </button>
        <span>{pageNumber} / {totalPages}</span>
        <button
          disabled={pageNumber >= totalPages}
          onClick={() => setPageNumber(pageNumber + 1)}
          className='bg-gray-200 disabled:bg-gray-100 p-2 rounded ml-2'
        >
          Siguiente
        </button>

        <select
          value={pageSize}
          onChange={evt => {
            setPageNumber(1);
            setPageSize(Number(evt.target.value));
          }}
          className='ml-3 border p-1 rounded'
        >
          <option value="2">2</option>
          <option value="10">10</option>
          <option value="15">15</option>
          <option value="20">20</option>
        </select>
      </div>
    </div>
  );
};

export default ListProductsPage;