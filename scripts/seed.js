require('dotenv').config();
const pool = require('../config/database');

const sampleData = {
  customers: [
    { id: 1001, email: 'john@example.com', first_name: 'John', last_name: 'Doe', total_spent: 1250.00, orders_count: 5 },
    { id: 1002, email: 'jane@example.com', first_name: 'Jane', last_name: 'Smith', total_spent: 890.50, orders_count: 3 },
    { id: 1003, email: 'bob@example.com', first_name: 'Bob', last_name: 'Johnson', total_spent: 2100.75, orders_count: 8 },
    { id: 1004, email: 'alice@example.com', first_name: 'Alice', last_name: 'Brown', total_spent: 650.25, orders_count: 2 },
    { id: 1005, email: 'charlie@example.com', first_name: 'Charlie', last_name: 'Wilson', total_spent: 1800.00, orders_count: 6 }
  ],
  products: [
    { id: 2001, title: 'Premium T-Shirt', vendor: 'Fashion Co', product_type: 'Apparel', price: 29.99 },
    { id: 2002, title: 'Wireless Headphones', vendor: 'Tech Corp', product_type: 'Electronics', price: 199.99 },
    { id: 2003, title: 'Coffee Mug', vendor: 'Home Goods', product_type: 'Kitchen', price: 15.99 },
    { id: 2004, title: 'Laptop Stand', vendor: 'Office Plus', product_type: 'Accessories', price: 89.99 },
    { id: 2005, title: 'Yoga Mat', vendor: 'Fitness Pro', product_type: 'Sports', price: 45.99 }
  ],
  orders: [
    { id: 3001, customer_id: 1001, total_price: 250.00, subtotal_price: 230.00, financial_status: 'paid', fulfillment_status: 'fulfilled' },
    { id: 3002, customer_id: 1002, total_price: 199.99, subtotal_price: 199.99, financial_status: 'paid', fulfillment_status: 'fulfilled' },
    { id: 3003, customer_id: 1003, total_price: 350.75, subtotal_price: 320.75, financial_status: 'paid', fulfillment_status: 'partial' },
    { id: 3004, customer_id: 1001, total_price: 89.99, subtotal_price: 89.99, financial_status: 'pending', fulfillment_status: 'unfulfilled' },
    { id: 3005, customer_id: 1005, total_price: 300.00, subtotal_price: 275.00, financial_status: 'paid', fulfillment_status: 'fulfilled' }
  ]
};

const seedData = async () => {
  try {
    console.log('Seeding sample data...');
    
    // Get first tenant
    const tenantResult = await pool.query('SELECT id FROM tenants LIMIT 1');
    if (tenantResult.rows.length === 0) {
      console.log('No tenants found. Please register a tenant first.');
      return;
    }
    
    const tenantId = tenantResult.rows[0].id;
    
    // Seed customers
    for (const customer of sampleData.customers) {
      await pool.query(`
        INSERT INTO customers (id, tenant_id, email, first_name, last_name, total_spent, orders_count, created_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
        ON CONFLICT (id) DO NOTHING
      `, [customer.id, tenantId, customer.email, customer.first_name, customer.last_name, customer.total_spent, customer.orders_count]);
    }
    
    // Seed products
    for (const product of sampleData.products) {
      await pool.query(`
        INSERT INTO products (id, tenant_id, title, vendor, product_type, price, created_at)
        VALUES ($1, $2, $3, $4, $5, $6, NOW())
        ON CONFLICT (id) DO NOTHING
      `, [product.id, tenantId, product.title, product.vendor, product.product_type, product.price]);
    }
    
    // Seed orders
    for (const order of sampleData.orders) {
      await pool.query(`
        INSERT INTO orders (id, tenant_id, customer_id, total_price, subtotal_price, financial_status, fulfillment_status, created_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, NOW() - INTERVAL '${Math.floor(Math.random() * 30)} days')
        ON CONFLICT (id) DO NOTHING
      `, [order.id, tenantId, order.customer_id, order.total_price, order.subtotal_price, order.financial_status, order.fulfillment_status]);
    }
    
    console.log('Sample data seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedData();