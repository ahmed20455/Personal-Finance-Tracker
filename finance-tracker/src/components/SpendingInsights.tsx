'use client';

import { useState, useEffect } from 'react';
import { useTransactions } from '../hooks/useTransactions';
import { toast } from 'react-toastify';
import Link from 'next/link';

export default function SpendingInsights() {
  const { data: transactions, isLoading, error } = useTransactions();
  const [threshold, setThreshold] = useState(30);
  const [dateRange, setDateRange] = useState('current'); // 'current' or 'previous'
  const [historicalTransactions, setHistoricalTransactions] = useState<any[]>([]);
  const [showDetails, setShowDetails] = useState(false);

  // Fetch historical data based on date range
  useEffect(() => {
    const fetchHistoricalData = async () => {
      if (dateRange === 'previous') {
        const today = new Date();
        const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);
        
        const response = await fetch(
          `http://localhost:3001/transactions?date_gte=${lastMonthStart.toISOString()}&date_lte=${lastMonthEnd.toISOString()}`
        );
        const data = await response.json();
        setHistoricalTransactions(data);
      } else {
        setHistoricalTransactions(transactions || []);
      }
    };
    fetchHistoricalData();
  }, [dateRange, transactions]);

  if (isLoading) return <div className="text-gray-500 dark:text-gray-400">Loading insights...</div>;
  if (error) return <div className="text-red-500 dark:text-red-400">Error: {error.message}</div>;

  const currentTotalExpenses = transactions?.reduce((sum, t) => (t.type === 'expense' ? sum + t.amount : sum), 0) || 0;
  const historicalTotalExpenses = historicalTransactions?.reduce((sum, t) => (t.type === 'expense' ? sum + t.amount : sum), 0) || 0;

  const categoryTotals = transactions?.reduce((acc, t) => {
    if (t.type === 'expense') {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
    }
    return acc;
  }, {} as Record<string, number>) || {};

  const historicalCategoryTotals = historicalTransactions?.reduce((acc, t) => {
    if (t.type === 'expense') {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
    }
    return acc;
  }, {} as Record<string, number>) || {};

  const topCategories = Object.entries(categoryTotals)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2)
    .map(([category, amount]) => ({
      category,
      amount,
      percentage: currentTotalExpenses ? (amount / currentTotalExpenses) * 100 : 0,
      historicalAmount: historicalCategoryTotals[category] || 0,
    }));

  const getInsights = () => {
    const insights = [];
    if (topCategories.length > 0 && topCategories[0].percentage > threshold) {
      const savings = (topCategories[0].amount * 0.1).toFixed(2);
      insights.push({
        text: `You’ve spent ${topCategories[0].percentage.toFixed(1)}% (₹${topCategories[0].amount}) on ${topCategories[0].category}. Consider reducing by 10% to save ₹${savings}!`,
        category: topCategories[0].category,
      });
    }
    if (topCategories.length > 1 && topCategories[1].percentage > threshold / 2) {
      insights.push({
        text: `Your second-highest category, ${topCategories[1].category}, accounts for ${topCategories[1].percentage.toFixed(1)}% (₹${topCategories[1].amount}). Consider optimizing this area.`,
        category: topCategories[1].category,
      });
    }
    if (topCategories.length > 0 && topCategories[0].historicalAmount > 0) {
      const change = ((topCategories[0].amount - topCategories[0].historicalAmount) / topCategories[0].historicalAmount) * 100;
      insights.push({
        text: `Spending in ${topCategories[0].category} has ${change > 0 ? 'increased' : 'decreased'} by ${Math.abs(change).toFixed(1)}% since last period (previously ₹${topCategories[0].historicalAmount}).`,
        category: topCategories[0].category,
      });
    }
    if (currentTotalExpenses > historicalTotalExpenses) {
      const increase = ((currentTotalExpenses - historicalTotalExpenses) / historicalTotalExpenses) * 100;
      const savings = ((currentTotalExpenses - historicalTotalExpenses) / 2).toFixed(2);
      insights.push({
        text: `Overall spending is up ${increase.toFixed(1)}% from last period. Aim to save ₹${savings}!`,
        category: null,
      });
    } else if (currentTotalExpenses < historicalTotalExpenses) {
      insights.push({
        text: 'Great job! Your overall spending is down from last period.',
        category: null,
      });
    }
    return insights.length ? insights : [{ text: 'Your spending is well-balanced. Keep it up!', category: null }];
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Spending Insights</h2>
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-blue-600 dark:text-blue-400 hover:underline"
        >
          {showDetails ? 'Hide Details' : 'Show Details'}
        </button>
      </div>
      <div className="flex space-x-4 mb-4">
        <div>
          <label className="block text-gray-600 dark:text-gray-400 mb-2">Spending Threshold (%)</label>
          <input
            type="number"
            value={threshold}
            onChange={(e) => setThreshold(parseInt(e.target.value) || 30)}
            className="w-24 p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 focus:ring-2 focus:ring-blue-500"
            min="0"
            max="100"
          />
        </div>
        <div>
          <label className="block text-gray-600 dark:text-gray-400 mb-2">Date Range</label>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 focus:ring-2 focus:ring-blue-500"
          >
            <option value="current">Current Month</option>
            <option value="previous">Previous Month</option>
          </select>
        </div>
      </div>
      {showDetails && (
        <div className="mb-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-md">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Category Breakdown</h3>
          <ul className="space-y-2">
            {topCategories.map((cat) => (
              <li key={cat.category} className="text-gray-600 dark:text-gray-400">
                {cat.category}: ₹{cat.amount} ({cat.percentage.toFixed(1)}%) -{' '}
                {cat.historicalAmount > 0 ? `Last period: ₹${cat.historicalAmount}` : 'No historical data'}
              </li>
            ))}
          </ul>
        </div>
      )}
      <ul className="list-disc pl-5 text-gray-600 dark:text-gray-400">
        {getInsights().map((insight, index) => (
          <li key={index} className="mb-2 flex items-center justify-between">
            <span>{insight.text}</span>
            {insight.category && (
              <Link
                href={`/transactions?category=${encodeURIComponent(insight.category)}`}
                className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
              >
                View Transactions
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}