import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './modules/auth/pages/LoginPage';
import RegisterPage from './modules/auth/pages/RegisterPage.jsx';
import RegisterAdminPage from './modules/auth/pages/RegisterAdminPage.jsx';
import { AuthProvider } from './modules/auth/context/AuthProvider';
import Dashboard from './modules/templates/components/Dashboard.jsx';
import Home from './modules/home/pages/Home.jsx';
import ListProductsPage from './modules/products/pages/ListProductsPage.jsx';
import CreateProductPage from './modules/products/pages/CreateProductPage.jsx';
import ListOrdersPage from './modules/orders/pages/ListOrdersPage.jsx';
import OrderDetailPage from './modules/orders/pages/OrderDetailPage.jsx'; // <--- IMPORTAR

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Rutas Públicas */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<RegisterPage />} />
        
        {/* --- RUTA 1: INDEPENDIENTE (Para acceder desde el Login) --- */}
        {/* Esta ruta NO tiene el Dashboard alrededor, por lo que se verá pantalla completa */}
        <Route path="/admin/register-standalone" element={<RegisterAdminPage />} />
        
        {/* --- RUTAS DEL DASHBOARD (Para acceder desde el Menú) --- */}
        <Route path="/admin" element={<Dashboard />}>
            
            <Route index element={<Home />} />
            
            {/* Gestión de Productos */}
            <Route path="products" element={<ListProductsPage />} />
            <Route path="products/create" element={<CreateProductPage />} />
            <Route path="products/edit/:id" element={<CreateProductPage />} />
            
            {/* --- RUTA 2: INTEGRADA (Para acceder desde el Menú Lateral) --- */}
            {/* Esta ruta SÍ tiene el Dashboard alrededor */}
            <Route path="users/create" element={<RegisterAdminPage />} />
            
            {/* Gestión de Órdenes (CONECTADO) */}
            <Route path="orders" element={<ListOrdersPage />} />

            {/* NUEVA RUTA */}
            <Route path="orders/:id" element={<OrderDetailPage />} />
       
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;