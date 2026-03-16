const WooCommerce = require('../woocommerce');

exports.getProducts = async (req, res) => {
    try {
        const { data } = await WooCommerce.get('products', { per_page: 50 });
        res.json(data);
    } catch (error) {
        console.error('Error al obtener productos de WooCommerce:', error);
        res.status(500).json({ message: 'Error al obtener productos' });
    }
};

exports.getLowStockProducts = async (req, res) => {
    try {
        const { data } = await WooCommerce.get('products', { per_page: 50 });
        const lowStockProducts = data.filter(product => product.stock_quantity && product.stock_quantity < 10);
        res.json(lowStockProducts);
    } catch (error) {
        console.error('Error al obtener productos con bajo inventario:', error);
        res.status(500).json({ message: 'Error al obtener productos con bajo inventario' });
    }
};

exports.getCategories = async (req, res) => {
    try {
        const response = await WooCommerce.get('products/categories');
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ error: 'Error fetching categories' });
    }
};
