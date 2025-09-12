require('dotenv').config();
const pool = require('../config/database');

const createTables = async () => {
  try {
    // Tenants table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS tenants (
        id SERIAL PRIMARY KEY,
        shop_domain VARCHAR(255) UNIQUE NOT NULL,
        access_token TEXT,
        email VARCHAR(255) NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Customers table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS customers (
        id BIGINT PRIMARY KEY,
        tenant_id INTEGER REFERENCES tenants(id),
        email VARCHAR(255),
        first_name VARCHAR(255),
        last_name VARCHAR(255),
        total_spent DECIMAL(10,2) DEFAULT 0,
        orders_count INTEGER DEFAULT 0,
        created_at TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Products table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS products (
        id BIGINT PRIMARY KEY,
        tenant_id INTEGER REFERENCES tenants(id),
        title VARCHAR(500),
        vendor VARCHAR(255),
        product_type VARCHAR(255),
        price DECIMAL(10,2),
        created_at TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Orders table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id BIGINT PRIMARY KEY,
        tenant_id INTEGER REFERENCES tenants(id),
        customer_id BIGINT,
        total_price DECIMAL(10,2),
        subtotal_price DECIMAL(10,2),
        financial_status VARCHAR(50),
        fulfillment_status VARCHAR(50),
        created_at TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Events table (for cart abandoned, checkout started)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS events (
        id SERIAL PRIMARY KEY,
        tenant_id INTEGER REFERENCES tenants(id),
        customer_id BIGINT,
        event_type VARCHAR(100),
        event_data JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('Database tables created successfully');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
};

createTables();