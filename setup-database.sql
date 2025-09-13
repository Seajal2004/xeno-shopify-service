-- Connect to PostgreSQL as superuser and run these commands

-- Create database
CREATE DATABASE xeno_shopify;

-- Create user (optional, you can use postgres user)
CREATE USER xeno_user WITH PASSWORD 'your_password';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE xeno_shopify TO xeno_user;

-- Connect to the database
\c xeno_shopify;

-- Grant schema privileges
GRANT ALL ON SCHEMA public TO xeno_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO xeno_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO xeno_user;