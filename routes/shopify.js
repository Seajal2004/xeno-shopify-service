const express = require('express');
const axios = require('axios');
const { authenticateToken } = require('../middleware/auth');
const Customer = require('../models/Customer');
const Order = require('../models/Order');
const Product = require('../models/Product');
const Tenant = require('../models/Tenant');
const router = express.Router();

// Connect Shopify store
router.post('/connect', authenticateToken, async (req, res) => {
  try {
    const { accessToken } = req.body;
    
    if (!accessToken) {
      return res.status(400).json({ error: 'Access token required' });
    }

    // Test the connection
    const shopResponse = await axios.get(`https://${req.tenant.shop_domain}/admin/api/2023-10/shop.json`, {
      headers: { 'X-Shopify-Access-Token': accessToken }
    });

    await Tenant.updateAccessToken(req.tenant.id, accessToken);
    res.json({ message: 'Shopify store connected successfully', shop: shopResponse.data.shop });
  } catch (error) {
    res.status(400).json({ error: 'Failed to connect to Shopify store' });
  }
});

// Sync data from Shopify
router.post('/sync', authenticateToken, async (req, res) => {
  try {
    if (!req.tenant.access_token) {
      return res.status(400).json({ error: 'Shopify store not connected' });
    }

    const baseUrl = `https://${req.tenant.shop_domain}/admin/api/2023-10`;
    const headers = { 'X-Shopify-Access-Token': req.tenant.access_token };

    // Sync customers
    const customersResponse = await axios.get(`${baseUrl}/customers.json`, { headers });
    for (const customer of customersResponse.data.customers) {
      await Customer.upsert(customer, req.tenant.id);
    }

    // Sync products
    const productsResponse = await axios.get(`${baseUrl}/products.json`, { headers });
    for (const product of productsResponse.data.products) {
      await Product.upsert(product, req.tenant.id);
    }

    // Sync orders
    const ordersResponse = await axios.get(`${baseUrl}/orders.json`, { headers });
    for (const order of ordersResponse.data.orders) {
      await Order.upsert(order, req.tenant.id);
    }

    res.json({ 
      message: 'Data synced successfully',
      synced: {
        customers: customersResponse.data.customers.length,
        products: productsResponse.data.products.length,
        orders: ordersResponse.data.orders.length
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Sync failed' });
  }
});

// Webhook endpoint for real-time updates
router.post('/webhook/:type', async (req, res) => {
  try {
    const { type } = req.params;
    const data = req.body;
    
    // Find tenant by shop domain (extracted from webhook headers)
    const shopDomain = req.headers['x-shopify-shop-domain'];
    if (!shopDomain) {
      return res.status(400).json({ error: 'Shop domain required' });
    }

    const tenant = await pool.query('SELECT * FROM tenants WHERE shop_domain = $1', [shopDomain]);
    if (tenant.rows.length === 0) {
      return res.status(404).json({ error: 'Tenant not found' });
    }

    const tenantId = tenant.rows[0].id;

    switch (type) {
      case 'customers/create':
      case 'customers/update':
        await Customer.upsert(data, tenantId);
        break;
      case 'orders/create':
      case 'orders/updated':
        await Order.upsert(data, tenantId);
        break;
      case 'products/create':
      case 'products/update':
        await Product.upsert(data, tenantId);
        break;
    }

    res.status(200).json({ message: 'Webhook processed' });
  } catch (error) {
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

module.exports = router;