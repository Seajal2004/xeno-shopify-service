const pool = require('../config/database');
const bcrypt = require('bcryptjs');

class Tenant {
  static async create(shopDomain, email, password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO tenants (shop_domain, email, password_hash) VALUES ($1, $2, $3) RETURNING *',
      [shopDomain, email, hashedPassword]
    );
    return result.rows[0];
  }

  static async findByEmail(email) {
    const result = await pool.query('SELECT * FROM tenants WHERE email = $1', [email]);
    return result.rows[0];
  }

  static async findById(id) {
    const result = await pool.query('SELECT * FROM tenants WHERE id = $1', [id]);
    return result.rows[0];
  }

  static async updateAccessToken(id, accessToken) {
    await pool.query('UPDATE tenants SET access_token = $1 WHERE id = $2', [accessToken, id]);
  }

  static async validatePassword(password, hashedPassword) {
    return bcrypt.compare(password, hashedPassword);
  }
}

module.exports = Tenant;