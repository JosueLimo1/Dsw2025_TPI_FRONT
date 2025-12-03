import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './modules/auth/pages/LoginPage';
import RegisterPage from './modules/auth/pages/RegisterPage.jsx';
import RegisterAdminPage from './modules/auth/pages/RegisterAdminPage.jsx';
import { AuthProvider } from './modules/auth/context/AuthProvider';

// Tus importaciones originales (respetando la ruta modules/templates)
import Dashboard from './modules/templates/components/Dashboard.jsx';
import Home from './modules/home/pages/Home.jsx';
import ListProductsPage from './modules/products/pages/ListProductsPage.jsx';
import CreateProductPage from './modules/products/pages/CreateProductPage.jsx';
import ListOrdersPage from './modules/orders/pages/ListOrdersPage.jsx';
import OrderDetailPage from './modules/orders/pages/OrderDetailPage.jsx';

// IMPORTAR LA TIENDA PÚBLICA
import StorePage from './modules/shop/pages/StorePage.jsx';

function App() {
  return (
    <AuthProvider>
      <Routes>
        
        {/* --- RUTA RAÍZ (PÚBLICA) --- */}
        <Route path="/" element={<StorePage />} />

        {/* Rutas de Autenticación */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<RegisterPage />} />
        
        {/* Ruta Independiente Admin */}
        <Route path="/admin/register-standalone" element={<RegisterAdminPage />} />
        
        {/* --- RUTAS DEL DASHBOARD (ADMIN) --- */}
        <Route path="/admin" element={<Dashboard />}>
            
            <Route index element={<Home />} />
            
            {/* Gestión de Productos */}
            <Route path="products" element={<ListProductsPage />} />
            <Route path="products/create" element={<CreateProductPage />} />
            <Route path="products/edit/:id" element={<CreateProductPage />} />
            
            {/* Gestión de Usuarios */}
            <Route path="users/create" element={<RegisterAdminPage />} />
            
            {/* Gestión de Órdenes */}
            <Route path="orders" element={<ListOrdersPage />} />
            <Route path="orders/:id" element={<OrderDetailPage />} />
        
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;