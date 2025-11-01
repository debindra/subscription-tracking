'use client';

import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { SpendingChart } from '@/components/dashboard/SpendingChart';
import { SubscriptionCard } from '@/components/dashboard/SubscriptionCard';
import { subscriptionsApi, Subscription } from '@/lib/api/subscriptions';
import { analyticsApi, SpendingSummary, CategorySpending, MonthlyTrend } from '@/lib/api/analytics';
import { formatCurrency } from '@/lib/utils/format';
import Link from 'next/link';

export default function DashboardPage() {
  const [upcomingSubscriptions, setUpcomingSubscriptions] = useState<Subscription[]>([]);
  const [spendingSummary, setSpendingSummary] = useState<SpendingSummary | null>(null);
  const [categoryData, setCategoryData] = useState<CategorySpending[]>([]);
  const [monthlyData, setMonthlyData] = useState<MonthlyTrend[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [upcomingRes, spendingRes, categoryRes, monthlyRes] = await Promise.all([
        subscriptionsApi.getUpcoming(),
        analyticsApi.getSpending(),
        analyticsApi.getByCategory(),
        analyticsApi.getMonthlyTrend(6),
      ]);

      setUpcomingSubscriptions(upcomingRes.data);
      setSpendingSummary(spendingRes.data);
      setCategoryData(categoryRes.data);
      setMonthlyData(monthlyRes.data);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Overview of your subscriptions and spending</p>
        </div>
        <Link
          href="/dashboard/subscriptions"
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          Manage Subscriptions
        </Link>
      </div>

      {/* Stats Cards */}
      {spendingSummary && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Monthly Spending</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {formatCurrency(spendingSummary.monthlyTotal, spendingSummary.currency)}
                </p>
              </div>
              <div className="p-3 bg-primary-100 rounded-full">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Yearly Spending</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {formatCurrency(spendingSummary.yearlyTotal, spendingSummary.currency)}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Subscriptions</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {spendingSummary.totalSubscriptions}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Charts */}
      <SpendingChart categoryData={categoryData} monthlyData={monthlyData} />

      {/* Upcoming Renewals */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Upcoming Renewals</h2>
        {upcomingSubscriptions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingSubscriptions.map((subscription) => (
              <SubscriptionCard
                key={subscription.id}
                subscription={subscription}
                onEdit={() => {}}
                onDelete={() => {}}
              />
            ))}
          </div>
        ) : (
          <Card>
            <p className="text-center text-gray-500 py-8">
              No upcoming renewals in the next 7 days
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}

