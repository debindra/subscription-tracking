'use client';

import React, { useState, useEffect } from 'react';
import { Subscription, CreateSubscriptionData } from '@/lib/api/subscriptions';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';

interface SubscriptionFormProps {
  subscription?: Subscription;
  onSubmit: (data: CreateSubscriptionData) => Promise<void>;
  onCancel: () => void;
}

const categories = [
  'Entertainment',
  'Development',
  'Productivity',
  'Cloud Services',
  'Design',
  'Marketing',
  'Communication',
  'Security',
  'Finance',
  'Education',
  'Other',
];

const billingCycles = [
  { value: 'monthly', label: 'Monthly' },
  { value: 'quarterly', label: 'Quarterly' },
  { value: 'yearly', label: 'Yearly' },
  { value: 'weekly', label: 'Weekly' },
];

export const SubscriptionForm: React.FC<SubscriptionFormProps> = ({
  subscription,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState<CreateSubscriptionData>({
    name: '',
    amount: 0,
    currency: 'USD',
    billingCycle: 'monthly',
    nextRenewalDate: '',
    category: 'Entertainment',
    description: '',
    website: '',
    isActive: true,
    reminderEnabled: true,
    reminderDaysBefore: 7,
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (subscription) {
      setFormData({
        name: subscription.name,
        amount: subscription.amount,
        currency: subscription.currency,
        billingCycle: subscription.billingCycle,
        nextRenewalDate: subscription.nextRenewalDate.split('T')[0],
        category: subscription.category,
        description: subscription.description || '',
        website: subscription.website || '',
        isActive: subscription.isActive,
        reminderEnabled: subscription.reminderEnabled,
        reminderDaysBefore: subscription.reminderDaysBefore,
      });
    }
  }, [subscription]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await onSubmit(formData);
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      <Input
        label="Subscription Name"
        type="text"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        required
        placeholder="Netflix, Spotify, etc."
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Amount"
          type="number"
          step="0.01"
          min="0"
          value={formData.amount}
          onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
          required
        />

        <Select
          label="Currency"
          value={formData.currency}
          onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
          options={[
            { value: 'USD', label: 'USD ($)' },
            { value: 'EUR', label: 'EUR (€)' },
            { value: 'GBP', label: 'GBP (£)' },
            { value: 'NPR', label: 'NPR (रू)' },
          ]}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Select
          label="Billing Cycle"
          value={formData.billingCycle}
          onChange={(e) => setFormData({ ...formData, billingCycle: e.target.value })}
          options={billingCycles}
        />

        <Input
          label="Next Renewal Date"
          type="date"
          value={formData.nextRenewalDate}
          onChange={(e) => setFormData({ ...formData, nextRenewalDate: e.target.value })}
          required
        />
      </div>

      <Select
        label="Category"
        value={formData.category}
        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
        options={categories.map((cat) => ({ value: cat, label: cat }))}
      />

      <Input
        label="Description (Optional)"
        type="text"
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        placeholder="Brief description of the subscription"
      />

      <Input
        label="Website (Optional)"
        type="url"
        value={formData.website}
        onChange={(e) => setFormData({ ...formData, website: e.target.value })}
        placeholder="https://example.com"
      />

      <div className="flex items-center space-x-6">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={formData.isActive}
            onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
            className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
          />
          <span className="ml-2 text-sm text-gray-700">Active</span>
        </label>

        <label className="flex items-center">
          <input
            type="checkbox"
            checked={formData.reminderEnabled}
            onChange={(e) => setFormData({ ...formData, reminderEnabled: e.target.checked })}
            className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
          />
          <span className="ml-2 text-sm text-gray-700">Enable Reminders</span>
        </label>
      </div>

      {formData.reminderEnabled && (
        <Input
          label="Remind me (days before renewal)"
          type="number"
          min="1"
          max="30"
          value={formData.reminderDaysBefore}
          onChange={(e) => setFormData({ ...formData, reminderDaysBefore: parseInt(e.target.value) })}
        />
      )}

      <div className="flex space-x-3 pt-4">
        <Button type="submit" disabled={loading} fullWidth>
          {loading ? 'Saving...' : subscription ? 'Update Subscription' : 'Add Subscription'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} fullWidth>
          Cancel
        </Button>
      </div>
    </form>
  );
};

