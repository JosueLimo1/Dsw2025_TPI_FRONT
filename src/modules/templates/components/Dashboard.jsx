import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import useAuth from '../../auth/hook/useAuth'; // Verifica que esta ruta a tu hook sea correcta

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { logoutSession } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutSession();
    navigate('/login');
  };

  const linkStyles = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-md transition-colors duration-200 font-medium text-sm ${
      isActive 
        ? 'bg-gray-100 text-gray-900 border-l-4 border-purple-600' 
        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
    }`;

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      
      {/* SIDEBAR */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out 
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} sm:relative sm:translate-x-0`}
      >
        <div className="h-full flex flex-col justify-between">
          <div>
            {/* Header del Sidebar */}
            <div className="h-16 flex items-center px-6 border-b border-gray-200">
              <h1 className="text-lg font-bold text-gray-800 tracking-wide uppercase">Administración</h1>
            </div>

            {/* Navegación */}
            <nav className="flex-1 px-3 py-6 space-y-1">
              <NavLink to="/admin" end className={linkStyles}>
                Principal
              </NavLink>
              
              <NavLink to="/admin/products" className={linkStyles}>
                Productos
              </NavLink>

              <NavLink to="/admin/orders" className={linkStyles}>
                Órdenes
              </NavLink>

              <NavLink to="/admin/users/create" className={linkStyles}>
                Registrar Usuario
              </NavLink>
            </nav>
          </div>

          {/* Footer del Sidebar - Botón Cerrar Sesión Rojo Suave */}
          <div className="p-4 border-t border-gray-200">
            <button 
              onClick={handleLogout}
              className="w-full flex items-center justify-center bg-red-50 border border-red-100 text-red-600 py-2 px-4 rounded hover:bg-red-100 hover:border-red-200 transition text-sm font-medium"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Header Móvil */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sm:hidden">
          <button 
            className="p-2 text-gray-600 rounded hover:bg-gray-100"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            Menú
          </button>
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-8">
          <Outlet />
        </main>
      </div>
      
      {/* Overlay para móvil */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black opacity-25 z-40 sm:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default Dashboard;