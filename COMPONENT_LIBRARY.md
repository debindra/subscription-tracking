# Component Library Documentation

**Project**: Subscription Tracking Dashboard  
**Framework**: Next.js 14 + React 18 + TypeScript  
**Styling**: TailwindCSS 3.4.18  
**Last Updated**: November 2025

## Table of Contents

1. [Overview](#overview)
2. [Design System](#design-system)
3. [UI Components](#ui-components)
4. [Dashboard Components](#dashboard-components)
5. [Layout Components](#layout-components)
6. [Utility Components](#utility-components)
7. [Usage Guidelines](#usage-guidelines)

---

## Overview

This component library follows **Atomic Design** principles with a focus on reusability, accessibility, and consistency. All components are built with TypeScript for type safety and TailwindCSS for styling.

### Component Structure

```
components/
├── ui/                  # Atomic UI components (Button, Input, etc.)
├── dashboard/           # Feature-specific components
├── layout/              # Layout components (Navbar, etc.)
└── auth/                # Authentication components
```

### Principles

- **Reusability**: Components are highly composable
- **Accessibility**: ARIA labels and keyboard navigation
- **Dark Mode**: All components support dark mode
- **Type Safety**: Full TypeScript support
- **Responsive**: Mobile-first design

---

## Design System

### Colors

#### Primary Palette
```typescript
primary: {
  50: '#eef2ff',   // Lightest
  100: '#e0e7ff',  // Light
  500: '#6366f1',  // Base (Indigo)
  600: '#4f46e5',  // Primary
  700: '#4338ca',  // Dark
}
```

#### Semantic Colors
- **Success**: Green-500 (`#22c55e`)
- **Error**: Red-600 (`#dc2626`)
- **Warning**: Orange-500 (`#f97316`)
- **Info**: Blue-500 (`#3b82f6`)

### Typography

```css
/* Headings */
h1: text-3xl font-bold     /* 30px, bold */
h2: text-2xl font-semibold /* 24px, semi-bold */
h3: text-xl font-semibold  /* 20px, semi-bold */
h4: text-lg font-medium    /* 18px, medium */

/* Body */
body: text-base            /* 16px */
small: text-sm             /* 14px */
xs: text-xs                /* 12px */
```

### Spacing

Based on Tailwind's 4px scale:
- `p-2` = 8px
- `p-4` = 16px
- `p-6` = 24px
- `p-8` = 32px

### Shadows

```css
shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05)
shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1)
shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1)
```

---

## UI Components

### Button

A versatile button component with multiple variants and sizes.

**Location**: `components/ui/Button.tsx`

**Props**:
```typescript
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}
```

**Usage**:
```tsx
import { Button } from '@/components/ui/Button';

// Primary button
<Button variant="primary" onClick={handleClick}>
  Click Me
</Button>

// Secondary button (small)
<Button variant="secondary" size="sm">
  Cancel
</Button>

// Danger button (full width)
<Button variant="danger" fullWidth>
  Delete Account
</Button>

// Outline button
<Button variant="outline">
  Learn More
</Button>

// Disabled button
<Button disabled>
  Loading...
</Button>
```

**Variants**:
- `primary`: Indigo background, white text (main CTAs)
- `secondary`: Gray background, dark text (secondary actions)
- `danger`: Red background, white text (destructive actions)
- `outline`: Border only, transparent background

**Sizes**:
- `sm`: 32px height, 14px text
- `md`: 40px height, 16px text (default)
- `lg`: 48px height, 18px text

**Dark Mode**: Fully supported with adjusted colors

**Accessibility**:
- Keyboard focusable
- Visual focus indicator
- Disabled state clearly indicated

---

### Input

Form input field with label, error states, and helper text.

**Location**: `components/ui/Input.tsx`

**Props**:
```typescript
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}
```

**Usage**:
```tsx
import { Input } from '@/components/ui/Input';

// Basic input with label
<Input
  label="Email Address"
  type="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  required
/>

// Input with error
<Input
  label="Password"
  type="password"
  error="Password must be at least 6 characters"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
/>

// Input with helper text
<Input
  label="Username"
  helperText="Choose a unique username (3-20 characters)"
  value={username}
  onChange={(e) => setUsername(e.target.value)}
/>

// Number input
<Input
  label="Amount"
  type="number"
  step="0.01"
  min="0"
  value={amount}
  onChange={(e) => setAmount(parseFloat(e.target.value))}
/>
```

**Features**:
- Automatic ID generation from label
- Error state styling (red border)
- Helper text below input
- Responsive sizing
- Dark mode support

---

### Select

Dropdown select component with label and validation.

**Location**: `components/ui/Select.tsx`

**Props**:
```typescript
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}
```

**Usage**:
```tsx
import { Select } from '@/components/ui/Select';

const currencies = [
  { value: 'USD', label: 'USD ($)' },
  { value: 'EUR', label: 'EUR (€)' },
  { value: 'GBP', label: 'GBP (£)' },
];

<Select
  label="Currency"
  value={currency}
  onChange={(e) => setCurrency(e.target.value)}
  options={currencies}
/>

// With error
<Select
  label="Category"
  error="Please select a category"
  options={categories}
  value={category}
  onChange={(e) => setCategory(e.target.value)}
/>
```

**Features**:
- Pre-populated options
- Error state styling
- Dark mode support
- Accessible labeling

---

### Card

Container component with shadow and padding variants.

**Location**: `components/ui/Card.tsx`

**Props**:
```typescript
interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'sm' | 'md' | 'lg';
}
```

**Usage**:
```tsx
import { Card } from '@/components/ui/Card';

// Default card
<Card>
  <h3>Card Title</h3>
  <p>Card content goes here</p>
</Card>

// Large padding
<Card padding="lg">
  <h2>Important Content</h2>
</Card>

// Small padding
<Card padding="sm">
  <div>Compact content</div>
</Card>

// Custom class
<Card className="hover:shadow-lg transition-shadow">
  <p>Interactive card</p>
</Card>
```

**Padding Options**:
- `sm`: 16px (p-4)
- `md`: 24px (p-6) - default
- `lg`: 32px (p-8)

**Features**:
- Rounded corners
- Shadow elevation
- Dark mode support
- Composable with other components

---

### Modal

Overlay dialog component for forms and confirmations.

**Location**: `components/ui/Modal.tsx`

**Props**:
```typescript
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}
```

**Usage**:
```tsx
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';

function MyComponent() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        Open Modal
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Add Subscription"
        size="lg"
      >
        <p>Modal content here</p>
        <Button onClick={() => setIsOpen(false)}>
          Close
        </Button>
      </Modal>
    </>
  );
}
```

**Sizes**:
- `sm`: max-width 448px
- `md`: max-width 512px (default)
- `lg`: max-width 672px
- `xl`: max-width 896px

**Features**:
- Overlay backdrop (click to close)
- Close button in header
- Body scroll lock when open
- Centered on screen
- Smooth animations
- Dark mode support
- Keyboard escape to close

---

## Dashboard Components

### SubscriptionCard

Display individual subscription information.

**Location**: `components/dashboard/SubscriptionCard.tsx`

**Props**:
```typescript
interface SubscriptionCardProps {
  subscription: Subscription;
  onEdit: (subscription: Subscription) => void;
  onDelete: (id: string) => void;
}
```

**Usage**:
```tsx
import { SubscriptionCard } from '@/components/dashboard/SubscriptionCard';

<SubscriptionCard
  subscription={subscription}
  onEdit={(sub) => handleEdit(sub)}
  onDelete={(id) => handleDelete(id)}
/>
```

**Features**:
- Shows name, category, amount
- Displays renewal date with urgency colors
- Edit and delete action buttons
- Active/inactive status badge
- Overdue/upcoming indicators
- Dark mode support
- Hover effects

**Visual States**:
- **Upcoming** (≤7 days): Orange text
- **Overdue** (<0 days): Red text
- **Normal** (>7 days): Gray text
- **Inactive**: Gray badge

---

### SubscriptionForm

Form for creating/editing subscriptions.

**Location**: `components/dashboard/SubscriptionForm.tsx`

**Props**:
```typescript
interface SubscriptionFormProps {
  subscription?: Subscription;
  onSubmit: (data: CreateSubscriptionData) => Promise<void>;
  onCancel: () => void;
}
```

**Usage**:
```tsx
import { SubscriptionForm } from '@/components/dashboard/SubscriptionForm';

// Create mode
<SubscriptionForm
  onSubmit={handleCreate}
  onCancel={handleCancel}
/>

// Edit mode
<SubscriptionForm
  subscription={existingSubscription}
  onSubmit={handleUpdate}
  onCancel={handleCancel}
/>
```

**Fields**:
- Name (text, required)
- Amount (number, required)
- Currency (select, required)
- Billing Cycle (select, required)
- Next Renewal Date (date, required)
- Category (select, required)
- Description (text, optional)
- Website (URL, optional)
- Active (checkbox)
- Reminder Enabled (checkbox)
- Reminder Days Before (number, conditional)

**Features**:
- Client-side validation
- Error display
- Loading states
- Pre-fills data in edit mode
- Conditional fields (reminder days)
- Dark mode support

---

### SpendingChart

Visualize spending data with Chart.js.

**Location**: `components/dashboard/SpendingChart.tsx`

**Props**:
```typescript
interface SpendingChartProps {
  categoryData: CategorySpending[];
  monthlyData: MonthlyTrend[];
}

interface CategorySpending {
  category: string;
  amount: number;
}

interface MonthlyTrend {
  month: string;
  total: number;
}
```

**Usage**:
```tsx
import { SpendingChart } from '@/components/dashboard/SpendingChart';

<SpendingChart
  categoryData={[
    { category: 'Entertainment', amount: 45.97 },
    { category: 'Development', amount: 39.99 }
  ]}
  monthlyData={[
    { month: '2025-11', total: 125.45 },
    { month: '2025-10', total: 118.32 }
  ]}
/>
```

**Features**:
- Pie chart for category breakdown
- Bar chart for monthly trend
- Responsive sizing
- Empty state handling
- Interactive tooltips
- Dark mode compatible
- Currency formatting

---

### ExportButton

Export subscriptions as CSV or HTML.

**Location**: `components/dashboard/ExportButton.tsx`

**Props**:
```typescript
interface ExportButtonProps {
  subscriptions: Subscription[];
  monthlyTotal: number;
  yearlyTotal: number;
}
```

**Usage**:
```tsx
import { ExportButton } from '@/components/dashboard/ExportButton';

<ExportButton
  subscriptions={subscriptions}
  monthlyTotal={monthlyTotal}
  yearlyTotal={yearlyTotal}
/>
```

**Features**:
- Dropdown menu with 3 options
- Export as CSV
- Export as HTML report
- Print report
- Automatic file naming with timestamp
- Dark mode support

---

## Layout Components

### Navbar

Main navigation bar.

**Location**: `components/layout/Navbar.tsx`

**Usage**:
```tsx
import { Navbar } from '@/components/layout/Navbar';

// In layout
<Navbar />
```

**Features**:
- Logo and branding
- Navigation links (Dashboard, Subscriptions)
- Dark mode toggle
- User email display
- Sign out button
- Responsive design
- Active route highlighting

**Behavior**:
- Only shows when user is authenticated
- Automatically gets user from `useAuth` hook
- Dark mode toggle uses `useTheme` hook

---

## Utility Components

### ThemeProvider

Context provider for dark mode.

**Location**: `lib/context/ThemeContext.tsx`

**Usage**:
```tsx
import { ThemeProvider, useTheme } from '@/lib/context/ThemeContext';

// In root layout
<ThemeProvider>
  {children}
</ThemeProvider>

// In any component
function MyComponent() {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <button onClick={toggleTheme}>
      Current theme: {theme}
    </button>
  );
}
```

**Features**:
- Persists to localStorage
- Detects system preference
- Prevents hydration mismatch
- Updates document class

---

## Usage Guidelines

### Component Composition

Components are designed to be composed:

```tsx
<Card>
  <h3 className="text-lg font-semibold mb-4">Settings</h3>
  <div className="space-y-4">
    <Input
      label="Email"
      type="email"
      value={email}
      onChange={e => setEmail(e.target.value)}
    />
    <Select
      label="Timezone"
      options={timezones}
      value={timezone}
      onChange={e => setTimezone(e.target.value)}
    />
    <div className="flex space-x-3">
      <Button variant="primary">Save</Button>
      <Button variant="outline">Cancel</Button>
    </div>
  </div>
</Card>
```

### Dark Mode

All components automatically support dark mode. Use `dark:` prefix for custom styles:

```tsx
<div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
  Content
</div>
```

### Responsive Design

Use Tailwind breakpoints:

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* Cards */}
</div>
```

Breakpoints:
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px

### Accessibility

All components include:
- Proper ARIA labels
- Keyboard navigation
- Focus indicators
- Semantic HTML

Example:
```tsx
<button
  aria-label="Close modal"
  onClick={onClose}
>
  <svg>...</svg>
</button>
```

### TypeScript

All components are fully typed:

```tsx
import { ButtonProps } from '@/components/ui/Button';

const MyButton: React.FC<ButtonProps> = (props) => {
  // TypeScript autocomplete works!
};
```

### Custom Styling

Use `className` prop to extend styles:

```tsx
<Button
  variant="primary"
  className="mt-4 shadow-xl"
>
  Submit
</Button>
```

### State Management

Components accept controlled props:

```tsx
const [value, setValue] = useState('');

<Input
  value={value}
  onChange={(e) => setValue(e.target.value)}
/>
```

---

## Best Practices

### 1. Always Use TypeScript Types

```tsx
// Good
<Button variant="primary" size="md">Click</Button>

// Bad
<Button variant="blue" size="medium">Click</Button>
```

### 2. Provide Accessible Labels

```tsx
// Good
<Input label="Email Address" type="email" />

// Bad
<Input type="email" placeholder="email" />
```

### 3. Handle Loading States

```tsx
<Button disabled={loading}>
  {loading ? 'Saving...' : 'Save'}
</Button>
```

### 4. Show Error Messages

```tsx
<Input
  label="Password"
  error={errors.password}
  value={password}
  onChange={handleChange}
/>
```

### 5. Use Dark Mode Classes

```tsx
<div className="bg-white dark:bg-gray-800">
  Content
</div>
```

---

## Component Checklist

When creating a new component:

- [ ] TypeScript interface for props
- [ ] Dark mode support
- [ ] Responsive design
- [ ] Accessibility (ARIA, keyboard)
- [ ] Loading states (if applicable)
- [ ] Error states (if applicable)
- [ ] Documentation in this file
- [ ] Usage examples

---

## Future Components

Planned additions:
- [ ] Toast notifications
- [ ] Dropdown menu
- [ ] Tooltip
- [ ] Tabs
- [ ] Badge
- [ ] Alert/Banner
- [ ] Skeleton loaders
- [ ] Pagination
- [ ] Search input
- [ ] Date picker

---

**Maintainer**: Frontend Team  
**Review Cycle**: Quarterly  
**Next Review**: February 2026

