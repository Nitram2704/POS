const WooCommerce = require('../woocommerce');

exports.getOrders = async (req, res) => {
    try {
        const { data } = await WooCommerce.get('orders', { per_page: 20 });
        res.json(data);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ message: 'Error fetching orders' });
    }
};

exports.createOrder = async (req, res) => {
    const { cart, customer } = req.body;

    const orderData = {
        payment_method: "bacs",
        payment_method_title: "Direct Bank Transfer",
        set_paid: true,
        billing: {
            first_name: customer.firstName,
            last_name: customer.lastName,
            email: customer.email,
        },
        shipping: {
            first_name: customer.firstName,
            last_name: customer.lastName,
        },
        line_items: cart.map(item => ({
            product_id: item.id,
            quantity: item.quantity,
        })),
        status: 'completed'
    };

    try {
        const { data } = await WooCommerce.post('orders', orderData);
        res.json(data);
    } catch (error) {
        console.error('Error al crear el pedido en WooCommerce:', error.response ? error.response.data : error.message);
        res.status(500).json({ message: 'Error al crear el pedido', details: error.response ? error.response.data : null });
    }
};
