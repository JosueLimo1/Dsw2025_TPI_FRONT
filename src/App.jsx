import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './modules/auth/pages/LoginPage';
import { AuthProvider } from './modules/auth/context/AuthProvider';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        
        {/* Placeholder para cuando entres */}
        <Route path="/admin" element={<h1 className="p-10 text-2xl text-green-600">¡Bienvenido al Dashboard!</h1>} />
      </Routes>
    </AuthProvider>
  );
}

export default App;