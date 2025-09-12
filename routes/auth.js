const express = require('express');
const jwt = require('jsonwebtoken');
const Tenant = require('../models/Tenant');
const router = express.Router();

// Register tenant
router.post('/register', async (req, res) => {
  try {
    const { shopDomain, email, password } = req.body;
    
    if (!shopDomain || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const tenant = await Tenant.create(shopDomain, email, password);
    const token = jwt.sign({ tenantId: tenant.id }, process.env.JWT_SECRET);
    
    res.json({ token, tenant: { id: tenant.id, shopDomain: tenant.shop_domain, email: tenant.email } });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(400).json({ error: 'Shop domain already exists' });
    }
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login tenant
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const tenant = await Tenant.findByEmail(email);
    if (!tenant) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValid = await Tenant.validatePassword(password, tenant.password_hash);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ tenantId: tenant.id }, process.env.JWT_SECRET);
    res.json({ token, tenant: { id: tenant.id, shopDomain: tenant.shop_domain, email: tenant.email } });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

module.exports = router;