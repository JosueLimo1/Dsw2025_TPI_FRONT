import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './modules/auth/pages/LoginPage';
import RegisterPage from './modules/auth/pages/RegisterPage.jsx';
import RegisterAdminPage from './modules/auth/pages/RegisterAdminPage.jsx';
import { AuthProvider } from './modules/auth/context/AuthProvider';

// IMPORTACIONES DEL DASHBOARD
import Dashboard from './modules/templates/components/Dashboard.jsx';
import Home from './modules/home/pages/Home.jsx'; // Tu Home con Cards
import ListProductsPage from './modules/products/pages/ListProductsPage.jsx'; // Tu lista compleja

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Rutas Públicas */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<RegisterPage />} />
        
        {/* Ruta Especial: Crear Admin */}
        <Route path="/admin/users/create" element={<RegisterAdminPage />} />
        
        {/* === RUTAS DEL DASHBOARD === */}
        <Route path="/admin" element={<Dashboard />}>
            
            {/* 1. Al entrar a /admin, carga tu Home.jsx */}
            <Route index element={<Home />} />
            
            {/* 2. Al entrar a /admin/products, carga tu ListProductsPage.jsx */}
            <Route path="products" element={<ListProductsPage />} />
            
            {/* 3. Placeholder para creación (para que no de error el botón de tu lista) */}
            <Route path="products/create" element={<h2>Crear Producto (Próximamente)</h2>} />
            
            {/* 4. Placeholder para órdenes */}
            <Route path="orders" element={<h2>Gestión de Órdenes (Próximamente)</h2>} />
            
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;