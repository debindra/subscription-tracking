import { apiClient } from './client';

export interface SpendingSummary {
  monthlyTotal: number;
  yearlyTotal: number;
  totalSubscriptions: number;
  currency: string;
}

export interface CategorySpending {
  category: string;
  amount: number;
}

export interface MonthlyTrend {
  month: string;
  total: number;
}

export interface SubscriptionStats {
  total: number;
  active: number;
  inactive: number;
  categories: number;
}

export const analyticsApi = {
  getSpending: () => apiClient.get<SpendingSummary>('/analytics/spending'),
  
  getByCategory: () => apiClient.get<CategorySpending[]>('/analytics/by-category'),
  
  getMonthlyTrend: (months: number = 12) =>
    apiClient.get<MonthlyTrend[]>(`/analytics/monthly-trend?months=${months}`),
  
  getStats: () => apiClient.get<SubscriptionStats>('/analytics/stats'),
};

