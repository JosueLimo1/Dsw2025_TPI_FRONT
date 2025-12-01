import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './modules/auth/pages/LoginPage';
import RegisterPage from './modules/auth/pages/RegisterPage.jsx';
import RegisterAdminPage from './modules/auth/pages/RegisterAdminPage.jsx';
import { AuthProvider } from './modules/auth/context/AuthProvider';

// IMPORTACIONES DEL DASHBOARD
// Prueba agregar '/modules' al principio de la ruta
import Dashboard from './modules/templates/components/Dashboard.jsx';
import Home from './modules/home/pages/Home.jsx';
import ListProductsPage from './modules/products/pages/ListProductsPage.jsx';

// 1. IMPORTAR LA PÁGINA DEL FORMULARIO (Asegúrate de tener este archivo)
import CreateProductPage from './modules/products/pages/CreateProductPage.jsx';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<RegisterPage />} />
        
        {/* Ruta para crear Admin */}
        <Route path="/admin/users/create" element={<RegisterAdminPage />} />
        
        {/* RUTAS DEL DASHBOARD */}
        <Route path="/admin" element={<Dashboard />}>
            <Route index element={<Home />} />
            
            {/* Lista de productos */}
            <Route path="products" element={<ListProductsPage />} />
            
            {/* 2. AQUÍ ESTÁ EL CAMBIO CLAVE: Usamos el componente <CreateProductPage /> */}
            <Route path="products/create" element={<CreateProductPage />} />
            
            <Route path="orders" element={<h2>Gestión de Órdenes (Próximamente)</h2>} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;