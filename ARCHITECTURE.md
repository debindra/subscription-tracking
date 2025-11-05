# System Architecture Documentation

**Project**: Subscription Tracking Dashboard  
**Version**: 1.0.0  
**Last Updated**: November 2025  

## Table of Contents

1. [System Overview](#system-overview)
2. [Architecture Diagram](#architecture-diagram)
3. [Technology Stack](#technology-stack)
4. [Component Architecture](#component-architecture)
5. [Database Design](#database-design)
6. [API Design](#api-design)
7. [Authentication Flow](#authentication-flow)
8. [Data Flow](#data-flow)
9. [Deployment Architecture](#deployment-architecture)
10. [Security Architecture](#security-architecture)

---

## System Overview

The Subscription Tracking Dashboard is a full-stack web application that helps users manage and track all their subscription services. The system provides real-time analytics, automated reminders, and comprehensive reporting features.

### Key Features
- User authentication and authorization
- Subscription management (CRUD operations)
- Automated email reminders
- Spending analytics and visualizations
- Dark mode support
- Data export (CSV/HTML)
- Responsive design for all devices

### Architecture Style
- **Pattern**: Client-Server with REST API
- **Frontend**: SPA (Single Page Application) with Next.js 14
- **Backend**: Microservices-ready monolith with NestJS
- **Database**: Relational (PostgreSQL via Supabase)
- **Authentication**: JWT-based with Supabase Auth

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                             │
│                                                                   │
│  ┌─────────────┐  ┌─────────────┐  ┌──────────────┐            │
│  │   Browser   │  │   Mobile    │  │    Tablet    │            │
│  │  (Desktop)  │  │   Safari    │  │    Chrome    │            │
│  └──────┬──────┘  └──────┬──────┘  └──────┬───────┘            │
│         │                 │                 │                     │
│         └─────────────────┴─────────────────┘                    │
│                           │                                       │
└───────────────────────────┼───────────────────────────────────────┘
                            │
                            │ HTTPS
                            │
┌───────────────────────────┼───────────────────────────────────────┐
│                    FRONTEND LAYER                                 │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    Next.js 14 App                         │  │
│  │  ┌────────────┐  ┌────────────┐  ┌──────────────────┐  │  │
│  │  │   Pages    │  │ Components │  │  Context/Hooks   │  │  │
│  │  │            │  │            │  │                  │  │  │
│  │  │ - Dashboard│  │ - UI       │  │ - ThemeContext  │  │  │
│  │  │ - Auth     │  │ - Dashboard│  │ - useAuth       │  │  │
│  │  │ - Subs     │  │ - Layout   │  │                  │  │  │
│  │  └────────────┘  └────────────┘  └──────────────────┘  │  │
│  │                                                          │  │
│  │  ┌────────────┐  ┌────────────┐  ┌──────────────────┐  │  │
│  │  │  API Client│  │   Utils    │  │   State Mgmt     │  │  │
│  │  │  (Axios)   │  │  (format,  │  │   (React State)  │  │  │
│  │  │            │  │   export)  │  │                  │  │  │
│  │  └────────────┘  └────────────┘  └──────────────────┘  │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                   │
└───────────────────────────────┬───────────────────────────────────┘
                                │
                                │ REST API (JSON)
                                │
┌───────────────────────────────┼───────────────────────────────────┐
│                      BACKEND LAYER                                │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                     NestJS API Server                     │  │
│  │                                                           │  │
│  │  ┌─────────────────────────────────────────────────┐   │  │
│  │  │              Core Modules                       │   │  │
│  │  │                                                 │   │  │
│  │  │  ┌──────────┐  ┌──────────┐  ┌─────────────┐ │   │  │
│  │  │  │   Auth   │  │   Subs   │  │  Analytics  │ │   │  │
│  │  │  │  Module  │  │  Module  │  │    Module   │ │   │  │
│  │  │  └──────────┘  └──────────┘  └─────────────┘ │   │  │
│  │  │                                                 │   │  │
│  │  │  ┌──────────────────────────────────────────┐ │   │  │
│  │  │  │        Notifications Module              │ │   │  │
│  │  │  │  ┌────────────┐  ┌──────────────────┐  │ │   │  │
│  │  │  │  │   Email    │  │     BullMQ       │  │ │   │  │
│  │  │  │  │  Service   │  │    Scheduler     │  │ │   │  │
│  │  │  │  └────────────┘  └──────────────────┘  │ │   │  │
│  │  │  └──────────────────────────────────────────┘ │   │  │
│  │  └─────────────────────────────────────────────────┘   │  │
│  │                                                           │  │
│  │  ┌─────────────────────────────────────────────────┐   │  │
│  │  │           Infrastructure Layer                  │   │  │
│  │  │  ┌──────────┐  ┌──────────┐  ┌──────────────┐ │   │  │
│  │  │  │ TypeORM  │  │  Guards  │  │  Decorators  │ │   │  │
│  │  │  │          │  │          │  │              │ │   │  │
│  │  │  └──────────┘  └──────────┘  └──────────────┘ │   │  │
│  │  └─────────────────────────────────────────────────┘   │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                   │
└───────────────────┬───────────────────┬───────────────────────────┘
                    │                   │
                    │                   │
        ┌───────────┴─────────┐  ┌──────┴──────────┐
        │                     │  │                 │
┌───────┴──────────┐  ┌───────┴──────────┐  ┌────┴──────────┐
│   PostgreSQL     │  │      Redis       │  │  SMTP Server  │
│   (Supabase)     │  │   (Job Queue)    │  │  (Email)      │
│                  │  │                  │  │               │
│ - subscriptions  │  │ - Reminder Jobs  │  │ - Nodemailer  │
│ - auth.users     │  │ - Cron Schedule  │  │               │
└──────────────────┘  └──────────────────┘  └───────────────┘
```

---

## Technology Stack

### Frontend
- **Framework**: Next.js 14.2.33 (App Router)
- **Language**: TypeScript 5.7.2
- **Styling**: TailwindCSS 3.4.18
- **Charts**: Chart.js 4.4.7 + react-chartjs-2 5.2.0
- **HTTP Client**: Axios 1.7.9
- **Date Handling**: date-fns 4.1.0
- **Authentication**: @supabase/supabase-js 2.48.1

### Backend
- **Framework**: NestJS 11.1.8
- **Language**: TypeScript 5.7.2
- **Database**: PostgreSQL (via Supabase)
- **ORM**: TypeORM 0.3.21
- **Job Queue**: BullMQ 5.34.3
- **Email**: Nodemailer 6.9.17
- **Validation**: class-validator 0.14.1
- **Configuration**: @nestjs/config 3.3.1

### Infrastructure
- **Database**: Supabase (PostgreSQL + Auth)
- **Cache/Queue**: Redis
- **Hosting**: Docker-ready (Vercel + Railway/Render)
- **Email**: SMTP (Gmail, SendGrid, etc.)

---

## Component Architecture

### Frontend Component Hierarchy

```
App Layout
├── ThemeProvider
│   └── Body
│       ├── Navbar
│       │   ├── Logo
│       │   ├── Navigation Links
│       │   ├── Dark Mode Toggle
│       │   └── User Menu
│       │
│       └── Page Content
│           ├── Dashboard Page
│           │   ├── Stats Cards (4x)
│           │   ├── SpendingChart
│           │   │   ├── Pie Chart (Category)
│           │   │   └── Bar Chart (Monthly Trend)
│           │   └── Upcoming Renewals Widget
│           │
│           ├── Subscriptions Page
│           │   ├── Header
│           │   │   ├── Title
│           │   │   ├── ExportButton
│           │   │   └── Add Button
│           │   ├── Filter Buttons
│           │   ├── Subscription Grid
│           │   │   └── SubscriptionCard (n)
│           │   └── Modal
│           │       └── SubscriptionForm
│           │
│           └── Auth Pages
│               ├── Login Form
│               └── Signup Form
```

### Backend Module Structure

```
AppModule
├── ConfigModule (Global)
├── TypeOrmModule (Database)
│
├── AuthModule
│   ├── AuthController
│   ├── AuthService
│   └── DTOs
│
├── SubscriptionsModule
│   ├── SubscriptionsController
│   ├── SubscriptionsService
│   ├── Subscription Entity
│   └── DTOs
│
├── AnalyticsModule
│   ├── AnalyticsController
│   ├── AnalyticsService
│   └── Calculations
│
└── NotificationsModule
    ├── NotificationsService
    ├── EmailService
    └── ReminderScheduler (BullMQ)
```

---

## Database Design

### Entity Relationship Diagram

```
┌────────────────────────────┐
│       auth.users           │
│  (Supabase Managed)        │
├────────────────────────────┤
│ id (UUID)                  │
│ email                      │
│ created_at                 │
│ ...                        │
└────────────┬───────────────┘
             │
             │ 1:N
             │
┌────────────┴───────────────┐
│     subscriptions          │
├────────────────────────────┤
│ id (UUID) PK               │
│ user_id (UUID) FK          │───┐
│ name (VARCHAR)             │   │
│ amount (DECIMAL)           │   │ Belongs To
│ currency (VARCHAR)         │   │
│ billing_cycle (VARCHAR)    │   │
│ next_renewal_date (DATE)   │───┘
│ category (VARCHAR)         │
│ description (TEXT)         │
│ website (VARCHAR)          │
│ is_active (BOOLEAN)        │
│ reminder_enabled (BOOLEAN) │
│ reminder_days_before (INT) │
│ created_at (TIMESTAMP)     │
│ updated_at (TIMESTAMP)     │
└────────────────────────────┘

Indexes:
- idx_subscriptions_user_id (user_id)
- idx_subscriptions_renewal_date (next_renewal_date)
```

### Database Schema

#### subscriptions Table

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() | Unique identifier |
| user_id | UUID | NOT NULL, FOREIGN KEY → auth.users(id) | User owner |
| name | VARCHAR(255) | NOT NULL | Subscription name |
| amount | DECIMAL(10,2) | NOT NULL, CHECK (amount >= 0) | Cost |
| currency | VARCHAR(3) | NOT NULL, DEFAULT 'USD' | Currency code |
| billing_cycle | VARCHAR(20) | NOT NULL | monthly/yearly/quarterly/weekly |
| next_renewal_date | DATE | NOT NULL | Next payment date |
| category | VARCHAR(50) | NOT NULL | Subscription category |
| description | TEXT | NULL | Optional description |
| website | VARCHAR(255) | NULL | Service website |
| is_active | BOOLEAN | NOT NULL, DEFAULT true | Active status |
| reminder_enabled | BOOLEAN | NOT NULL, DEFAULT true | Email reminders |
| reminder_days_before | INTEGER | NOT NULL, DEFAULT 7 | Days before renewal |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Creation time |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Last update time |

---

## API Design

### REST API Endpoints

#### Authentication Endpoints
```
POST   /auth/signup           Create new user account
POST   /auth/signin           Authenticate user
POST   /auth/signout          Sign out user
POST   /auth/refresh          Refresh access token
POST   /auth/verify           Verify token validity
```

#### Subscriptions Endpoints
```
GET    /subscriptions         Get all user subscriptions
POST   /subscriptions         Create new subscription
GET    /subscriptions/:id     Get subscription by ID
PATCH  /subscriptions/:id     Update subscription
DELETE /subscriptions/:id     Delete subscription
GET    /subscriptions/upcoming Get upcoming renewals (7 days)
```

#### Analytics Endpoints
```
GET    /analytics/spending           Get spending summary
GET    /analytics/by-category        Get spending by category
GET    /analytics/monthly-trend      Get monthly spending trend
GET    /analytics/stats              Get subscription statistics
```

### Request/Response Format

#### Example: Create Subscription

**Request**:
```http
POST /subscriptions HTTP/1.1
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "name": "Netflix",
  "amount": 15.99,
  "currency": "USD",
  "billingCycle": "monthly",
  "nextRenewalDate": "2025-12-01",
  "category": "Entertainment",
  "description": "Premium plan",
  "website": "https://netflix.com",
  "isActive": true,
  "reminderEnabled": true,
  "reminderDaysBefore": 3
}
```

**Response**:
```http
HTTP/1.1 201 Created
Content-Type: application/json

{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "userId": "987fcdeb-51a2-43d7-9876-543210987654",
  "name": "Netflix",
  "amount": 15.99,
  "currency": "USD",
  "billingCycle": "monthly",
  "nextRenewalDate": "2025-12-01",
  "category": "Entertainment",
  "description": "Premium plan",
  "website": "https://netflix.com",
  "isActive": true,
  "reminderEnabled": true,
  "reminderDaysBefore": 3,
  "createdAt": "2025-11-01T10:30:00Z",
  "updatedAt": "2025-11-01T10:30:00Z"
}
```

### Error Response Format

```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request",
  "details": [
    {
      "field": "amount",
      "message": "amount must be a positive number"
    }
  ]
}
```

---

## Authentication Flow

### Sign Up Flow

```
┌────────┐         ┌──────────┐         ┌─────────┐         ┌──────────┐
│ Client │         │ Frontend │         │ Backend │         │ Supabase │
└────┬───┘         └────┬─────┘         └────┬────┘         └────┬─────┘
     │                  │                    │                   │
     │ 1. Submit Form   │                    │                   │
     ├─────────────────>│                    │                   │
     │                  │                    │                   │
     │                  │ 2. POST /auth/signup                  │
     │                  ├───────────────────>│                   │
     │                  │                    │                   │
     │                  │                    │ 3. Create User    │
     │                  │                    ├──────────────────>│
     │                  │                    │                   │
     │                  │                    │ 4. User + Token   │
     │                  │                    │<──────────────────┤
     │                  │                    │                   │
     │                  │ 5. Return User Data│                   │
     │                  │<───────────────────┤                   │
     │                  │                    │                   │
     │ 6. Store Token   │                    │                   │
     │<─────────────────┤                    │                   │
     │                  │                    │                   │
     │ 7. Redirect to Dashboard            │                   │
     ├─────────────────>│                    │                   │
     │                  │                    │                   │
```

### Protected Request Flow

```
┌────────┐         ┌──────────┐         ┌─────────┐         ┌──────────┐
│ Client │         │ Frontend │         │ Backend │         │ Supabase │
└────┬───┘         └────┬─────┘         └────┬────┘         └────┬─────┘
     │                  │                    │                   │
     │ 1. API Request   │                    │                   │
     ├─────────────────>│                    │                   │
     │                  │                    │                   │
     │                  │ 2. Add JWT Token   │                   │
     │                  │    Authorization: Bearer <token>      │
     │                  ├───────────────────>│                   │
     │                  │                    │                   │
     │                  │                    │ 3. Verify Token   │
     │                  │                    ├──────────────────>│
     │                  │                    │                   │
     │                  │                    │ 4. Token Valid    │
     │                  │                    │<──────────────────┤
     │                  │                    │                   │
     │                  │                    │ 5. Process Request│
     │                  │                    │    (DB Query)     │
     │                  │                    │                   │
     │                  │ 6. Return Data     │                   │
     │                  │<───────────────────┤                   │
     │                  │                    │                   │
     │ 7. Update UI     │                    │                   │
     │<─────────────────┤                    │                   │
     │                  │                    │                   │
```

### Token Refresh Flow

```
Client detects 401 error
     │
     ├─> Get refresh token from Supabase
     │
     ├─> Request new access token
     │
     ├─> Update stored token
     │
     └─> Retry original request
```

---

## Data Flow

### Subscription Creation Flow

```
1. User fills form in SubscriptionForm component
     │
     ├─> Form validation (client-side)
     │
     ├─> Submit to subscriptionsApi.create()
     │
     ├─> Axios interceptor adds JWT token
     │
     ├─> POST /subscriptions
     │
     ├─> NestJS ValidationPipe validates DTO
     │
     ├─> AuthGuard verifies JWT token
     │
     ├─> SubscriptionsService.create()
     │
     ├─> TypeORM saves to database
     │
     ├─> Return created subscription
     │
     ├─> Frontend updates state
     │
     └─> UI refreshes subscription list
```

### Email Reminder Flow

```
Daily Cron Job (9 AM)
     │
     ├─> BullMQ triggers reminder check
     │
     ├─> NotificationsService queries subscriptions
     │       WHERE next_renewal_date BETWEEN
     │       NOW() AND NOW() + reminder_days_before
     │       AND reminder_enabled = true
     │
     ├─> For each subscription:
     │   │
     │   ├─> Get user email from auth
     │   │
     │   ├─> EmailService generates HTML template
     │   │
     │   ├─> Nodemailer sends email via SMTP
     │   │
     │   └─> Log success/failure
     │
     └─> Job completes
```

---

## Deployment Architecture

### Development Environment

```
Developer Machine
├── Frontend (localhost:3000)
│   └── npm run dev
│
├── Backend (localhost:3001)
│   └── npm run start:dev
│
├── Redis (localhost:6379)
│   └── Local Redis server
│
└── PostgreSQL (Supabase Cloud)
    └── Remote connection
```

### Production Environment

```
┌─────────────────────────────────────────┐
│            CDN / Edge Network           │
│              (Vercel Edge)              │
└─────────────────┬───────────────────────┘
                  │
        ┌─────────┴─────────┐
        │                   │
┌───────┴──────────┐  ┌─────┴────────────┐
│   Frontend       │  │   Backend        │
│   (Vercel)       │  │  (Railway)       │
│                  │  │                  │
│ - Next.js SSR    │  │ - NestJS API    │
│ - Static Assets  │  │ - Docker        │
└──────────────────┘  └─────┬────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
┌───────┴──────────┐  ┌─────┴────────────┐  ┌──┴──────────┐
│   PostgreSQL     │  │      Redis       │  │ SMTP Server │
│   (Supabase)     │  │  (Railway/Upstash)│  │  (SendGrid) │
└──────────────────┘  └──────────────────┘  └─────────────┘
```

### Docker Deployment

```yaml
# docker-compose.yml structure
services:
  frontend:
    - Next.js production build
    - Port 3000
  
  backend:
    - NestJS production build
    - Port 3001
    - Depends on: postgres, redis
  
  postgres:
    - PostgreSQL 15
    - Volume for persistence
  
  redis:
    - Redis 7
    - Volume for persistence
```

---

## Security Architecture

### Security Layers

```
┌─────────────────────────────────────────────────────┐
│                 Application Security                │
├─────────────────────────────────────────────────────┤
│ 1. HTTPS/TLS                                        │
│    - All traffic encrypted                          │
│    - SSL certificates                               │
├─────────────────────────────────────────────────────┤
│ 2. Authentication                                   │
│    - JWT tokens (short-lived)                       │
│    - Refresh tokens (Supabase)                      │
│    - Password hashing (bcrypt via Supabase)         │
├─────────────────────────────────────────────────────┤
│ 3. Authorization                                    │
│    - User-scoped data access                        │
│    - Row Level Security (RLS) in Supabase           │
│    - AuthGuard on all protected routes              │
├─────────────────────────────────────────────────────┤
│ 4. Input Validation                                 │
│    - Client-side validation (React Hook Form)       │
│    - Server-side validation (class-validator)       │
│    - SQL injection prevention (TypeORM)             │
│    - XSS prevention (React auto-escaping)           │
├─────────────────────────────────────────────────────┤
│ 5. CORS Protection                                  │
│    - Whitelist frontend origin                      │
│    - Credentials: true                              │
│    - Specific headers allowed                       │
├─────────────────────────────────────────────────────┤
│ 6. Rate Limiting (Planned)                          │
│    - Per-IP limits                                  │
│    - Per-user limits                                │
├─────────────────────────────────────────────────────┤
│ 7. Environment Security                             │
│    - Secrets in environment variables               │
│    - No hardcoded credentials                       │
│    - .gitignore for sensitive files                 │
└─────────────────────────────────────────────────────┘
```

### Data Security

- **At Rest**: PostgreSQL encryption (Supabase)
- **In Transit**: HTTPS/TLS 1.3
- **Authentication**: JWT with Supabase Auth
- **Password**: Hashed with bcrypt (Supabase)
- **User Data**: Row Level Security policies

---

## Performance Considerations

### Frontend Optimization
- Code splitting (automatic with Next.js)
- Image optimization
- CSS optimization (TailwindCSS purge)
- Lazy loading for charts
- React.memo for expensive components
- useMemo for calculations

### Backend Optimization
- Database indexing on user_id and renewal_date
- Connection pooling (TypeORM)
- Query optimization
- Redis caching (for BullMQ)
- Async/await for I/O operations

### Monitoring
- Console logging (development)
- Error tracking (planned: Sentry)
- Performance monitoring (planned)
- Database query analysis

---

## Scalability

### Horizontal Scaling
- Stateless backend (JWT authentication)
- Database connection pooling
- Redis for shared state (jobs)
- Load balancer ready

### Vertical Scaling
- Optimized queries
- Indexed database columns
- Efficient algorithms
- Resource limits configured

---

## Future Enhancements

### Planned Features
1. **Caching Layer**: Redis for API responses
2. **CDN**: Static asset distribution
3. **Microservices**: Split modules into separate services
4. **GraphQL**: Alternative to REST API
5. **WebSockets**: Real-time updates
6. **Mobile App**: React Native
7. **API Versioning**: /v1/, /v2/ endpoints
8. **Rate Limiting**: Prevent abuse
9. **Monitoring**: APM and logging
10. **CI/CD**: Automated deployment pipeline

---

**Document Maintainer**: Development Team  
**Review Cycle**: Quarterly  
**Next Review**: February 2026

