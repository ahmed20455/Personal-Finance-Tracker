'use client';

import { useState, useEffect, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Transaction } from '../types';
import { useTransactions } from '../hooks/useTransactions'; // Assuming this hook exists

const FinanceChart: React.FC = () => {
  const { data: transactions, isLoading, error } = useTransactions();

  // State to manage chart data
  const [chartData, setChartData] = useState<{ date: string; income: number; expense: number }[]>([]);

  // Compute chart data when transactions change
  useEffect(() => {
    if (isLoading || error || !transactions) return;

    const newData = transactions.reduce((acc, transaction) => {
      const date = transaction.date;
      const existing = acc.find((entry) => entry.date === date);
      if (existing) {
        existing[transaction.type] = (existing[transaction.type] || 0) + transaction.amount;
      } else {
        acc.push({
          date,
          income: transaction.type === 'income' ? transaction.amount : 0,
          expense: transaction.type === 'expense' ? transaction.amount : 0,
        });
      }
      return acc;
    }, [] as { date: string; income: number; expense: number }[]);

    // Sort by date
    newData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    setChartData(newData);
  }, [transactions, isLoading, error]);

  // Memoize chart data to prevent unnecessary re-renders
  const memoizedData = useMemo(() => chartData, [chartData]);

  if (isLoading) return <div className="text-gray-500 dark:text-gray-400">Loading chart...</div>;
  if (error) return <div className="text-red-500 dark:text-red-400">Error: {error.message}</div>;
  if (!memoizedData.length) return <div className="text-gray-500 dark:text-gray-400">No data available.</div>;

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-6 animate-fade-in">
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Income vs Expenses Over Time</h2>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={memoizedData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="date" stroke="#6b7280" />
          <YAxis stroke="#6b7280" />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="income" stroke="#10B981" name="Income" />
          <Line type="monotone" dataKey="expense" stroke="#EF4444" name="Expenses" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default FinanceChart;