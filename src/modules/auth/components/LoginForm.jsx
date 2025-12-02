import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode"; 

// Importamos servicios y hooks
import { login } from '../services/login'; 
import useAuth from '../hook/useAuth';

const LoginForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { loginSession } = useAuth();
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Funcion auxiliar para extraer el rol del token de manera segura
  const getRoleFromToken = (token) => {
    try {
      const decoded = jwtDecode(token);
      // Buscamos el rol en las diferentes propiedades estandar de Microsoft Identity
      return decoded.role || 
             decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || 
             decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/role'];
    } catch (e) {
      return null;
    }
  };

  // Funcion comun de autenticacion
  const performAuth = async (data) => {
    const response = await login(data);
    if (response && response.token) {
        return response.token;
    }
    throw new Error("Credenciales inválidas");
  };

  // --- ESCENARIO 1: INICIAR SESIÓN NORMAL ---
  // Debe llevar al Home del Dashboard (/admin)
  const onLogin = async (data) => {
    try {
      setIsLoading(true);
      setErrorMsg('');
      
      const token = await performAuth(data);
      const userRole = getRoleFromToken(token);
      
      // Verificamos si es Admin antes de dejarlo entrar al panel
      if (userRole === 'Admin') {
        loginSession(token); 
        navigate('/admin'); // <--- VA AL HOME
      } else {
        setErrorMsg('Acceso restringido a Administradores.');
      }

    } catch (error) {
      console.error(error);
      setErrorMsg('Usuario o contraseña incorrectos.');
    } finally {
      setIsLoading(false);
    }
  };

  // --- ESCENARIO 2: REGISTRAR USUARIO (Acceso Directo) ---
  // Valida credenciales de Admin y lleva DIRECTO al formulario (/admin/users/create)
  const onAdminRegisterCheck = async (data) => {
    try {
      setIsLoading(true);
      setErrorMsg('');

      // 1. Validamos que las credenciales ingresadas sean correctas
      const token = await performAuth(data);
      
      // 2. Verificamos que esas credenciales pertenezcan a un Admin
      const userRole = getRoleFromToken(token);

      if (userRole === 'Admin') {
        loginSession(token); // Iniciamos la sesion para tener permiso
        // CAMBIO CLAVE: Redirigimos directo al formulario, saltando el Home
        navigate('/admin/register-standalone');
      } else {
        setErrorMsg('Solo los Administradores pueden acceder al registro.');
      }

    } catch (error) {
      if (error.response?.status === 401 || error.message.includes("inválidas")) {
        setErrorMsg('Credenciales de administrador inválidas.');
      } else {
        setErrorMsg('Error de conexión.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-96 border border-gray-200">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Panel de Acceso</h2>
      
      <form className="space-y-4">
        {/* Campo Usuario */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Usuario</label>
          <input 
            type="text" 
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 outline-none"
            {...register("username", { required: "El usuario es requerido" })}
          />
          {errors.username && <span className="text-xs text-red-500">{errors.username.message}</span>}
        </div>

        {/* Campo Contraseña */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Contraseña</label>
          <input 
            type="password" 
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 outline-none"
            {...register("password", { required: "La contraseña es requerida" })}
          />
          {errors.password && <span className="text-xs text-red-500">{errors.password.message}</span>}
        </div>

        {/* Mensaje de Error */}
        {errorMsg && (
            <div className="text-sm text-center p-2 rounded border bg-red-50 text-red-600 border-red-200 font-medium">
                {errorMsg}
            </div>
        )}

        <div className="flex flex-col gap-3 pt-4">
            {/* BOTON 1: Ir al Dashboard */}
            <button 
              type="button" 
              onClick={handleSubmit(onLogin)}
              disabled={isLoading}
              className="w-full bg-purple-700 text-white font-bold py-2.5 px-4 rounded-lg hover:bg-purple-800 transition duration-200 shadow-sm"
            >
              {isLoading ? 'Verificando...' : 'Iniciar Sesión'}
            </button>
            
            {/* BOTON 2: Ir directo a Crear Usuario */}
            <button 
              type="button" 
              onClick={handleSubmit(onAdminRegisterCheck)}
              disabled={isLoading}
              className="w-full bg-white text-gray-700 font-bold py-2.5 px-4 rounded-lg border border-gray-300 hover:bg-gray-50 transition duration-200"
            >
              Registrar Usuario
            </button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;