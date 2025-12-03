import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
// Importamos los servicios
import { registerPublic, registerByAdmin } from '../services/register';

/**
 * Componente de Formulario de Registro Reutilizable
 * @param {boolean} isAdminMode - Si es true, muestra selector de rol y usa endpoint de admin.
 * @param {function} onBack - Función para volver atrás.
 * @param {function} onSuccessCustom - Función especial para cuando el registro público es exitoso (ej: en modal).
 */
const RegisterForm = ({ isAdminMode = false, onBack, onSuccessCustom }) => {
  const { register, handleSubmit, watch, formState: { errors }, reset } = useForm();
  
  const navigate = useNavigate();
  
  const [serverError, setServerError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      setServerError('');
      setSuccessMsg('');
      
      const dto = {
        Username: data.username,
        Email: data.email,
        Password: data.password,
        Name: data.name,
        PhoneNumber: data.phoneNumber,
        ...(isAdminMode && { Role: data.role }) 
      };

      if (isAdminMode) {
        // --- MODO ADMIN ---
        await registerByAdmin(dto);
        setSuccessMsg(`¡Usuario creado correctamente con rol ${dto.Role}!`);
        reset(); 
        
      } else {
        // --- MODO PÚBLICO ---
        await registerPublic(dto);
        
        // AQUÍ ESTÁ EL CAMBIO PARA EL MODAL
        if (onSuccessCustom) {
            setSuccessMsg('¡Registro exitoso! Ya puedes iniciar sesión.');
            // Volvemos a la vista de Login dentro del modal automáticamente
            setTimeout(() => onSuccessCustom(), 1500);
        } else {
            // Comportamiento normal de página
            setSuccessMsg('¡Registro exitoso! Redirigiendo al login...');
            setTimeout(() => navigate('/login'), 2000);
        }
      }
      
    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.message || error.response?.data || 'Error al registrar.';
      setServerError(typeof msg === 'string' ? msg : JSON.stringify(msg));
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    if (onBack) {
        onBack(); 
    } else {
        navigate('/login'); 
    }
  };

  return (
    <div className={`bg-white p-8 rounded-lg ${onSuccessCustom ? 'shadow-none w-full' : 'shadow-md w-full max-w-lg mx-auto'}`}>
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        {isAdminMode ? 'Gestión de Usuarios' : 'Crear Cuenta'}
      </h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        
        {/* Usuario */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Usuario</label>
          <input type="text" {...register("username", { required: "Requerido" })} className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 outline-none"/>
          {errors.username && <span className="text-xs text-red-500">{errors.username.message}</span>}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input type="email" {...register("email", { required: "Requerido", pattern: { value: /^\S+@\S+$/i, message: "Inválido" } })} className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 outline-none"/>
          {errors.email && <span className="text-xs text-red-500">{errors.email.message}</span>}
        </div>

        {/* Rol (Solo Admin) */}
        {isAdminMode && (
            <div className="bg-purple-50 p-4 rounded-md border border-purple-200">
                <label className="block text-sm font-bold text-purple-900 mb-1">Rol a asignar</label>
                <select {...register("role", { required: "Seleccione un rol" })} className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white focus:ring-purple-500 focus:border-purple-500 outline-none">
                    <option value="">Seleccionar...</option>
                    <option value="User">Usuario (Cliente)</option>
                    <option value="Admin">Administrador</option>
                </select>
                {errors.role && <span className="text-xs text-red-500 mt-1 block">{errors.role.message}</span>}
            </div>
        )}

        {/* Nombre */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Nombre Completo</label>
          <input type="text" {...register("name", { required: "Requerido" })} className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 outline-none"/>
          {errors.name && <span className="text-xs text-red-500">{errors.name.message}</span>}
        </div>

        {/* Teléfono */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Teléfono</label>
          <input type="tel" {...register("phoneNumber", { required: "Requerido" })} className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 outline-none"/>
          {errors.phoneNumber && <span className="text-xs text-red-500">{errors.phoneNumber.message}</span>}
        </div>

        {/* Contraseña */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Contraseña</label>
          <input type="password" {...register("password", { required: "Requerida", minLength: { value: 6, message: "+6 caracteres" } })} className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 outline-none"/>
          {errors.password && <span className="text-xs text-red-500">{errors.password.message}</span>}
        </div>

        {/* Confirmar */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Confirmar contraseña</label>
          <input type="password" {...register("confirmPassword", { required: "Requerida", validate: (val) => watch('password') === val || "No coinciden" })} className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 outline-none"/>
          {errors.confirmPassword && <span className="text-xs text-red-500">{errors.confirmPassword.message}</span>}
        </div>

        {/* Mensajes */}
        {serverError && <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded text-center font-medium">{serverError}</div>}
        {successMsg && <div className="bg-green-50 border border-green-200 text-green-600 text-sm p-3 rounded text-center font-bold">{successMsg}</div>}

        {/* Botones */}
        <div className="flex flex-col gap-3 pt-4">
          <button type="submit" disabled={isLoading} className={`w-full bg-purple-600 text-white font-bold py-2.5 px-4 rounded-lg hover:bg-purple-700 transition duration-200 shadow-sm ${isLoading ? 'opacity-70 cursor-wait' : ''}`}>
            {isLoading ? 'Procesando...' : (isAdminMode ? 'Crear Usuario' : 'Registrarme')}
          </button>
          
          <button type="button" onClick={handleBack} className="w-full bg-gray-100 text-gray-700 font-bold py-2.5 px-4 rounded-lg hover:bg-gray-200 transition duration-200">
            {isAdminMode ? 'Volver' : (onSuccessCustom ? 'Volver al Inicio de Sesión' : 'Volver al Login')}
          </button>
        </div>

      </form>
    </div>
  );
};

export default RegisterForm;