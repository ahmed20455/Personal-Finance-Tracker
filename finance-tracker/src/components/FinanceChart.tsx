'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Transaction } from '../types';

interface FinanceChartProps {
  transactions: Transaction[];
}

const FinanceChart: React.FC<FinanceChartProps> = ({ transactions }) => {
  const data = transactions.reduce((acc, transaction) => {
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

  data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Income vs Expenses Over Time</h2>
      <ResponsiveContainer width="100%" height={400}> {/* Increased height from 300 to 400 */}
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
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