import React, { useEffect, useState } from 'react';
import Navbar from '../../templates/components/Navbar';
import { getPublicProducts } from '../services/public';
import { useCart } from '../context/CartProvider';

const StorePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  
  // ESTADO PARA LA BÚSQUEDA
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await getPublicProducts();
        setProducts(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error cargando tienda:", error);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  // --- LÓGICA DE FILTRADO EN TIEMPO REAL ---
  // Filtramos si el nombre incluye el texto escrito (ignorando mayúsculas/minúsculas)
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Pasamos la función setSearchTerm al Navbar */}
      <Navbar onSearch={setSearchTerm} />

      <main className="w-full px-6 md:px-12 py-8">
        
        {/* Encabezado */}
        <div className="mb-6 flex justify-between items-end">
            <h2 className="text-2xl font-bold text-gray-900">Catálogo</h2>
            <span className="text-sm text-gray-500">
                {/* Mostramos la cantidad filtrada */}
                {filteredProducts.length} resultados
            </span>
        </div>

        {/* Grilla de Productos */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
             <p className="text-gray-500 text-lg">Cargando catálogo...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            
            {/* USAMOS LA LISTA FILTRADA AQUÍ */}
            {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                <div key={product.id} className="bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col h-full">
                    
                    <div className="h-48 bg-gray-50 flex items-center justify-center rounded-t-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    </div>

                    <div className="p-4 flex flex-col flex-1">
                    <h3 className="font-bold text-gray-900 text-base mb-1 line-clamp-1" title={product.name}>
                        {product.name}
                    </h3>
                    
                    <p className="text-xs text-gray-500 line-clamp-2 mb-4 h-8">
                        {product.description}
                    </p>
                    
                    <div className="mt-auto flex items-center justify-between">
                        <span className="text-lg font-bold text-gray-900">
                        ${product.currentUnitPrice}
                        </span>
                        
                        <button 
                            className="bg-[#a855f7] text-white px-4 py-1.5 rounded text-xs font-bold hover:bg-purple-700 transition flex items-center gap-1 active:scale-95"
                            onClick={() => addToCart(product)}
                        >
                        + Agregar
                        </button>
                    </div>
                    </div>
                </div>
                ))
            ) : (
                <div className="col-span-full text-center py-20 text-gray-400">
                    No se encontraron productos que coincidan con "{searchTerm}".
                </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default StorePage;