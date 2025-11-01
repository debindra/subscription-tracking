# Subscription Tracking Dashboard

A smart subscription tracking dashboard that helps individuals and small teams manage all their active subscriptions including SaaS tools, domains, streaming services, and utilities.

## Features

- 🔐 User authentication (sign up, login)
- 📝 CRUD operations for subscriptions
- 🔔 Email reminders before renewals
- 📊 Dashboard with spending analytics
- 📱 Responsive UI for desktop and mobile

## Tech Stack

### Frontend
- **Framework**: Next.js 14
- **Styling**: TailwindCSS
- **Charts**: Chart.js
- **State Management**: React Context
- **Authentication**: Supabase Auth
- **Atomic Design**: React Atomic Design

### Backend
- **Framework**: NestJS
- **Database**: PostgreSQL (via Supabase)
- **Authentication**: Supabase
- **Email**: Nodemailer
- **Job Scheduler**: BullMQ + Redis

## Project Structure

```
subscription-tracking/
├── frontend/          # Next.js frontend application
├── backend/           # NestJS backend API
└── README.md
```

## Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL (or Supabase account)
- Redis (for BullMQ)

### Setup

1. **Backend Setup**
```bash
cd backend
npm install
cp .env.example .env
# Configure your environment variables
npm run start:dev
```

2. **Frontend Setup**
```bash
cd frontend
npm install
cp .env.example .env.local
# Configure your environment variables
npm run dev
```

### Environment Variables

#### Backend (.env)
```
DATABASE_URL=your_supabase_database_url
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_anon_key
JWT_SECRET=your_jwt_secret
REDIS_HOST=localhost
REDIS_PORT=6379
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

#### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## API Documentation

### Subscriptions Endpoints
- `GET /api/subscriptions` - Get all user subscriptions
- `POST /api/subscriptions` - Create new subscription
- `GET /api/subscriptions/:id` - Get subscription by ID
- `PUT /api/subscriptions/:id` - Update subscription
- `DELETE /api/subscriptions/:id` - Delete subscription

### Analytics Endpoints
- `GET /api/analytics/spending` - Get spending analytics
- `GET /api/analytics/by-category` - Get spending by category

## License

MIT

