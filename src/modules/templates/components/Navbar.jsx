import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../auth/hook/useAuth'; 
import { jwtDecode } from "jwt-decode";

const Navbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logoutSession } = useAuth(); 
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && isAuthenticated) {
      try {
        const decoded = jwtDecode(token);
        const name = decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] || decoded.unique_name || 'Usuario';
        setUsername(name);
        const userRole = decoded.role || 
                         decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || 
                         decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/role'];
        setRole(userRole);
      } catch (e) {
        console.error("Error leyendo token", e);
      }
    }
  }, [isAuthenticated]);

  const handleLogout = () => {
    logoutSession();
    navigate('/login');
  };

  return (
    <nav className="bg-white py-4 px-6 sticky top-0 z-50 border-b border-gray-100 shadow-sm font-sans">
      <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-4">
        
        {/* --- IZQUIERDA: LOGO + NAVEGACIÓN --- */}
        <div className="flex items-center gap-8">
            {/* Logo */}
            <div 
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => navigate('/')}
            >
              <div className="bg-black text-white p-1.5 rounded-md font-bold text-xl">B</div> 
              {/* En pantallas pequeñas ocultamos el texto para ahorrar espacio */}
              <span className="text-xl font-bold text-gray-800 hidden sm:block">Mi E-Commerce</span>
            </div>

            {/* Links de Navegación (Productos y Carrito) */}
            <div className="flex items-center gap-6">
                <button 
                    onClick={() => navigate('/')}
                    className="text-gray-600 hover:text-purple-600 font-medium text-sm transition"
                >
                    Productos
                </button>

                <button className="text-gray-600 hover:text-purple-600 font-medium text-sm transition">
                    Carrito de compras (0)
                </button>
            </div>
        </div>

        {/* --- CENTRO: BUSCADOR --- */}
        <div className="flex-1 max-w-lg mx-4 hidden md:block">
            <div className="relative">
                <input 
                    type="text" 
                    placeholder="Search" 
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 pl-4 pr-10 text-gray-700 focus:bg-white focus:ring-2 focus:ring-purple-100 focus:border-purple-200 outline-none transition-all"
                />
                <span className="absolute right-3 top-2.5 text-gray-400">🔍</span>
            </div>
        </div>

        {/* --- DERECHA: SESIÓN --- */}
        <div className="flex items-center gap-3">
          
          {isAuthenticated ? (
            // LOGUEADO
            <div className="flex items-center gap-4">
                <div className="text-right hidden lg:block leading-tight">
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Hola</p>
                    <p className="text-sm font-bold text-gray-800 truncate max-w-[120px]">{username}</p>
                </div>

                {/* BOTÓN PANEL (SOLO ADMIN) */}
                {role === 'Admin' && (
                    <button 
                        onClick={() => navigate('/admin')}
                        className="bg-gray-800 text-white px-3 py-2 rounded-md text-xs font-bold hover:bg-black transition"
                    >
                        Panel Admin
                    </button>
                )}

                {/* BOTÓN CERRAR SESIÓN */}
                <button 
                    onClick={handleLogout}
                    className="bg-purple-50 text-purple-700 px-4 py-2 rounded-md text-xs font-bold hover:bg-purple-100 transition"
                >
                    Cerrar Sesión
                </button>
            </div>
          ) : (
            // NO LOGUEADO
            <div className="flex items-center gap-3">
                <button 
                    onClick={() => navigate('/login')}
                    className="bg-purple-100 text-purple-700 px-5 py-2 rounded-md text-sm font-bold hover:bg-purple-200 transition"
                >
                    Iniciar Sesión
                </button>

                <button 
                    onClick={() => navigate('/signup')}
                    className="bg-gray-100 text-gray-700 px-5 py-2 rounded-md text-sm font-bold hover:bg-gray-200 transition"
                >
                    Registrarse
                </button>
            </div>
          )}

        </div>
      </div>
    </nav>
  );
};

export default Navbar;