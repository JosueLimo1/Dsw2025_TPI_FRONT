import React, { useEffect, useState } from 'react';
// Ajusta la ruta del Navbar según donde lo hayas guardado
// CORRECCIÓN: Usamos ../../ para ir de 'pages' a 'shop' y de 'shop' a 'modules'
import Navbar from '../../templates/components/Navbar.jsx';
// CORRECCIÓN: Un solo '..' para salir de 'pages' y entrar a 'services'
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
      <main className="max-w-7xl mx-auto py-10 px-6">
        <div className="bg-purple-600 text-white p-12 rounded-3xl shadow-lg mb-12 text-center">
          <h1 className="text-5xl font-extrabold mb-4">¡Ofertas de Verano!</h1>
          <p className="text-xl opacity-90">Los mejores productos tecnológicos.</p>
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-8">Catálogo</h2>
        {loading ? (
          <div className="text-center p-20 text-gray-500 text-xl">Cargando...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <div key={product.id} className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col">
                <div className="h-48 bg-gray-200 flex items-center justify-center text-gray-400">
                  <span className="text-5xl">📷</span>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="font-bold text-lg text-gray-900 mb-2">{product.name}</h3>
                  <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-1">{product.description}</p>
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                    <span className="text-2xl font-bold text-purple-700">${product.currentUnitPrice}</span>
                    <button className="bg-gray-900 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-black transition">
                      +
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