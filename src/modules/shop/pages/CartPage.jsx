import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../templates/components/Navbar';
import { useCart } from '../context/CartProvider';
import useAuth from '../../auth/hook/useAuth';
import { createOrder } from '../../orders/services/orderService';
import { jwtDecode } from "jwt-decode";

// Importamos el nuevo Modal
import LoginModal from '../../auth/components/LoginModal';

const CartPage = () => {
  const { cart, addToCart, decreaseQuantity, removeFromCart, totalPrice, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Estados de control de flujo
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false); // Para mostrar inputs de dirección
  const [orderSuccess, setOrderSuccess] = useState(false); // Para mostrar mensaje final
  const [isProcessing, setIsProcessing] = useState(false);

  // Estados de datos
  const [shippingAddress, setShippingAddress] = useState('');
  const [billingAddress, setBillingAddress] = useState('');

  // 1. CLICK EN FINALIZAR COMPRA
  const handleFinalizeClick = () => {
    if (isAuthenticated) {
      // Si ya está logueado, mostramos el formulario de dirección
      setShowAddressForm(true);
    } else {
      // Si NO está logueado, abrimos el modal
      setShowLoginModal(true);
    }
  };

  // 2. CUANDO EL LOGIN EN EL MODAL TIENE ÉXITO
  const handleLoginSuccess = () => {
    setShowLoginModal(false); // Cerramos modal
    setShowAddressForm(true); // Mostramos formulario de dirección automáticamente
  };

  // 3. CONFIRMAR LA ORDEN (Llamada al Backend)
  const handleConfirmOrder = async () => {
    if (!shippingAddress || !billingAddress) {
        alert("Por favor completa las direcciones."); // Validación básica
        return; 
    }

    try {
      setIsProcessing(true);
      const token = localStorage.getItem('token');
      const decoded = jwtDecode(token);
      
      // Obtenemos el ID del usuario del token.
      // .NET suele usar 'nameid', 'sub' o urls largas.
      const userId = decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] || 
                     decoded.nameid || 
                     decoded.sub;

      const orderData = {
        customerId: userId,
        shippingAddress,
        billingAddress,
        orderItems: cart.map(item => ({
          productId: item.id,
          quantity: item.quantity
        }))
      };

      await createOrder(orderData);
      
      // ÉXITO: Limpiamos y mostramos pantalla de gracias
      clearCart();
      setOrderSuccess(true); 

    } catch (error) {
      console.error(error);
      alert("Error al procesar la orden: " + (error.response?.data || "Error desconocido"));
    } finally {
      setIsProcessing(false);
    }
  };

  // --- VISTA DE ÉXITO (Reemplaza al Alert) ---
  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center animate-fade-in">
            <div className="bg-green-100 p-6 rounded-full mb-6 text-green-600 text-6xl shadow-sm">✓</div>
            <h1 className="text-4xl font-bold text-gray-800 mb-4">¡Gracias por tu compra!</h1>
            <p className="text-gray-600 mb-8 max-w-md">
                Tu orden ha sido registrada exitosamente en el sistema.
            </p>
            <button 
                onClick={() => navigate('/')} 
                className="bg-purple-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-purple-700 transition shadow-lg"
            >
                Volver a la Tienda
            </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-6xl mx-auto py-10 px-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Tu Carrito</h1>

        {cart.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
            <p className="text-xl text-gray-500 mb-6">El carrito está vacío 😔</p>
            <button onClick={() => navigate('/')} className="bg-purple-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-purple-700 transition">
              Volver a la tienda
            </button>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            
            {/* Lista de Productos */}
            <div className="flex-1 space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="bg-white p-4 rounded-xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between border border-gray-100 gap-4">
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 bg-gray-100 rounded-md flex items-center justify-center text-xl">📦</div>
                    <div>
                        <h3 className="font-bold text-gray-800">{item.name}</h3>
                        <p className="text-sm text-gray-500">${item.currentUnitPrice} unidad</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 justify-between sm:justify-end w-full sm:w-auto">
                    <div className="flex items-center bg-gray-50 rounded-lg p-1">
                        <button onClick={() => decreaseQuantity(item.id)} className="w-8 h-8 flex items-center justify-center font-bold text-gray-600 hover:bg-white rounded shadow-sm transition">-</button>
                        <span className="font-bold w-8 text-center text-gray-800">{item.quantity}</span>
                        <button onClick={() => addToCart(item)} className="w-8 h-8 flex items-center justify-center font-bold text-green-600 hover:bg-white rounded shadow-sm transition">+</button>
                    </div>
                    
                    <button onClick={() => removeFromCart(item.id)} className="text-red-500 text-sm font-medium hover:text-red-700 underline">Eliminar</button>
                  </div>
                </div>
              ))}
            </div>

            {/* Panel Lateral (Resumen + Checkout) */}
            <div className="lg:w-96">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-24">
                
                {/* SI NO ESTAMOS EN MODO ADDRESS, MOSTRAMOS RESUMEN SIMPLE */}
                {!showAddressForm ? (
                    <>
                        <h3 className="font-bold text-lg mb-6 text-gray-800">Resumen</h3>
                        <div className="flex justify-between mb-4 text-xl font-bold">
                            <span>Total</span>
                            <span className="text-purple-700">${totalPrice.toFixed(2)}</span>
                        </div>
                        <button 
                            className="w-full bg-black text-white py-3.5 rounded-xl font-bold hover:bg-gray-800 transition shadow-lg shadow-purple-100 active:scale-95"
                            onClick={handleFinalizeClick}
                        >
                            Finalizar Compra
                        </button>
                    </>
                ) : (
                    /* FORMULARIO DE DIRECCIÓN (Se muestra tras loguearse) */
                    <div className="animate-fade-in">
                        <h3 className="font-bold text-lg mb-4 text-purple-700">Detalles de Envío</h3>
                        
                        <div className="space-y-3 mb-6">
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase">Dirección de Envío</label>
                                <input 
                                    type="text" 
                                    className="w-full border border-gray-300 rounded p-2 mt-1 focus:ring-2 focus:ring-purple-500 outline-none"
                                    placeholder="Calle, Altura, Ciudad"
                                    value={shippingAddress}
                                    onChange={(e) => setShippingAddress(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase">Facturación</label>
                                <input 
                                    type="text" 
                                    className="w-full border border-gray-300 rounded p-2 mt-1 focus:ring-2 focus:ring-purple-500 outline-none"
                                    placeholder="Igual a envío..."
                                    value={billingAddress}
                                    onChange={(e) => setBillingAddress(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="flex justify-between mb-4 text-xl font-bold border-t pt-4">
                            <span>Total</span>
                            <span>${totalPrice.toFixed(2)}</span>
                        </div>

                        <div className="flex gap-2">
                            <button 
                                onClick={() => setShowAddressForm(false)}
                                className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-bold hover:bg-gray-200 transition"
                            >
                                Cancelar
                            </button>
                            <button 
                                onClick={handleConfirmOrder}
                                disabled={isProcessing || !shippingAddress || !billingAddress}
                                className={`flex-1 bg-purple-600 text-white py-3 rounded-lg font-bold hover:bg-purple-700 transition ${isProcessing || !shippingAddress ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                {isProcessing ? '...' : 'Confirmar'}
                            </button>
                        </div>
                    </div>
                )}

              </div>
            </div>
          </div>
        )}
      </main>

      {/* --- EL MODAL DE LOGIN --- */}
      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)}
        onSuccess={handleLoginSuccess}
      />

    </div>
  );
};

export default CartPage;