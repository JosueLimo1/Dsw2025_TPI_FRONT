import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../auth/hook/useAuth'; 
import { jwtDecode } from "jwt-decode";
import { useCart } from '../../shop/context/CartProvider';

// ACEPTAMOS LA PROP 'onSearch'
const Navbar = ({ onSearch }) => {
  const navigate = useNavigate();
  const { isAuthenticated, logoutSession } = useAuth(); 
  const { totalItems } = useCart();
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
      } catch (e) { console.error(e); }
    }
  }, [isAuthenticated]);

  const handleLogout = () => { logoutSession()};

  return (
    <nav className="bg-white py-4 px-6 sticky top-0 z-50 border-b border-gray-100 shadow-sm font-sans">
      <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-4">
        
        {/* LOGO */}
        <div className="flex items-center gap-8">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
              <div className="bg-black text-white p-1.5 rounded-md font-bold text-xl">B</div> 
              <span className="text-xl font-bold text-gray-800 hidden sm:block">Mi E-Commerce</span>
            </div>
            <div className="flex items-center gap-6">
                <button onClick={() => navigate('/')} className="text-gray-600 hover:text-purple-600 font-medium text-sm transition">Productos</button>
                <button onClick={() => navigate('/cart')} className="text-gray-600 hover:text-purple-600 font-medium text-sm transition flex items-center gap-1">
                    Carrito ({totalItems})
                </button>
            </div>
        </div>

        {/* --- BUSCADOR EN TIEMPO REAL --- */}
        <div className="flex-1 max-w-lg mx-4 hidden md:block">
            <div className="relative">
                <input 
                    type="text" 
                    placeholder="Buscar productos..." 
                    // AQUÍ ESTÁ LA MAGIA:
                    onChange={(e) => onSearch && onSearch(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 pl-4 pr-10 text-gray-700 focus:bg-white focus:ring-2 focus:ring-purple-100 focus:border-purple-200 outline-none transition-all"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
               </div>    
            </div>
        </div>

        {/* DERECHA (Usuario) */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
                <div className="text-right hidden lg:block leading-tight">
                    <p className="text-[10px] text-gray-500 font-bold uppercase">Hola</p>
                    <p className="text-sm font-bold text-gray-800 truncate max-w-[120px]">{username}</p>
                </div>
                {role === 'Admin' && <button onClick={() => navigate('/admin')} className="bg-gray-800 text-white px-3 py-2 rounded-md text-xs font-bold hover:bg-black transition">Panel Admin</button>}
                <button onClick={handleLogout} className="bg-purple-50 text-purple-700 px-4 py-2 rounded-md text-xs font-bold hover:bg-purple-100 transition">Cerrar Sesión</button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
                <button onClick={() => navigate('/login')} className="bg-purple-100 text-purple-700 px-5 py-2 rounded-md text-sm font-bold hover:bg-purple-200 transition">Iniciar Sesión</button>
                <button onClick={() => navigate('/signup')} className="bg-gray-100 text-gray-700 px-5 py-2 rounded-md text-sm font-bold hover:bg-gray-200 transition">Registrarse</button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;