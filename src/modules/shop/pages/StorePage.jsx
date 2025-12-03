import React, { useEffect, useState } from 'react';
import Navbar from '../../templates/components/Navbar';
import { getPublicProducts } from '../services/public';

const StorePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* CAMBIO 1: Aumentamos el padding lateral (px-8 md:px-12) para dar aire a los bordes */}
      <main className="w-full py-8 px-8 md:px-12">
        
        {/* Encabezado */}
        <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-800">Catálogo</h2>
            <span className="text-gray-500 font-medium">{products.length} resultados</span>
        </div>

        {/* Grilla de Productos */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
             <p className="text-gray-500 text-xl">Cargando catálogo...</p>
          </div>
        ) : (
          /* CAMBIO 2: Ajustamos el gap para que se vea más ordenado con los nuevos márgenes */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
            {products.map((product) => (
              <div key={product.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col hover:shadow-lg transition-shadow duration-300">
                
                <div className="h-56 bg-gray-100 flex items-center justify-center text-gray-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>

                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="text-gray-800 font-bold text-lg mb-1 truncate" title={product.name}>
                    {product.name}
                  </h3>
                  
                  <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-1">
                    {product.description}
                  </p>
                  
                  <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
                    <span className="text-xl font-extrabold text-gray-900">
                      ${product.currentUnitPrice}
                    </span>
                    
                    <button 
                        className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-purple-700 transition shadow-sm"
                        onClick={() => alert(`Agregaste ${product.name}`)}
                    >
                      + Agregar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default StorePage;