# API Reference Documentation

**Project**: Subscription Tracking Dashboard  
**API Version**: 1.0.0  
**Base URL**: `http://localhost:3001` (Development) | `https://api.yourdomain.com` (Production)  
**Last Updated**: November 2025

## Table of Contents

1. [Overview](#overview)
2. [Authentication](#authentication)
3. [Error Handling](#error-handling)
4. [Rate Limiting](#rate-limiting)
5. [Auth Endpoints](#auth-endpoints)
6. [Subscriptions Endpoints](#subscriptions-endpoints)
7. [Analytics Endpoints](#analytics-endpoints)
8. [Response Codes](#response-codes)
9. [Data Models](#data-models)

---

## Overview

The Subscription Tracker API is a RESTful API that provides endpoints for managing subscriptions, user authentication, and analytics. All requests and responses use JSON format.

### Base URL
```
Development: http://localhost:3001
Production:  https://api.yourdomain.com
```

### Content Type
All requests must include:
```
Content-Type: application/json
```

### API Versioning
Current version: `v1` (implicit - no prefix required)

---

## Authentication

Most endpoints require authentication using JWT (JSON Web Tokens).

### Authentication Header
```http
Authorization: Bearer <your_jwt_token>
```

### Token Lifecycle
- **Access Token**: Valid for 1 hour
- **Refresh Token**: Valid for 7 days (managed by Supabase)
- Tokens are automatically refreshed by the frontend

### Public Endpoints
The following endpoints do NOT require authentication:
- `POST /auth/signup`
- `POST /auth/signin`

---

## Error Handling

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

### Common Error Codes

| Code | Meaning | Description |
|------|---------|-------------|
| 400 | Bad Request | Invalid request format or validation error |
| 401 | Unauthorized | Missing or invalid authentication token |
| 403 | Forbidden | Valid token but insufficient permissions |
| 404 | Not Found | Resource not found |
| 409 | Conflict | Resource already exists |
| 422 | Unprocessable Entity | Semantic errors in request |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server error |

---

## Rate Limiting

**Status**: Planned (not yet implemented)

Future rate limits:
- 100 requests per minute per IP
- 1000 requests per hour per user

---

## Auth Endpoints

### Sign Up

Create a new user account.

**Endpoint**: `POST /auth/signup`

**Authentication**: None required

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "name": "John Doe"
}
```

**Response**: `201 Created`
```json
{
  "user": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "user@example.com",
    "name": "John Doe",
    "created_at": "2025-11-05T10:30:00Z"
  },
  "session": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "v1.MRjT9PQ...",
    "expires_in": 3600
  }
}
```

**Validation Rules**:
- `email`: Must be valid email format
- `password`: Minimum 6 characters
- `name`: Optional, 1-100 characters

**Error Responses**:
```json
// 409 Conflict - Email already exists
{
  "statusCode": 409,
  "message": "User already exists",
  "error": "Conflict"
}
```

---

### Sign In

Authenticate an existing user.

**Endpoint**: `POST /auth/signin`

**Authentication**: None required

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response**: `200 OK`
```json
{
  "user": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "user@example.com",
    "name": "John Doe"
  },
  "session": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "v1.MRjT9PQ...",
    "expires_in": 3600
  }
}
```

**Error Responses**:
```json
// 401 Unauthorized - Invalid credentials
{
  "statusCode": 401,
  "message": "Invalid credentials",
  "error": "Unauthorized"
}
```

---

### Sign Out

Sign out the current user.

**Endpoint**: `POST /auth/signout`

**Authentication**: Required

**Request Body**: None

**Response**: `200 OK`
```json
{
  "message": "Successfully signed out"
}
```

---

### Refresh Token

Refresh the access token using a refresh token.

**Endpoint**: `POST /auth/refresh`

**Authentication**: None (uses refresh token)

**Request Body**:
```json
{
  "refresh_token": "v1.MRjT9PQ..."
}
```

**Response**: `200 OK`
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "v1.NewToken...",
  "expires_in": 3600
}
```

---

### Verify Token

Verify if a token is valid.

**Endpoint**: `POST /auth/verify`

**Authentication**: Required

**Request Body**: None

**Response**: `200 OK`
```json
{
  "valid": true,
  "user": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "user@example.com"
  }
}
```

---

## Subscriptions Endpoints

### Get All Subscriptions

Retrieve all subscriptions for the authenticated user.

**Endpoint**: `GET /subscriptions`

**Authentication**: Required

**Query Parameters**: None

**Response**: `200 OK`
```json
[
  {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "userId": "user-uuid",
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
]
```

---

### Get Subscription by ID

Retrieve a specific subscription.

**Endpoint**: `GET /subscriptions/:id`

**Authentication**: Required

**Path Parameters**:
- `id` (string, required): Subscription UUID

**Response**: `200 OK`
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "userId": "user-uuid",
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

**Error Responses**:
```json
// 404 Not Found
{
  "statusCode": 404,
  "message": "Subscription not found",
  "error": "Not Found"
}

// 403 Forbidden - Trying to access another user's subscription
{
  "statusCode": 403,
  "message": "Access denied",
  "error": "Forbidden"
}
```

---

### Create Subscription

Create a new subscription.

**Endpoint**: `POST /subscriptions`

**Authentication**: Required

**Request Body**:
```json
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

**Field Descriptions**:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| name | string | Yes | Subscription name (1-255 chars) |
| amount | number | Yes | Cost per billing cycle (>= 0) |
| currency | string | Yes | Currency code (USD, EUR, GBP, NPR) |
| billingCycle | string | Yes | monthly, yearly, quarterly, weekly |
| nextRenewalDate | string | Yes | ISO date (YYYY-MM-DD) |
| category | string | Yes | Predefined category |
| description | string | No | Optional description |
| website | string | No | Optional website URL |
| isActive | boolean | No | Default: true |
| reminderEnabled | boolean | No | Default: true |
| reminderDaysBefore | number | No | Days before renewal (1-30), Default: 7 |

**Categories**:
- Entertainment
- Development
- Productivity
- Cloud Services
- Design
- Marketing
- Communication
- Security
- Finance
- Education
- Other

**Response**: `201 Created`
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "userId": "user-uuid",
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
  "createdAt": "2025-11-05T10:30:00Z",
  "updatedAt": "2025-11-05T10:30:00Z"
}
```

**Validation Errors**:
```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request",
  "details": [
    {
      "field": "amount",
      "message": "amount must be a positive number"
    },
    {
      "field": "nextRenewalDate",
      "message": "nextRenewalDate must be a valid date"
    }
  ]
}
```

---

### Update Subscription

Update an existing subscription.

**Endpoint**: `PATCH /subscriptions/:id`

**Authentication**: Required

**Path Parameters**:
- `id` (string, required): Subscription UUID

**Request Body**: (all fields optional)
```json
{
  "name": "Netflix Premium",
  "amount": 19.99,
  "isActive": false
}
```

**Response**: `200 OK`
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "userId": "user-uuid",
  "name": "Netflix Premium",
  "amount": 19.99,
  "currency": "USD",
  "billingCycle": "monthly",
  "nextRenewalDate": "2025-12-01",
  "category": "Entertainment",
  "description": "Premium plan",
  "website": "https://netflix.com",
  "isActive": false,
  "reminderEnabled": true,
  "reminderDaysBefore": 3,
  "createdAt": "2025-11-01T10:30:00Z",
  "updatedAt": "2025-11-05T14:20:00Z"
}
```

---

### Delete Subscription

Delete a subscription.

**Endpoint**: `DELETE /subscriptions/:id`

**Authentication**: Required

**Path Parameters**:
- `id` (string, required): Subscription UUID

**Response**: `200 OK`
```json
{
  "message": "Subscription deleted successfully",
  "id": "123e4567-e89b-12d3-a456-426614174000"
}
```

**Error Responses**:
```json
// 404 Not Found
{
  "statusCode": 404,
  "message": "Subscription not found",
  "error": "Not Found"
}
```

---

### Get Upcoming Renewals

Get subscriptions that will renew within the next 7 days.

**Endpoint**: `GET /subscriptions/upcoming`

**Authentication**: Required

**Response**: `200 OK`
```json
[
  {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "name": "Netflix",
    "amount": 15.99,
    "currency": "USD",
    "nextRenewalDate": "2025-11-08",
    "daysUntilRenewal": 3
  }
]
```

---

## Analytics Endpoints

### Get Spending Summary

Get monthly and yearly spending totals.

**Endpoint**: `GET /analytics/spending`

**Authentication**: Required

**Response**: `200 OK`
```json
{
  "monthly": 125.45,
  "yearly": 1505.40,
  "currency": "USD",
  "activeSubscriptions": 12,
  "calculatedAt": "2025-11-05T10:30:00Z"
}
```

**Notes**:
- Monthly total converts all billing cycles to monthly equivalent
- Yearly total is monthly × 12
- Only includes active subscriptions

---

### Get Spending by Category

Get spending breakdown by category.

**Endpoint**: `GET /analytics/by-category`

**Authentication**: Required

**Response**: `200 OK`
```json
[
  {
    "category": "Entertainment",
    "amount": 45.97,
    "subscriptionCount": 3,
    "percentage": 36.6
  },
  {
    "category": "Development",
    "amount": 39.99,
    "subscriptionCount": 2,
    "percentage": 31.9
  },
  {
    "category": "Cloud Services",
    "amount": 25.00,
    "subscriptionCount": 1,
    "percentage": 19.9
  }
]
```

---

### Get Monthly Trend

Get monthly spending trend for the past N months.

**Endpoint**: `GET /analytics/monthly-trend`

**Authentication**: Required

**Query Parameters**:
- `months` (number, optional): Number of months (1-24), Default: 6

**Example**: `GET /analytics/monthly-trend?months=12`

**Response**: `200 OK`
```json
[
  {
    "month": "2025-11",
    "total": 125.45,
    "subscriptionCount": 12
  },
  {
    "month": "2025-10",
    "total": 118.32,
    "subscriptionCount": 11
  },
  {
    "month": "2025-09",
    "total": 121.55,
    "subscriptionCount": 12
  }
]
```

---

### Get Subscription Statistics

Get general statistics about subscriptions.

**Endpoint**: `GET /analytics/stats`

**Authentication**: Required

**Response**: `200 OK`
```json
{
  "total": 15,
  "active": 12,
  "inactive": 3,
  "categories": 5,
  "averageMonthly": 10.45,
  "mostExpensive": {
    "name": "Adobe Creative Cloud",
    "amount": 52.99
  },
  "nextRenewal": {
    "name": "Netflix",
    "date": "2025-11-08",
    "daysAway": 3
  }
}
```

---

## Response Codes

### Success Codes

| Code | Meaning | Usage |
|------|---------|-------|
| 200 | OK | Successful GET, PATCH, DELETE |
| 201 | Created | Successful POST |
| 204 | No Content | Successful DELETE (alternative) |

### Error Codes

| Code | Meaning | When It Occurs |
|------|---------|----------------|
| 400 | Bad Request | Invalid request format, validation failed |
| 401 | Unauthorized | Missing or invalid token |
| 403 | Forbidden | Valid token but no permission |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Resource already exists |
| 422 | Unprocessable Entity | Semantic validation error |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server-side error |
| 503 | Service Unavailable | Service temporarily down |

---

## Data Models

### Subscription Model

```typescript
interface Subscription {
  id: string;                    // UUID
  userId: string;                // UUID (foreign key)
  name: string;                  // 1-255 characters
  amount: number;                // Decimal (10,2)
  currency: string;              // 3-letter code
  billingCycle: BillingCycle;    // Enum
  nextRenewalDate: string;       // ISO date string
  category: string;              // Predefined category
  description: string | null;    // Optional text
  website: string | null;        // Optional URL
  isActive: boolean;             // Default: true
  reminderEnabled: boolean;      // Default: true
  reminderDaysBefore: number;    // 1-30, Default: 7
  createdAt: string;             // ISO timestamp
  updatedAt: string;             // ISO timestamp
}

type BillingCycle = 'monthly' | 'yearly' | 'quarterly' | 'weekly';
```

### User Model (Managed by Supabase)

```typescript
interface User {
  id: string;           // UUID
  email: string;        // Email address
  name?: string;        // Optional display name
  created_at: string;   // ISO timestamp
}
```

### Session Model

```typescript
interface Session {
  access_token: string;   // JWT
  refresh_token: string;  // Refresh token
  expires_in: number;     // Seconds (3600)
  token_type: string;     // "Bearer"
}
```

---

## Examples

### cURL Examples

**Sign Up**:
```bash
curl -X POST http://localhost:3001/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securePass123",
    "name": "John Doe"
  }'
```

**Create Subscription**:
```bash
curl -X POST http://localhost:3001/subscriptions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "Netflix",
    "amount": 15.99,
    "currency": "USD",
    "billingCycle": "monthly",
    "nextRenewalDate": "2025-12-01",
    "category": "Entertainment"
  }'
```

**Get All Subscriptions**:
```bash
curl -X GET http://localhost:3001/subscriptions \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### JavaScript/Axios Examples

**Sign In**:
```javascript
const response = await axios.post('http://localhost:3001/auth/signin', {
  email: 'user@example.com',
  password: 'securePass123'
});

const { access_token } = response.data.session;
```

**Get Analytics**:
```javascript
const response = await axios.get('http://localhost:3001/analytics/spending', {
  headers: {
    'Authorization': `Bearer ${access_token}`
  }
});

console.log(response.data.monthly); // 125.45
```

---

## Changelog

### Version 1.0.0 (2025-11-05)
- Initial API release
- Auth endpoints (signup, signin, signout, refresh, verify)
- Subscriptions CRUD endpoints
- Analytics endpoints (spending, category, trend, stats)
- JWT authentication
- Input validation

### Planned for v1.1.0
- Rate limiting
- Pagination for large datasets
- Filtering and sorting query parameters
- Webhook support for notifications
- Bulk operations

---

## Support

For API support:
- **Issues**: GitHub Issues
- **Email**: support@yourdomain.com
- **Documentation**: This file + ARCHITECTURE.md

---

**Maintained by**: Development Team  
**Last Review**: November 2025  
**Next Review**: February 2026

