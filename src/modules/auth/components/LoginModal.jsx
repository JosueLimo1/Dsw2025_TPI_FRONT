import React, { useState } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

const LoginModal = ({ isOpen, onClose, onSuccess }) => {
  // Estado para saber qué formulario mostrar: 'login' o 'register'
  const [view, setView] = useState('login'); 

  if (!isOpen) return null;

  // Función para volver al login después de registrarse exitosamente en el modal
  const handleRegisterSuccess = () => {
    setView('login'); // Volvemos al login para que ingrese con su cuenta nueva
    // Opcional: podrías loguearlo automáticamente aquí si tu backend devolviera el token al registrar
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Botón Cerrar */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 font-bold text-xl z-10"
        >
          ✕
        </button>

        <div className="p-2 overflow-y-auto">
            {view === 'login' ? (
                <>
                    {/* Pasamos una prop extra para mostrar el link de registro */}
                    <LoginForm 
                        onSuccess={onSuccess} 
                        onSwitchToRegister={() => setView('register')} 
                    />
                </>
            ) : (
                <>
                    {/* Formulario de Registro en modo Modal */}
                    <RegisterForm 
                        onBack={() => setView('login')} // Botón volver lleva al login
                        onSuccessCustom={handleRegisterSuccess} // Callback especial
                    />
                </>
            )}
        </div>
        
      </div>
    </div>
  );
};

export default LoginModal;