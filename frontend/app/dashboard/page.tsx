'use client';

import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { SpendingChart } from '@/components/dashboard/SpendingChart';
import { SubscriptionCard } from '@/components/dashboard/SubscriptionCard';
import { subscriptionsApi, Subscription } from '@/lib/api/subscriptions';
import { analyticsApi, SpendingSummary, CategorySpending, MonthlyTrend } from '@/lib/api/analytics';
import { formatCurrency } from '@/lib/utils/format';
import { useToast } from '@/lib/context/ToastContext';
import Link from 'next/link';

export default function DashboardPage() {
  const [upcomingSubscriptions, setUpcomingSubscriptions] = useState<Subscription[]>([]);
  const [spendingSummary, setSpendingSummary] = useState<SpendingSummary | null>(null);
  const [categoryData, setCategoryData] = useState<CategorySpending[]>([]);
  const [monthlyData, setMonthlyData] = useState<MonthlyTrend[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

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
      showToast('Failed to load dashboard data', 'error');
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-8 animate-fade-in">
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <div className="h-9 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-shimmer"></div>
            <div className="h-5 w-96 bg-gray-200 dark:bg-gray-700 rounded animate-shimmer"></div>
          </div>
          <div className="h-10 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-shimmer"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-3 flex-1">
                  <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-shimmer"></div>
                  <div className="h-9 w-40 bg-gray-200 dark:bg-gray-700 rounded animate-shimmer"></div>
                </div>
                <div className="w-14 h-14 rounded-full bg-gray-200 dark:bg-gray-700 animate-shimmer"></div>
              </div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-shimmer mb-4"></div>
              <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded animate-shimmer"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 animate-fade-in">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white bg-clip-text">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2 text-lg">
            Overview of your subscriptions and spending
          </p>
        </div>
        <Link
          href="/dashboard/subscriptions"
          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 dark:from-primary-500 dark:to-primary-600 text-white rounded-lg hover:from-primary-700 hover:to-primary-800 dark:hover:from-primary-600 dark:hover:to-primary-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl font-medium"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Manage Subscriptions
        </Link>
      </div>

      {/* Stats Cards */}
      {spendingSummary && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="animate-scale-in hover:shadow-xl dark:hover:shadow-gray-900/50 transition-all duration-300 transform hover:-translate-y-1 bg-gradient-to-br from-white to-primary-50 dark:from-gray-800 dark:to-primary-900/10 border-l-4 border-primary-600 dark:border-primary-400">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 font-semibold uppercase tracking-wide">Monthly Spending</p>
                <p className="text-4xl font-extrabold text-gray-900 dark:text-white mt-2">
                  {formatCurrency(spendingSummary.monthlyTotal, spendingSummary.currency)}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  {formatCurrency(spendingSummary.yearlyTotal / 12, spendingSummary.currency)} avg per month
                </p>
              </div>
              <div className="p-4 bg-gradient-to-br from-primary-500 to-primary-600 dark:from-primary-600 dark:to-primary-700 rounded-2xl shadow-lg transform transition-transform group-hover:scale-110">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </Card>

          <Card className="animate-scale-in hover:shadow-xl dark:hover:shadow-gray-900/50 transition-all duration-300 transform hover:-translate-y-1 bg-gradient-to-br from-white to-green-50 dark:from-gray-800 dark:to-green-900/10 border-l-4 border-green-600 dark:border-green-400" style={{animationDelay: '0.1s'}}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 font-semibold uppercase tracking-wide">Yearly Spending</p>
                <p className="text-4xl font-extrabold text-gray-900 dark:text-white mt-2">
                  {formatCurrency(spendingSummary.yearlyTotal, spendingSummary.currency)}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  Total annual commitment
                </p>
              </div>
              <div className="p-4 bg-gradient-to-br from-green-500 to-green-600 dark:from-green-600 dark:to-green-700 rounded-2xl shadow-lg transform transition-transform group-hover:scale-110">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
          </Card>

          <Card className="animate-scale-in hover:shadow-xl dark:hover:shadow-gray-900/50 transition-all duration-300 transform hover:-translate-y-1 bg-gradient-to-br from-white to-purple-50 dark:from-gray-800 dark:to-purple-900/10 border-l-4 border-purple-600 dark:border-purple-400" style={{animationDelay: '0.2s'}}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 font-semibold uppercase tracking-wide">Active Subscriptions</p>
                <p className="text-4xl font-extrabold text-gray-900 dark:text-white mt-2">
                  {spendingSummary.totalSubscriptions}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  Services you're subscribed to
                </p>
              </div>
              <div className="p-4 bg-gradient-to-br from-purple-500 to-purple-600 dark:from-purple-600 dark:to-purple-700 rounded-2xl shadow-lg transform transition-transform group-hover:scale-110">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
      <div className="animate-fade-in">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Upcoming Renewals</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Subscriptions renewing in the next 7 days</p>
          </div>
          {upcomingSubscriptions.length > 0 && (
            <span className="px-4 py-2 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 rounded-full text-sm font-bold">
              {upcomingSubscriptions.length} upcoming
            </span>
          )}
        </div>
        {upcomingSubscriptions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingSubscriptions.map((subscription, index) => (
              <div key={subscription.id} style={{animationDelay: `${index * 0.1}s`}}>
                <SubscriptionCard
                  subscription={subscription}
                  onEdit={() => {}}
                  onDelete={() => {}}
                />
              </div>
            ))}
          </div>
        ) : (
          <Card className="text-center py-16 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-green-100 dark:bg-green-900/30 rounded-full">
                <svg className="w-12 h-12 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              All Clear!
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              No upcoming renewals in the next 7 days
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}

