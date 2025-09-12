const jwt = require('jsonwebtoken');
const Tenant = require('../models/Tenant');

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const tenant = await Tenant.findById(decoded.tenantId);
    
    if (!tenant) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    req.tenant = tenant;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid token' });
  }
};

module.exports = { authenticateToken };