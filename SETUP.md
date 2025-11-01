# Subscription Tracker - Setup Guide

Complete setup guide for the Subscription Tracking Dashboard.

## Prerequisites

Before you begin, ensure you have:

- Node.js 18+ installed
- PostgreSQL database (or Supabase account)
- Redis server (for BullMQ job scheduling)
- SMTP credentials (Gmail, SendGrid, etc.)

## Quick Start

### 1. Clone and Install Dependencies

```bash
cd subscription-tracking

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Set Up Supabase

1. Create a free account at [supabase.com](https://supabase.com)
2. Create a new project
3. In the SQL Editor, run the schema from `backend/database/schema.sql`
4. Go to Settings > API to get your keys:
   - Project URL
   - Anon/Public key
   - Service Role key (keep this secret!)

### 3. Configure Backend Environment

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:

```env
# Database - Get from Supabase Settings > Database
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT-ID].supabase.co:5432/postgres

# Supabase - Get from Settings > API
SUPABASE_URL=https://[PROJECT-ID].supabase.co
SUPABASE_KEY=your_anon_key_here
SUPABASE_SERVICE_KEY=your_service_role_key_here

# JWT Secret - Generate a random string
JWT_SECRET=your_random_secret_here

# Redis - If using local Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# Email - Using Gmail
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password  # Generate from Google Account settings
EMAIL_FROM=noreply@yourapp.com

# App
PORT=3001
NODE_ENV=development
```

#### Gmail SMTP Setup

1. Go to [Google Account Settings](https://myaccount.google.com/)
2. Enable 2-Factor Authentication
3. Go to Security > App Passwords
4. Generate a new app password for "Mail"
5. Use this password in `SMTP_PASS`

### 4. Configure Frontend Environment

```bash
cd frontend
cp .env.example .env.local
```

Edit `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_SUPABASE_URL=https://[PROJECT-ID].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

### 5. Start Redis (Required for Reminders)

**macOS:**
```bash
brew install redis
brew services start redis
```

**Ubuntu/Debian:**
```bash
sudo apt-get update
sudo apt-get install redis-server
sudo systemctl start redis
```

**Windows:**
Download from [Redis Windows](https://github.com/microsoftarchive/redis/releases)

**Docker:**
```bash
docker run -d -p 6379:6379 redis:alpine
```

### 6. Run the Application

Open two terminal windows:

**Terminal 1 - Backend:**
```bash
cd backend
npm run start:dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### 7. Access the Application

- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend API: [http://localhost:3001](http://localhost:3001)

## Testing the Setup

1. Open [http://localhost:3000](http://localhost:3000)
2. Click "Sign up" and create a new account
3. You'll be redirected to the dashboard
4. Click "Add Subscription" to create your first subscription
5. View analytics on the dashboard

## Troubleshooting

### Backend won't start

**Error: "Cannot connect to database"**
- Check your `DATABASE_URL` is correct
- Verify your Supabase database is running
- Make sure you've run the schema SQL

**Error: "Redis connection failed"**
- Ensure Redis is running: `redis-cli ping` should return "PONG"
- Check `REDIS_HOST` and `REDIS_PORT` in `.env`

### Frontend won't start

**Error: "Module not found"**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

**Error: "Supabase connection failed"**
- Verify your Supabase URL and keys
- Check they're prefixed with `NEXT_PUBLIC_`

### Email reminders not working

- Verify SMTP credentials are correct
- Check spam folder for test emails
- Ensure Redis is running (required for BullMQ)
- Check backend logs for errors

## Production Deployment

### Backend (Railway, Render, Heroku)

1. Set all environment variables
2. Ensure PostgreSQL and Redis are configured
3. Build: `npm run build`
4. Start: `npm start`

### Frontend (Vercel, Netlify)

1. Connect your GitHub repository
2. Set environment variables (NEXT_PUBLIC_*)
3. Build command: `npm run build`
4. Deploy!

### Database (Supabase)

Already hosted! Just use your production Supabase project.

## Optional: Sample Data

To add sample data for testing:

```sql
-- Run in Supabase SQL Editor
INSERT INTO subscriptions ("userId", name, amount, currency, "billingCycle", "nextRenewalDate", category, description, website)
VALUES 
  ('YOUR_USER_ID', 'Netflix', 15.99, 'USD', 'monthly', '2025-12-01', 'Entertainment', 'Streaming service', 'https://netflix.com'),
  ('YOUR_USER_ID', 'Spotify', 9.99, 'USD', 'monthly', '2025-11-15', 'Entertainment', 'Music streaming', 'https://spotify.com'),
  ('YOUR_USER_ID', 'GitHub Pro', 7.00, 'USD', 'monthly', '2025-11-10', 'Development', 'Code repository', 'https://github.com');
```

Replace `YOUR_USER_ID` with your actual user ID from Supabase Auth.

## Need Help?

Check the individual README files:
- [Backend README](./backend/README.md)
- [Frontend README](./frontend/README.md)
- [Main README](./README.md)

## Next Steps

1. ✅ Set up your first subscriptions
2. ✅ Configure email reminders
3. ✅ Explore the analytics dashboard
4. ✅ Customize categories for your needs
5. ✅ Set up notifications for upcoming renewals

Enjoy tracking your subscriptions! 🎉

