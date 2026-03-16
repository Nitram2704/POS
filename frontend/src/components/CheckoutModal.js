import React, { useState } from 'react';
import { Modal, Button, Form, Spinner, Alert } from 'react-bootstrap';

const CheckoutModal = ({ show, handleClose, cart, onOrderPlaced }) => {
  const [customer, setCustomer] = useState({ firstName: '', lastName: '', email: '' });
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomer(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cart, customer }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al procesar el pedido.');
      }

      const order = await response.json();
      onOrderPlaced(order);
      handleClose(true); // Pasamos true para indicar que fue exitoso
    } catch (err) {
      setError(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleModalClose = () => {
    setError(null);
    setCustomer({ firstName: '', lastName: '', email: '' });
    // No reseteamos isProcessing aquí, lo hace el finally del submit
    handleClose();
  }

  return (
    <Modal show={show} onHide={handleModalClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Información del Cliente</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form.Group className="mb-3">
            <Form.Label>Nombre</Form.Label>
            <Form.Control type="text" name="firstName" onChange={handleInputChange} required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Apellido</Form.Label>
            <Form.Control type="text" name="lastName" onChange={handleInputChange} required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" name="email" onChange={handleInputChange} required />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose} disabled={isProcessing}>Cancelar</Button>
          <Button type="submit" variant="primary" disabled={isProcessing}>
            {isProcessing ? <><Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> Procesando...</> : 'Realizar Pedido'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default CheckoutModal;