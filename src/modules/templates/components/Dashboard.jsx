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
    `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 font-medium ${
      isActive 
        ? 'bg-purple-100 text-purple-700' 
        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
    }`;

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      
      {/* SIDEBAR */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out 
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} sm:relative sm:translate-x-0`}
      >
        <div className="h-full flex flex-col justify-between">
          <div>
            <div className="h-16 flex items-center justify-center border-b bg-purple-600 text-white">
              <h1 className="text-xl font-bold tracking-wider">PANEL ADMIN</h1>
            </div>

            <nav className="flex-1 px-4 py-6 space-y-2">
              <NavLink to="/admin" end className={linkStyles}>
                <span></span> Principal
              </NavLink>
              
              <NavLink to="/admin/products" className={linkStyles}>
                <span></span> Productos
              </NavLink>

              {/* --- NUEVO ENLACE: REGISTRAR USUARIO --- */}
              <NavLink to="/admin/users/create" className={linkStyles}>
                <span></span> Registrar Usuario
              </NavLink>
              
              <NavLink to="/admin/orders" className={linkStyles}>
                <span></span> Órdenes
              </NavLink>
            </nav>
          </div>

          <div className="p-4 border-t">
            <button 
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 bg-red-50 text-red-600 py-2 rounded-lg hover:bg-red-100 transition font-medium border border-red-100"
            >
               Cerrar Sesión
            </button>
          </div>
        </div>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white shadow-sm flex items-center justify-between px-6 sm:hidden">
          <button 
            className="p-2 text-gray-600 rounded-md hover:bg-gray-100"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            ☰
          </button>
          <span className="font-bold text-gray-700">Menú</span>
        </header>

        {/* AQUÍ SE CARGARÁ EL FORMULARIO DE REGISTRO */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          <Outlet />
        </main>
      </div>
      
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black opacity-50 z-40 sm:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default Dashboard;