const pool = require('../config/database');

class Customer {
  static async upsert(customerData, tenantId) {
    const { id, email, first_name, last_name, total_spent, orders_count, created_at } = customerData;
    
    const result = await pool.query(`
      INSERT INTO customers (id, tenant_id, email, first_name, last_name, total_spent, orders_count, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        first_name = EXCLUDED.first_name,
        last_name = EXCLUDED.last_name,
        total_spent = EXCLUDED.total_spent,
        orders_count = EXCLUDED.orders_count,
        updated_at = CURRENT_TIMESTAMP
      RETURNING *
    `, [id, tenantId, email, first_name, last_name, total_spent || 0, orders_count || 0, created_at]);
    
    return result.rows[0];
  }

  static async getByTenant(tenantId) {
    const result = await pool.query('SELECT * FROM customers WHERE tenant_id = $1 ORDER BY total_spent DESC', [tenantId]);
    return result.rows;
  }

  static async getTopCustomers(tenantId, limit = 5) {
    const result = await pool.query(
      'SELECT * FROM customers WHERE tenant_id = $1 ORDER BY total_spent DESC LIMIT $2',
      [tenantId, limit]
    );
    return result.rows;
  }
}

module.exports = Customer;