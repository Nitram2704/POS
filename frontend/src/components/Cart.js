import React from 'react';
import { Button, Badge } from 'react-bootstrap';
import { Trash, Plus, Dash, Cart as CartIcon } from 'react-bootstrap-icons';
import { useCart } from '../context/CartContext';

const Cart = ({ onCheckout }) => {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  if (cart.length === 0) {
    return (
      <div className="glass-panel p-4 text-center text-muted cart-container">
        <CartIcon size={48} className="mb-3 opacity-50" />
        <h5>Tu carrito está vacío</h5>
        <p className="small">Agrega productos para comenzar una orden.</p>
      </div>
    );
  }

  return (
    <div className="glass-panel p-3 cart-container text-white">
      <h4 className="mb-4 d-flex align-items-center">
        <CartIcon className="me-2" /> Carrito <Badge bg="primary" className="ms-2 rounded-pill">{cart.length}</Badge>
      </h4>

      <div className="cart-items" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
        {cart.map(item => (
          <div key={item.id} className="cart-item d-flex justify-content-between align-items-center animate-fade-in">
            <div className="flex-grow-1 me-2">
              <div className="fw-bold text-truncate" style={{ maxWidth: '150px' }}>{item.name}</div>
              <div className="small text-info">${item.price} x {item.quantity}</div>
            </div>
            <div className="d-flex align-items-center">
              <Button
                variant="outline-light"
                size="sm"
                className="p-1 border-0"
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
              >
                <Dash />
              </Button>
              <span className="mx-2 fw-bold">{item.quantity}</span>
              <Button
                variant="outline-light"
                size="sm"
                className="p-1 border-0"
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
              >
                <Plus />
              </Button>
              <Button
                variant="outline-danger"
                size="sm"
                className="ms-2 border-0"
                onClick={() => removeFromCart(item.id)}
              >
                <Trash />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="cart-total">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <span className="fs-5">Total:</span>
          <span className="fs-4 fw-bold text-success">${total.toFixed(2)}</span>
        </div>
        <div className="d-grid gap-2">
          <Button variant="success" size="lg" className="fw-bold" onClick={onCheckout}>
            Completar Pedido
          </Button>
          <Button variant="outline-light" size="sm" onClick={clearCart}>
            Vaciar Carrito
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Cart;