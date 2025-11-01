# Subscription Tracker Backend

NestJS backend API for the Subscription Tracking Dashboard.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up your environment variables:
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
- **DATABASE_URL**: Your PostgreSQL connection string (from Supabase or local)
- **SUPABASE_URL**: Your Supabase project URL
- **SUPABASE_KEY**: Your Supabase anon key
- **SUPABASE_SERVICE_KEY**: Your Supabase service role key
- **REDIS_HOST** and **REDIS_PORT**: Redis connection for BullMQ
- **SMTP_*** variables: Email configuration for Nodemailer

3. Set up the database:
   - If using Supabase, run the SQL in `database/schema.sql` in the Supabase SQL editor
   - If using local PostgreSQL, run: `psql -U postgres -d subscription_tracker -f database/schema.sql`

4. Make sure Redis is running (required for BullMQ):
```bash
# macOS
brew install redis
brew services start redis

# Ubuntu/Debian
sudo apt-get install redis-server
sudo systemctl start redis
```

5. Start the development server:
```bash
npm run start:dev
```

The API will be available at `http://localhost:3001`

## API Endpoints

### Authentication
- `POST /auth/signup` - Create new account
- `POST /auth/signin` - Sign in
- `POST /auth/signout` - Sign out
- `POST /auth/refresh` - Refresh token
- `POST /auth/verify` - Verify token

### Subscriptions
- `GET /subscriptions` - Get all user subscriptions
- `POST /subscriptions` - Create new subscription
- `GET /subscriptions/:id` - Get subscription by ID
- `PATCH /subscriptions/:id` - Update subscription
- `DELETE /subscriptions/:id` - Delete subscription
- `GET /subscriptions/upcoming` - Get upcoming renewals

### Analytics
- `GET /analytics/spending` - Get spending summary
- `GET /analytics/by-category` - Get spending by category
- `GET /analytics/monthly-trend` - Get monthly spending trend
- `GET /analytics/stats` - Get subscription statistics

## Features

- ✅ User authentication with Supabase
- ✅ Full CRUD operations for subscriptions
- ✅ Spending analytics and reports
- ✅ Email notifications for upcoming renewals
- ✅ Scheduled reminders using BullMQ
- ✅ TypeORM with PostgreSQL
- ✅ Input validation with class-validator
- ✅ JWT-based authentication

## Project Structure

```
src/
├── config/           # Configuration files
├── decorators/       # Custom decorators
├── entities/         # TypeORM entities
├── guards/           # Auth guards
└── modules/
    ├── auth/         # Authentication module
    ├── subscriptions/# Subscriptions CRUD
    ├── analytics/    # Analytics & reports
    └── notifications/# Email & reminders
```

