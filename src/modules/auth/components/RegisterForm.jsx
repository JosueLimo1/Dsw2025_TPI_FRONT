import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
// Importamos los servicios que definimos antes
import { registerPublic, registerByAdmin } from '../services/register';

/**
 * Componente de Formulario de Registro Reutilizable
 * @param {boolean} isAdminMode - Si es true, muestra selector de rol y usa endpoint de admin.
 * @param {function} onBack - (Opcional) Función para ejecutar al volver (si se usa incrustado).
 */
const RegisterForm = ({ isAdminMode = false, onBack }) => {
  // Inicializamos useForm con la función reset
  const { register, handleSubmit, watch, formState: { errors }, reset } = useForm();
  
  const navigate = useNavigate();
  
  // Estados para feedback visual
  const [serverError, setServerError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Función principal de envío
  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      setServerError('');
      setSuccessMsg('');
      
      // Construimos el objeto DTO (Data Transfer Object)
      const dto = {
        Username: data.username,
        Email: data.email,
        Password: data.password,
        Name: data.name,
        PhoneNumber: data.phoneNumber,
        // Solo agregamos 'Role' si estamos en modo Admin (el endpoint público lo ignora/rechaza)
        ...(isAdminMode && { Role: data.role }) 
      };

      if (isAdminMode) {
        // --- ESCENARIO 1: ADMIN CREANDO USUARIOS ---
        // Usamos el endpoint privado que requiere token
        await registerByAdmin(dto);
        
        // Mostramos éxito pero NO redirigimos, para que pueda seguir creando más
        setSuccessMsg(`¡Usuario creado correctamente con rol ${dto.Role}!`);
        
        // Limpiamos el formulario para el siguiente
        reset(); 
        
      } else {
        // --- ESCENARIO 2: REGISTRO PÚBLICO ---
        // Usamos el endpoint público
        await registerPublic(dto);
        
        setSuccessMsg('¡Registro exitoso! Redirigiendo al login...');
        
        // Redirigimos automáticamente al login después de 2 segundos
        setTimeout(() => navigate('/login'), 2000);
      }
      
    } catch (error) {
      console.error(error);
      // Intentamos extraer el mensaje de error del backend de forma robusta
      const msg = error.response?.data?.message || error.response?.data || 'Error al registrar.';
      // Si el mensaje es un objeto (ej: validaciones), lo convertimos a texto
      setServerError(typeof msg === 'string' ? msg : JSON.stringify(msg));
    } finally {
      setIsLoading(false);
    }
  };

  // Manejador del botón volver
  const handleBack = () => {
    if (onBack) {
        onBack(); // Si nos pasaron una función personalizada (ej: desde el Login)
    } else {
        navigate('/login'); // Comportamiento por defecto
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        {isAdminMode ? 'Gestión de Usuarios' : 'Crear Cuenta'}
      </h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        
        {/* Input: Usuario */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Usuario</label>
          <input 
            type="text" 
            {...register("username", { required: "El usuario es requerido" })}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 outline-none"
          />
          {errors.username && <span className="text-xs text-red-500">{errors.username.message}</span>}
        </div>

        {/* Input: Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input 
            type="email" 
            {...register("email", { 
                required: "El email es requerido", 
                pattern: { value: /^\S+@\S+$/i, message: "Email inválido" } 
            })}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 outline-none"
          />
          {errors.email && <span className="text-xs text-red-500">{errors.email.message}</span>}
        </div>

        {/* SELECTOR DE ROL: Solo visible si es Admin */}
        {isAdminMode && (
            <div className="bg-purple-50 p-4 rounded-md border border-purple-200">
                <label className="block text-sm font-bold text-purple-900 mb-1">Rol a asignar</label>
                <select
                    {...register("role", { required: "Seleccione un rol" })}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white focus:ring-purple-500 focus:border-purple-500 outline-none"
                >
                    <option value="">Seleccionar...</option>
                    <option value="User">Usuario (Cliente)</option>
                    <option value="Admin">Administrador</option>
                </select>
                {errors.role && <span className="text-xs text-red-500 mt-1 block">{errors.role.message}</span>}
            </div>
        )}

        {/* Input: Nombre */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Nombre Completo</label>
          <input 
            type="text" 
            {...register("name", { required: "El nombre es requerido" })}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 outline-none"
          />
          {errors.name && <span className="text-xs text-red-500">{errors.name.message}</span>}
        </div>

        {/* Input: Teléfono */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Teléfono</label>
          <input 
            type="tel" 
            {...register("phoneNumber", { required: "El teléfono es requerido" })}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 outline-none"
          />
          {errors.phoneNumber && <span className="text-xs text-red-500">{errors.phoneNumber.message}</span>}
        </div>

        {/* Input: Contraseña */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Contraseña</label>
          <input 
            type="password" 
            {...register("password", { 
                required: "Requerida", 
                minLength: { value: 6, message: "Mínimo 6 caracteres" } 
            })}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 outline-none"
          />
          {errors.password && <span className="text-xs text-red-500">{errors.password.message}</span>}
        </div>

        {/* Input: Confirmar Contraseña */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Confirmar contraseña</label>
          <input 
            type="password" 
            {...register("confirmPassword", { 
              required: "Requerida", 
              validate: (val) => watch('password') === val || "Las contraseñas no coinciden" 
            })}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 outline-none"
          />
          {errors.confirmPassword && <span className="text-xs text-red-500">{errors.confirmPassword.message}</span>}
        </div>

        {/* Mensajes de Feedback (Error / Éxito) */}
        {serverError && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded text-center font-medium">
                {serverError}
            </div>
        )}
        {successMsg && (
            <div className="bg-green-50 border border-green-200 text-green-600 text-sm p-3 rounded text-center font-bold">
                {successMsg}
            </div>
        )}

        {/* Botones de Acción */}
        <div className="flex flex-col gap-3 pt-4">
          <button 
            type="submit" 
            disabled={isLoading} 
            className={`w-full bg-purple-600 text-white font-bold py-2.5 px-4 rounded-lg hover:bg-purple-700 transition duration-200 shadow-sm ${isLoading ? 'opacity-70 cursor-wait' : ''}`}
          >
            {isLoading ? 'Procesando...' : (isAdminMode ? 'Crear Usuario' : 'Registrarme')}
          </button>
          
          <button 
            type="button" 
            onClick={handleBack}
            className="w-full bg-gray-100 text-gray-700 font-bold py-2.5 px-4 rounded-lg hover:bg-gray-200 transition duration-200"
          >
            {isAdminMode ? 'Volver' : 'Volver al Login'}
          </button>
        </div>

      </form>
    </div>
  );
};

export default RegisterForm;