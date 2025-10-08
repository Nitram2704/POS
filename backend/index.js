const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Backend del POS funcionando!');
});

const WooCommerce = require('./woocommerce');

// Ruta para obtener productos de WooCommerce
app.get('/api/products', async (req, res) => {
  try {
    const { data } = await WooCommerce.get('products');
    res.json(data);
  } catch (error) {
    console.error('Error al obtener productos de WooCommerce:', error);
    res.status(500).json({ message: 'Error al obtener productos' });
  }
});

// Aquí añadiremos las rutas para interactuar con WooCommerce

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});