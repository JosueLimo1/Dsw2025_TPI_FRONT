import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/login'; 
import useAuth from '../hook/useAuth';
import { jwtDecode } from "jwt-decode"; 

const LoginForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { loginSession } = useAuth();
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Función auxiliar para obtener el rol desde el token
  const getRoleFromToken = (token) => {
    const decoded = jwtDecode(token);
    return decoded.role || 
           decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || 
           decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/role'];
  };

  const performLogin = async (data) => {
    const response = await login(data);
    if (response && response.token) {
        return response.token;
    }
    throw new Error("No token received");
  };

  // --- MODIFICADO: AHORA VERIFICA EL ROL ANTES DE ENTRAR ---
  const onLogin = async (data) => {
    try {
      setIsLoading(true);
      setErrorMsg('');
      
      // 1. Validamos credenciales con el backend
      const token = await performLogin(data);
      
      // 2. Verificamos quién es
      const userRole = getRoleFromToken(token);
      
      // 3. FILTRO DE SEGURIDAD: Solo Admins pasan
      if (userRole === 'Admin') {
        loginSession(token); // Guardamos sesión
        navigate('/admin');  // Vamos al Dashboard
      } else {
        // Si es User, lo rebotamos aquí mismo
        setErrorMsg('Acceso restringido a Administradores.');
      }

    } catch (error) {
      console.error(error);
      setErrorMsg('Usuario o contraseña incorrectos.');
    } finally {
      setIsLoading(false);
    }
  };

  // Lógica para el botón de registrar admin (sigue igual de protegida)
  const onAdminRegisterCheck = async (data) => {
    try {
      setIsLoading(true);
      setErrorMsg('');

      const token = await performLogin(data);
      const userRole = getRoleFromToken(token); // Reusamos la función auxiliar

      if (userRole === 'Admin') {
        loginSession(token); 
        navigate('/admin/users/create'); 
      } else {
        setErrorMsg('Acceso Denegado: Solo los Administradores pueden registrar usuarios.');
      }

    } catch (error) {
      if (error.response?.status === 401) {
        setErrorMsg('Credenciales inválidas.');
      } else {
        setErrorMsg('Error de conexión o permisos.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-96">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Acceso Admin</h2>
      
      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Usuario</label>
          <input 
            type="text" 
            {...register("username", { required: "Requerido" })}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
          />
          {errors.username && <span className="text-xs text-red-500">{errors.username.message}</span>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Contraseña</label>
          <input 
            type="password" 
            {...register("password", { required: "Requerida" })}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
          />
          {errors.password && <span className="text-xs text-red-500">{errors.password.message}</span>}
        </div>

        {errorMsg && (
            <div className={`text-sm text-center p-2 rounded border ${errorMsg.includes('⛔') ? 'bg-red-50 text-red-600 border-red-200 font-bold' : 'bg-yellow-50 text-yellow-700 border-yellow-200'}`}>
                {errorMsg}
            </div>
        )}

        <div className="flex flex-col gap-3 pt-2">
            <button 
              type="button" 
              onClick={handleSubmit(onLogin)}
              disabled={isLoading}
              className="w-full bg-purple-600 text-white font-bold py-2 px-4 rounded hover:bg-purple-700 transition duration-200"
            >
              Iniciar Sesión
            </button>
            
            <button 
              type="button" 
              onClick={handleSubmit(onAdminRegisterCheck)}
              disabled={isLoading}
              className="w-full bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded hover:bg-gray-300 transition duration-200 border border-gray-300"
            >
              Registrar Usuario (Solo Admin)
            </button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;