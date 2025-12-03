import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useLocation } from 'react-router-dom';
import { login } from '../services/login'; 
import useAuth from '../hook/useAuth';
import { jwtDecode } from "jwt-decode";
import RegisterForm from './RegisterForm'; 

// ACEPTAMOS PROP EXTRA: 'onSwitchToRegister' (Para cambiar de vista en el modal)
const LoginForm = ({ onSuccess, onSwitchToRegister }) => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const { loginSession } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [showAdminRegister, setShowAdminRegister] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const usernameValue = watch('username');
  const passwordValue = watch('password');

  const getRoleFromToken = (token) => {
    try {
      const decoded = jwtDecode(token);
      return decoded.role || 
             decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || 
             decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/role'];
    } catch (e) {
      return '';
    }
  };

  const performLogin = async (data) => {
    const response = await login(data);
    if (response && response.token) return response.token;
    throw new Error("No token");
  };

  const onLogin = async (data) => {
    try {
      setIsLoading(true);
      setErrorMsg('');
      
      const token = await performLogin(data);
      loginSession(token); // Guardamos sesión

      // --- LÓGICA DEL MODAL ---
      if (onSuccess) {
        // SI ESTAMOS EN UN MODAL: Ejecutamos el callback y NO navegamos
        onSuccess(); 
        return; 
      }

      // SI NO, COMPORTAMIENTO NORMAL (Página completa)
      const userRole = getRoleFromToken(token);
      const origin = location.state?.from;

      if (origin) {
        navigate(origin);
        return;
      }

      if (userRole === 'Admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }

    } catch (error) {
      console.error(error);
      setErrorMsg('Usuario o contraseña incorrectos.');
    } finally {
      setIsLoading(false);
    }
  };

  const onAdminRegisterCheck = async (data) => {
    try {
      setIsLoading(true);
      setErrorMsg('');

      const token = await performLogin(data);
      const userRole = getRoleFromToken(token);

      if (userRole === 'Admin') {
        loginSession(token);
        setShowAdminRegister(true); 
      } else {
        setErrorMsg('Acceso Denegado: Solo Admin.');
      }

    } catch (error) {
      if (error.response?.status === 401) setErrorMsg('Credenciales inválidas.');
      else setErrorMsg('Error de conexión.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterClick = (e) => {
    e.preventDefault();
    if (!usernameValue || !passwordValue) {
        navigate('/signup');
    } else {
        handleSubmit(onAdminRegisterCheck)();
    }
  };

  if (showAdminRegister) {
    return <RegisterForm isAdminMode={true} onBack={() => setShowAdminRegister(false)} />;
  }

  return (
    <div className={`bg-white p-8 rounded-lg ${onSuccess ? 'shadow-none w-full' : 'shadow-md w-96'}`}>
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        {onSuccess ? 'Inicia Sesión para comprar' : 'Panel de Acceso'}
      </h2>
      
      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Usuario</label>
          <input type="text" {...register("username", { required: "Requerido" })} className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 outline-none"/>
          {errors.username && <span className="text-xs text-red-500">{errors.username.message}</span>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Contraseña</label>
          <input type="password" {...register("password", { required: "Requerida" })} className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 outline-none"/>
          {errors.password && <span className="text-xs text-red-500">{errors.password.message}</span>}
        </div>

        {errorMsg && (
            <div className={`text-sm text-center p-2 rounded border ${errorMsg.includes('⛔') ? 'bg-red-50 text-red-600 border-red-200' : 'bg-red-50 text-red-500 border-red-200'}`}>
                {errorMsg}
            </div>
        )}

        <div className="flex flex-col gap-3 pt-2">
            <button type="button" onClick={handleSubmit(onLogin)} disabled={isLoading} className="w-full bg-purple-600 text-white font-bold py-2 px-4 rounded hover:bg-purple-700 transition duration-200">
              {isLoading ? 'Verificando...' : 'Iniciar Sesión'}
            </button>
            
            {/* Ocultamos botón de admin en el modal para simplificar al cliente */}
            {!onSuccess && (
                <button type="button" onClick={handleRegisterClick} disabled={isLoading} className="w-full bg-white text-gray-700 font-bold py-2 px-4 rounded hover:bg-gray-50 transition duration-200 border border-gray-300 shadow-sm">
                Registrar Usuario
                </button>
            )}

            {/* LINK PARA REGISTRARSE DENTRO DEL MODAL */}
            {onSuccess && onSwitchToRegister && (
                <div className="text-center mt-4 pt-4 border-t border-gray-100">
                    <p className="text-sm text-gray-500">¿No tienes cuenta?</p>
                    <button 
                        type="button"
                        onClick={onSwitchToRegister}
                        className="text-purple-600 font-bold text-sm hover:underline"
                    >
                        Regístrate aquí
                    </button>
                </div>
            )}
        </div>
      </form>
    </div>
  );
};

export default LoginForm;