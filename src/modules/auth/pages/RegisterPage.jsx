import React from 'react';
// Importante: Asegúrate de que apunte bien a components
import RegisterForm from '../components/RegisterForm.jsx'; 

const RegisterPage = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <RegisterForm />
    </div>
  );
};

export default RegisterPage;