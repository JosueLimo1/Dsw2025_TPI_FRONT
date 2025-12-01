import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../shared/components/Button';
import Card from '../../shared/components/Card';
import { getProducts } from '../services/list';
import { deleteProduct } from '../services/delete';

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
  const [ products, setProducts ] = useState([]); 

  const [loading, setLoading] = useState(false);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await getProducts(searchTerm, status, pageNumber, pageSize);

      if (error) throw error;

      if (Array.isArray(data)) {
          setProducts(data);
          setTotal(data.length);
      } 
      else if (data && data.productItems) {
          setProducts(data.productItems);
          setTotal(data.total);
      } 
      else {
          setProducts([]);
          setTotal(0);
      }

    } catch (error) {
      console.error(error);
      setProducts([]); 
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [status, pageSize, pageNumber]);

  const handleDelete = async (id, name) => {
    if (window.confirm(`¿Estás seguro de eliminar el producto "${name}"?`)) {
        try {
            setLoading(true);
            await deleteProduct(id);
            await fetchProducts();
        } catch (error) {
            console.error(error);
            alert("Error al eliminar el producto.");
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
        <div className='flex justify-between items-center mb-3'>
          <h1 className='text-3xl'>Productos</h1>
          
          <Button className='h-11 w-11 rounded-2xl sm:hidden'>
             +
          </Button>

          <Button
            className='hidden sm:block'
            onClick={() => navigate('/admin/products/create')}
          >
            Crear Producto
          </Button>
        </div>

        <div className='flex flex-col sm:flex-row gap-4'>
          <div className='flex items-center gap-3 w-full'>
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
            <div className="text-center p-4">Cargando datos...</div>
          ) : (
            products?.length > 0 ? (
                products.map(product => (
                <Card key={product.sku || product.id}>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        
                        <div>
                            <h1 className="font-bold text-xl">{product.name} <span className="text-sm text-gray-500 font-normal">({product.sku})</span></h1>
                            <p className='text-base mt-1'>
                                Stock: <b>{product.stockQuantity}</b> | 
                                Precio: <b>${product.currentUnitPrice}</b> | 
                                <span className={`ml-1 ${product.isActive ? 'text-green-600' : 'text-red-600'}`}>
                                    {product.isActive ? 'Activado' : 'Desactivado'}
                                </span>
                            </p>
                        </div>

                        <div className="flex gap-2 w-full sm:w-auto">
                            {/* --- BOTÓN EDITAR CONECTADO --- */}
                            <Button 
                                className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 text-sm w-full sm:w-auto"
                                onClick={() => navigate(`/admin/products/edit/${product.id}`)}
                            >
                                ✏️ Editar
                            </Button>
                            
                            <Button 
                                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 text-sm w-full sm:w-auto"
                                onClick={() => handleDelete(product.id, product.name)}
                            >
                                🗑️ Eliminar
                            </Button>
                        </div>
                    </div>
                </Card>
                ))
            ) : (
                <p className="text-center p-4">No se encontraron productos.</p>
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