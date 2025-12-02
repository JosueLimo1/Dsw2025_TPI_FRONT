// Importamos hooks de React
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Importamos el servicio de estadísticas
import { getDashboardStats } from '../services/stats';

function Home() {
  const navigate = useNavigate();

  // Estado para almacenar los números del dashboard
  const [stats, setStats] = useState({ products: 0, orders: 0 });
  const [loading, setLoading] = useState(true);

  // Efecto de carga inicial
  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      const data = await getDashboardStats();
      setStats(data);
      setLoading(false);
    };

    fetchStats();
  }, []);

  // Componente interno para la Tarjeta de KPI (Indicador Clave de Rendimiento)
  // Esto mantiene el código limpio y reutilizable.
  const StatCard = ({ title, value, icon, onClick, labelLink }) => (
    <div 
        className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer"
        onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
            {title}
          </p>
          <p className="mt-2 text-3xl font-semibold text-gray-900">
            {loading ? '-' : value}
          </p>
        </div>
        
        {/* Contenedor del Icono con fondo suave */}
        <div className="p-3 bg-gray-50 rounded-full border border-gray-100">
          {icon}
        </div>
      </div>
      
      {/* Footer de la tarjeta con enlace de acción */}
      <div className="mt-4 flex items-center text-sm text-purple-600 font-medium group">
        <span>{labelLink}</span>
        <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-8">
      
      {/* Encabezado de la Sección */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Panel de Control</h2>
        <p className="text-gray-500 mt-1 text-sm">Resumen general de la actividad del sistema.</p>
      </div>

      {/* Grid de Tarjetas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* KPI: PRODUCTOS */}
        <StatCard 
            title="Total Productos" 
            value={stats.products} 
            labelLink="Gestionar inventario"
            onClick={() => navigate('/admin/products')}
            icon={
                // Icono SVG "Box/Cube" profesional
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
            }
        />

        {/* KPI: ÓRDENES */}
        <StatCard 
            title="Total Órdenes" 
            value={stats.orders} 
            labelLink="Ver pedidos recientes"
            onClick={() => navigate('/admin/orders')}
            icon={
                // Icono SVG "Shopping Cart" profesional
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
            }
        />

        {/* KPI: USUARIOS (Opcional, si tienes endpoint) */}
        {/* Puedes dejarlo comentado o hardcodeado si no hay endpoint aun */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm opacity-60">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Usuarios</p>
                    <p className="mt-2 text-3xl font-semibold text-gray-900">-</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-full border border-gray-100">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                </div>
            </div>
            <div className="mt-4 text-xs text-gray-400 font-medium">
                Módulo en desarrollo
            </div>
        </div>

      </div>
    </div>
  );
};

export default Home;