'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { subscriptionsApi, Subscription, CreateSubscriptionData } from '@/lib/api/subscriptions';
import { SubscriptionCard } from '@/components/dashboard/SubscriptionCard';
import { SubscriptionForm } from '@/components/dashboard/SubscriptionForm';
import { ExportButton } from '@/components/dashboard/ExportButton';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';

export default function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubscription, setEditingSubscription] = useState<Subscription | undefined>();
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');

  useEffect(() => {
    loadSubscriptions();
  }, []);

  const loadSubscriptions = async () => {
    try {
      const response = await subscriptionsApi.getAll();
      setSubscriptions(response.data);
    } catch (error) {
      console.error('Error loading subscriptions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (data: CreateSubscriptionData) => {
    try {
      await subscriptionsApi.create(data);
      await loadSubscriptions();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error creating subscription:', error);
      throw error;
    }
  };

  const handleUpdate = async (data: CreateSubscriptionData) => {
    if (!editingSubscription) return;

    try {
      await subscriptionsApi.update(editingSubscription.id, data);
      await loadSubscriptions();
      setIsModalOpen(false);
      setEditingSubscription(undefined);
    } catch (error) {
      console.error('Error updating subscription:', error);
      throw error;
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this subscription?')) {
      return;
    }

    try {
      await subscriptionsApi.delete(id);
      await loadSubscriptions();
    } catch (error) {
      console.error('Error deleting subscription:', error);
    }
  };

  const handleEdit = (subscription: Subscription) => {
    setEditingSubscription(subscription);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingSubscription(undefined);
  };

  const filteredSubscriptions = subscriptions.filter((sub) => {
    if (filter === 'active') return sub.isActive;
    if (filter === 'inactive') return !sub.isActive;
    return true;
  });

  // Calculate totals for export
  const { monthlyTotal, yearlyTotal } = useMemo(() => {
    const monthly = subscriptions
      .filter(s => s.isActive)
      .reduce((sum, sub) => {
        const { amount, billingCycle } = sub;
        let monthlyAmount = amount;
        
        if (billingCycle === 'yearly') monthlyAmount = amount / 12;
        else if (billingCycle === 'quarterly') monthlyAmount = amount / 3;
        else if (billingCycle === 'weekly') monthlyAmount = amount * 4.33;
        
        return sum + monthlyAmount;
      }, 0);
    
    return {
      monthlyTotal: monthly,
      yearlyTotal: monthly * 12,
    };
  }, [subscriptions]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-gray-600">Loading subscriptions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Subscriptions</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage all your subscriptions</p>
        </div>
        <div className="flex space-x-3">
          {subscriptions.length > 0 && (
            <ExportButton
              subscriptions={subscriptions}
              monthlyTotal={monthlyTotal}
              yearlyTotal={yearlyTotal}
            />
          )}
          <Button onClick={() => setIsModalOpen(true)}>
            + Add Subscription
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex space-x-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            filter === 'all'
              ? 'bg-primary-600 dark:bg-primary-500 text-white'
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
          }`}
        >
          All ({subscriptions.length})
        </button>
        <button
          onClick={() => setFilter('active')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            filter === 'active'
              ? 'bg-primary-600 dark:bg-primary-500 text-white'
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
          }`}
        >
          Active ({subscriptions.filter((s) => s.isActive).length})
        </button>
        <button
          onClick={() => setFilter('inactive')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            filter === 'inactive'
              ? 'bg-primary-600 dark:bg-primary-500 text-white'
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
          }`}
        >
          Inactive ({subscriptions.filter((s) => !s.isActive).length})
        </button>
      </div>

      {/* Subscriptions Grid */}
      {filteredSubscriptions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSubscriptions.map((subscription) => (
            <SubscriptionCard
              key={subscription.id}
              subscription={subscription}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-12 text-center">
          <div className="text-gray-400 dark:text-gray-600 text-6xl mb-4">📋</div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No subscriptions found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {filter !== 'all'
              ? `You don't have any ${filter} subscriptions.`
              : 'Get started by adding your first subscription.'}
          </p>
          {filter === 'all' && (
            <Button onClick={() => setIsModalOpen(true)}>
              + Add Your First Subscription
            </Button>
          )}
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingSubscription ? 'Edit Subscription' : 'Add New Subscription'}
        size="lg"
      >
        <SubscriptionForm
          subscription={editingSubscription}
          onSubmit={editingSubscription ? handleUpdate : handleCreate}
          onCancel={handleCloseModal}
        />
      </Modal>
    </div>
  );
}

