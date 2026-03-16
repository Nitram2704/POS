import React, { useState, useEffect } from 'react';
import { Navbar, Container, Row, Col, Spinner, Alert } from 'react-bootstrap';
import ProductList from './components/ProductList';
import Cart from './components/Cart';
import CheckoutModal from './components/CheckoutModal';
import { CartProvider, useCart } from './context/CartContext';
import { getProducts, getCategories } from './services/api';
import { generateReceipt } from './utils/pdfGenerator';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Dashboard from './components/Dashboard';
import { List, Bag } from 'react-bootstrap-icons';
import './App.css';

const MainContent = () => {
  const [view, setView] = useState('pos'); // 'pos' or 'dashboard'
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const { cart, clearCart } = useCart();

  const refreshData = async () => {
    setLoading(true);
    try {
      const [productsData, categoriesData] = await Promise.all([
        getProducts(),
        getCategories()
      ]);
      setProducts(productsData);
      setCategories(categoriesData);
    } catch (err) {
      setError(err.message || 'Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const handleOrderPlaced = async (order) => {
    console.log('Pedido realizado con éxito:', order);
    toast.success(`Pedido #${order.id} creado con éxito.`);
    generateReceipt(order);
    clearCart();
    await refreshData(); // Recargar datos para actualizar stock
  };

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory ? product.categories.some(cat => cat.name === selectedCategory) : true;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg" className="mb-4 glass-navbar">
        <Container>
          <Navbar.Brand href="#home" className="fw-bold text-uppercase">Mi POS Premium</Navbar.Brand>
          <div className="d-flex gap-2">
            <button
              className={`btn ${view === 'pos' ? 'btn-primary' : 'btn-outline-light'}`}
              onClick={() => setView('pos')}
            >
              <Bag className="me-2" /> POS
            </button>
            <button
              className={`btn ${view === 'dashboard' ? 'btn-primary' : 'btn-outline-light'}`}
              onClick={() => setView('dashboard')}
            >
              <List className="me-2" /> Dashboard
            </button>
          </div>
        </Container>
      </Navbar>

      <Container className="mt-4">
        {view === 'dashboard' ? (
          <Dashboard />
        ) : (
          <Row>
            <Col md={8}>
              <div className="mb-4 d-flex align-items-center gap-3">
                <div className="flex-grow-1">
                  <input
                    type="text"
                    className="form-control glass-input"
                    placeholder="Buscar productos..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="d-flex align-items-center">
                  <label htmlFor="category-select" className="me-2 fw-bold text-white text-nowrap">Categoría:</label>
                  <select
                    id="category-select"
                    className="form-select glass-input"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    <option value="">Todas</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.name}>{category.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              {loading ? (
                <div className="text-center py-5 text-white">
                  <Spinner animation="border" role="status" variant="light" />
                  <p className="mt-2">Cargando productos...</p>
                </div>
              ) : error ? (
                <Alert variant="danger">Error al cargar productos: {error}</Alert>
              ) : (
                <ProductList products={filteredProducts} />
              )}
            </Col>
            <Col md={4} className="cart-section">
              <Cart onCheckout={() => setShowCheckout(true)} />
            </Col>
          </Row>
        )}
      </Container>

      <CheckoutModal
        show={showCheckout}
        handleClose={() => setShowCheckout(false)}
        cart={cart}
        onOrderPlaced={handleOrderPlaced}
      />
    </>
  );
};

function App() {
  return (
    <CartProvider>
      <div className="App">
        <MainContent />
        <ToastContainer position="bottom-right" theme="dark" />
      </div>
    </CartProvider>
  );
}

export default App;