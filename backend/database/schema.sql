-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "userId" VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'USD',
  "billingCycle" VARCHAR(50) NOT NULL CHECK ("billingCycle" IN ('monthly', 'yearly', 'quarterly', 'weekly')),
  "nextRenewalDate" DATE NOT NULL,
  category VARCHAR(100) NOT NULL,
  description TEXT,
  website VARCHAR(500),
  "isActive" BOOLEAN DEFAULT true,
  "reminderEnabled" BOOLEAN DEFAULT true,
  "reminderDaysBefore" INTEGER DEFAULT 7,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for userId for faster queries
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions("userId");

-- Create index for nextRenewalDate for reminder queries
CREATE INDEX IF NOT EXISTS idx_subscriptions_renewal_date ON subscriptions("nextRenewalDate");

-- Create function to update updatedAt timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW."updatedAt" = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updatedAt
DROP TRIGGER IF EXISTS update_subscriptions_updated_at ON subscriptions;
CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Sample data (optional, for testing)
-- INSERT INTO subscriptions ("userId", name, amount, currency, "billingCycle", "nextRenewalDate", category, description, website)
-- VALUES 
--   ('user-123', 'Netflix', 15.99, 'USD', 'monthly', '2025-12-01', 'Entertainment', 'Streaming service', 'https://netflix.com'),
--   ('user-123', 'Spotify', 9.99, 'USD', 'monthly', '2025-11-15', 'Entertainment', 'Music streaming', 'https://spotify.com'),
--   ('user-123', 'GitHub Pro', 7.00, 'USD', 'monthly', '2025-11-10', 'Development', 'Code repository', 'https://github.com');

