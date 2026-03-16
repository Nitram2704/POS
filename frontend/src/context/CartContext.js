import React, { createContext, useState, useContext } from 'react';
import { toast } from 'react-toastify';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);

    const addToCart = (product) => {
        // Check if item exists outside of setState to avoid side effects in updater
        const existingItem = cart.find(item => item.id === product.id);

        if (product.manage_stock && product.stock_quantity !== null) {
            const currentQty = existingItem ? existingItem.quantity : 0;
            if (currentQty + 1 > product.stock_quantity) {
                toast.error(`No hay suficiente stock. Disponible: ${product.stock_quantity}`);
                return;
            }
        }

        if (existingItem) {
            toast.info(`Cantidad actualizada: ${product.name}`);
            setCart(prevCart => prevCart.map(item =>
                item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
            ));
        } else {
            toast.success(`${product.name} agregado al carrito`);
            setCart(prevCart => [...prevCart, { ...product, quantity: 1 }]);
        }
    };

    const removeFromCart = (productId) => {
        const item = cart.find(i => i.id === productId);
        if (item) {
            toast.error(`${item.name} eliminado del carrito`);
        }
        setCart(prevCart => prevCart.filter(item => item.id !== productId));
    };

    const updateQuantity = (productId, quantity) => {
        if (quantity <= 0) {
            removeFromCart(productId);
        } else {
            setCart(prevCart =>
                prevCart.map(item =>
                    item.id === productId ? { ...item, quantity } : item
                )
            );
        }
    };

    const clearCart = () => {
        if (cart.length > 0) {
            toast.warn('Carrito vaciado');
            setCart([]);
        }
    };

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};
