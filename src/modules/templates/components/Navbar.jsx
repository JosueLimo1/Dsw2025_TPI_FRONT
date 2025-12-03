import React from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="bg-white shadow-md py-4 px-8 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div 
          className="text-2xl font-bold text-purple-700 cursor-pointer"
          onClick={() => navigate('/')}
        >
          🛒 MI E-COMMERCE
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/login')}
            className="text-sm text-gray-400 hover:text-purple-600 border border-gray-200 px-3 py-1 rounded"
          >
            Soy Admin
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;