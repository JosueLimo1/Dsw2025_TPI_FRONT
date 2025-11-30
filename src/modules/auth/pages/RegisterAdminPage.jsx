import React from 'react';
// Importante: Revisa que la ruta al componente RegisterForm sea correcta
import RegisterForm from '../components/RegisterForm.jsx';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hook/useAuth';

const RegisterAdminPage = () => {
  const navigate = useNavigate();
  const { logoutSession } = useAuth();

  const handleBack = () => {
    logoutSession(); 
    navigate('/login');
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-full max-w-md relative">
        
        {/* Botón para salir (arriba a la derecha) */}
        <button 
            onClick={handleBack}
            className="absolute -top-10 right-0 text-sm text-gray-500 hover:text-red-600 font-medium"
        >
            Cerrar Sesión Admin
        </button>

        {/* Cargamos el formulario activando el modo Admin */}
        <RegisterForm isAdminMode={true} />
        
      </div>
    </div>
  );
};

export default RegisterAdminPage;