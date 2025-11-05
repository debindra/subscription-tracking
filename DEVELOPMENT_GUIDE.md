# Development Guide

**Project**: Subscription Tracking Dashboard  
**Last Updated**: November 2025

## Table of Contents

1. [Getting Started](#getting-started)
2. [Development Workflow](#development-workflow)
3. [Code Standards](#code-standards)
4. [Git Workflow](#git-workflow)
5. [Testing](#testing)
6. [Debugging](#debugging)
7. [Common Tasks](#common-tasks)
8. [Troubleshooting](#troubleshooting)

---

## Getting Started

### Prerequisites

- **Node.js**: v18.17.0 or higher
- **npm**: v9.0.0 or higher
- **PostgreSQL**: v14+ (or Supabase account)
- **Redis**: v7+ (for email reminders)
- **Git**: v2.30+

### Initial Setup

#### 1. Clone the Repository

```bash
git clone https://github.com/your-org/subscription-tracking.git
cd subscription-tracking
```

#### 2. Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend  
cd ../frontend
npm install
```

#### 3. Set Up Environment Variables

**Backend** (`.env`):
```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:
```env
# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/subtracker
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-key

# JWT
JWT_SECRET=your-secret-key-min-32-chars

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
EMAIL_FROM=noreply@subscriptiontracker.com

# Server
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

**Frontend** (`.env.local`):
```bash
cd ../frontend
cp .env.example .env.local
```

Edit `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

#### 4. Set Up Database

**Option A: Using Supabase (Recommended)**

1. Create account at [supabase.com](https://supabase.com)
2. Create a new project
3. Go to SQL Editor
4. Run `backend/database/schema.sql`
5. Copy connection string and API keys to `.env`

**Option B: Local PostgreSQL**

```bash
# Install PostgreSQL
brew install postgresql  # macOS
sudo apt-get install postgresql  # Linux

# Create database
createdb subtracker

# Run migrations (TypeORM will auto-sync in development)
npm run start:dev
```

#### 5. Set Up Redis

```bash
# macOS
brew install redis
brew services start redis

# Ubuntu
sudo apt-get install redis-server
sudo systemctl start redis

# Verify
redis-cli ping  # Should return PONG
```

#### 6. Start Development Servers

**Using the start script** (recommended):
```bash
# From project root
./start.sh
```

**Or manually**:
```bash
# Terminal 1 - Backend
cd backend
npm run start:dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

#### 7. Access the Application

- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:3001](http://localhost:3001)

---

## Development Workflow

### Daily Workflow

```bash
# 1. Pull latest changes
git pull origin main

# 2. Create feature branch
git checkout -b feature/your-feature-name

# 3. Make changes
# ... code ...

# 4. Test locally
npm run dev  # Frontend
npm run start:dev  # Backend

# 5. Commit changes
git add .
git commit -m "feat: add your feature"

# 6. Push and create PR
git push origin feature/your-feature-name
```

### Project Structure

```
subscription-tracking/
├── backend/
│   ├── src/
│   │   ├── modules/          # Feature modules
│   │   │   ├── auth/
│   │   │   ├── subscriptions/
│   │   │   ├── analytics/
│   │   │   └── notifications/
│   │   ├── entities/         # Database entities
│   │   ├── guards/           # Auth guards
│   │   ├── decorators/       # Custom decorators
│   │   ├── config/           # Configuration
│   │   └── main.ts          # Entry point
│   ├── database/            # SQL schemas
│   └── package.json
│
├── frontend/
│   ├── app/                 # Next.js pages
│   │   ├── auth/           # Auth pages
│   │   ├── dashboard/      # Dashboard pages
│   │   ├── layout.tsx      # Root layout
│   │   └── globals.css     # Global styles
│   ├── components/         # React components
│   │   ├── ui/            # UI primitives
│   │   ├── dashboard/     # Feature components
│   │   └── layout/        # Layout components
│   ├── lib/               # Utilities
│   │   ├── api/          # API clients
│   │   ├── hooks/        # Custom hooks
│   │   ├── context/      # React contexts
│   │   └── utils/        # Helper functions
│   └── public/           # Static assets
│
├── ARCHITECTURE.md        # Architecture docs
├── API_REFERENCE.md       # API docs
├── COMPONENT_LIBRARY.md   # Component docs
└── docker-compose.yml     # Docker config
```

---

## Code Standards

### TypeScript

#### General Rules

```typescript
// ✅ Good: Strong typing
interface UserData {
  id: string;
  email: string;
  name?: string;
}

function getUser(id: string): Promise<UserData> {
  return api.get<UserData>(`/users/${id}`);
}

// ❌ Bad: Using any
function getUser(id): any {
  return api.get(`/users/${id}`);
}
```

#### Naming Conventions

```typescript
// Interfaces: PascalCase with 'I' prefix (optional)
interface SubscriptionData { }
interface ISubscriptionData { }  // Also acceptable

// Types: PascalCase
type BillingCycle = 'monthly' | 'yearly';

// Components: PascalCase
export const SubscriptionCard: React.FC = () => { };

// Functions: camelCase
function calculateTotal() { }

// Constants: UPPER_SNAKE_CASE
const MAX_RETRIES = 3;

// Variables: camelCase
const userName = 'John';
```

### React/Next.js

#### Component Structure

```tsx
// ✅ Good: Well-structured component
'use client';  // If using client features

import React, { useState } from 'react';

interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

export const Button: React.FC<ButtonProps> = ({
  label,
  onClick,
  variant = 'primary',
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    try {
      await onClick();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`btn btn-${variant}`}
      disabled={isLoading}
    >
      {isLoading ? 'Loading...' : label}
    </button>
  );
};
```

#### Hooks

```tsx
// ✅ Good: Custom hook
export function useSubscriptions() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSubscriptions();
  }, []);

  const loadSubscriptions = async () => {
    try {
      setLoading(true);
      const response = await subscriptionsApi.getAll();
      setSubscriptions(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { subscriptions, loading, error, reload: loadSubscriptions };
}
```

### NestJS

#### Module Structure

```typescript
// ✅ Good: Complete module
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubscriptionsController } from './subscriptions.controller';
import { SubscriptionsService } from './subscriptions.service';
import { Subscription } from '../../entities/subscription.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Subscription])],
  controllers: [SubscriptionsController],
  providers: [SubscriptionsService],
  exports: [SubscriptionsService],
})
export class SubscriptionsModule {}
```

#### Service Pattern

```typescript
// ✅ Good: Service with error handling
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class SubscriptionsService {
  constructor(
    @InjectRepository(Subscription)
    private subscriptionRepository: Repository<Subscription>,
  ) {}

  async findAll(userId: string): Promise<Subscription[]> {
    return this.subscriptionRepository.find({
      where: { userId },
      order: { nextRenewalDate: 'ASC' },
    });
  }

  async findOne(id: string, userId: string): Promise<Subscription> {
    const subscription = await this.subscriptionRepository.findOne({
      where: { id, userId },
    });

    if (!subscription) {
      throw new NotFoundException('Subscription not found');
    }

    return subscription;
  }
}
```

### CSS/TailwindCSS

#### Guidelines

```tsx
// ✅ Good: Semantic, organized classes
<div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
    Title
  </h3>
</div>

// ❌ Bad: Inline styles
<div style={{ display: 'flex', padding: '16px' }}>
  <h3 style={{ fontSize: '18px' }}>Title</h3>
</div>
```

#### Dark Mode

Always include dark mode variants:

```tsx
// ✅ Good
<div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">

// ❌ Bad
<div className="bg-white text-gray-900">
```

---

## Git Workflow

### Branch Naming

```
feature/   - New features
bugfix/    - Bug fixes
hotfix/    - Critical fixes
chore/     - Maintenance tasks
docs/      - Documentation
refactor/  - Code refactoring
test/      - Test additions
```

Examples:
```
feature/dark-mode
bugfix/login-validation
hotfix/security-patch
chore/update-dependencies
docs/api-reference
```

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types**:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting
- `refactor`: Code restructuring
- `test`: Tests
- `chore`: Maintenance

**Examples**:
```
feat(auth): add password reset functionality

fix(subscriptions): correct renewal date calculation

docs(api): update endpoints documentation

chore(deps): upgrade Next.js to v14
```

### Pull Request Process

1. **Create Branch**:
   ```bash
   git checkout -b feature/your-feature
   ```

2. **Make Changes & Commit**:
   ```bash
   git add .
   git commit -m "feat: add feature"
   ```

3. **Push to Remote**:
   ```bash
   git push origin feature/your-feature
   ```

4. **Create PR**:
   - Go to GitHub
   - Click "New Pull Request"
   - Fill in template:
     ```markdown
     ## Description
     Brief description of changes
     
     ## Changes
     - Added X
     - Fixed Y
     - Updated Z
     
     ## Testing
     - [ ] Tested locally
     - [ ] No console errors
     - [ ] Works in dark mode
     
     ## Screenshots
     (if applicable)
     ```

5. **Code Review**:
   - Wait for review
   - Address feedback
   - Get approval

6. **Merge**:
   - Squash and merge (preferred)
   - Delete branch after merge

---

## Testing

### Running Tests

```bash
# Backend (when implemented)
cd backend
npm test                 # Run all tests
npm run test:watch      # Watch mode
npm run test:cov        # Coverage report

# Frontend (when implemented)
cd frontend
npm test                # Run all tests
npm run test:watch     # Watch mode
npm run test:e2e       # E2E tests
```

### Writing Tests

#### Backend Unit Test Example

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { SubscriptionsService } from './subscriptions.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Subscription } from '../../entities/subscription.entity';

describe('SubscriptionsService', () => {
  let service: SubscriptionsService;

  const mockRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SubscriptionsService,
        {
          provide: getRepositoryToken(Subscription),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<SubscriptionsService>(SubscriptionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all subscriptions for user', async () => {
    const mockSubscriptions = [{ id: '1', name: 'Netflix' }];
    mockRepository.find.mockResolvedValue(mockSubscriptions);

    const result = await service.findAll('user-123');

    expect(result).toEqual(mockSubscriptions);
    expect(mockRepository.find).toHaveBeenCalledWith({
      where: { userId: 'user-123' },
      order: { nextRenewalDate: 'ASC' },
    });
  });
});
```

#### Frontend Component Test Example

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('renders with text', () => {
    render(<Button>Click Me</Button>);
    expect(screen.getByText('Click Me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click</Button>);
    
    fireEvent.click(screen.getByText('Click'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Click</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
```

---

## Debugging

### Frontend Debugging

#### Console Logging

```typescript
// ✅ Good: Structured logging
console.log('User data:', {
  id: user.id,
  email: user.email,
  timestamp: new Date().toISOString()
});

// ❌ Bad: Unclear logging
console.log(user);
```

#### React DevTools

1. Install React DevTools extension
2. Open DevTools > Components tab
3. Inspect component props and state

#### Network Debugging

```typescript
// In api client (lib/api/client.ts)
apiClient.interceptors.request.use(request => {
  console.log('Request:', request.method, request.url);
  return request;
});

apiClient.interceptors.response.use(
  response => {
    console.log('Response:', response.status, response.data);
    return response;
  },
  error => {
    console.error('API Error:', error.response?.data);
    return Promise.reject(error);
  }
);
```

### Backend Debugging

#### Logging

```typescript
// Use console.log for development
console.log('Processing subscription:', subscriptionId);

// Use proper logger in production (implement later)
this.logger.log('Processing subscription', { subscriptionId });
```

#### VS Code Debugging

Create `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Backend",
      "runtimeExecutable": "npm",
      "runtimeArgs": ["run", "start:dev"],
      "skipFiles": ["<node_internals>/**"],
      "cwd": "${workspaceFolder}/backend"
    }
  ]
}
```

Then:
1. Set breakpoints in code
2. Press F5 to start debugging
3. Execution will pause at breakpoints

---

## Common Tasks

### Add a New API Endpoint

1. **Create DTO** (`backend/src/modules/yourmodule/dto/`):
```typescript
// create-item.dto.ts
export class CreateItemDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @Min(0)
  amount: number;
}
```

2. **Add Service Method** (`yourmodule.service.ts`):
```typescript
async create(userId: string, dto: CreateItemDto): Promise<Item> {
  const item = this.itemRepository.create({
    ...dto,
    userId,
  });
  return this.itemRepository.save(item);
}
```

3. **Add Controller Endpoint** (`yourmodule.controller.ts`):
```typescript
@Post()
@UseGuards(AuthGuard)
async create(
  @User() user,
  @Body() dto: CreateItemDto,
): Promise<Item> {
  return this.service.create(user.id, dto);
}
```

4. **Add Frontend API Client** (`frontend/lib/api/items.ts`):
```typescript
export const itemsApi = {
  create: (data: CreateItemData) => 
    apiClient.post<Item>('/items', data),
};
```

### Add a New Page

1. **Create Page File** (`frontend/app/yourpage/page.tsx`):
```tsx
'use client';

export default function YourPage() {
  return (
    <div>
      <h1>Your Page</h1>
    </div>
  );
}
```

2. **Add to Navigation** (`components/layout/Navbar.tsx`):
```tsx
<Link href="/yourpage">
  Your Page
</Link>
```

### Add a New Component

1. **Create Component** (`frontend/components/ui/YourComponent.tsx`):
```tsx
import React from 'react';

interface YourComponentProps {
  title: string;
}

export const YourComponent: React.FC<YourComponentProps> = ({
  title
}) => {
  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg">
      <h3 className="text-lg font-semibold">{title}</h3>
    </div>
  );
};
```

2. **Document in COMPONENT_LIBRARY.md**

3. **Use in Pages**:
```tsx
import { YourComponent } from '@/components/ui/YourComponent';

<YourComponent title="Hello" />
```

---

## Troubleshooting

### Common Issues

#### Port Already in Use

```bash
# Find process using port
lsof -i :3000  # Frontend
lsof -i :3001  # Backend

# Kill process
kill -9 <PID>
```

#### Module Not Found

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### Database Connection Issues

```bash
# Check PostgreSQL is running
pg_isready

# Check connection string in .env
echo $DATABASE_URL

# Test Supabase connection
curl https://your-project.supabase.co
```

#### Redis Connection Issues

```bash
# Check Redis is running
redis-cli ping

# Start Redis
brew services start redis  # macOS
sudo systemctl start redis  # Linux
```

#### Build Errors

```bash
# Clear Next.js cache
rm -rf .next

# Rebuild
npm run build
```

### Getting Help

1. Check documentation files
2. Search GitHub issues
3. Ask in team chat
4. Create GitHub issue with:
   - Error message
   - Steps to reproduce
   - Environment info
   - Screenshots if applicable

---

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [NestJS Documentation](https://docs.nestjs.com)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [Supabase Documentation](https://supabase.com/docs)

---

**Maintainer**: Development Team  
**Questions?**: Create an issue or contact the team  
**Last Review**: November 2025

