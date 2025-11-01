'use client';

import React from 'react';
import { Subscription } from '@/lib/api/subscriptions';
import { formatCurrency, formatDate, getDaysUntil, capitalize } from '@/lib/utils/format';
import { Card } from '../ui/Card';

interface SubscriptionCardProps {
  subscription: Subscription;
  onEdit: (subscription: Subscription) => void;
  onDelete: (id: string) => void;
}

export const SubscriptionCard: React.FC<SubscriptionCardProps> = ({
  subscription,
  onEdit,
  onDelete,
}) => {
  const daysUntilRenewal = getDaysUntil(subscription.nextRenewalDate);
  const isUpcoming = daysUntilRenewal <= 7 && daysUntilRenewal >= 0;
  const isOverdue = daysUntilRenewal < 0;

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <h3 className="text-lg font-semibold text-gray-900">{subscription.name}</h3>
            {!subscription.isActive && (
              <span className="px-2 py-1 text-xs rounded-full bg-gray-200 text-gray-600">
                Inactive
              </span>
            )}
          </div>
          
          <p className="text-sm text-gray-500 mt-1">{subscription.category}</p>
          
          <div className="mt-3">
            <p className="text-2xl font-bold text-primary-600">
              {formatCurrency(subscription.amount, subscription.currency)}
            </p>
            <p className="text-sm text-gray-500">
              per {subscription.billingCycle.replace('ly', '')}
            </p>
          </div>
          
          <div className="mt-4 space-y-1">
            <div className="flex items-center text-sm">
              <span className="text-gray-600">Next renewal:</span>
              <span className={`ml-2 font-medium ${isOverdue ? 'text-red-600' : isUpcoming ? 'text-orange-600' : 'text-gray-900'}`}>
                {formatDate(subscription.nextRenewalDate)}
              </span>
            </div>
            
            {daysUntilRenewal >= 0 && (
              <p className={`text-xs ${isUpcoming ? 'text-orange-600 font-medium' : 'text-gray-500'}`}>
                {daysUntilRenewal === 0 ? 'Renews today!' : `${daysUntilRenewal} days away`}
              </p>
            )}
            
            {isOverdue && (
              <p className="text-xs text-red-600 font-medium">
                Overdue by {Math.abs(daysUntilRenewal)} days
              </p>
            )}
          </div>
          
          {subscription.description && (
            <p className="mt-3 text-sm text-gray-600">{subscription.description}</p>
          )}
        </div>
        
        <div className="flex flex-col space-y-2 ml-4">
          <button
            onClick={() => onEdit(subscription)}
            className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
            title="Edit"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          
          <button
            onClick={() => onDelete(subscription.id)}
            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </Card>
  );
};

