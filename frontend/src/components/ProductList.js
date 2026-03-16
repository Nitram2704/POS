import React from 'react';
import { Card, Button, Row, Col, Badge } from 'react-bootstrap';
import { useCart } from '../context/CartContext';

const ProductList = ({ products }) => {
  const { addToCart } = useCart();

  return (
    <Row>
      {products.map((product, index) => (
        <Col key={product.id} md={6} lg={4} className="mb-4 animate-fade-in" style={{ animationDelay: `${index * 0.05}s` }}>
          <Card className="product-card h-100 text-white">
            <div className="product-image-container">
              <Card.Img
                variant="top"
                src={product.images[0]?.src || 'https://via.placeholder.com/300'}
                className="product-image"
              />
              {product.on_sale && (
                <Badge bg="danger" className="position-absolute top-0 end-0 m-2">Oferta</Badge>
              )}
            </div>
            <Card.Body className="d-flex flex-column">
              <Card.Title className="fs-6 fw-bold text-truncate" title={product.name}>
                {product.name}
              </Card.Title>
              <div className="mt-auto">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <span className="fs-5 fw-bold text-info">${product.price}</span>
                  {product.regular_price && product.price !== product.regular_price && (
                    <span className="text-muted text-decoration-line-through small">${product.regular_price}</span>
                  )}
                </div>
                {product.manage_stock && (
                  <div className="mb-2">
                    <small className={product.stock_quantity > 0 ? "text-success" : "text-danger"}>
                      {product.stock_quantity > 0 ? `Stock: ${product.stock_quantity}` : "Sin Stock"}
                    </small>
                  </div>
                )}
                <Button
                  variant="primary"
                  className="w-100 btn-primary-gradient"
                  onClick={() => addToCart(product)}
                  disabled={product.manage_stock && product.stock_quantity === 0}
                >
                  {product.manage_stock && product.stock_quantity === 0 ? "Sin Stock" : "Agregar al Carrito"}
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default ProductList;