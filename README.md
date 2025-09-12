# Xeno Shopify Data Ingestion & Insights Service

A multi-tenant Shopify data ingestion and analytics platform built for the Xeno FDE Internship Assignment.

## 🚀 Features

- **Multi-tenant Architecture**: Isolated data per Shopify store
- **Real-time Data Sync**: Webhooks and scheduled sync from Shopify
- **Analytics Dashboard**: Customer insights, order trends, revenue analytics
- **Secure Authentication**: JWT-based tenant authentication
- **RESTful APIs**: Clean API design for data access

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Frontend │    │  Express Backend │    │   PostgreSQL    │
│                 │◄──►│                 │◄──►│    Database     │
│  - Dashboard    │    │  - Auth APIs    │    │  - Multi-tenant │
│  - Charts       │    │  - Shopify APIs │    │  - Normalized   │
│  - Auth         │    │  - Analytics    │    │    Schema       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │  Shopify APIs   │
                       │  - Customers    │
                       │  - Orders       │
                       │  - Products     │
                       │  - Webhooks     │
                       └─────────────────┘
```

## 📊 Database Schema

### Tenants
- `id` (Primary Key)
- `shop_domain` (Unique)
- `email`, `password_hash`
- `access_token` (Shopify)
- `created_at`

### Customers
- `id` (Shopify Customer ID)
- `tenant_id` (Foreign Key)
- `email`, `first_name`, `last_name`
- `total_spent`, `orders_count`
- `created_at`, `updated_at`

### Orders
- `id` (Shopify Order ID)
- `tenant_id` (Foreign Key)
- `customer_id`
- `total_price`, `subtotal_price`
- `financial_status`, `fulfillment_status`
- `created_at`, `updated_at`

### Products
- `id` (Shopify Product ID)
- `tenant_id` (Foreign Key)
- `title`, `vendor`, `product_type`
- `price`
- `created_at`, `updated_at`

### Events (Bonus)
- `id` (Primary Key)
- `tenant_id` (Foreign Key)
- `customer_id`
- `event_type` (cart_abandoned, checkout_started)
- `event_data` (JSONB)
- `created_at`

## 🛠️ Setup Instructions

### Prerequisites
- Node.js 16+
- PostgreSQL
- Shopify Development Store

### Backend Setup
```bash
cd xeno-shopify-service
npm install
cp .env.example .env
# Edit .env with your database and Shopify credentials
npm run migrate
npm start
```

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

### Environment Variables
```env
PORT=3000
DATABASE_URL=postgresql://username:password@localhost:5432/xeno_shopify
JWT_SECRET=your-super-secret-jwt-key
NODE_ENV=development
SHOPIFY_API_KEY=your-shopify-api-key
SHOPIFY_API_SECRET=your-shopify-api-secret
SHOPIFY_WEBHOOK_SECRET=your-webhook-secret
```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new tenant
- `POST /api/auth/login` - Login tenant

### Shopify Integration
- `POST /api/shopify/connect` - Connect Shopify store
- `POST /api/shopify/sync` - Manual data sync
- `POST /api/shopify/webhook/:type` - Webhook endpoints

### Analytics
- `GET /api/analytics/dashboard` - Dashboard overview
- `GET /api/analytics/orders` - Orders with date filtering
- `GET /api/analytics/customers` - Customer data
- `GET /api/analytics/products` - Product data

## 🔄 Data Sync Strategy

1. **Initial Sync**: Manual sync after store connection
2. **Webhooks**: Real-time updates for new/updated data
3. **Scheduled Sync**: Hourly cron job for data consistency
4. **Upsert Pattern**: Handle duplicates gracefully

## 🚀 Deployment

### Heroku Deployment
```bash
# Create Heroku app
heroku create xeno-shopify-service

# Add PostgreSQL addon
heroku addons:create heroku-postgresql:hobby-dev

# Set environment variables
heroku config:set JWT_SECRET=your-secret
heroku config:set SHOPIFY_API_KEY=your-key

# Deploy
git push heroku main

# Run migrations
heroku run npm run migrate
```

### Railway Deployment
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

## 🔐 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Multi-tenant data isolation
- Environment-based configuration
- CORS protection

## 📈 Analytics Features

- **Overview Metrics**: Total customers, orders, products, revenue
- **Time Series**: Orders and revenue by date
- **Top Customers**: Ranked by total spend
- **Date Range Filtering**: Custom period analysis
- **Real-time Updates**: Live data synchronization

## 🎯 Assumptions Made

1. **Shopify Store Access**: Users have admin access to their Shopify stores
2. **Data Volume**: Moderate data volumes suitable for single-instance deployment
3. **Sync Frequency**: Hourly sync sufficient for business needs
4. **Authentication**: Email-based tenant identification
5. **Currency**: All monetary values in USD

## 🔄 Next Steps for Production

### Scalability
- Implement Redis for caching and session management
- Add database connection pooling
- Implement rate limiting
- Add API versioning

### Monitoring & Observability
- Add structured logging (Winston)
- Implement health checks
- Add metrics collection (Prometheus)
- Error tracking (Sentry)

### Security Enhancements
- Add API rate limiting
- Implement OAuth for Shopify integration
- Add request validation middleware
- Implement RBAC for multi-user tenants

### Performance Optimization
- Add database indexing strategy
- Implement data pagination
- Add response caching
- Optimize database queries

### DevOps
- Add CI/CD pipeline
- Implement automated testing
- Add database migration strategy
- Container deployment (Docker)

## 🧪 Testing Strategy

- Unit tests for models and utilities
- Integration tests for API endpoints
- End-to-end tests for critical user flows
- Load testing for data sync operations

## 📝 Known Limitations

1. **Single Instance**: Not horizontally scalable without modifications
2. **Data Retention**: No automatic data archiving strategy
3. **Error Handling**: Basic error handling, needs enhancement
4. **Validation**: Limited input validation on API endpoints
5. **Monitoring**: No built-in monitoring or alerting

## 🤝 Contributing

This is an assignment project. For production use, consider the next steps mentioned above.

## 📄 License

MIT License - Built for Xeno FDE Internship Assignment 2025