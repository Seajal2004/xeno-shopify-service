require('dotenv').config();
const pool = require('../config/database');
const bcrypt = require('bcryptjs');

const createTenant = async () => {
  const email = process.argv[2];
  const password = process.argv[3];
  const shopDomain = process.argv[4];

  if (!email || !password || !shopDomain) {
    console.log('Usage: node scripts/create-tenant.js <email> <password> <shop-domain>');
    console.log('Example: node scripts/create-tenant.js admin@shop.com password123 myshop.myshopify.com');
    process.exit(1);
  }

  try {
    const passwordHash = await bcrypt.hash(password, 10);
    
    const result = await pool.query(
      'INSERT INTO tenants (email, password_hash, shop_domain) VALUES ($1, $2, $3) RETURNING *',
      [email, passwordHash, shopDomain]
    );

    console.log('✅ Tenant created successfully!');
    console.log('ID:', result.rows[0].id);
    console.log('Email:', result.rows[0].email);
    console.log('Shop Domain:', result.rows[0].shop_domain);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating tenant:', error.message);
    process.exit(1);
  }
};

createTenant();