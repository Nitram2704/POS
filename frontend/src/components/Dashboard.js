import React, { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, Row, Col, Spinner } from 'react-bootstrap';
import axios from 'axios';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const Dashboard = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/orders');
                setOrders(response.data);
            } catch (error) {
                console.error('Error fetching orders:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    if (loading) return <div className="text-center py-5"><Spinner animation="border" variant="light" /></div>;

    // Calculate stats
    const totalSales = orders.reduce((acc, order) => acc + parseFloat(order.total), 0);
    const totalOrders = orders.length;

    // Prepare chart data (Sales by Date)
    const salesByDate = orders.reduce((acc, order) => {
        const date = new Date(order.date_created).toLocaleDateString();
        acc[date] = (acc[date] || 0) + parseFloat(order.total);
        return acc;
    }, {});

    const chartData = Object.keys(salesByDate).map(date => ({
        date,
        sales: salesByDate[date]
    }));

    // Prepare Pie Chart Data (Top Products)
    const productSales = {};
    orders.forEach(order => {
        order.line_items.forEach(item => {
            const name = item.name || `Prod ${item.product_id}`;
            productSales[name] = (productSales[name] || 0) + item.quantity;
        });
    });

    const pieData = Object.keys(productSales).map(name => ({
        name,
        value: productSales[name]
    })).sort((a, b) => b.value - a.value).slice(0, 5); // Top 5

    return (
        <div className="dashboard-container text-white">
            <h2 className="mb-4">Dashboard de Ventas</h2>

            <Row className="mb-4">
                <Col md={6}>
                    <div className="glass-panel p-4 text-center">
                        <h4>Ventas Totales</h4>
                        <div className="display-4 fw-bold text-success">${totalSales.toFixed(2)}</div>
                    </div>
                </Col>
                <Col md={6}>
                    <div className="glass-panel p-4 text-center">
                        <h4>Total Pedidos</h4>
                        <div className="display-4 fw-bold text-primary">{totalOrders}</div>
                    </div>
                </Col>
            </Row>

            <Row>
                <Col lg={8} className="mb-4">
                    <div className="glass-panel p-4" style={{ height: '500px' }}>
                        <h4 className="mb-3">Tendencia de Ventas</h4>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                <XAxis dataKey="date" stroke="#fff" />
                                <YAxis stroke="#fff" />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1f2937', border: 'none', color: '#fff' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Legend />
                                <Line type="monotone" dataKey="sales" stroke="#8884d8" strokeWidth={3} name="Ventas ($)" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </Col>
                <Col lg={4} className="mb-4">
                    <div className="glass-panel p-4" style={{ height: '500px' }}>
                        <h4 className="mb-3">Top Productos</h4>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="40%"
                                    labelLine={false}
                                    outerRadius={60}
                                    fill="#8884d8"
                                    dataKey="value"
                                    label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1f2937', border: 'none', color: '#fff' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Legend
                                    layout="vertical"
                                    verticalAlign="bottom"
                                    align="center"
                                    wrapperStyle={{ fontSize: '12px', width: '100%' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default Dashboard;
