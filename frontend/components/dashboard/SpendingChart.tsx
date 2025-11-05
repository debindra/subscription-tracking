'use client';

import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import { CategorySpending, MonthlyTrend } from '@/lib/api/analytics';
import { Card } from '../ui/Card';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

interface SpendingChartProps {
  categoryData: CategorySpending[];
  monthlyData: MonthlyTrend[];
}

export const SpendingChart: React.FC<SpendingChartProps> = ({
  categoryData,
  monthlyData,
}) => {
  const pieData = {
    labels: categoryData.map((item) => item.category),
    datasets: [
      {
        label: 'Monthly Spending',
        data: categoryData.map((item) => item.amount),
        backgroundColor: [
          'rgba(99, 102, 241, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(251, 191, 36, 0.8)',
          'rgba(168, 85, 247, 0.8)',
          'rgba(236, 72, 153, 0.8)',
          'rgba(20, 184, 166, 0.8)',
          'rgba(249, 115, 22, 0.8)',
        ],
        borderColor: [
          'rgba(99, 102, 241, 1)',
          'rgba(239, 68, 68, 1)',
          'rgba(34, 197, 94, 1)',
          'rgba(251, 191, 36, 1)',
          'rgba(168, 85, 247, 1)',
          'rgba(236, 72, 153, 1)',
          'rgba(20, 184, 166, 1)',
          'rgba(249, 115, 22, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const barData = {
    labels: monthlyData.map((item) => item.month),
    datasets: [
      {
        label: 'Monthly Spending',
        data: monthlyData.map((item) => item.total),
        backgroundColor: 'rgba(99, 102, 241, 0.8)',
        borderColor: 'rgba(99, 102, 241, 1)',
        borderWidth: 1,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value: any) {
            return '$' + value;
          },
        },
      },
    },
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Spending by Category</h3>
        <div className="h-64 flex items-center justify-center">
          {categoryData.length > 0 ? (
            <Pie data={pieData} />
          ) : (
            <p className="text-gray-500 dark:text-gray-400">No data available</p>
          )}
        </div>
      </Card>

      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Monthly Trend</h3>
        <div className="h-64">
          {monthlyData.length > 0 ? (
            <Bar data={barData} options={barOptions} />
          ) : (
            <p className="text-gray-500 dark:text-gray-400">No data available</p>
          )}
        </div>
      </Card>
    </div>
  );
};

