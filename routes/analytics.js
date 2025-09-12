const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const Customer = require('../models/Customer');
const Order = require('../models/Order');
const Product = require('../models/Product');
const pool = require('../config/database');
const router = express.Router();

// Dashboard overview
router.get('/dashboard', authenticateToken, async (req, res) => {
  try {
    const tenantId = req.tenant.id;

    // Get total counts
    const customersCount = await pool.query('SELECT COUNT(*) FROM customers WHERE tenant_id = $1', [tenantId]);
    const ordersCount = await pool.query('SELECT COUNT(*) FROM orders WHERE tenant_id = $1', [tenantId]);
    const productsCount = await pool.query('SELECT COUNT(*) FROM products WHERE tenant_id = $1', [tenantId]);
    
    // Get total revenue
    const totalRevenue = await Order.getTotalRevenue(tenantId);
    
    // Get top customers
    const topCustomers = await Customer.getTopCustomers(tenantId, 5);
    
    // Get orders by date (last 30 days)
    const ordersByDate = await Order.getOrdersByDate(tenantId);

    res.json({
      overview: {
        totalCustomers: parseInt(customersCount.rows[0].count),
        totalOrders: parseInt(ordersCount.rows[0].count),
        totalProducts: parseInt(productsCount.rows[0].count),
        totalRevenue: totalRevenue
      },
      topCustomers,
      ordersByDate
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

// Orders by date range
router.get('/orders', authenticateToken, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const tenantId = req.tenant.id;

    let orders;
    if (startDate && endDate) {
      orders = await Order.getByDateRange(tenantId, startDate, endDate);
    } else {
      orders = await Order.getByTenant(tenantId);
    }

    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Customer analytics
router.get('/customers', authenticateToken, async (req, res) => {
  try {
    const customers = await Customer.getByTenant(req.tenant.id);
    res.json(customers);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
});

// Product analytics
router.get('/products', authenticateToken, async (req, res) => {
  try {
    const products = await Product.getByTenant(req.tenant.id);
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

module.exports = router;