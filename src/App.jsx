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
import OrderDetailPage from './modules/orders/pages/OrderDetailPage.jsx';
import StorePage from './modules/shop/pages/StorePage.jsx';

// 1. IMPORTAR PROVIDER Y PAGINA DE CARRITO
import { CartProvider } from './modules/shop/context/CartProvider.jsx';
import CartPage from './modules/shop/pages/CartPage.jsx';

function App() {
  return (
    <AuthProvider>
      {/* 2. ENVOLVER CON EL CARRITO */}
      <CartProvider>
        <Routes>
          <Route path="/" element={<StorePage />} />
          
          {/* 3. AGREGAR RUTA DEL CARRITO */}
          <Route path="/cart" element={<CartPage />} />

          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<RegisterPage />} />
          <Route path="/admin/register-standalone" element={<RegisterAdminPage />} />
          
          <Route path="/admin" element={<Dashboard />}>
              <Route index element={<Home />} />
              <Route path="products" element={<ListProductsPage />} />
              <Route path="products/create" element={<CreateProductPage />} />
              <Route path="products/edit/:id" element={<CreateProductPage />} />
              <Route path="users/create" element={<RegisterAdminPage />} />
              <Route path="orders" element={<ListOrdersPage />} />
              <Route path="orders/:id" element={<OrderDetailPage />} />
          </Route>
        </Routes>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;