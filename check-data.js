require('dotenv').config();
const pool = require('./config/database');

const checkData = async () => {
  try {
    const tenants = await pool.query('SELECT * FROM tenants');
    console.log('Tenants:', tenants.rows);
    
    const customers = await pool.query('SELECT * FROM customers LIMIT 5');
    console.log('Customers:', customers.rows);
    
    const orders = await pool.query('SELECT * FROM orders LIMIT 5');
    console.log('Orders:', orders.rows);
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

checkData();