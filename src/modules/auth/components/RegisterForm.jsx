import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
// Importamos los servicios
import { registerPublic, registerByAdmin } from '../services/register';

const RegisterForm = ({ isAdminMode = false }) => {
  // 1. AGREGAMOS 'reset' AQUÍ
  const { register, handleSubmit, watch, formState: { errors }, reset } = useForm();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      setServerError('');
      setSuccessMsg(''); // Limpiamos mensaje previo
      
      const dto = {
        Username: data.username,
        Email: data.email,
        Password: data.password,
        Name: data.name,
        PhoneNumber: data.phoneNumber,
        ...(isAdminMode && { Role: data.role }) 
      };

      if (isAdminMode) {
        // --- MODO ADMIN (DENTRO DEL DASHBOARD) ---
        await registerByAdmin(dto);
        
        // CORRECCIÓN:
        // 1. Mensaje de éxito
        setSuccessMsg(`¡Usuario creado correctamente! Puede registrar otro.`);
        // 2. Limpiamos el formulario para que quede listo para el siguiente
        reset(); 
        // 3. ¡NO REDIRIGIMOS! Nos quedamos aquí.
        
      } else {
        // --- MODO PÚBLICO (DESDE EL LOGIN) ---
        await registerPublic(dto);
        setSuccessMsg('¡Registro exitoso! Redirigiendo al login...');
        // Aquí sí redirigimos porque el usuario acaba de registrarse
        setTimeout(() => navigate('/login'), 2000);
      }
      
    } catch (error) {
      console.error(error);
      const msg = error.response?.data || 'Error al registrar.';
      setServerError(typeof msg === 'string' ? msg : JSON.stringify(msg));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
        {isAdminMode ? 'Gestión de Usuarios' : 'Crear Cuenta'}
      </h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        
        {/* Usuario */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Usuario</label>
          <input type="text" {...register("username", { required: "Requerido" })} className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"/>
          {errors.username && <span className="text-xs text-red-500">{errors.username.message}</span>}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input type="email" {...register("email", { required: "Requerido", pattern: { value: /^\S+@\S+$/i, message: "Email inválido" } })} className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"/>
          {errors.email && <span className="text-xs text-red-500">{errors.email.message}</span>}
        </div>

        {/* Rol (Solo Admin) */}
        {isAdminMode && (
            <div className="bg-purple-50 p-3 rounded-md border border-purple-200">
                <label className="block text-sm font-bold text-purple-900">Rol a asignar</label>
                <select
                    {...register("role", { required: "Seleccione un rol" })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white"
                >
                    <option value="">Seleccionar...</option>
                    <option value="User">Usuario (Cliente)</option>
                    <option value="Admin">Administrador</option>
                </select>
                {errors.role && <span className="text-xs text-red-500">{errors.role.message}</span>}
            </div>
        )}

        {/* Nombre */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Nombre Completo</label>
          <input type="text" {...register("name", { required: "Requerido" })} className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"/>
          {errors.name && <span className="text-xs text-red-500">{errors.name.message}</span>}
        </div>

        {/* Teléfono */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Teléfono</label>
          <input type="tel" {...register("phoneNumber", { required: "Requerido" })} className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"/>
          {errors.phoneNumber && <span className="text-xs text-red-500">{errors.phoneNumber.message}</span>}
        </div>

        {/* Contraseña */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Contraseña</label>
          <input type="password" {...register("password", { required: "Requerida", minLength: { value: 6, message: "+6 caracteres" } })} className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"/>
          {errors.password && <span className="text-xs text-red-500">{errors.password.message}</span>}
        </div>

        {/* Confirmar Contraseña */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Confirmar contraseña</label>
          <input type="password" {...register("confirmPassword", { required: "Requerida", validate: (val) => watch('password') === val || "No coinciden" })} className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"/>
          {errors.confirmPassword && <span className="text-xs text-red-500">{errors.confirmPassword.message}</span>}
        </div>

        {/* Mensajes */}
        {serverError && <div className="text-red-500 text-xs text-center bg-red-50 p-2 rounded">{serverError}</div>}
        {successMsg && <div className="text-green-500 text-sm text-center font-bold bg-green-50 p-2 rounded">{successMsg}</div>}

        {/* Botones */}
        <div className="flex flex-col gap-2 pt-2">
          <button type="submit" disabled={isLoading} className="w-full bg-purple-600 text-white font-bold py-2 px-4 rounded hover:bg-purple-700 transition">
            {isLoading ? 'Procesando...' : (isAdminMode ? 'Crear Usuario' : 'Registrarme')}
          </button>
          
          {/* Botón Volver */}
          <button 
            type="button" 
            onClick={() => navigate('/login')}
            className="w-full bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded hover:bg-gray-300 transition duration-200"
          >
            {isAdminMode ? 'Volver' : 'Volver al Login'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;