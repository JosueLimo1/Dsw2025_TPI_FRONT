import React, { createContext, useState, useEffect, useContext } from 'react';

// 1. Creamos el contexto
const CartContext = createContext();

// 2. Hook personalizado para usar el carrito fácil
export const useCart = () => useContext(CartContext);

// 3. El Proveedor que envuelve la app
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // Al cargar, leemos del localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // Cada vez que cambia el carrito, guardamos en localStorage
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // FUNCIÓN: Agregar producto
  const addToCart = (product) => {
    setCart((prevCart) => {
      // ¿Ya existe el producto en el carrito?
      const existingItem = prevCart.find((item) => item.id === product.id);

      if (existingItem) {
        // Si existe, aumentamos la cantidad
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        // Si no existe, lo agregamos con cantidad 1
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };

  // FUNCIÓN: Eliminar producto
  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  // FUNCIÓN: Bajar cantidad (restar 1)
  const decreaseQuantity = (productId) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === productId);
      if (existingItem?.quantity === 1) {
        // Si queda 1 y restamos, lo borramos
        return prevCart.filter((item) => item.id !== productId);
      }
      return prevCart.map((item) =>
        item.id === productId ? { ...item, quantity: item.quantity - 1 } : item
      );
    });
  };

  // FUNCIÓN: Vaciar carrito
  const clearCart = () => setCart([]);

  // Calculamos el total de items para el numerito del Navbar
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  
  // Calculamos el precio total
  const totalPrice = cart.reduce((acc, item) => acc + (item.currentUnitPrice * item.quantity), 0);

  return (
    <CartContext.Provider value={{ 
      cart, 
      addToCart, 
      removeFromCart, 
      decreaseQuantity, 
      clearCart, 
      totalItems,
      totalPrice
    }}>
      {children}
    </CartContext.Provider>
  );
};