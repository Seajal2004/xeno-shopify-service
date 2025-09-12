import React, { useState, useEffect } from 'react';
import { useAuth } from '../utils/AuthContext';
import { analyticsAPI, shopifyAPI } from '../utils/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const Dashboard = () => {
  const { tenant, logout } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [accessToken, setAccessToken] = useState('');
  const [showConnect, setShowConnect] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await analyticsAPI.getDashboard();
      setDashboardData(response.data);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async () => {
    try {
      await shopifyAPI.connect(accessToken);
      setShowConnect(false);
      setAccessToken('');
      alert('Shopify store connected successfully!');
    } catch (error) {
      alert('Failed to connect Shopify store');
    }
  };

  const handleSync = async () => {
    setSyncing(true);
    try {
      await shopifyAPI.sync();
      await fetchDashboardData();
      alert('Data synced successfully!');
    } catch (error) {
      alert('Sync failed. Please connect your Shopify store first.');
    } finally {
      setSyncing(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div style={{ padding: '1rem', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '2rem',
        backgroundColor: 'white',
        padding: '1rem',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <div>
          <h1 style={{ margin: 0, color: '#333' }}>Xeno Shopify Insights</h1>
          <p style={{ margin: '0.5rem 0 0 0', color: '#666' }}>
            Store: {tenant?.shopDomain}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            onClick={() => setShowConnect(true)}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Connect Store
          </button>
          <button
            onClick={handleSync}
            disabled={syncing}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: syncing ? 'not-allowed' : 'pointer',
              opacity: syncing ? 0.7 : 1
            }}
          >
            {syncing ? 'Syncing...' : 'Sync Data'}
          </button>
          <button
            onClick={logout}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Connect Modal */}
      {showConnect && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '8px',
            width: '400px'
          }}>
            <h3>Connect Shopify Store</h3>
            <p>Enter your Shopify Admin API access token:</p>
            <input
              type="text"
              value={accessToken}
              onChange={(e) => setAccessToken(e.target.value)}
              placeholder="shpat_..."
              style={{
                width: '100%',
                padding: '0.5rem',
                margin: '1rem 0',
                border: '1px solid #ddd',
                borderRadius: '4px'
              }}
            />
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowConnect(false)}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleConnect}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Connect
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Overview Cards */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '1rem', 
        marginBottom: '2rem' 
      }}>
        {dashboardData?.overview && Object.entries({
          'Total Customers': dashboardData.overview.totalCustomers,
          'Total Orders': dashboardData.overview.totalOrders,
          'Total Products': dashboardData.overview.totalProducts,
          'Total Revenue': `$${dashboardData.overview.totalRevenue.toFixed(2)}`
        }).map(([label, value]) => (
          <div key={label} style={{
            backgroundColor: 'white',
            padding: '1.5rem',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            textAlign: 'center'
          }}>
            <h3 style={{ margin: '0 0 0.5rem 0', color: '#666', fontSize: '0.9rem' }}>{label}</h3>
            <p style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold', color: '#333' }}>{value}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
        {/* Orders by Date */}
        <div style={{
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ marginBottom: '1rem' }}>Orders by Date (Last 30 Days)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dashboardData?.ordersByDate || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="order_date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="order_count" stroke="#007bff" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Daily Revenue */}
        <div style={{
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ marginBottom: '1rem' }}>Daily Revenue</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dashboardData?.ordersByDate || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="order_date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="daily_revenue" fill="#28a745" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Customers */}
      <div style={{
        backgroundColor: 'white',
        padding: '1.5rem',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{ marginBottom: '1rem' }}>Top 5 Customers by Spend</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8f9fa' }}>
                <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Name</th>
                <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Email</th>
                <th style={{ padding: '0.75rem', textAlign: 'right', borderBottom: '1px solid #dee2e6' }}>Total Spent</th>
                <th style={{ padding: '0.75rem', textAlign: 'right', borderBottom: '1px solid #dee2e6' }}>Orders</th>
              </tr>
            </thead>
            <tbody>
              {dashboardData?.topCustomers?.map((customer, index) => (
                <tr key={customer.id}>
                  <td style={{ padding: '0.75rem', borderBottom: '1px solid #dee2e6' }}>
                    {customer.first_name} {customer.last_name}
                  </td>
                  <td style={{ padding: '0.75rem', borderBottom: '1px solid #dee2e6' }}>
                    {customer.email}
                  </td>
                  <td style={{ padding: '0.75rem', textAlign: 'right', borderBottom: '1px solid #dee2e6' }}>
                    ${parseFloat(customer.total_spent || 0).toFixed(2)}
                  </td>
                  <td style={{ padding: '0.75rem', textAlign: 'right', borderBottom: '1px solid #dee2e6' }}>
                    {customer.orders_count}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;