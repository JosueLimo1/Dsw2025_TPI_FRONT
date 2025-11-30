import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './modules/auth/pages/LoginPage';
import RegisterPage from './modules/auth/pages/RegisterPage.jsx';
// Importamos la página de Admin
import RegisterAdminPage from './modules/auth/pages/RegisterAdminPage.jsx';
import { AuthProvider } from './modules/auth/context/AuthProvider';

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Rutas Públicas */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<RegisterPage />} />
        
        {/* --- AQUÍ ESTÁ LA SOLUCIÓN --- */}
        {/* Definimos esta ruta FUERA del Dashboard para que se vea sola y limpia */}
        <Route path="/admin/users/create" element={<RegisterAdminPage />} />
        
        {/* Rutas del Dashboard (Las dejamos pendientes o vacías por ahora) */}
        <Route path="/admin" element={<h1 className="p-10">Dashboard Pendiente</h1>} />
      </Routes>
    </AuthProvider>
  );
}

export default App;