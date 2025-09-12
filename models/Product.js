const pool = require('../config/database');

class Product {
  static async upsert(productData, tenantId) {
    const { id, title, vendor, product_type, variants, created_at } = productData;
    const price = variants?.[0]?.price || 0;
    
    const result = await pool.query(`
      INSERT INTO products (id, tenant_id, title, vendor, product_type, price, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      ON CONFLICT (id) DO UPDATE SET
        title = EXCLUDED.title,
        vendor = EXCLUDED.vendor,
        product_type = EXCLUDED.product_type,
        price = EXCLUDED.price,
        updated_at = CURRENT_TIMESTAMP
      RETURNING *
    `, [id, tenantId, title, vendor, product_type, price, created_at]);
    
    return result.rows[0];
  }

  static async getByTenant(tenantId) {
    const result = await pool.query('SELECT * FROM products WHERE tenant_id = $1 ORDER BY created_at DESC', [tenantId]);
    return result.rows;
  }
}

module.exports = Product;