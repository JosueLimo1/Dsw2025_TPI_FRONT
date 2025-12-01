import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './modules/auth/pages/LoginPage';
import RegisterPage from './modules/auth/pages/RegisterPage.jsx';
import RegisterAdminPage from './modules/auth/pages/RegisterAdminPage.jsx';
import { AuthProvider } from './modules/auth/context/AuthProvider';

// IMPORTACIONES DEL DASHBOARD
// CORRECCIÓN: Agregamos 'modules' a la ruta
import Dashboard from './modules/templates/components/Dashboard.jsx';
import Home from './modules/home/pages/Home.jsx';
import ListProductsPage from './modules/products/pages/ListProductsPage.jsx';

// IMPORTAR LA PÁGINA DEL FORMULARIO (Sirve para Crear y Editar)
import CreateProductPage from './modules/products/pages/CreateProductPage.jsx';

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Rutas Públicas */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<RegisterPage />} />
        
        {/* Ruta para crear Admin (Fuera del dashboard) */}
        <Route path="/admin/users/create" element={<RegisterAdminPage />} />
        
        {/* RUTAS DEL DASHBOARD */}
        <Route path="/admin" element={<Dashboard />}>
            
            {/* Inicio del Dashboard */}
            <Route index element={<Home />} />
            
            {/* Lista de productos */}
            <Route path="products" element={<ListProductsPage />} />
            
            {/* Ruta Crear Producto */}
            <Route path="products/create" element={<CreateProductPage />} />

            {/* --- NUEVA RUTA PARA EDITAR --- */}
            {/* El ':id' captura el ID que envía el botón de la lista */}
            <Route path="products/edit/:id" element={<CreateProductPage />} />
            
            <Route path="orders" element={<h2>Gestión de Órdenes (Próximamente)</h2>} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;