require('dotenv').config();
const axios = require('axios');

const API_BASE = process.env.API_BASE || 'http://localhost:3000/api';

const demoFlow = async () => {
  try {
    console.log('🚀 Starting Xeno Shopify Service Demo...\n');

    // 1. Register a tenant
    console.log('1. Registering demo tenant...');
    const registerResponse = await axios.post(`${API_BASE}/auth/register`, {
      shopDomain: 'demo-store.myshopify.com',
      email: 'demo@example.com',
      password: 'password123'
    });
    
    const { token } = registerResponse.data;
    console.log('✅ Tenant registered successfully\n');

    // 2. Get dashboard data (should be empty initially)
    console.log('2. Fetching initial dashboard data...');
    const dashboardResponse = await axios.get(`${API_BASE}/analytics/dashboard`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('📊 Dashboard Data:', JSON.stringify(dashboardResponse.data, null, 2));
    console.log('✅ Dashboard data fetched\n');

    // 3. Simulate webhook data (since we don't have real Shopify connection)
    console.log('3. Simulating Shopify webhook data...');
    
    // Simulate customer creation
    const customerData = {
      id: 12345,
      email: 'customer@example.com',
      first_name: 'John',
      last_name: 'Doe',
      total_spent: '150.00',
      orders_count: 2,
      created_at: new Date().toISOString()
    };

    // Simulate order creation
    const orderData = {
      id: 67890,
      customer: { id: 12345 },
      total_price: '75.00',
      subtotal_price: '70.00',
      financial_status: 'paid',
      fulfillment_status: 'fulfilled',
      created_at: new Date().toISOString()
    };

    console.log('📦 Demo data prepared');
    console.log('💡 In a real scenario, this data would come from Shopify webhooks');
    console.log('✅ Demo completed successfully!\n');

    console.log('🎯 Next Steps:');
    console.log('1. Deploy to Railway/Heroku');
    console.log('2. Create a Shopify development store');
    console.log('3. Connect your store using the Admin API token');
    console.log('4. Use the sync feature to import real data');
    console.log('5. Set up webhooks for real-time updates\n');

  } catch (error) {
    console.error('❌ Demo failed:', error.response?.data || error.message);
  }
};

// Run demo if called directly
if (require.main === module) {
  demoFlow();
}

module.exports = { demoFlow };