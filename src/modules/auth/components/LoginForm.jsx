import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/login'; // Importamos el servicio
import useAuth from '../hook/useAuth'; // Usamos tu hook

const LoginForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { loginSession } = useAuth();
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState('');

  const onSubmit = async (data) => {
    try {
      setErrorMsg('');
      const response = await login(data); // Llamada al back
      
      if (response && response.token) {
        loginSession(response.token); // Guardamos sesión
        navigate('/admin'); // Redirigimos al Dashboard
      }
    } catch (error) {
      console.error(error);
      setErrorMsg('Usuario o contraseña incorrectos.');
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-96">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Iniciar Sesión</h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Usuario */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Usuario</label>
          <input 
            type="text" 
            {...register("username", { required: "El usuario es requerido" })}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
          />
          {errors.username && <span className="text-xs text-red-500">{errors.username.message}</span>}
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Contraseña</label>
          <input 
            type="password" 
            {...register("password", { required: "La contraseña es requerida" })}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
          />
          {errors.password && <span className="text-xs text-red-500">{errors.password.message}</span>}
        </div>

        {/* Error del servidor */}
        {errorMsg && (
            <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded">
                {errorMsg}
            </div>
        )}

        <button type="submit" className="w-full bg-purple-200 text-purple-700 font-bold py-2 px-4 rounded hover:bg-purple-300 transition duration-200">
          Iniciar Sesión
        </button>
        
        {/* Botón ficticio de registrar para cumplir con el diseño */}
        <button type="button" className="w-full bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded hover:bg-gray-300 transition duration-200">
          Registrar Usuario
        </button>
      </form>
    </div>
  );
};

export default LoginForm;