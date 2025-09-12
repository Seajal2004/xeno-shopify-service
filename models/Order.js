const pool = require('../config/database');

class Order {
  static async upsert(orderData, tenantId) {
    const { id, customer, total_price, subtotal_price, financial_status, fulfillment_status, created_at } = orderData;
    
    const result = await pool.query(`
      INSERT INTO orders (id, tenant_id, customer_id, total_price, subtotal_price, financial_status, fulfillment_status, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      ON CONFLICT (id) DO UPDATE SET
        total_price = EXCLUDED.total_price,
        subtotal_price = EXCLUDED.subtotal_price,
        financial_status = EXCLUDED.financial_status,
        fulfillment_status = EXCLUDED.fulfillment_status,
        updated_at = CURRENT_TIMESTAMP
      RETURNING *
    `, [id, tenantId, customer?.id, total_price, subtotal_price, financial_status, fulfillment_status, created_at]);
    
    return result.rows[0];
  }

  static async getByTenant(tenantId) {
    const result = await pool.query('SELECT * FROM orders WHERE tenant_id = $1 ORDER BY created_at DESC', [tenantId]);
    return result.rows;
  }

  static async getByDateRange(tenantId, startDate, endDate) {
    const result = await pool.query(
      'SELECT * FROM orders WHERE tenant_id = $1 AND created_at BETWEEN $2 AND $3 ORDER BY created_at DESC',
      [tenantId, startDate, endDate]
    );
    return result.rows;
  }

  static async getTotalRevenue(tenantId) {
    const result = await pool.query(
      'SELECT SUM(total_price) as total_revenue FROM orders WHERE tenant_id = $1',
      [tenantId]
    );
    return parseFloat(result.rows[0].total_revenue) || 0;
  }

  static async getOrdersByDate(tenantId) {
    const result = await pool.query(`
      SELECT DATE(created_at) as order_date, COUNT(*) as order_count, SUM(total_price) as daily_revenue
      FROM orders 
      WHERE tenant_id = $1 
      GROUP BY DATE(created_at) 
      ORDER BY order_date DESC 
      LIMIT 30
    `, [tenantId]);
    return result.rows;
  }
}

module.exports = Order;