# Deployment Guide

## Quick Deploy to Railway

1. **Install Railway CLI**
   ```bash
   npm install -g @railway/cli
   ```

2. **Login and Deploy**
   ```bash
   railway login
   railway init
   railway up
   ```

3. **Add Database**
   ```bash
   railway add postgresql
   ```

4. **Set Environment Variables**
   ```bash
   railway variables set JWT_SECRET=your-super-secret-key
   railway variables set SHOPIFY_API_KEY=your-api-key
   railway variables set SHOPIFY_API_SECRET=your-api-secret
   ```

## Quick Deploy to Heroku

1. **Create App**
   ```bash
   heroku create your-app-name
   ```

2. **Add PostgreSQL**
   ```bash
   heroku addons:create heroku-postgresql:hobby-dev
   ```

3. **Set Environment Variables**
   ```bash
   heroku config:set JWT_SECRET=your-super-secret-key
   heroku config:set SHOPIFY_API_KEY=your-api-key
   heroku config:set SHOPIFY_API_SECRET=your-api-secret
   ```

4. **Deploy**
   ```bash
   git push heroku main
   ```

## Local Development

1. **Setup Database**
   ```bash
   createdb xeno_shopify
   ```

2. **Install Dependencies**
   ```bash
   npm install
   cd frontend && npm install && cd ..
   ```

3. **Setup Environment**
   ```bash
   cp .env.example .env
   # Edit .env with your values
   ```

4. **Run Migrations**
   ```bash
   npm run migrate
   ```

5. **Seed Sample Data (Optional)**
   ```bash
   npm run seed
   ```

6. **Start Development**
   ```bash
   npm run dev
   ```

## Shopify Setup

1. **Create Development Store**
   - Go to partners.shopify.com
   - Create development store
   - Add sample products and customers

2. **Create Private App**
   - Go to Apps > Manage private apps
   - Create private app with Admin API permissions:
     - Customers: Read/Write
     - Orders: Read/Write
     - Products: Read/Write

3. **Get Access Token**
   - Copy the Admin API access token
   - Use it in the "Connect Store" feature

## Testing the Application

1. **Register Account**
   - Visit your deployed URL
   - Register with your Shopify store domain

2. **Connect Store**
   - Click "Connect Store"
   - Enter your Shopify Admin API access token

3. **Sync Data**
   - Click "Sync Data" to import your Shopify data
   - View analytics on the dashboard

## Environment Variables Reference

```env
PORT=3000
DATABASE_URL=postgresql://user:pass@host:port/db
JWT_SECRET=your-jwt-secret
NODE_ENV=production
SHOPIFY_API_KEY=your-shopify-api-key
SHOPIFY_API_SECRET=your-shopify-api-secret
SHOPIFY_WEBHOOK_SECRET=your-webhook-secret
```