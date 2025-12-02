import React from 'react';
// Importante: Revisa que la ruta al componente RegisterForm sea correcta
import RegisterForm from '../components/RegisterForm.jsx';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hook/useAuth';

const RegisterAdminPage = () => {
  const navigate = useNavigate();
  // Esta función puede usarse si decides poner un botón de salir en el futuro
  const { logoutSession } = useAuth(); 

  return (
    // Contenedor principal con padding para que no se pegue a los bordes
    <div className="p-6 w-full max-w-4xl mx-auto">
      
      {/* Encabezado de la página */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Gestión de Usuarios</h2>
        <p className="text-gray-500 text-sm mt-1">
            Complete el formulario para registrar un nuevo administrador o usuario del sistema.
        </p>
      </div>

      {/* Cargamos el formulario activando el modo Admin */}
      {/* El formulario ya tiene sus propios estilos de tarjeta (Card), así que se verá integrado */}
      <RegisterForm isAdminMode={true} />
        
    </div>
  );
};

export default RegisterAdminPage;